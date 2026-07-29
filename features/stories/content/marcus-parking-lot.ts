import type { InteractiveStory } from "@/features/stories/types/interactive-story";

export const marcusParkingLotStory = {
  id: "marcus-parking-lot",
  slug: "marcus-parking-lot",
  title: "Forty Minutes in the Parking Lot",
  characterName: "Marcus",
  disclosure:
    "About this story: Marcus is a placeholder name. This is an original illustrative scenario inspired by emotions and questions commonly reported by people living with Type 2 diabetes. It does not describe one specific individual.",
  topic: "Just diagnosed",
  themes: [
    "Diagnosis",
    "Overwhelm",
    "Self-blame",
    "Information overload",
    "Finding a manageable next step",
  ],
  learningObjective:
    "A new Type 2 diabetes diagnosis does not need to be understood or solved all at once. Identify one safe, manageable next step and bring personal questions to a qualified healthcare professional.",
  relatedLessonId: "lesson-1",
  estimatedMinutes: 7,
  medicalRiskLevel: "low",
  reviewStatus: "not-reviewed",
  version: "1.0",
  sourceThemeNote:
    "Original composite narrative informed by recurring themes commonly described in public diabetes-education discussions. No single person’s wording, identity, or chronology is reproduced.",
  visualTheme: "quiet-dusk",
  emotionalArc: "shock to orientation",
  dominantInteractionType: "prioritize",
  primaryAccent: "dashboard amber",
  closingTone: "quietly capable",
  imagePath: "/stories/marcus-parking-lot-cover.webp",
  imageAlt:
    "An editorial illustration of a man sitting quietly inside a parked car at dusk with folded medical papers and a phone after an appointment.",
  imagePrompt:
    "A cinematic editorial illustration of a quiet medical-office parking lot at dusk, with a middle-aged man seen from behind sitting alone inside a parked car, folded medical papers in his lap, and a phone beside him. Restrained warm cream, muted green, blue-gray, and soft terracotta; private reflection without panic, branding, text, or dramatic medical imagery.",
  introduction:
    "Marcus left his appointment with several pages of instructions and almost none of the words he needed. Follow the first evening after his diagnosis and the small question that helped him move forward.",
  whyItMatters:
    "This story explores the first hours after diagnosis and why one manageable next step can be more useful than trying to understand everything at once.",
  scenes: [
    {
      id: "the-word-he-heard",
      number: 1,
      title: "The Word He Heard",
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
        "The doctor turned her monitor slightly toward Marcus.",
        "Several results were on the screen, but his attention stopped on one word.",
        "Diabetes.",
        "The doctor continued talking. She mentioned his A1C, a prescription, and a follow-up appointment. Marcus nodded whenever she paused, although almost none of the details stayed with him.",
        "In his mind, the conversation had already moved years into the future.",
        "Would he need injections?",
        "Had he permanently damaged his body?",
        "Would every meal become a medical decision?",
        "He left the office carrying three printed pages he could barely remember receiving.",
      ],
    },
    {
      id: "forty-minutes",
      number: 2,
      title: "Forty Minutes",
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
        "Marcus reached his car but did not turn it on.",
        "He sat in the driver’s seat with the visit summary folded across his lap. Cars entered and left the parking lot around him. He barely noticed them.",
        "His wife texted: “How did the appointment go?”",
        "Marcus began typing: “Everything is fine.”",
        "He erased it.",
        "Then he typed: “I have diabetes.”",
        "He erased that too.",
        "He did not know how to explain something he did not understand himself.",
        "Forty minutes passed before he finally touched the call button.",
      ],
    },
    {
      id: "the-promise-he-thought-he-broke",
      number: 3,
      title: "The Promise He Thought He Broke",
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
        "Marcus’s thoughts went to his father.",
        "He remembered the plastic pill organizer on the kitchen counter. He remembered relatives watching what his father ate and asking whether he was “supposed to have that.”",
        "Years earlier, Marcus had quietly promised himself that he would take better care of his health.",
        "Now he felt as though he had broken that promise without realizing it.",
        "He thought about skipped appointments, takeout dinners, and all the months when he had told himself he was simply too busy.",
        "The diagnosis did not feel like information.",
        "It felt like evidence against him.",
      ],
    },
    {
      id: "then-come-home",
      number: 4,
      title: "Then Come Home",
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
        "Marcus finally called his wife.",
        "He expected her to panic. Instead, she listened while he tried to repeat the few details he remembered.",
        "After a quiet moment, she was ready to respond.",
      ],
      paragraphsAfterInteraction: [
        "After a quiet moment, she asked: “What did the doctor tell you to do tonight?”",
        "Marcus unfolded the papers.",
        "“Nothing tonight, really,” he said. “I need to pick up a prescription tomorrow and schedule another appointment.”",
        "“Then come home,” she replied. “We’ll start there.”",
        "Her response did not make the diagnosis disappear.",
        "It made the diagnosis smaller than the disaster Marcus had built in his mind.",
        "For the first time since leaving the examination room, he could see something directly in front of him instead of imagining everything that might happen years later.",
      ],
    },
    {
      id: "too-much-information",
      number: 5,
      title: "Too Much Information",
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
        "Later that evening, Marcus searched for Type 2 diabetes online.",
        "Within minutes, he was reading about kidney disease, vision loss, heart problems, diets, medications, and complications.",
        "Each new tab gave him more information and less understanding.",
        "He was trying to learn everything before he had learned what his own results meant.",
      ],
      paragraphsAfterInteraction: [
        "Marcus eventually closed his laptop.",
        "His wife placed two cups of tea on the kitchen table and pulled over a sheet of paper.",
        "Instead of searching for every possible answer, they wrote down the questions that belonged to Marcus.",
      ],
    },
    {
      id: "three-questions",
      number: 6,
      title: "Three Questions",
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
          "Prioritization turns an overwhelming diagnosis into questions that can be addressed one at a time without pretending every answer is immediately available.",
      },
      continueLabel: "Pause and Think",
      paragraphs: [
        "Marcus and his wife wrote down three questions:",
        "1. What does this diagnosis mean for me?",
        "2. What should I do first?",
        "3. Can I still live a normal life?",
        "None of those questions had complete answers that night.",
        "Marcus was still frightened when he went to bed. He did not suddenly feel confident, motivated, or ready to change his entire life.",
        "But he knew what he would do in the morning.",
        "He would pick up his prescription.",
        "He would schedule the follow-up appointment.",
        "He would bring his three questions.",
        "For that first night, it was enough.",
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
        "Marcus still had unanswered questions. Progress began when he focused on what he could safely do next instead of trying to solve his entire future at once.",
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
    "Marcus did not leave the clinic feeling fearless or fully prepared. His progress was quieter than that.",
    "He stopped trying to understand his entire future and identified what belonged to tomorrow morning.",
    "That did not minimize the diagnosis. It made responding to it possible.",
  ],
  takeaway:
    "You do not need to solve diabetes on the day you are diagnosed. Begin with the next safe, manageable step.",
  privateReflectionPrompt: "What would help make a new diagnosis feel more manageable for you?",
} satisfies InteractiveStory;
