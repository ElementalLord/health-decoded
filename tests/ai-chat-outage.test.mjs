import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

import { conversationReplyFor } from "../features/ai/services/ai-conversation-replies.ts";
import {
  allCredibleSources,
  credibleSourcesForQuestion,
} from "../features/ai/data/credible-sources.ts";
import { reviewedSuggestedAnswerFor } from "../features/ai/data/reviewed-suggested-answers.ts";
import {
  diabetesSourceBank,
  diabetesKnowledge,
  diabetesKnowledgeFor,
} from "../features/ai/data/diabetes-knowledge.ts";
import { assessAiSafety, buildAiSafetyInput } from "../features/ai/services/ai-safety-rules.ts";
import { aiChatStreamEventSchema } from "../features/ai/schemas/ai-chat.schema.ts";
import * as grounding from "../features/ai/services/ai-grounding.ts";
import { uniqueCitations } from "../features/ai/data/unique-citations.ts";

const source = stripTypeScriptTypes(
  await readFile(new URL("../features/ai/services/ai-chat.server.ts", import.meta.url), "utf8"),
)
  .replace(/^import\b[\s\S]*?;\n/gm, "")
  .replace(/^export /gm, "");

function chatWithProvider(provider, overrides = {}) {
  const dependencies = {
    uniqueCitations,
    ...grounding,
    allCredibleSources,
    conversationReplyFor,
    reviewedSuggestedAnswerFor,
    diabetesSourceBank,
    assessAiSafety,
    buildAiSafetyInput,
    AI_DEFAULT_TEMPERATURE: 0,
    AI_REGENERATION_TEMPERATURE: 0.7,
    consumeAiRequestSlot: () => ({ allowed: true }),
    fingerprintAiRequest: (message) => message,
    consumeAiProviderBudget: () => ({ allowed: true }),
    recordAiProviderFailure: () => {},
    recordAiProviderSuccess: () => {},
    logAiOperation: () => {},
    recordQualifyingLearningActivity: async () => {},
    sanitizeAiConversationHistory: (messages) => messages,
    loadTrustedAiContext: async ({ message }) => {
      const sources = [...diabetesKnowledgeFor(message), ...credibleSourcesForQuestion(message)];
      return {
        ok: true,
        data: {
          retrievedSources: sources,
          promptContext: {},
          metadata: {
            credibleSources: sources.map(({ href, organization, title }) => ({
              href,
              organization,
              title,
            })),
            suggestedQuestions: ["What is diabetes?"],
          },
        },
      };
    },
    buildAiPrompt: ({ message }) => ({ prompt: message, systemInstruction: "Test" }),
    ...overrides,
    aiProvider: {
      generateStructuredResponse: async () => ({ ok: false, category: "rate_limited" }),
      ...provider,
    },
  };
  return new Function(...Object.keys(dependencies), `${source}\nreturn createAiChatStream;`)(
    ...Object.values(dependencies),
  );
}

test("personal diagnosis questions get an honest relevant fallback rather than a definition", async () => {
  const chat = chatWithProvider({});
  for (const question of ["do i have diabetes", "do i have diabtes", "is this diabetes"]) {
    const answer = await answerFrom(chat, question);
    assert.match(answer, /can’t tell whether you have diabetes/);
    assert.match(answer, /blood tests/);
    assert.doesNotMatch(answer, /^Diabetes refers to|^Diabetes means/);
  }
});

test("an unknown personal name never becomes a brand-name medicine explanation", async () => {
  const answer = await answerFrom(chatWithProvider({}), "what is my name");
  assert.match(answer, /don’t know your name/);
  assert.doesNotMatch(answer, /medicine|brand|generic/);
});

test("Gemini can answer a personal conversational question without irrelevant citations", async () => {
  const answer = "You haven’t told me your name in this conversation.";
  const chat = chatWithProvider({
    generateStructuredResponse: async () => ({
      ok: true,
      text: JSON.stringify({ answer, sourceIds: [], answerKind: "conversation" }),
    }),
  });
  const result = await chat({
    message: "what is my name",
    userId: "synthetic",
    networkKey: "synthetic",
  });
  const events = [];
  for await (const event of result.data) {
    assert.equal(aiChatStreamEventSchema.safeParse(event).success, true);
    events.push(event);
  }
  assert.equal(
    events.some(({ type }) => type === "context"),
    false,
  );
  assert.equal(events.find(({ type }) => type === "delta").text, answer);
  assert.equal(events.at(-1).type, "done");
});

