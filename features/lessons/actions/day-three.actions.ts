"use server";

import { z } from "zod";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";

const dayThreeEvaluationSchema = z.discriminatedUnion("stage", [
  z
    .object({
      answer: z.enum(["snapshot", "three_month_pattern", "diagnosis_score"]),
      stage: z.literal("window"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["same_for_everyone", "starting_line", "emergency"]),
      stage: z.literal("threshold"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["exact_today", "daily_variation", "personal_goal"]),
      stage: z.literal("pattern"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["single_moment", "pattern_reasoning"]),
      statement: z.number().int().min(0).max(2),
      stage: z.literal("myth"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["different_windows", "one_test_failed", "more_tests_are_harsher"]),
      stage: z.literal("tests"),
    })
    .strict(),
  z
    .object({
      answer: z.enum(["useful_windows", "daily_grade", "one_reading_decides"]),
      stage: z.literal("teach_back"),
    })
    .strict(),
]);

export type DayThreeEvaluationFeedback = {
  readonly accurate: boolean;
  readonly body: string;
  readonly heading: string;
  readonly whyOthers: readonly string[];
};

export type DayThreeEvaluationResult =
  | { readonly ok: true; readonly data: DayThreeEvaluationFeedback }
  | { readonly ok: false; readonly message: string };

const windowFeedback: Record<
  "snapshot" | "three_month_pattern" | "diagnosis_score",
  DayThreeEvaluationFeedback
> = {
  snapshot: {
    accurate: false,
    body: "A blood-glucose reading is the snapshot. A1C gathers information from a much longer window.",
    heading: "That describes today’s reading.",
    whyOthers: [
      "A1C reflects average glucose exposure over roughly two to three months.",
      "Neither A1C nor a glucose reading is a score of effort or character.",
    ],
  },
  three_month_pattern: {
    accurate: true,
    body: "A1C reflects average glucose exposure over roughly the past two to three months. It cannot show every rise and fall inside that period.",
    heading: "A1C is the wider window.",
    whyOthers: [
      "A point-in-time glucose test is the snapshot, not A1C.",
      "A1C can support diagnosis and monitoring, but it is never a grade on the person.",
    ],
  },
  diagnosis_score: {
    accurate: false,
    body: "A1C may be used in diagnosis, but the result is information, not a grade, verdict, or measure of effort.",
    heading: "The number has a medical job, not a moral meaning.",
    whyOthers: [
      "A1C describes a longer pattern of glucose exposure.",
      "A single glucose reading describes one moment instead.",
    ],
  },
};

const thresholdFeedback: Record<
  "same_for_everyone" | "starting_line" | "emergency",
  DayThreeEvaluationFeedback
> = {
  same_for_everyone: {
    accurate: false,
    body: "A diagnostic cut point helps identify diabetes. A treatment goal is chosen with a healthcare professional and can differ from person to person.",
    heading: "Diagnosis and personal goals do different jobs.",
    whyOthers: [
      "A diagnostic threshold is a shared starting line for identifying a condition.",
      "The threshold alone does not describe an emergency.",
    ],
  },
  starting_line: {
    accurate: true,
    body: "A diagnostic threshold helps clinicians decide whether test results meet criteria for diabetes. It does not automatically become every person’s treatment target.",
    heading: "A threshold is a starting line, not a finish line.",
    whyOthers: [
      "Personal goals account for health history, treatment, and individual circumstances.",
      "A result at a diagnostic cut point is not, by itself, an emergency signal.",
    ],
  },
  emergency: {
    accurate: false,
    body: "Diagnostic thresholds identify a condition. Urgency depends on the full situation, including symptoms and clinical context.",
    heading: "The threshold is not an alarm bell.",
    whyOthers: [
      "A threshold is used to help identify diabetes.",
      "Personal treatment goals are decided separately with a healthcare professional.",
    ],
  },
};

const patternFeedback: Record<
  "exact_today" | "daily_variation" | "personal_goal",
  DayThreeEvaluationFeedback
