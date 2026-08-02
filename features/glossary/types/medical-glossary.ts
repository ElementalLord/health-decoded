export type GlossaryTopic =
  | "Foundations"
  | "Tests and monitoring"
  | "Medicines and treatments"
  | "Food, nutrition, and activity"
  | "Urgent and long-term health"
  | "Care team and emotional health"
  | "Insurance, access, and appointments";

export type CommonlyConfused = { readonly term: string; readonly explanation: string };

export type MedicalGlossaryEntry = {
  readonly id: string;
  readonly slug: string;
  readonly term: string;
  readonly definition: string;
  readonly abbreviation?: string;
  readonly aliases?: readonly string[];
  readonly misspellings?: readonly string[];
  readonly commonlyConfusedWith?: CommonlyConfused;
  readonly sourceIds: readonly string[];
  readonly contentStatus: "source-backed";
  readonly topic: GlossaryTopic;
};

export type GlossarySeed = readonly [
  term: string,
  definition: string,
  options?: {
    readonly abbreviation?: string;
    readonly aliases?: readonly string[];
    readonly misspellings?: readonly string[];
    readonly confused?: CommonlyConfused;
  },
];

export type GlossarySource = {
  readonly id: string;
  readonly organization: string;
  readonly title: string;
  readonly url: string;
  readonly reviewedAt: string;
};
