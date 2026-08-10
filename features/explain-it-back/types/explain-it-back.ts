export type ExplainVerdict = "got_it" | "almost_there" | "try_again";

export type ExplainConcept = {
  readonly id: string;
  readonly meaning: string;
  readonly acceptedMeanings?: readonly string[];
  readonly missingFeedback: string;
};

export type ExplainMisconception = {
  readonly id: string;
  readonly meaning: string;
  readonly correction: string;
};

export type ExplainSource = {
  readonly organization: string;
  readonly title: string;
  readonly url: string;
};

export type ExplainChallenge = {
  readonly id: string;
  readonly group: "Foundations" | "Food & labels";
  readonly title: string;
  readonly prompt: string;
  readonly shortDescriptor: string;
  readonly referenceAnswer: string;
  readonly essentialConcepts: readonly ExplainConcept[];
  readonly optionalConcepts: readonly Omit<ExplainConcept, "missingFeedback">[];
  readonly misconceptions: readonly ExplainMisconception[];
  readonly passingExample: string;
  readonly almostExample: string;
  readonly failingExample: string;
  readonly sources: readonly ExplainSource[];
};

export type ExplainModelClassification = {
  readonly verdict: ExplainVerdict;
  readonly coveredConceptIds: readonly string[];
  readonly missingEssentialConceptIds: readonly string[];
  readonly contradictionIds: readonly string[];
  readonly offTopic: boolean;
  readonly personalMedicalContent: boolean;
};

export type ExplainFeedback = {
  readonly verdict: ExplainVerdict;
  readonly label: "You got the idea." | "Almost there." | "Give it another try.";
  readonly covered: readonly string[];
  readonly missing?: string;
  readonly correction?: string;
  readonly personalMedicalContent: boolean;
};
