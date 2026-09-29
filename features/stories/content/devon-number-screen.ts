import type { InteractiveStory } from "@/features/stories/types/interactive-story";

export const devonNumberScreenStory: InteractiveStory = {
  id: "devon-number-screen",
  slug: "devon-number-screen",
  title: "After Dinner",
  characterName: "Devon",
  disclosure:
    "Devon is a placeholder name. This is an original illustrative scenario based on common reactions to an unexpected glucose result. It does not describe one specific individual or provide personal instructions for responding to a glucose result.",
  topic: "A worrying reading",
  themes: [
    "glucose anxiety",
    "self-judgment",
    "measurement context",
    "symptoms and care plans",
    "useful care-team communication",
    "one result and a longer view",
  ],
  learningObjective:
    "Show how to separate a glucose result from self-judgment, check symptoms and measurement context, follow an established care plan, and prepare a useful question for a qualified healthcare professional.",
  relatedLessonId: "20000000-0000-0000-0000-000000000008",
  relatedLessonLabel: "Lesson 8",
  relatedLessonTitle: "Lesson 8, Making Sense of Your Glucose",
  relatedLessonHref: "/lessons/8",
  estimatedMinutes: 7,
  estimatedTimeLabel: "About 7 minutes",
  readerPartCount: 8,
  medicalRiskLevel: "moderate",
  contentWarning:
    "This story includes an unexpected glucose result and a brief discussion of symptoms that may need urgent help.",
  reviewStatus: "not-reviewed",
  version: "2.1",
  sourceThemeNote:
    "Original composite narrative informed by common glucose-monitoring concerns. It avoids personal targets, treatment changes, and universal response thresholds.",
  visualTheme: "urgent-calm",
  emotionalArc: "worry to useful context",
  dominantInteractionType: "reading-boundary",
  primaryAccent: "muted blue-green",
  closingTone: "grounded and practical",
  imagePath: "/stories/devon-number-screen-cover.webp",
  imagePrompt:
    "A cinematic editorial illustration of a thoughtful adult man sitting at a lived-in kitchen table at night, looking at an unbranded glucose meter with an unreadable display. A notebook, pen, water glass, and ordinary dinner remnants provide context. Warm cream and muted blue-green palette, restrained amber light, calm rather than alarming, no readable numbers, logos, labels, needles, or medical drama.",
  imageAlt:
    "An editorial illustration of a man sitting at a kitchen table at night while looking at a glucose meter with an unreadable display.",
  introduction: "An unexpected glucose result leaves Devon worried that he did something wrong.",
  whyItMatters:
    "A result can deserve attention without becoming a grade on effort or a reason to improvise treatment.",
  scenes: [
    {
      id: "the-number",
      number: 1,
      title: "After dinner",
      layout: "quiet-pause",
      tone: "tension",
      paragraphs: [
        "Devon almost forgot to check his glucose. When he did, the result was above the personal range he and his healthcare team had discussed.",
        "He looked at the screen and immediately thought he had done something wrong: ‘Great. I messed up.’",
      ],
      interactionType: "reading-boundary",
      interaction: {
        id: "devon-reading-boundary",
        purpose: "reading-boundary",
        engagement: "optional-exploration",
        prompt: "What can a device measure, and what is outside its job?",
        instructions: "Compare measurement with a conclusion about the person.",
        options: [
          { id: "reading", label: "Measurement: information from this check" },
          { id: "judgment", label: "Judgment: a conclusion about someone’s effort" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "A device can supply health data without evaluating character, intention, or effort.",
      },
      continueLabel: "A few minutes later",
    },
    {
      id: "what-the-number-became",
      number: 2,
      title: "On the sofa",
      layout: "thought-chain",
      tone: "tension",
      paragraphs: [
        "Devon tried to watch television, but he kept replaying dinner and the birthday cake someone had brought to work.",
        "One result turned into a guess about the meal, then a prediction about every reading that might come next.",
      ],
      interactionType: "thought-chain",
      interaction: {
        id: "devon-thought-chain",
        purpose: "thought-chain",
        engagement: "optional-exploration",
        prompt: "Where does the direct evidence end?",
        instructions: "Follow the observation, guess, and prediction.",
        options: [
          { id: "observation", label: "The result is above Devon’s personal range" },
          { id: "guess", label: "Dinner must have caused it" },
          { id: "prediction", label: "Every future reading will look like this" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "Only the first statement comes directly from the meter. One result does not establish an exact cause or predict the future.",
      },
      continueLabel: "Go back to the meter",
    },
    {
      id: "before-he-trusted-it",
      number: 3,
      title: "Checking the steps",
      layout: "process-path",
      tone: "pause",
      paragraphs: [
        "Devon noticed a piece of cut fruit beside the plate. He could not remember whether he had washed and dried his hands before testing.",
        "That did not prove the result was wrong. It gave him a reason to slow down and follow the instructions for his meter.",
      ],
      interactionType: "measurement-context",
      interaction: {
        id: "devon-measurement-context",
        purpose: "measurement-context",
        engagement: "knowledge-application",
        prompt: "Which steps add useful measurement context?",
        instructions: "Compare careful technique with reassurance-seeking.",
        options: [
          { id: "hands", label: "Wash and dry his hands" },
          { id: "guide", label: "Follow the meter instructions" },
          { id: "record", label: "Record the result and useful context" },
          { id: "repeat", label: "Keep testing until a preferred number appears" },
        ],
        feedbackMode: "choice-consequence",
        requiredForProgress: false,
        learningPoint:
          "Careful technique can add useful context without promising a preferred result. Repeated testing should follow device instructions and the established care plan.",
      },
      continueLabel: "Open Devon’s care plan",
    },
    {
      id: "what-mattered-now",
      number: 4,
      title: "What matters now",
      layout: "decision-focus",
      tone: "clarity",
      paragraphs: [
        "The meter could show a result. It could not check Devon’s symptoms, read his personal instructions, or tell whether this was isolated or repeating.",
        "Devon was alert and able to think clearly. He opened the written plan from his healthcare team.",
      ],
      interactionType: "urgency-context",
      interaction: {
        id: "devon-urgency-context",
        purpose: "urgency-context",
        engagement: "optional-exploration",
        prompt: "What else shapes the response?",
        instructions: "Review symptoms, the personal plan, and the broader pattern.",
        options: [
          { id: "symptoms", label: "Symptoms and how Devon feels" },
          { id: "personal-plan", label: "His written care plan" },
          { id: "pattern", label: "Whether the result is isolated or repeating" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "Urgency depends on symptoms, Devon’s established plan, and the broader pattern. A general story cannot supply one universal number.",
      },
      continueLabel: "Write down the context",
    },
    {
      id: "the-note-beside-the-meter",
      number: 5,
      title: "A useful note",
      layout: "communication-builder",
      tone: "clarity",
      paragraphs: [
        "Devon put a notebook beside the meter. He wrote down the result and time, then added the details he would want his care team to know.",
        "He did not need to identify one cause or apologize for the number. He needed a clear question with enough context to discuss it.",
      ],
      interactionType: "communication-builder",
      interaction: {
        id: "devon-communication-builder",
        purpose: "communication-builder",
        engagement: "optional-exploration",
        prompt: "Which details could make the conversation more useful?",
        instructions: "Add any context Devon wants to bring to his healthcare team.",
        options: [
          { id: "result-time", label: "The result and time" },
          { id: "meal-timing", label: "When it was checked in relation to eating" },
          { id: "symptoms", label: "How he felt and any symptoms" },
          { id: "routine", label: "Relevant changes in illness, stress, sleep, or routine" },
          { id: "instructions", label: "The meter and care-plan instructions he followed" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "Useful context can help a qualified healthcare professional without requiring Devon to invent a cause, apologize, or change treatment independently.",
      },
      continueLabel: "See the longer view",
    },
    {
      id: "one-point-on-a-longer-line",
      number: 6,
      title: "The follow-up",
      layout: "closing-wide",
      tone: "clarity",
      paragraphs: [
        "Devon’s care team reviewed the result, its timing, how he felt, and the instructions he had followed.",
        "They discussed what information would be useful if something similar happened again. They considered the result alongside the rest of Devon’s note.",
      ],
      interactionType: "pattern-comparison",
      interaction: {
        id: "devon-pattern-comparison",
        purpose: "pattern-comparison",
        engagement: "optional-exploration",
        prompt: "What makes a more useful care conversation?",
        instructions: "Compare one isolated point with results that include relevant context.",
        options: [
          { id: "isolated", label: "One isolated result" },
          { id: "contextual", label: "Results with timing, symptoms, and routine context" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "Context can support a more specific question. Devon’s care plan determines when monitoring is useful; this story does not.",
      },
      continueLabel: "Finish story",
    },
  ],
  predictionPrompt: "What helped Devon respond without turning the result into a judgment?",
  predictionChoices: [
    { id: "a", label: "He ignored the result" },
    { id: "b", label: "He identified one meal as the permanent cause" },
    {
      id: "c",
      label: "He added symptoms, measurement context, his care plan, and a useful question",
    },
    { id: "d", label: "He changed treatment on his own" },
  ],
  quiz: [
    {
      id: "devon-reading-meaning",
      prompt: "What can one glucose reading report by itself?",
      choices: [
        { id: "a", label: "Whether Devon tried hard enough" },
        { id: "b", label: "The exact cause" },
        { id: "c", label: "The glucose result at that moment" },
        { id: "d", label: "Every future result" },
      ],
      correctChoiceId: "c",
      explanation:
        "The meter reports a result at a moment. It cannot measure effort, prove an exact cause, or predict the future.",
      relatedSceneId: "the-number",
    },
    {
      id: "devon-unexpected-result",
      prompt: "What adds useful context to an unexpected result?",
      choices: [
        { id: "a", label: "Changing medication immediately" },
        { id: "b", label: "Testing until a preferred result appears" },
        { id: "c", label: "Symptoms, measurement technique, and the established care plan" },
        { id: "d", label: "Ignoring it because a previous result was different" },
      ],
      correctChoiceId: "c",
      explanation:
        "Symptoms, measurement context, and the person’s established plan guide the response.",
      relatedSceneId: "what-mattered-now",
    },
    {
      id: "devon-useful-message",
      prompt: "Which note gives a healthcare professional useful context?",
      choices: [
        { id: "a", label: "An apology for the result" },
        { id: "b", label: "The most frightening explanation online" },
        { id: "c", label: "The result, timing, symptoms, context, and instructions followed" },
        { id: "d", label: "A promise to avoid one meal forever" },
      ],
      correctChoiceId: "c",
      explanation:
        "Context helps the care team discuss the result without requiring Devon to invent a cause or apologize.",
      relatedSceneId: "the-note-beside-the-meter",
    },
  ],
  resultIdeas: [
    "A glucose result is information, not a grade on effort.",
    "Symptoms, measurement context, and an established care plan shape the response.",
    "Timing, symptoms, and routine details can help at follow-up.",
  ],
  keyIdeaUnderstoodMessage: "The result on the screen was not a judgment about Devon.",
  lessonEyebrow: "What changed",
  lessonHeading: "Devon brought the result and his notes to the follow-up.",
  interpretation: [
    "The meter reported one result; it did not grade Devon’s effort.",
    "Devon checked technique, symptoms, and the plan made with his healthcare team.",
    "Timing and routine context made the follow-up conversation more useful.",
  ],
  takeaway:
    "A worrying result deserves attention without becoming a judgment. Notice symptoms, follow device instructions and the established care plan, and ask a qualified healthcare professional when the result or response is unclear.",
  privateReflectionPrompt:
    "What context could help you discuss an unexpected health result without blaming yourself?",
  completionHeading: "Finished",
  completionMessage:
    "Devon checked the measurement context, followed his care plan, and prepared a useful question for his healthcare team.",
};
