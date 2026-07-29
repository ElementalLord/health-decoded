import type { InteractiveStory } from "@/features/stories/types/interactive-story";

export const noraPrescriptionBagStory: InteractiveStory = {
  id: "nora-prescription-bag",
  slug: "nora-prescription-bag",
  title: "The Prescription Stayed in the Bag",
  characterName: "Nora",
  disclosure:
    "About this story: Nora is a placeholder name. This is an original illustrative scenario inspired by concerns and emotions commonly reported by people who are prescribed medication for Type 2 diabetes. It does not describe one specific individual.",
  topic: "Starting medication",
  themes: [
    "medication stigma",
    "fear of failure",
    "uncertainty",
    "side-effect concerns",
    "asking useful questions",
    "following professional instructions",
    "building a manageable routine",
    "receiving support without judgment",
  ],
  learningObjective:
    "Understand that medication is a healthcare tool rather than a grade on effort; connect prescription-specific questions to qualified healthcare professionals; avoid independent medication changes; and practice support that preserves autonomy.",
  relatedLessonId: "lesson-7",
  relatedLessonLabel: "Lesson 7",
  relatedLessonTitle: "Lesson 7, Medicines Are Tools, Not Judgments",
  relatedLessonHref: "/lessons/7",
  estimatedMinutes: 8,
  estimatedTimeLabel: "6 to 8 minutes",
  medicalRiskLevel: "moderate",
  reviewStatus: "not-reviewed",
  version: "1.0",
  sourceThemeNote:
    "Original composite narrative informed by common medication-stigma, uncertainty, and question-asking themes in diabetes education. It does not reproduce one person’s identity, wording, or treatment plan.",
  imagePath: "/stories/nora-prescription-bag-cover.webp",
  imagePrompt:
    "A cinematic editorial scene in a quiet lived-in kitchen in early evening, with a thoughtful older woman seated at a table beside a closed unbranded pharmacy bag, reading glasses, and folded paper. Warm natural light, muted cream and green tones, no loose pills, labels, logos, or medical drama.",
  imageAlt:
    "An editorial illustration of a woman sitting at a kitchen table while a closed pharmacy bag rests nearby.",
  showDetailCover: true,
  introduction:
    "Nora picked up the medication her clinician prescribed, but the pharmacy bag stayed unopened on her kitchen counter. Follow the assumptions, questions, and conversation that changed what the prescription meant to her.",
  whyItMatters:
    "This story explores why starting medication can feel like failure and how clear questions can replace shame with informed decision-making.",
  scenes: [
    {
      id: "the-pharmacy-bag",
      number: 1,
      title: "The Pharmacy Bag",
      paragraphs: [
        "Nora expected the appointment to end with advice about food, movement, and another set of laboratory tests.",
        "Instead, her clinician also prescribed medication.",
        "At the pharmacy, Nora nodded while the pharmacist reviewed the label and instructions. She placed the bag on the passenger seat and drove home without opening it again.",
        "The bag felt heavier than it was.",
        "Nora had always believed medication came after someone had failed to make enough changes on their own.",
        "She did not say that belief aloud.",
        "She placed the bag on the kitchen counter and walked past it.",
      ],
      interactionType: "belief-mapping",
      interaction: {
        id: "nora-belief-map",
        purpose: "belief-mapping",
        engagement: "knowledge-application",
        prompt:
          "Which statements describe a fear or assumption, and which describe a more useful understanding?",
        instructions:
          "Place every statement in a category. Buttons provide a keyboard-friendly alternative to dragging.",
        options: [
          {
            id: "effort-proof",
            label: "Medication is proof that someone did not try hard enough.",
          },
          {
            id: "health-needs",
            label: "Medication may be recommended because of someone’s current health needs.",
          },
          {
            id: "habits-stop",
            label: "Taking medication means food, movement, and other habits no longer matter.",
          },
          {
            id: "broader-plan",
            label: "Medication can be one part of a broader care plan.",
          },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: true,
        learningPoint:
          "A prescription is not a grade on someone’s effort. Medication may be one tool used alongside other parts of a care plan.",
      },
      continueLabel: "See why the bag stayed closed",
    },
    {
      id: "still-on-the-counter",
      number: 2,
      title: "Still on the Counter",
      paragraphs: [
        "The bag remained on the counter the next morning.",
        "Nora noticed it while making coffee. She noticed it again before leaving for work.",
        "She was not forgetting it.",
        "She was waiting to feel certain.",
        "That evening, she searched the medication name online. One person described feeling much better. Another described an uncomfortable side effect. A third said no one should need medication if they ate correctly.",
        "The more Nora read, the less prepared she felt to make a decision.",
        "She still had the printed instructions from the pharmacy, but she had not looked at them again.",
      ],
      interactionType: "source-pathway",
      interaction: {
        id: "nora-source-pathway",
        purpose: "source-evaluation",
        engagement: "knowledge-application",
        prompt:
          "Nora has questions about why the medication was prescribed, how to follow the instructions, and what concerns to watch for. Which sources can help her get information connected to her own prescription?",
        instructions: "Choose every source that can speak to Nora’s specific prescription.",
        options: [
          {
            id: "written-instructions",
            label: "The prescription label and written pharmacy instructions",
          },
          { id: "pharmacist", label: "A pharmacist" },
          {
            id: "prescribing-professional",
            label: "The prescribing healthcare professional",
          },
          {
            id: "anonymous-comment",
            label: "An anonymous comment with no medical context",
          },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: true,
        learningPoint:
          "Other people’s experiences may feel relatable, but they cannot explain what Nora’s clinician prescribed for her. A pharmacist or prescribing professional can answer questions connected to her medication and care plan.",
      },
      continueLabel: "Continue to the conversation",
    },
    {
      id: "already",
      number: 3,
      title: "“Already?”",
      paragraphs: [
        "Nora’s sister came over that weekend and noticed the pharmacy bag.",
        "“They put you on medication already?” she asked.",
        "The question was brief. Her sister may have meant surprise or concern.",
        "Nora heard something else.",
        "She heard: You let this get bad.",
        "She folded the top of the bag closed and changed the subject.",
        "Her sister did not realize the conversation had ended before it had really begun.",
      ],
      interactionType: "perspective-switch",
      interaction: {
        id: "nora-perspective-response",
        purpose: "perspective-switch",
        secondaryPurpose: "rewrite-response",
        engagement: "meaningful-decision",
        prompt:
          "Intention and impact can be different. Look from both sides, then make room for Nora.",
        instructions:
          "Switch perspectives before choosing the response that lets Nora decide how much she wants to share.",
        options: [
          { id: "a", label: "Why did they put you on medication so quickly?" },
          { id: "b", label: "Are you sure you really need it?" },
          { id: "c", label: "How are you feeling about the new prescription?" },
          { id: "d", label: "You should try harder before relying on medication." },
        ],
        feedbackMode: "choice-consequence",
        requiredForProgress: true,
        learningPoint:
          "A supportive response centers Nora’s experience and lets her decide how much she wants to share.",
      },
      continueLabel: "See the question Nora was afraid to ask",
    },
    {
      id: "the-question-she-avoided",
      number: 4,
      title: "The Question She Avoided",
      paragraphs: [
        "On Monday, Nora called the pharmacy.",
        "She began with a practical question about the instructions. Then she paused.",
        "“There is something else,” she said. “Does needing this mean I failed?”",
        "The pharmacist did not laugh or rush her.",
        "They explained that medication was not a reward or punishment. It had been prescribed as one part of her care based on information her healthcare team had reviewed.",
        "Nora still wanted to understand more.",
        "For the first time, she realized that the questions she felt embarrassed to ask might be the ones she most needed answered.",
      ],
      interactionType: "question-builder",
      interaction: {
        id: "nora-question-builder",
        purpose: "question-building",
        engagement: "knowledge-application",
        prompt: "Which questions could help Nora understand the prescription more clearly?",
        instructions:
          "Build a list of four questions for a pharmacist or prescribing professional.",
        options: [
          { id: "purpose", label: "What is this medication intended to help with?" },
          {
            id: "label",
            label: "How should I follow the instructions on my prescription label?",
          },
          {
            id: "concerns",
            label: "What side effects or concerns should I discuss with you?",
          },
          {
            id: "uncertain",
            label: "What should I do if I am uncertain about an instruction?",
          },
          {
            id: "reading-change",
            label: "Can I change the amount whenever my glucose reading changes?",
          },
          {
            id: "online-stop",
            label: "Should I stop taking it if someone online had a bad experience?",
          },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: true,
        learningPoint:
          "Medication changes should not be made independently based on a single reading or another person’s experience. Questions about changing or stopping medication belong with a qualified healthcare professional.",
      },
      continueLabel: "See how Nora made the plan feel manageable",
    },
    {
      id: "making-it-fit",
      number: 5,
      title: "Making It Fit",
      paragraphs: [
        "After the call, Nora read the written instructions again.",
        "The prescription no longer felt like a sealed decision she was afraid to touch. It felt like something she could understand one question at a time.",
        "She decided to follow the instructions she had been given.",
        "Her next challenge was practical.",
        "She did not want the medication to remain isolated on the counter, separate from the routines that already shaped her day.",
        "Nora looked for a simple reminder that would not make her entire morning feel medical.",
      ],
      interactionType: "routine-anchor",
      interaction: {
        id: "nora-routine-anchor",
        purpose: "routine-planning",
        engagement: "meaningful-decision",
        prompt:
          "Which routine could act as a reminder while still following the medication’s specific label instructions?",
        instructions:
          "Choose one familiar anchor, then connect it to the written prescription instructions.",
        options: [
          { id: "teeth", label: "Brushing teeth" },
          { id: "breakfast", label: "Preparing breakfast" },
          { id: "keys", label: "Placing keys near the door" },
          { id: "alarm", label: "Setting an evening phone alarm" },
          { id: "organizer", label: "Filling a weekly organizer" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: true,
        learningPoint:
          "A routine can support memory, but it does not replace the instructions on the label or advice from a pharmacist or prescriber.",
      },
      continueLabel: "See what changed for Nora",
    },
    {
      id: "one-tool-not-a-verdict",
      number: 6,
      title: "One Tool, Not a Verdict",
      paragraphs: [
        "A few days later, the pharmacy bag was gone from the counter.",
        "Nora had not stopped caring about meals, movement, or the other changes she wanted to make.",
        "She also had not become completely comfortable with medication overnight.",
        "She still wrote down questions when they came up.",
        "What changed was the meaning she attached to the prescription.",
        "The medication was not evidence against her.",
        "It was one part of a plan she could continue learning about with her healthcare team.",
        "The bottle had stopped feeling like a verdict.",
        "It had become a tool.",
      ],
      interactionType: "care-toolbox",
      interaction: {
        id: "nora-care-toolbox",
        purpose: "concept-integration",
        engagement: "knowledge-application",
        prompt: "Build a care toolbox that can hold several useful tools at the same time.",
        instructions: "Add all seven elements. This activity does not rank one above another.",
        options: [
          { id: "medication", label: "Medication used as prescribed" },
          { id: "questions", label: "Questions for the healthcare team" },
          { id: "meals", label: "Meals that feel realistic" },
          { id: "movement", label: "Movement that fits the person’s life" },
          { id: "sleep", label: "Sleep and recovery" },
          { id: "appointments", label: "Appointments and follow-up" },
          { id: "support", label: "Support from trusted people" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: true,
        learningPoint:
          "A care plan can contain several tools at the same time. Using medication does not erase the value of habits, questions, appointments, or support.",
      },
      continueLabel: "Pause and Think",
    },
  ],
  predictionPrompt: "What most changed Nora’s relationship with the prescription?",
  predictionChoices: [
    { id: "a", label: "She stopped caring what anyone thought." },
    { id: "b", label: "She learned that medication guaranteed a perfect result." },
    {
      id: "c",
      label: "She asked questions and stopped treating medication as proof of failure.",
    },
    {
      id: "d",
      label: "She decided that medication was the only part of her care that mattered.",
    },
  ],
  quiz: [
    {
      id: "nora-belief-question",
      prompt: "Which belief contributed most to Nora’s hesitation?",
      choices: [
        { id: "a", label: "Medication could be one part of a larger care plan." },
        { id: "b", label: "Being prescribed medication meant she had failed." },
        { id: "c", label: "A pharmacist could answer questions about the prescription." },
        {
          id: "d",
          label: "Written instructions could help her understand what to do.",
        },
      ],
      correctChoiceId: "b",
      explanation:
        "Nora was not only uncertain about the medication. She had attached a moral judgment to it. Seeing medication as proof of failure made it harder for her to ask useful questions.",
      relatedSceneId: "the-pharmacy-bag",
    },
    {
      id: "nora-safest-response-question",
      prompt: "What is the safest response when someone is uncertain about a new prescription?",
      choices: [
        { id: "a", label: "Change the amount based on how they feel that day." },
        {
          id: "b",
          label: "Stop taking it after reading one negative online experience.",
        },
        {
          id: "c",
          label:
            "Review the written instructions and contact a pharmacist or prescribing professional with questions.",
        },
        {
          id: "d",
          label: "Follow whatever worked for a friend with the same diagnosis.",
        },
      ],
      correctChoiceId: "c",
      explanation:
        "Medication instructions are specific to the prescription and the person’s care. A pharmacist or prescribing professional can clarify questions without requiring the person to guess or rely on someone else’s experience.",
      relatedSceneId: "still-on-the-counter",
    },
    {
      id: "nora-support-question",
      prompt:
        "Which response is most supportive when someone feels embarrassed about starting medication?",
      choices: [
        { id: "a", label: "Are you sure you really need it?" },
        { id: "b", label: "You should have tried harder first." },
        {
          id: "c",
          label: "How are you feeling about the prescription, and would any support be useful?",
        },
        { id: "d", label: "Do not tell anyone you are taking it." },
      ],
      correctChoiceId: "c",
      explanation:
        "This response makes room for the person’s feelings and preserves their ability to decide what support they want.",
      relatedSceneId: "already",
    },
  ],
  resultIdeas: [
    "Medication is not proof of failure.",
    "Prescription questions belong with qualified healthcare professionals.",
    "Support should reduce shame while preserving autonomy.",
  ],
  keyIdeaUnderstoodMessage:
    "You connected medication with informed care rather than moral judgment.",
  lessonEyebrow: "What Nora’s experience can teach us",
  lessonHeading: "The question beneath the question deserved a clear answer.",
  interpretation: [
    "Nora’s hesitation was not simply about remembering to open a pharmacy bag. She believed the prescription said something about her character.",
    "The turning point came when she asked the question she felt embarrassed to say aloud.",
    "Clear information did not erase every concern. It helped her separate the medication from the judgment she had attached to it.",
  ],
  takeaway:
    "Medication is a healthcare tool, not a verdict on how hard someone tried. Questions about a prescription deserve clear answers from a qualified healthcare professional.",
  privateReflectionPrompt:
    "What question would help you feel more informed about a new medication?",
  completionHeading: "A prescription can be a tool without becoming a judgment.",
  completionMessage:
    "You followed Nora as she separated a new prescription from the belief that needing medication meant she had failed.",
};