> = {
  exact_today: {
    accurate: false,
    body: "A1C cannot identify which exact morning was highest. That requires a dated point-in-time record, not a longer average.",
    heading: "A1C does not replay a specific day.",
    whyOthers: [
      "A longer average does not preserve every daily rise and fall.",
      "A personal treatment goal is decided separately with a healthcare professional.",
    ],
  },
  daily_variation: {
    accurate: true,
    body: "A1C estimates average glucose exposure across a longer window. It cannot reconstruct the precise timing and shape of each day inside that average.",
    heading: "An average compresses the timeline.",
    whyOthers: [
      "A dated meter or sensor record is needed to inspect individual moments.",
      "A personal goal comes from a care decision, not from reverse-engineering an average.",
    ],
  },
  personal_goal: {
    accurate: false,
    body: "A1C does not determine one universal treatment goal. Goals are individualized with a healthcare professional.",
    heading: "A result and a goal are different things.",
    whyOthers: [
      "The chart’s individual moments are also not recoverable from A1C alone.",
      "Diagnostic cut points and treatment goals do different jobs.",
    ],
  },
};

const mythAnswers = ["single_moment", "single_moment", "single_moment"] as const;
const mythBodies = [
  "A morning finger-stick and A1C describe different time windows, so they are not expected to match as if they were the same measurement.",
  "A diagnostic threshold helps identify a condition. A personal treatment goal is chosen separately with a healthcare professional.",
  "A1C and glucose tests can differ because they examine different windows or conditions. A clinician can check timing, method, health context, and factors that affect accuracy.",
] as const;

export async function evaluateDayThreeAction(input: unknown): Promise<DayThreeEvaluationResult> {
  const parsed = dayThreeEvaluationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "We could not reveal that explanation right now." };
  }

  const user = await getAuthenticatedUser();
  if (!user.ok) {
    return { ok: false, message: "Your session has ended. Please sign in again." };
  }

  const data = parsed.data;
  if (data.stage === "window") return { ok: true, data: windowFeedback[data.answer] };
  if (data.stage === "threshold") return { ok: true, data: thresholdFeedback[data.answer] };
  if (data.stage === "pattern") return { ok: true, data: patternFeedback[data.answer] };
  if (data.stage === "myth") {
    const accurate = data.answer === mythAnswers[data.statement];
    return {
      ok: true,
      data: {
        accurate,
        body: mythBodies[data.statement]!,
        heading: accurate ? "That separates the test jobs." : "Keep each test in its own job.",
        whyOthers: [
          data.answer === "single_moment"
            ? "The statement merges measurements, thresholds, or purposes that need to stay distinct."
            : "The two tests or clinical decisions in this statement are not interchangeable.",
        ],
      },
    };
  }
  if (data.stage === "tests") {
    const accurate = data.answer === "different_windows";
    return {
      ok: true,
      data: {
        accurate,
        body: accurate
          ? "A1C, fasting glucose, random glucose, and glucose-tolerance testing look through different time windows or testing conditions. Clinicians compare them with symptoms, history, and factors that may affect accuracy."
          : "Ordering more than one test does not mean someone failed a test or that the clinician is trying to be harsher. Different tests answer different questions.",
        heading: accurate
          ? "Several windows can make the picture clearer."
          : "The tests are not a series of grades.",
        whyOthers: [
          "A result can need confirmation even when the test was performed correctly.",
          "More testing is used for context and confirmation, not punishment.",
        ],
      },
    };
  }

  const accurate = data.answer === "useful_windows";
  return {
    ok: true,
    data: {
      accurate,
      body: accurate
        ? "A blood-glucose test shows one moment. A1C reflects a longer average. Clinicians use those windows together with context, and neither number defines the person."
        : "Numbers can guide care, but they are not daily grades and one reading does not make the diagnosis appear or disappear by itself.",
      heading: accurate
        ? "That is the lesson in plain language."
        : "Bring the time window back into the explanation.",
      whyOthers: [
        "Daily readings naturally change and are not grades.",
        "Diagnosis and ongoing care rely on more context than one isolated reading.",
      ],
    },
  };
}
