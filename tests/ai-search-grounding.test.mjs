import assert from "node:assert/strict";
import test from "node:test";

import {
  isAiAnswerRelevant,
  isPermittedDynamicSource,
  parseAndValidateAiGatewayGroundedOutput,
  parseAndValidateAiSearchGroundedOutput,
} from "../features/ai/services/ai-search-grounding.ts";

test("answers address the requested meaning, reason, or comparison rather than a shared keyword", () => {
  for (const [question, wrong, correct] of [
    [
      "what does it mean when i have diabetes",
      "An A1C test is used to diagnose diabetes.",
      "Diabetes means your body cannot keep blood glucose in a healthy range because it does not make enough insulin or use it effectively.",
    ],
    [
      "What is type 2 diabetes?",
      "Type 2 diabetes is diagnosed with glucose tests.",
      "Type 2 diabetes means your body responds less effectively to insulin and may not make enough to meet its needs.",
    ],
    [
      "Why does exercise help blood sugar?",
      "Exercise is part of a diabetes care plan.",
      "Working muscles use glucose during exercise, and activity can increase insulin sensitivity.",
    ],
    [
      "How does metformin work?",
      "Metformin is prescribed for type 2 diabetes.",
      "Metformin reduces the glucose released by the liver and improves the body's response to insulin.",
    ],
    [
      "Why can stress raise glucose?",
      "Stress is common when managing diabetes.",
      "Stress hormones can signal the liver to release glucose and reduce insulin sensitivity.",
    ],
    [
      "Compare insulin and metformin",
      "Insulin helps glucose enter cells.",
      "Insulin supplies the hormone that helps glucose enter cells; metformin mainly reduces glucose production in the liver.",
    ],
    [
      "What is the difference between A1C and a glucose meter?",
      "A glucose meter measures glucose at one moment.",
      "A1C reflects average glucose over roughly three months, while a glucose meter measures glucose at the time of the test.",
    ],
  ]) {
    assert.equal(
      isAiAnswerRelevant(wrong, { question }),
      false,
      `Wrong answer accepted: ${question}`,
    );
    assert.equal(
      isAiAnswerRelevant(correct, { question }),
      true,
      `Useful paraphrase rejected: ${question}`,
    );
  }
});

test("dynamic discovery uses source restrictions instead of a fixed source allowlist", () => {
  for (const href of [
    "https://new-public-health-agency.example/clinical-guideline",
    "https://previously-unseen-university.example/research/insulin",
  ]) {
    assert.equal(isPermittedDynamicSource(new URL(href)), true, href);
  }

  for (const href of [
    "https://reddit.com/r/diabetes/comments/example",
    "https://writer.medium.com/my-insulin-routine",
    "https://healthtips.substack.com/p/injections",
  ]) {
    assert.equal(isPermittedDynamicSource(new URL(href)), false, href);
  }
});

test("grounded output drops excluded user-generated citations", () => {
  const text = "Insulin is injected into the fatty tissue beneath the skin.";
  const result = parseAndValidateAiSearchGroundedOutput(
    interaction(text, [
      {
        title: "Forum answer",
        type: "url_citation",
        url: "https://reddit.com/r/diabetes/comments/example",
      },
      {
        title: "Clinical instructions",
        type: "url_citation",
        url: "https://new-medical-center.example/insulin/injection-sites",
      },
    ]),
  );

  assert.deepEqual(
    result?.sources.map(({ organization }) => organization),
    ["new-medical-center.example"],
  );
});

function interaction(text, annotations) {
  return {
    steps: [
      { type: "google_search_call", arguments: { queries: ["diabetes evidence"] } },
      {
        type: "model_output",
        content: [{ annotations, text, type: "text" }],
      },
    ],
  };
}

test("accepts direct HTTPS citation annotations and preserves the exact source", () => {
  const text = "Metformin lowers glucose production in the liver.";
  const result = parseAndValidateAiSearchGroundedOutput(
    interaction(text, [
      {
        end_index: text.length,
        start_index: 0,
        title: "Metformin information",
        type: "url_citation",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=example",
      },
    ]),
  );

  assert.equal(result?.answer, text);
  assert.deepEqual(result?.sources, [
    {
      citedText: text,
      href: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=example",
      organization: "dailymed.nlm.nih.gov",
      title: "Metformin information",
    },
  ]);
});

test("rejects a safe but nonsensical answer that does not address the current question", () => {
  const irrelevant =
    "Managing these areas can help reduce the chance of heart, eye, kidney, nerve, and foot problems.";
  const relevant =
    "Too little sleep can make the body less sensitive to insulin, which can make blood glucose harder to manage.";
  const relevanceContext = { question: "How can sleep affect blood sugar?" };
  const citation = [
    {
      title: "The Impact of Poor Sleep on Type 2 Diabetes",
      type: "url_citation",
      url: "https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/the-impact-of-poor-sleep-on-type-2-diabetes",
    },
  ];

  assert.equal(isAiAnswerRelevant(irrelevant, relevanceContext), false);
  assert.equal(isAiAnswerRelevant(relevant, relevanceContext), true);
  assert.equal(
    parseAndValidateAiSearchGroundedOutput(interaction(irrelevant, citation), relevanceContext),
    null,
  );
  assert.equal(
    parseAndValidateAiSearchGroundedOutput(interaction(relevant, citation), relevanceContext)
      ?.answer,
    relevant,
  );
});

