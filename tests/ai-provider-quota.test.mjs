import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

// Exercise the real provider without sending requests or loading Next's
// server-only module. Only its external dependencies are replaced.
const source = stripTypeScriptTypes(
  await readFile(new URL("../services/ai/provider.ts", import.meta.url), "utf8"),
)
  .replace(/^import\b[\s\S]*?;\n/gm, "")
  .replace(/^export /gm, "");

function providerWithResponses(responses) {
  globalThis.healthDecodedAiGenerationRetryAfter = new Map();
  const calls = [];
  class ApiError extends Error {}
  class GoogleGenAI {
    models = {
      async generateContent(request) {
        calls.push(request.model);
        const response = responses.shift();
        if (response instanceof Error) throw response;
        return response;
      },
    };
  }
  const dependencies = {
    ApiError,
    GoogleGenAI,
    AI_MAX_PROMPT_CHARACTERS: 100_000,
    AI_DEFAULT_TEMPERATURE: 0,
    DEFAULT_AI_MODEL: "primary",
    FALLBACK_AI_MODEL: "backup",
    getGeminiServerEnv: () => ({ ok: true, data: { GEMINI_API_KEY: "test-key" } }),
    getAiSecurityConfig: () => ({ maxOutputTokens: 700, providerTimeoutMs: 10_000 }),
    normalizeAiProviderFailure: (category) => ({ ok: false, category }),
    parseAiProviderText: (text) => ({ ok: true, text }),
  };
  const provider = new Function(...Object.keys(dependencies), `${source}\nreturn aiProvider;`)(
    ...Object.values(dependencies),
  );
  return { provider, calls };
}

const failure = (status) => Object.assign(new Error("Provider failure"), { status });
const request = { prompt: "Synthetic question", systemInstruction: "Test", responseJsonSchema: {} };

test("structured answers try the backup when the primary quota is exhausted", async () => {
  const { provider, calls } = providerWithResponses([failure(429), { text: '{"answer":"OK"}' }]);
  assert.deepEqual(await provider.generateStructuredResponse(request), {
    ok: true,
    text: '{"answer":"OK"}',
  });
  assert.deepEqual(calls, ["primary", "backup"]);
});

test("both model quotas exhausted returns a rate limit after one backup call", async () => {
  const { provider, calls } = providerWithResponses([failure(429), failure(429)]);
  assert.deepEqual(await provider.generateStructuredResponse(request), {
    ok: false,
    category: "rate_limited",
  });
  assert.deepEqual(calls, ["primary", "backup"]);
});

test("credential failures do not trigger model failover", async () => {
  const { provider, calls } = providerWithResponses([failure(403)]);
  assert.deepEqual(await provider.generateStructuredResponse(request), {
    ok: false,
    category: "configuration",
  });
  assert.deepEqual(calls, ["primary"]);
});

test("an aborted quota request does not start a backup request", async () => {
  const { provider, calls } = providerWithResponses([failure(429)]);
  await provider.generateStructuredResponse(request, AbortSignal.abort());
  assert.deepEqual(calls, ["primary"]);
});

test("subsequent questions use the working backup during the primary cooldown", async () => {
  const { provider, calls } = providerWithResponses([
    failure(429),
    { text: "First answer" },
    { text: "Second answer" },
    { text: "Third answer" },
  ]);
  for (let index = 0; index < 3; index++) {
    assert.equal((await provider.generateStructuredResponse(request)).ok, true);
  }
  assert.deepEqual(calls, ["primary", "backup", "backup", "backup"]);
});

test("generation is retried after the short quota cooldown expires", async () => {
  const { provider, calls } = providerWithResponses([failure(429), failure(429), { text: "OK" }]);
  await provider.generateStructuredResponse(request);
  assert.equal((await provider.generateStructuredResponse(request)).category, "rate_limited");
  globalThis.healthDecodedAiGenerationRetryAfter.set("primary", Date.now() - 1);
  assert.equal((await provider.generateStructuredResponse(request)).ok, true);
  assert.deepEqual(calls, ["primary", "backup", "primary"]);
});
