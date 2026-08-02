export const caregiverModule3Source = Object.freeze({
  document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
  heading: "MODULE 3: EVERYDAY SUPPORT THAT ACTUALLY HELPS",
  claims: ["CG-CLAIM-002", "CG-CLAIM-003", "CG-CLAIM-005"] as const,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);

export const caregiverModule3 = Object.freeze({
  id: "CG-M3",
  slug: "everyday-support-that-actually-helps",
  metadata: {
    purpose: "Translate respect and permission into practical daily support.",
    audienceProblem:
      "Broad offers are hard to use, while unrequested household changes can feel stigmatizing or controlling.",
    emotionalObjective: "Move from uncertainty to specific usefulness to shared normalcy.",
    estimatedTime: "10 to 13 minutes",
    medicalRiskLevel:
      "Moderate because food, movement, medication reminders, appointments, and supplies appear without individualized prescriptions.",
    reviewStatus:
      "Editorial, clinical, cultural, privacy, accessibility, and emotional-safety review required.",
  },
  passiveReading: {
    title: "Small offers can make a real difference",
    paragraphs: [
      "Useful help often removes one piece of work instead of reorganizing someone else's life. A ride, grocery pickup, shared cleanup, or a quiet invitation can be meaningful because it is concrete and easy to accept, adjust, or decline.",
      "Ordinary life matters. Keeping meals, errands, and time together recognizable can reduce the feeling that every moment has become about diabetes. Support can fit alongside normal friendship, family life, and household routines.",
      "The most useful offer may change from week to week. Checking whether an offer still helps is not the same as checking up on the person. It is a way to let their current preference lead.",
    ],
    subsections: [
      {
        title: "Specific does not mean demanding",
        paragraphs: [
          "A specific offer names an action and leaves the answer open: “I am already going to the store. Would anything from your list help?” It gives the person less decision work without requiring them to explain, disclose, or accept a larger form of help.",
          "The offer can also have an endpoint. “I can drive Tuesday afternoon” is clearer than “I will handle transportation.” Clear edges make it easier to adjust support as schedules, energy, and preferences change.",
        ],
      },
      {
        title: "Shared spaces need shared decisions",
        paragraphs: [
          "A kitchen, calendar, cabinet, or car can be shared without becoming a place to supervise someone. Before changing a shared routine, talk about what is inconvenient, what would help, and what should remain private or unchanged.",
          "Not every practical problem needs a diabetes-specific solution. Sometimes the most respectful help is normal household cooperation: divide cleanup, pick up groceries, make room in the schedule, or enjoy time together without discussing health at all.",
        ],
      },
    ],
  },
  sections: {
    opening: {
      id: "CG-M3-S01",
      eyebrow: "MODULE 3 OF 5",
      title: "Everyday Support That Actually Helps",
      opening:
        "“Tell me if you need anything” can be sincere and still hard to use. Practical help becomes easier to accept when it is specific, connected to a real burden, and offered without turning daily life into a diabetes project.",
      centralIdea:
        "Ask what would reduce work, offer one concrete action, and keep ordinary life visible.",
    },
    scenario: {
      id: "CG-M3-S02",
      title: "Dinner at seven",
      paragraphs: [
        "Nia and Cam are roommates. They usually trade cooking nights. Cam was recently diagnosed with Type 2 diabetes and has had several appointments after work.",
        "On Nia's cooking night she says, “I cleared out the snack shelf and found a diabetes recipe online.”",
        "Cam looks into the cabinet. “You threw away my food?”",
        "“I was trying to make this easier,” Nia says. “The recipe is supposed to be healthy.”",
        "Cam sighs. “I wanted help getting to the pharmacy before it closes. I did not ask for a new kitchen.”",
        "Nia feels unappreciated. Cam is frustrated that dinner and the shared cabinet changed without a conversation. Neither person is entirely wrong about wanting the home to work better, but the chosen help did not match the request.",
      ],
    },
    meals: {
      id: "CG-M3-S03",
      title: "Shared meals are still shared life",
      paragraphs: [
        "Support does not require a separate meal, a forbidden-food list, or public comments about what belongs on someone's plate. Cultural and family foods can remain part of the conversation. The person living with diabetes and their qualified care team decide what fits their individual plan.",
        "A useful household question is practical:",
        "“What would make dinner easier this week?”",
        "Possible answers may involve timing, budget, shared ingredients, cleanup, transportation, or no change at all.",
      ],
    },
    specific: {
      id: "CG-M3-S04",
      title: "Specific help reduces decision work",
      broad: "Broad offer: “Let me know if you need anything.”",
      specific:
        "Specific offer: “I am going to the store at six. Would you like me to pick up anything from your list?”",
      paragraphs: [
        "Specific help can include a ride, one phone call, shared meal preparation, moving an errand, organizing a nonmedical supply space, taking notes if invited, or company on an ordinary walk if the person wants it.",
        "Movement is companionship here, not a treatment for a reading or symptom.",
      ],
    },
    changes: {
      id: "CG-M3-S05",
      title: "Support changes",
      paragraphs: [
        "An offer that helped during a busy month may become unnecessary. A medication reminder is appropriate only when requested and agreed. A supply shelf can be helpful without becoming an inspection point.",
        "Ask: “Does this still reduce work, or has it started to feel like checking?”",
      ],
    },
    normalLife: {
      id: "CG-M3-S06",
      title: "Preserve normal life",
      paragraphs: [
        "Not every meal, outing, text, or purchase needs a diabetes explanation. Continue invitations that are not built around health. Let the person decide what they disclose to guests or relatives.",
      ],
    },
    misunderstanding: {
      id: "CG-M3-S07",
      title: "Common misunderstanding correction",
      misunderstanding:
        "“Changing the whole household is more supportive than asking one person to change.”",
      correction:
        "Shared changes can be welcome when discussed. Unilateral changes can still remove choice. Ask what the household wants to change, who the change is for, and whether everyone can revisit it.",
    },
  },
  interactions: {
    planning: {
      id: "CG-M3-I01",
      title: "Plan the conversation, not the plate",
      prompt:
        "Cam says the pharmacy closes at seven, the grocery budget is tight, and he does not want a separate meal. Arrange a plan for the evening.",
      zones: ["Timing", "Shared task", "Question for Cam", "Leave undecided"] as const,
      items: [
        { id: "ride", copy: "Pharmacy ride before seven", preferredZones: ["Timing"] },
        { id: "cook", copy: "Cook after returning", preferredZones: ["Shared task"] },
        {
          id: "ingredients",
          copy: "Ask which shared ingredients work tonight",
          preferredZones: ["Question for Cam"],
        },
        { id: "portion", copy: "Choose Cam's portion", preferredZones: [] },
        { id: "separate", copy: "Buy a special separate meal", preferredZones: [] },
        {
          id: "shelf",
          copy: "Decide whether to change the snack shelf together later.",
          preferredZones: ["Leave undecided", "Question for Cam"],
        },
      ],
      submit: "Review the plan",
      reset: "Reset",
      feedback: {
        preferred:
          "The plan addresses the burden Cam named, keeps dinner shared, and leaves individual food decisions with him.",
        portion: "Choosing the amount on another adult's plate turns planning into food control.",
        separate: "A separate meal was not requested and may make the person conspicuous.",
        shelf:
          "Leaving this for a separate conversation keeps tonight's time pressure from deciding a household agreement.",
      },
      feedbackGap:
        "The approved source does not provide feedback for arrangements that misplace the ride, cooking, ingredient-question, or snack-shelf items.",
      learningPoint:
        "Practical context can be organized without prescribing what someone should eat.",
    },
    matching: {
      id: "CG-M3-I02",
      title: "Match the offer to the request",
      prompt: "Match each request to the offer that answers it without adding a new role.",
      pairs: [
        {
          id: "ride",
          request: "Could someone drive me Tuesday?",
          offer: "I can drive Tuesday at three.",
        },
        {
          id: "notes",
          request: "Would you take notes if I invite you in?",
          offer: "Yes. Tell me what you want captured.",
        },
        {
          id: "supplies",
          request: "Can you put these unopened supplies in one drawer?",
          offer: "Yes. Which drawer should I use?",
        },
        {
          id: "reminders",
          request: "I do not want reminders this week.",
          offer: "Okay. I will pause them.",
        },
      ],
      feedback: {
        preferred: "The offer stays inside the request.",
        adjacent:
          "This may be useful in another conversation, but it adds access, checking, or a role that was not requested.",
      },
      learningPoint: "Useful help is not the largest action. It is the action that fits.",
    },
    menu: {
      id: "CG-M3-I03",
      title: "Build a support menu",
      prompt:
        "Imagine the person has responded to each offer. Place it under Useful now, Ask another time, or Not wanted.",
      categories: ["Useful now", "Ask another time", "Not wanted"] as const,
      offers: [
        {
          id: "groceries",
          label: "grocery pickup",
          preference: "A grocery pickup would reduce work this week.",
          preferredCategory: "Useful now",
        },
        {
          id: "cooking",
          label: "shared cooking",
          preference: "I want to cook alone right now. Ask another time.",
          preferredCategory: "Ask another time",
        },
        {
          id: "walk",
          label: "invitation to walk together",
          preference: "I would rather walk alone this week.",
          preferredCategory: "Not wanted",
        },
        {
          id: "ride",
          label: "transportation",
          preference: "A ride on Tuesday would help.",
          preferredCategory: "Useful now",
        },
        {
          id: "notes",
          label: "appointment notes",
          preference: "I do not want notes right now.",
          preferredCategory: "Not wanted",
        },
        {
          id: "reminder",
          label: "requested reminder",
          preference: "Please pause reminders this week.",
          preferredCategory: "Not wanted",
        },
      ],
      submit: "Review this menu",
      feedback: {
        preferred:
          "The menu follows stated preferences. A medically related action is not automatically more important than transportation or cleanup.",
        mismatch:
          "One or more offers were placed by likely usefulness rather than the person's stated preference.",
      },
      learningPoint:
        "A support menu belongs to the relationship and can change; it is not a care plan.",
    },
    routines: {
      id: "CG-M3-I04",
      title: "When a routine becomes checking",
      prompt: "Compare each pair. Choose the detail that changes organization into monitoring.",
      topics: ["a shared supply drawer", "ride calendar", "requested reminder"],
      pairs: [
        {
          id: "drawer",
          topic: "a shared supply drawer",
          a: "Cam asked Nia to place unopened supplies in one drawer.",
          b: "Nia opens the drawer to inspect what is inside.",
          preferredOption: "private information",
        },
        {
          id: "calendar",
          topic: "ride calendar",
          a: "Cam asks Nia for a ride Tuesday afternoon.",
          b: "Nia adds Cam's appointments to a calendar without asking.",
          preferredOption: "permission",
        },
        {
          id: "reminder",
          topic: "requested reminder",
          a: "Cam asked for one reminder and later asks to pause it.",
          b: "Nia continues the reminder after the pause.",
          preferredOption: "permission",
        },
      ],
      options: ["permission", "frequency", "private information", "household convenience"],
      submit: "Compare the routines",
      feedback: {
        preferred:
          "The object is the same. The change is access, purpose, or continued checking after permission changed.",
        incorrect:
          "Frequency can matter, but look first for permission, private information, and whether the action continues after no.",
      },
      learningPoint:
        "Monitoring is defined by how information and behavior are checked, not by whether the routine looks organized.",
    },
  },
  scripts: [
    {
      label: "Groceries",
      copy: "“I am going to the store at six. Would you like anything from your list?”",
    },
    {
      label: "Family meal",
      copy: "“What would help this meal work for everyone? We do not need to single out one plate.”",
    },
    {
      label: "Movement invitation",
      copy: "“I am taking a walk after dinner. Want company? It is fine if not.”",
    },
    {
      label: "Transportation",
      copy: "“I can drive Tuesday afternoon. Does that fit what you need?”",
    },
    { label: "Appointment", copy: "“If you want me there, what role would be useful?”" },
    { label: "Reminders", copy: "“Would a reminder help, and if so, when should it stop?”" },
    {
      label: "Household routine",
      copy: "“Before I change the cabinet, can we decide together what would make the space work?”",
    },
    {
      label: "Declined offer",
      copy: "“Okay. I will not keep offering this. Ask me if it becomes useful later.”",
    },
  ],
  questions: [
    {
      id: "CG-M3-Q01",
      question:
        "At a family gathering, an aunt announces that she made a separate “diabetes plate” without asking. What is the main concern?",
      choices: [
        "The meal may expose and single out the person",
        "Every guest should eat the separate meal",
        "The aunt should explain the nutrition",
        "The person must accept because effort was made.",
      ],
      preferredIndex: 0,
      explanation:
        "A separate meal may be welcome if requested. Announcing it without permission can expose private information and make ordinary eating feel supervised.",
      relatedSection: "CG-M3-S03",
      reviewLabel: "Review shared meals",
    },
    {
      id: "CG-M3-Q02",
      question:
        "A neighbor asks for a ride to pick up supplies but declines help organizing them. What offer fits?",
      choices: [
        "Provide the ride and leave organization alone",
        "Organize them during the ride",
        "Ask to inspect the supplies first",
        "Decline the ride because only part of the help was accepted.",
      ],
      preferredIndex: 0,
      explanation:
        "Support can be accepted in one area and declined in another. The ride does not authorize inspection or organization.",
      relatedSection: "CG-M3-S04",
      reviewLabel: "Review specific help",
    },
    {
      id: "CG-M3-Q03",
      question:
        "Two partners agreed to cook together on Sundays. One partner now wants some Sundays alone. What preserves both the routine and the new preference?",
      choices: [
        "Ask which Sundays, if any, they still want to share",
        "Keep every Sunday because routines improve consistency",
        "End shared cooking permanently",
        "Track whether solo Sundays go well.",
      ],
      preferredIndex: 0,
      explanation:
        "This gray area does not require keeping or ending the whole arrangement. The agreement can become more specific and remain revisable.",
      relatedSection: "CG-M3-S05",
      reviewLabel: "Review support changing over time",
    },
  ],
  reflection: {
    id: "CG-M3-R01",
    prompt:
      "Which ordinary task could you offer in one specific sentence without changing someone else's food, movement, medication, or privacy?",
    privacy:
      "This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.",
    skip: "Skip for Now",
    clear: "Clear reflection",
    clearConfirmation: "Clear this session-only reflection?",
  },
  takeaway: {
    heading: "Make help smaller and more useful",
    centralIdea: "Practical support works best when it answers a real request.",
    practicalAction: "Offer one task with a clear time or limit.",
    boundary: "Do not turn meals, movement, supplies, or reminders into inspection.",
  },
  completion: {
    completed: "Module completed",
    practiced:
      "You planned around shared life, matched offers to requests, built a revisable support menu, and noticed when routine becomes monitoring.",
    keyIdea: "Useful help follows the request and preserves normal life.",
    review: "Review the key idea",
    next: "Next: When Something Feels Wrong",
    continue: "Continue to Module 4",
    return: "Return to Support Someone You Care About",
  },
  source: caregiverModule3Source,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);
