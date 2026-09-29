import type { InteractiveStory } from "@/features/stories/types/interactive-story";

export const marcusParkingLotStory = {
  id: "marcus-parking-lot",
  slug: "marcus-parking-lot",
  title: "After the Appointment",
  characterName: "Marcus",
  disclosure:
    "Marcus is a placeholder name. This is an original illustrative scenario based on common questions people report after a Type 2 diabetes diagnosis. It does not describe one specific individual or provide personal medical advice.",
  topic: "A new diagnosis",
  themes: [
    "Diagnosis",
    "Overwhelm",
    "Self-blame",
    "Information overload",
    "Finding a manageable next step",
  ],
  learningObjective:
    "Separate a new diagnosis from self-blame and identify the instructions and questions that are useful on the first day.",
  relatedLessonId: "lesson-1",
  estimatedMinutes: 7,
  estimatedTimeLabel: "About 7 minutes",
  readerPartCount: 8,
  relatedLessonLabel: "Lesson 1",
  relatedLessonTitle: "Lesson 1, The First Five Minutes",
  relatedLessonHref: "/lessons/1",
  medicalRiskLevel: "low",
  reviewStatus: "not-reviewed",
  version: "2.1",
  sourceThemeNote:
    "Original composite narrative informed by recurring themes commonly described in public diabetes-education discussions. No single person’s wording, identity, or chronology is reproduced.",
  visualTheme: "quiet-dusk",
  emotionalArc: "overwhelm to a practical plan",
  dominantInteractionType: "prioritize",
  primaryAccent: "dashboard amber",
  closingTone: "practical",
  imagePath: "/stories/marcus-parking-lot-cover.webp",
  imageAlt:
    "An editorial illustration of a man sitting inside a parked car at dusk with appointment papers and a phone.",
  imagePrompt:
    "A cinematic editorial illustration of a quiet medical-office parking lot at dusk, with a middle-aged man seen from behind sitting alone inside a parked car, folded medical papers in his lap, and a phone beside him. Restrained warm cream, muted green, blue-gray, and soft terracotta; private reflection without panic, branding, text, or dramatic medical imagery.",
  introduction:
    "Marcus leaves an appointment with a new diagnosis and only part of what the doctor said.",
  whyItMatters:
    "The first day can be hard to process. Clear instructions and a few specific questions can be more useful than trying to understand everything at once.",
  scenes: [
    {
      id: "the-word-he-heard",
      number: 1,
      title: "The appointment",
      layout: "narrative-left",
      tone: "tension",
      interactionType: "attention-overload",
      interaction: {
        id: "marcus-attention-overload",
        purpose: "interpret",
        engagement: "optional-exploration",
        prompt:
          "Marcus has just heard the diagnosis. Which information is he most likely to hold onto in this moment?",
        instructions: "Choose up to two items, then consider what stress can do to attention.",
        options: [
          { id: "diagnosis", label: "Type 2 diabetes" },
          { id: "a1c", label: "A1C result" },
          { id: "prescription", label: "Prescription" },
          { id: "follow-up", label: "Follow-up appointment" },
          { id: "nutrition", label: "Nutrition guidance" },
          { id: "contact", label: "Contact information" },
        ],
        feedbackMode: "open-interpretation",
        requiredForProgress: false,
        learningPoint:
          "Stress can narrow attention toward emotionally charged information while practical details become harder to retain.",
      },
      continueLabel: "Continue to the parking lot",
      paragraphs: [
        "The doctor turned her monitor toward Marcus. There were several results on the screen, but he stopped listening after two words: Type 2 diabetes.",
        "She explained his A1C, a prescription, and when to come back. Marcus nodded. By the time he reached the hallway, most of the details were gone.",
      ],
    },
    {
      id: "forty-minutes",
      number: 2,
      title: "In the car",
      layout: "narrative-right",
      tone: "pause",
      interactionType: "emotional-interpretation",
      interaction: {
        id: "marcus-message-interpretation",
        purpose: "interpret",
        engagement: "optional-exploration",
        prompt: "What may be making this message difficult for Marcus to send?",
        instructions: "Choose one or more possibilities. More than one reaction can be true.",
        options: [
          {
            id: "language",
            label: "He does not know how to explain something he barely understands",
          },
          {
            id: "reaction",
            label: "He is worried about how the other person will react",
          },
          {
            id: "real",
            label: "Saying it aloud makes the diagnosis feel more real",
          },
          {
            id: "multiple",
            label: "More than one of these may be true",
          },
        ],
        feedbackMode: "open-interpretation",
        requiredForProgress: false,
        learningPoint:
          "Silence after difficult news can reflect uncertainty and emotion rather than avoidance or lack of care.",
      },
      continueLabel: "See what Marcus was thinking",
      paragraphs: [
        "Marcus sat in the driver’s seat with the visit summary folded on his lap. He didn’t start the car.",
        "His wife texted to ask how the appointment went. He started an answer, deleted it, and put the phone down. Cars came and went. He stayed there for forty minutes.",
      ],
    },
    {
      id: "the-promise-he-thought-he-broke",
      number: 3,
      title: "His first thought",
      layout: "stacked",
      tone: "tension",
      interactionType: "thought-sort",
      interaction: {
        id: "marcus-fact-self-blame-sort",
        purpose: "sort",
        engagement: "knowledge-application",
        prompt: "Where does each thought belong?",
        instructions:
          "Sort each thought into what Marcus knows or what Marcus is blaming himself for.",
        options: [
          { id: "new-information", label: "I received new health information today." },
          { id: "prevented", label: "I should have prevented this." },
          { id: "results", label: "I need to understand what my results mean." },
          { id: "takeout", label: "Every takeout meal led to this." },
          { id: "first-step", label: "I can ask what my first step should be." },
          { id: "failed", label: "This diagnosis proves I failed." },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "A diagnosis provides health information; shame can add a harsher story that the results themselves do not say.",
      },
      continueLabel: "Continue to the phone call",
      paragraphs: [
        "Marcus thought about missed appointments and the takeout he ordered when work ran late. He thought about his dad’s pill organizer on the kitchen counter.",
        "“I should have stopped this from happening.”",
        "The doctor hadn’t said that. Marcus had filled in the blame on his own.",
      ],
    },
    {
      id: "then-come-home",
      number: 4,
      title: "The call",
      layout: "perspective-split",
      tone: "pause",
      interactionType: "response-prediction",
      interaction: {
        id: "marcus-helpful-response-prediction",
        purpose: "predict",
        engagement: "meaningful-decision",
        prompt: "Which response would be most helpful right now?",
        instructions: "Choose a response before Marcus hears what his wife actually says.",
        options: [
          {
            id: "replace-food",
            label: "We need to replace all the food in the house tonight.",
            feedback:
              "This reaction is understandable, but it may add pressure before Marcus knows what applies to him.",
          },
          {
            id: "all-numbers",
            label: "Tell me every number the doctor gave you.",
            feedback:
              "Details may matter later, but asking for all of them now may increase the load Marcus is already carrying.",
          },
          {
            id: "first-action",
            label: "What did the doctor ask you to do first?",
            feedback:
              "This response creates space for the next useful step without minimizing the diagnosis.",
          },
          {
            id: "nothing",
            label: "Do not worry about it. It is probably nothing.",
            feedback:
              "This may provide temporary relief, but it dismisses information that deserves appropriate follow-up.",
          },
        ],
        feedbackMode: "choice-consequence",
        requiredForProgress: true,
        learningPoint:
          "A grounding question can bring someone from an imagined future back to the next clear action.",
      },
      continueLabel: "Follow Marcus home",
      paragraphs: [
        "Marcus finally called his wife. He expected a dozen questions. Instead, she waited while he tried to repeat what he remembered.",
        "He got through the diagnosis, then stopped. “That’s about all I heard,” he said.",
      ],
      paragraphsAfterInteraction: [
        "His wife asked, “What did the doctor tell you to do first?”",
        "Marcus unfolded the papers. He needed to pick up a prescription the next morning and schedule a follow-up appointment.",
      ],
    },
    {
      id: "too-much-information",
      number: 5,
      title: "Too many tabs",
      layout: "decision-focus",
      tone: "clarity",
      interactionType: "information-filter",
      interaction: {
        id: "marcus-information-filter",
        purpose: "apply",
        engagement: "meaningful-decision",
        prompt: "What would make the information more useful to Marcus?",
        instructions:
          "Choose an information strategy, then turn a broad search into a question connected to Marcus’s care.",
        options: [
          {
            id: "every-complication",
            label: "Read until every possible complication is understood",
            feedback: "This adds more information before Marcus knows which details apply to him.",
          },
          {
            id: "dramatic",
            label: "Find the most dramatic explanation",
            feedback:
              "Emotional intensity can capture attention without making the information more personally useful.",
          },
          {
            id: "personal",
            label: "Connect one question to his own results and care instructions",
            feedback:
              "This connects general information to Marcus’s own care and creates a question a qualified professional can answer.",
          },
          {
            id: "avoid",
            label: "Avoid all health information permanently",
            feedback:
              "Stepping away can reduce overload, but permanent avoidance would also remove information that may become useful in context.",
          },
        ],
        feedbackMode: "choice-consequence",
        requiredForProgress: true,
        learningPoint:
          "Health information becomes more useful when a broad concern is connected to personal results, instructions, and a qualified source.",
      },
      continueLabel: "See the questions they wrote",
      paragraphs: [
        "After dinner, Marcus searched for Type 2 diabetes. Ten minutes later, he had tabs open about food, kidneys, eyesight, medications, and things that might happen years from now.",
        "The information wasn’t helping him understand his own appointment. He closed the laptop and unfolded the visit summary again.",
      ],
      paragraphsAfterInteraction: [
        "Marcus and his wife wrote down what he needed to do next and what he wanted to ask at the follow-up appointment.",
      ],
    },
    {
      id: "three-questions",
      number: 6,
      title: "For tomorrow",
      layout: "closing-wide",
      tone: "clarity",
      interactionType: "question-prioritization",
      interaction: {
        id: "marcus-question-prioritization",
        purpose: "prioritize",
        engagement: "knowledge-application",
        prompt: "How might Marcus organize these questions so he can address them one at a time?",
        instructions:
          "Place every question under Ask first, Discuss during follow-up, or Keep exploring over time. There is no perfect order.",
        options: [
          { id: "meaning", label: "What does this diagnosis mean for me?" },
          { id: "first", label: "What should I do first?" },
          { id: "normal-life", label: "Can I still live a normal life?" },
        ],
        feedbackMode: "open-interpretation",
        requiredForProgress: false,
        learningPoint:
          "Marcus can decide which question needs an answer first and save the others for later.",
      },
      continueLabel: "Pause and Think",
      paragraphs: [
        "Marcus and his wife wrote down what the doctor had asked him to do next. Then they added three questions for the follow-up appointment.",
        "He still felt unsettled when he went to bed. But he knew what he needed to do in the morning, so he stopped searching for the night.",
      ],
    },
  ],
  predictionPrompt:
    "What do you think helped Marcus most during his first evening after diagnosis?",
  quiz: [
    {
      id: "manageable-next-step",
      prompt: "What first helped Marcus begin moving forward?",
      choices: [
        { id: "a", label: "Understanding every possible complication" },
        { id: "b", label: "Creating a perfect long-term plan" },
        { id: "c", label: "Identifying one manageable next step" },
        { id: "d", label: "Pretending the diagnosis was not important" },
      ],
      correctChoiceId: "c",
      explanation:
        "Marcus still had unanswered questions. Focusing on the next instruction was more manageable than trying to plan everything at once.",
      relatedSceneId: "then-come-home",
    },
    {
      id: "information-overload",
      prompt: "Why did Marcus’s online search make him feel more overwhelmed?",
      choices: [
        { id: "a", label: "Reliable health information is never useful" },
        {
          id: "b",
          label:
            "He encountered many possible outcomes before understanding his own results and care plan",
        },
        { id: "c", label: "Type 2 diabetes cannot be explained online" },
        { id: "d", label: "He should never ask questions about diabetes" },
      ],
      correctChoiceId: "b",
      explanation:
        "Health information can be helpful, but it becomes easier to understand when it is connected to personal results and guidance from a qualified healthcare professional.",
      relatedSceneId: "too-much-information",
    },
    {
      id: "helpful-response",
      prompt:
        "A friend has just received a Type 2 diabetes diagnosis and says, “I have to change everything tonight.” Which response is most helpful?",
      choices: [
        {
          id: "a",
          label: "Yes. You should completely change your food and routine immediately.",
        },
        { id: "b", label: "Do not think about it until your next appointment." },
        {
          id: "c",
          label:
            "Let’s identify what your care team asked you to do first and write down your questions.",
        },
        {
          id: "d",
          label: "Search every possible complication so you know what could happen.",
        },
      ],
      correctChoiceId: "c",
      explanation:
        "The diagnosis deserves attention, but the first day does not require solving everything. Clear instructions, questions, and one manageable next step can reduce unnecessary overwhelm.",
      relatedSceneId: "three-questions",
    },
  ],
  interpretation: [
    "Marcus remembered the diagnosis more clearly than the practical details that followed it.",
    "Returning to the visit summary helped him separate his next steps from general information online.",
    "He kept three questions for the follow-up appointment instead of trying to answer them alone that night.",
  ],
  takeaway:
    "After a new diagnosis, start with the instructions from your care team and write down the questions you want to bring back.",
  privateReflectionPrompt: "What kind of support would help you process new health information?",
  completionHeading: "Finished",
  completionMessage:
    "Marcus left the evening with the instructions from his appointment and three questions for his care team.",
} satisfies InteractiveStory;
