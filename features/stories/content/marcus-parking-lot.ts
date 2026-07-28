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
      interactionType: "term-focus",
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
      interactionType: "phone-drafts",
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
      interactionType: "fact-vs-story",
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
      interactionType: "phone-dialogue",
      continueLabel: "Follow Marcus home",
      paragraphs: [
        "Marcus finally called his wife.",
        "He expected her to panic. Instead, she listened while he tried to repeat the few details he remembered.",
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
      interactionType: "meaningful-choice",
      continueLabel: "See the questions they wrote",
      paragraphs: [
        "Later that evening, Marcus searched for Type 2 diabetes online.",
        "Within minutes, he was reading about kidney disease, vision loss, heart problems, diets, medications, and complications.",
        "Each new tab gave him more information and less understanding.",
        "He was trying to learn everything before he had learned what his own results meant.",
        "Marcus eventually closed his laptop.",
        "His wife placed two cups of tea on the kitchen table and pulled over a sheet of paper.",
        "Instead of searching for every possible answer, they wrote down the questions that belonged to Marcus.",
      ],
    },
    {
      id: "three-questions",
      number: 6,
      title: "Three Questions",
      interactionType: "question-cards",
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
