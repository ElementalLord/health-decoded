export type MatchPairItem = {
  id: string;
  label: string;
};

export type MatchPairActivityConfiguration = {
  feedback: {
    correct: string;
    retry: string;
  };
  helperText?: string | undefined;
  leftItems: MatchPairItem[];
  prompt: string;
  rightItems: MatchPairItem[];
};

export type MatchPairActivity = {
  configuration: MatchPairActivityConfiguration;
  id: string;
  instructions: string;
  isComplete: boolean;
  title: string;
  type: "match_pair";
};

export type LessonActivity = MatchPairActivity;