test("definition questions reject answers that merely mention the requested term", () => {
  assert.equal(
    isAiAnswerRelevant(
      "Diabetes management can include blood glucose, blood pressure, medicines, and preventive care.",
      { question: "what is glucose" },
    ),
    false,
  );
  assert.equal(
    isAiAnswerRelevant("Glucose is a type of sugar that the body's cells use for energy.", {
      question: "what is glucose",
    }),
    true,
  );
});

test("answer relevance understands a misspelled subject", () => {
  assert.equal(
    isAiAnswerRelevant("Glucose is a type of sugar that the body's cells use for energy.", {
      question: "wat is glocose",
    }),
    true,
  );
});

test("supports SDK camel-case citation offsets and de-duplicates a source", () => {
  const text = "A1C reflects average glucose over time.";
  const result = parseAndValidateAiSearchGroundedOutput(
    interaction(text, [
      {
        endIndex: text.length,
        startIndex: 0,
        title: "NIDDK diabetes tests",
        type: "url_citation",
        url: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis",
      },
      {
        title: "NIDDK diabetes tests",
        type: "url_citation",
        url: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis",
      },
    ]),
  );

  assert.equal(result?.sources.length, 1);
  assert.equal(result?.sources[0]?.organization, "niddk.nih.gov");
  assert.equal(result?.sources[0]?.citedText, text);
});

test("accepts grounded AI Gateway Responses output and preserves exact citations", () => {
  const text = "Sleep can affect insulin sensitivity and blood glucose.";
  const result = parseAndValidateAiGatewayGroundedOutput(
    {
      output: [
        { type: "web_search_call", status: "completed" },
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text,
              annotations: [
                {
                  type: "url_citation",
                  title: "Sleep and diabetes",
                  url: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems",
                },
              ],
            },
          ],
        },
      ],
    },
    { question: "How can sleep affect blood sugar?" },
  );

  assert.equal(result?.answer, text);
  assert.equal(result?.sources[0]?.title, "Sleep and diabetes");
});

test("rejects irrelevant or ungrounded AI Gateway output", () => {
  const output = (text, annotations = []) => ({
    output: [{ type: "message", content: [{ type: "output_text", text, annotations }] }],
  });
  const citation = [
    {
      type: "url_citation",
      title: "Evidence",
      url: "https://www.cdc.gov/diabetes/about/index.html",
    },
  ];

  assert.equal(
    parseAndValidateAiGatewayGroundedOutput(output("Metformin lowers liver glucose.", citation), {
      question: "How does sleep affect glucose?",
    }),
    null,
  );
  assert.equal(parseAndValidateAiGatewayGroundedOutput(output("A1C is a blood test.")), null);
});

test("rejects ungrounded, unsafe, local, IP, and model-written links", () => {
  assert.equal(parseAndValidateAiSearchGroundedOutput(interaction("What is A1C?", [])), null);
  assert.equal(
    parseAndValidateAiSearchGroundedOutput(
      interaction("Visit https://example.com for the answer.", [
        { title: "Example", type: "url_citation", url: "https://example.com" },
      ]),
    ),
    null,
  );

  for (const url of [
    "http://niddk.nih.gov/example",
    "https://localhost/example",
    "https://127.0.0.1/example",
    "https://user:password@niddk.nih.gov/example",
  ]) {
    assert.equal(
      parseAndValidateAiSearchGroundedOutput(
        interaction("A grounded educational answer.", [
          { title: "Invalid", type: "url_citation", url },
        ]),
      ),
      null,
      url,
    );
  }
});

test("dynamic sourcing never bypasses diagnosis or medication-output safety", () => {
  const citation = [
    {
      title: "Medical evidence",
      type: "url_citation",
      url: "https://www.niddk.nih.gov/health-information/diabetes/overview",
    },
  ];

  for (const unsafeAnswer of [
    "You have diabetes based on this result.",
    "You should stop taking metformin.",
    "Take 20 mg of the medication tonight.",
  ]) {
    assert.equal(
      parseAndValidateAiSearchGroundedOutput(interaction(unsafeAnswer, citation)),
      null,
      unsafeAnswer,
    );
  }
});

test("uses only the latest model output and requires every displayed source to be bounded", () => {
  const latest = "The latest answer.";
  const result = parseAndValidateAiSearchGroundedOutput({
    steps: [
      {
        type: "model_output",
        content: [
          {
            annotations: [
              { title: "Old", type: "url_citation", url: "https://old.example.org/source" },
            ],
            text: "An earlier draft.",
            type: "text",
          },
        ],
      },
      {
        type: "model_output",
        content: [
          {
            annotations: [
              {
                title: "Current",
                type: "url_citation",
                url: "https://current.example.org/source",
              },
            ],
            text: latest,
            type: "text",
          },
        ],
      },
    ],
  });

  assert.equal(result?.answer, latest);
  assert.deepEqual(
    result?.sources.map(({ organization }) => organization),
    ["current.example.org"],
  );

  assert.equal(
    parseAndValidateAiSearchGroundedOutput(
      interaction(
        "Too many sources.",
        Array.from({ length: 9 }, (_, index) => ({
          title: `Source ${index}`,
          type: "url_citation",
          url: `https://source-${index}.example.org/page`,
        })),
      ),
    ),
    null,
  );
});
