export type MythCheckVerdict = "myth" | "fact" | "depends";

export type MythCheckCategory = "basics" | "food" | "monitoring" | "treatment";

export type MythCheckCard = {
  readonly id: string;
  readonly category: MythCheckCategory;
  readonly claim: string;
  readonly verdict: MythCheckVerdict;
  readonly explanation: string;
  readonly takeaway: string;
  readonly sourceIds: readonly string[];
  readonly status: "source-backed" | "draft" | "archived";
};

export type MythCheckSource = {
  readonly id: string;
  readonly organization: string;
  readonly title: string;
  readonly url: string;
  readonly accessedAt: string;
};

export type MythCheckMode = "quick" | MythCheckCategory | "all" | "replay";

export type MythCheckAnswer = {
  readonly cardId: string;
  readonly selected: MythCheckVerdict;
  readonly understood: boolean;
};