for (const category of ["configuration", "rate_limited", "timeout", "unexpected", "refused"]) {
  test(`provider ${category} failure produces a useful completed fallback`, async () => {
    const chat = chatWithProvider({
      generateStructuredResponse: async () => ({ ok: false, category }),
      generateGroundedResponse: async () => {
        throw new Error("No search after provider failure");
      },
    });
    const answer = await answerFrom(chat, "what does it mean when i have diabetes");
    assert.match(answer, /^Diabetes means/);
    assert.doesNotMatch(answer, /internet|unavailable|enough information/);
  });
}

for (const [label, response] of [
  ["invalid JSON", "not JSON"],
  ["empty JSON", "{}"],
  ["wrong answer type", JSON.stringify({ answer: 42, sourceIds: ["KB-DIABETES-MEANING"] })],
  [
    "invented source",
    JSON.stringify({ answer: "Diabetes means high glucose.", sourceIds: ["MADE-UP"] }),
  ],
  [
    "duplicate IDs",
    JSON.stringify({
      answer: "Diabetes means high glucose.",
      sourceIds: ["KB-DIABETES-MEANING", "KB-DIABETES-MEANING"],
    }),
  ],
  ["uncited answer", JSON.stringify({ answer: "Diabetes means high glucose.", sourceIds: [] })],
  ["empty answer", JSON.stringify({ answer: "", sourceIds: ["KB-DIABETES-MEANING"] })],
  [
    "unsafe treatment",
    JSON.stringify({ answer: "Double your insulin dose.", sourceIds: ["KB-DIABETES-MEANING"] }),
  ],
]) {
  test(`${label} never replaces the source-backed fallback or triggers search`, async () => {
    const chat = chatWithProvider({
      generateStructuredResponse: async () => ({ ok: true, text: response }),
      generateGroundedResponse: async () => {
        throw new Error("Malformed output needs no search");
      },
    });
    assert.match(
      await answerFrom(chat, "what does it mean when i have diabetes"),
      /^Diabetes means/,
    );
  });
}

test("an unexpected generation exception still completes with evidence", async () => {
  const chat = chatWithProvider({
    generateStructuredResponse: async () => {
      throw new Error("SDK or network exception");
    },
  });
  assert.match(await answerFrom(chat, "what does it mean when i have diabetes"), /^Diabetes means/);
});

test("an unexpected search exception falls back after valid insufficient knowledge", async () => {
  const chat = chatWithProvider({
    generateStructuredResponse: async () => ({
      ok: true,
      text: JSON.stringify({ answer: grounding.AI_INSUFFICIENT_EVIDENCE_MESSAGE, sourceIds: [] }),
    }),
    generateGroundedResponse: async () => {
      throw new Error("Search SDK exception");
    },
  });
  assert.match(await answerFrom(chat, "what does it mean when i have diabetes"), /^Diabetes means/);
});

test("an exhausted provider budget answers from local evidence without calling Gemini", async () => {
  let calls = 0;
  const chat = chatWithProvider(
    {
      generateStructuredResponse: async () => {
        calls++;
        throw new Error("Should not call");
      },
    },
    { consumeAiProviderBudget: () => ({ allowed: false, reason: "budget" }) },
  );
  assert.match(await answerFrom(chat, "what does it mean when i have diabetes"), /^Diabetes means/);
  assert.equal(calls, 0);
});

test("request rejection returns before invoking the provider", async () => {
  const chat = chatWithProvider(
    {
      generateStructuredResponse: async () => {
        throw new Error("Should not call");
      },
    },
    { consumeAiRequestSlot: () => ({ allowed: false }) },
  );
  const result = await chat({
    message: "What is diabetes?",
    userId: "synthetic",
    networkKey: "synthetic",
  });
  assert.deepEqual(result, { ok: false, category: "rate_limited" });
});

for (const mode of ["generated", "fallback"]) {
  test(`${mode} completion does not wait for slow optional progress recording`, async () => {
    let release;
    const pending = new Promise((resolve) => {
      release = resolve;
    });
    const chat = chatWithProvider(
      mode === "fallback"
        ? {}
        : {
            generateStructuredResponse: async () => ({
              ok: true,
              text: JSON.stringify({
                answer:
                  "Diabetes means glucose stays high when insulin production or action is insufficient.",
                sourceIds: ["KB-DIABETES-MEANING"],
              }),
            }),
          },
      { recordQualifyingLearningActivity: () => pending },
    );
    const result = await chat({
      message: "What is diabetes?",
      userId: "synthetic",
      networkKey: "synthetic",
    });
    let timer;
    try {
      const completion = (async () => {
        for (;;) {
          const event = await result.data.next();
          assert.equal(event.done, false);
          if (event.value.type === "done") return;
        }
      })();
      await Promise.race([
        completion,
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(new Error("Completion waited for optional recording")),
            500,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
      release();
      await result.data.next();
    }
  });
}

test("progress recording errors cannot turn a completed generated answer into a stream error", async () => {
  const chat = chatWithProvider(
    {
      generateStructuredResponse: async () => ({
        ok: true,
        text: JSON.stringify({
          answer: "Diabetes means glucose stays high when insulin action is insufficient.",
          sourceIds: ["KB-DIABETES-MEANING"],
        }),
      }),
    },
    {
      recordQualifyingLearningActivity: async () => {
        throw new Error("Database unavailable");
      },
    },
  );
  assert.match(await answerFrom(chat, "What is diabetes?"), /^Diabetes means/);
});

test("short follow-ups keep the original conversation available for Gemini interpretation", async () => {
  const messages = [
    { role: "user", content: "What does metformin do?" },
    { role: "assistant", content: "It lowers glucose production in the liver." },
  ];
  for (const question of [
    "why?",
    "how does that happen",
    "say it simpler",
    "what about that one",
  ]) {
    const synthesis =
      "It turns down glucose production in the liver, so less glucose enters the bloodstream.";
    const chat = chatWithProvider({
      generateStructuredResponse: async ({ prompt }) => {
        const input = JSON.parse(prompt);
        assert.equal(input.currentQuestion, question);
        assert.equal(input.previousQuestion, messages[0].content);
        assert.deepEqual(input.previousAnswers, [messages[1].content]);
        assert.ok(input.reviewedSources.some(({ id }) => id === "KB-METFORMIN-ACTION"));
        return {
          ok: true,
          text: JSON.stringify({ answer: synthesis, sourceIds: ["KB-METFORMIN-ACTION"] }),
        };
      },
    });
    const result = await chat({
      message: question,
      messages,
      userId: "synthetic",
      networkKey: "synthetic",
    });
    const events = [];
    for await (const event of result.data) {
      assert.equal(aiChatStreamEventSchema.safeParse(event).success, true);
      events.push(event);
    }
    assert.equal(
      events
        .filter(({ type }) => type === "delta")
        .map(({ text }) => text)
        .join(""),
      synthesis,
    );
    assert.equal(events.at(-1).type, "done");
  }
});

test("every knowledge topic can produce a cited generated answer through the real chat service", async () => {
  let calls = 0;
  let active;
  const chat = chatWithProvider({
    generateStructuredResponse: async ({ prompt }) => {
      calls++;
      const input = JSON.parse(prompt);
      assert.ok(input.reviewedSources.some(({ id }) => id === active.id));
      return {
        ok: true,
        text: JSON.stringify({
          answer: `Here is a plain-language explanation: ${active.summary}`,
          sourceIds: [active.id],
        }),
      };
    },
    generateGroundedResponse: async () => {
      throw new Error("Bank topics need no search");
    },
  });
  for (const entry of diabetesKnowledge) {
    active = entry;
    const answer = await answerFrom(
      chat,
      `Could you help me understand ${entry.title.toLowerCase()}?`,
    );
    assert.equal(answer, `Here is a plain-language explanation: ${entry.summary}`, entry.id);
  }
  assert.equal(calls, diabetesKnowledge.length);
});

test("Gemini citation entries sharing the screenshot URL produce one stable source row", async () => {
  const href =
    "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments";
  const entries = diabetesKnowledge.filter((source) => source.href === href).slice(0, 3);
  assert.equal(entries.length, 3);
  const chat = chatWithProvider({
    generateStructuredResponse: async () => ({
      ok: true,
      text: JSON.stringify({
        answer:
          "Insulin helps glucose enter cells for energy. Treatment can deliver insulin in different ways.",
        sourceIds: entries.map(({ id }) => id),
      }),
    }),
  });
  const result = await chat({
    message: "Explain insulin delivery",
    userId: "synthetic",
    networkKey: "synthetic",
  });
  assert.equal(result.ok, true);
  const events = [];
  for await (const event of result.data) {
    assert.equal(aiChatStreamEventSchema.safeParse(event).success, true);
    events.push(event);
  }
  const context = events.find(({ type }) => type === "context");
  assert.equal(context.credibleSources.length, 1);
  assert.equal(context.credibleSources[0].href, href);
  assert.equal(events.at(-1).type, "done");

  const first = { href, title: "First selected citation" };
  const second = { href: "https://www.cdc.gov/diabetes/", title: "Different citation" };
  assert.deepEqual(uniqueCitations([first, { href, title: "Duplicate" }, second]), [first, second]);
});

async function answerFrom(chat, message) {
  const result = await chat({ message, userId: "synthetic", networkKey: "synthetic" });
  assert.equal(result.ok, true);
  const events = [];
  for await (const event of result.data) {
    assert.equal(aiChatStreamEventSchema.safeParse(event).success, true, JSON.stringify(event));
    events.push(event);
  }
  assert.equal(events.at(-1).type, "done");
  return events
    .filter(({ type }) => type === "delta")
    .map(({ text }) => text)
    .join("");
}

test("the screenshot greeting gets a conversational answer with no API or context dependency", async () => {
  const chat = chatWithProvider({});
  assert.match(await answerFrom(chat, "hello there"), /^Hello!/);
  assert.match(await answerFrom(chat, "hello there"), /What would you like/);
  assert.match(await answerFrom(chat, "hello there"), /^Hello!/);
});

test("greeting plus a medical question is never swallowed as small talk", () => {
  assert.equal(conversationReplyFor("Hello, what is metformin?"), null);
  assert.equal(conversationReplyFor("hello there, should I stop taking my medicine?"), null);
});

test("thanks and help remain available without search or generation", async () => {
  const chat = chatWithProvider({});
  assert.match(await answerFrom(chat, "thank you"), /welcome/);
  assert.match(await answerFrom(chat, "what can you do?"), /plain language/);
});

test("three actual questions still produce streamed reviewed answers during a search outage", async () => {
  let fallbackCalls = 0;
  let searchCalls = 0;
  const question = "Why can stress raise blood sugar?";
  const cited = allCredibleSources.find(({ summary }) => /Stress hormones/.test(summary));
  assert.ok(cited);
  const chat = chatWithProvider({
    generateGroundedResponse: async () => {
      searchCalls++;
      return { ok: false, category: "rate_limited" };
    },
    generateStructuredResponse: async () => {
      fallbackCalls++;
      return {
        ok: true,
        text: JSON.stringify({
          answer:
            "Stress can raise blood sugar because stress hormones affect blood glucose levels.",
          sourceIds: [cited.id],
        }),
      };
    },
  });
  for (let i = 0; i < 3; i++) assert.match(await answerFrom(chat, question), /^Stress can raise/);
  assert.equal(fallbackCalls, 3);
  assert.equal(searchCalls, 0, "built-in knowledge must answer without a search request");
});

test("known educational questions get direct reviewed answers when both APIs are unavailable", async () => {
  const chat = chatWithProvider({});
  assert.match(await answerFrom(chat, "What is insulin?"), /Insulin is a hormone/);
});

test("search is used only after the knowledge library reports a missing answer", async () => {
  const calls = [];
  const chat = chatWithProvider({
    generateStructuredResponse: async () => {
      calls.push("knowledge");
      return {
        ok: true,
        text: JSON.stringify({ answer: grounding.AI_INSUFFICIENT_EVIDENCE_MESSAGE, sourceIds: [] }),
      };
    },
    generateGroundedResponse: async () => {
      calls.push("search");
      return {
        ok: true,
        text: "An answer from an additional authoritative source.",
        sources: [
          {
            href: "https://www.fda.gov/",
            organization: "FDA",
            title: "Additional authoritative source",
          },
        ],
      };
    },
  });
  assert.match(
    await answerFrom(chat, "What is a newly approved treatment?"),
    /additional authoritative source/,
  );
  assert.deepEqual(calls, ["knowledge", "search"]);
});

test("Gemini quota failure immediately uses bundled knowledge instead of starting search", async () => {
  let generationCalls = 0;
  const chat = chatWithProvider({
    generateStructuredResponse: async () => {
      generationCalls++;
      return { ok: false, category: "rate_limited" };
    },
    generateGroundedResponse: async () => {
      throw new Error("Search must not be required");
    },
  });
  const answer = await answerFrom(
    chat,
    "Explain how metformin affects glucose production in the liver",
  );
  assert.match(answer, /metformin/i);
  assert.doesNotMatch(answer, /internet|source search|unavailable/i);
  assert.equal(generationCalls, 1);
});

test("every bundled common question keeps a cited fallback when generation fails", async () => {
  const chat = chatWithProvider({});
  for (const entry of diabetesKnowledge) {
    for (const message of entry.questions) {
      const result = await chat({ message, userId: "synthetic", networkKey: "synthetic" });
      assert.equal(result.ok, true, message);
      const events = [];
      for await (const event of result.data) {
        assert.equal(aiChatStreamEventSchema.safeParse(event).success, true, JSON.stringify(event));
        events.push(event);
      }
      const answer = events
        .filter(({ type }) => type === "delta")
        .map(({ text }) => text)
        .join("");
      assert.equal(answer, reviewedSuggestedAnswerFor(message).answer, message);
      assert.ok(
        events.some(
          ({ type, credibleSources }) => type === "context" && credibleSources.length > 0,
        ),
        message,
      );
      assert.equal(events.at(-1).type, "done", message);
    }
  }
});

test("Gemini answers exact examples and messy paraphrases from locally retrieved evidence", async () => {
  const questions = [
    "What is the dawn phenomenon?",
    "why my sugars jump up when waking up without food",
    "why can glucose rise before breakfast even without eating",
  ];
  const seen = [];
  const generatedAnswer =
    "The dawn phenomenon is an early-morning glucose rise. Morning glucose can rise before breakfast because hormones signal the liver to release glucose, even without eating.";
  const chat = chatWithProvider({
    generateStructuredResponse: async ({ prompt, systemInstruction }) => {
      const input = JSON.parse(prompt);
      seen.push(input.currentQuestion);
      assert.ok(input.reviewedSources.some(({ id }) => id === "KB-DAWN"));
      assert.match(systemInstruction, /paraphrases.*spelling mistakes/);
      return {
        ok: true,
        text: JSON.stringify({ answer: generatedAnswer, sourceIds: ["KB-DAWN"] }),
      };
    },
    generateGroundedResponse: async () => {
      throw new Error("No web search should be needed");
    },
  });
  for (const question of questions) {
    assert.equal(await answerFrom(chat, question), generatedAnswer);
  }
  assert.deepEqual(seen, questions, "even exact examples must reach Gemini");
});

test("Gemini synthesizes condition meaning from the bank for personal phrasing", async () => {
  for (const question of [
    "what does it mean when i have type 2 diabetes",
    "what does having type 2 diabetes mean",
    "can u explain type 2 diabtes in simple words",
  ]) {
    const chat = chatWithProvider({
      generateStructuredResponse: async ({ prompt }) => {
        const input = JSON.parse(prompt);
        assert.ok(input.reviewedSources.some(({ id }) => id === "KB-TYPE2-MEANING"));
        assert.ok(input.reviewedSources.some(({ id }) => id === "KB-TEST-TYPES"));
        // Model-selected evidence is validated without a question-pattern filter.
        return {
          ok: true,
          text: JSON.stringify({
            answer:
              "Type 2 diabetes means your body responds less effectively to insulin. Glucose may build up in your blood instead of entering cells for energy.",
            sourceIds: ["KB-TYPE2-MEANING"],
          }),
        };
      },
      generateGroundedResponse: async () => {
        throw new Error("A basic meaning question needs no search");
      },
    });
    const answer = await answerFrom(chat, question);
    assert.match(answer, /^Type 2 diabetes means/);
    assert.match(answer, /insulin/);
    assert.match(answer, /cells/);
    assert.doesNotMatch(answer, /identify the type|An A1C or glucose test/);
  }
});

test("general diabetes meaning answers the screenshot question during a provider outage", async () => {
  const chat = chatWithProvider({});
  for (const question of [
    "what does it mean when i have diabetes",
    "what does having diabtes mean",
    "can u explain diabetes in simple words",
  ]) {
    const answer = await answerFrom(chat, question);
    assert.match(answer, /^Diabetes means/);
    assert.match(answer, /insulin/);
    assert.doesNotMatch(answer, /enough information|Type 2 diabetes means/);
  }
});

test("Gemini selects evidence without requiring question or source wording in its answer", async () => {
  const question = "How does metformin work in the liver?";
  const synthesis =
    "It turns down the liver’s glucose production, so less sugar enters the bloodstream. It also helps the body respond to insulin.";
  const chat = chatWithProvider({
    generateStructuredResponse: async ({ prompt }) => {
      const { reviewedSources } = JSON.parse(prompt);
      assert.ok(reviewedSources.some(({ id }) => id === "KB-METFORMIN-ACTION"));
      return {
        ok: true,
        text: JSON.stringify({ answer: synthesis, sourceIds: ["KB-METFORMIN-ACTION"] }),
      };
    },
    generateGroundedResponse: async () => {
      throw new Error("A basic mechanism needs no search");
    },
  });
  const answer = await answerFrom(chat, question);
  assert.equal(answer, synthesis);
  assert.doesNotMatch(answer, /enough information/);
});
