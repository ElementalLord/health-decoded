export const caregiverModule5Source = Object.freeze({
  document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
  heading: "MODULE 5: THE CAREGIVER MATTERS TOO",
  claims: ["CG-CLAIM-010", "CG-CLAIM-011", "CG-CLAIM-012"] as const,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);

export const caregiverModule5 = Object.freeze({
  id: "CG-M5",
  slug: "the-caregiver-matters-too",
  metadata: {
    purpose:
      "Help supporters recognize strain, limits, responsibility beliefs, and sustainable boundaries without shifting control away from the person living with diabetes.",
    estimatedTime: "10 to 13 minutes",
    medicalRiskLevel:
      "Low to moderate. Caregiver strain is discussed descriptively, not diagnostically.",
    reviewStatus:
      "Editorial, emotional-safety, cultural, accessibility, privacy, and clinical-boundary review required.",
  },
  sections: {
    opening: {
      id: "CG-M5-S01",
      eyebrow: "MODULE 5 OF 5",
      title: "The Caregiver Matters Too",
      opening:
        "A support arrangement can become difficult to sustain before anyone names it. Constant availability, repeated checking, interrupted sleep, practical load, guilt, resentment, and isolation are signals worth noticing. They are not a diagnosis and do not make either person the problem.",
      centralIdea:
        "You can care deeply without becoming responsible for another adult's decisions. A sustainable arrangement needs clear limits, shared responsibility, and backup.",
    },
    scenario: {
      id: "CG-M5-S02",
      title: "The 6:10 call",
      paragraphs: [
        "Elena lives twenty minutes from her father, Tomas. For three months, she has called before work, driven to most appointments, handled insurance mail, and kept her phone on through the night.",
        "At 6:10 one morning, Tomas calls to ask whether she can bring a folder he left at home. Elena has an important meeting. She says, “I will figure it out,” then starts crying after they hang up.",
        "That evening she tells Tomas, “I cannot keep doing all of this.”",
        "Tomas replies, “I did not ask you to stay awake every night.”",
        "Elena says, “If I do not pay attention, who will?”",
        "Neither has a complete picture. Tomas has accepted some help, Elena has assumed other responsibilities, and their current arrangement depends on her being reachable almost all the time.",
      ],
    },
    responsibility: {
      id: "CG-M5-S03",
      title: "Sort responsibility before solving the schedule",
      groups: [
        [
          "Tomas owns",
          "His medical decisions, what information he shares, and whether he accepts support.",
        ],
        ["Elena owns", "What time, money, travel, and emotional availability she can offer."],
        [
          "They may agree together",
          "Specific rides, paperwork tasks, check-ins, backup contacts, and how to change the arrangement.",
        ],
        [
          "Qualified professionals own",
          "Clinical assessment, medication decisions, treatment instructions, and emergency guidance.",
        ],
      ],
      close: "Responsibility can be shared without being blurred.",
    },
    strain: {
      id: "CG-M5-S04",
      title: "Strain is information",
      paragraphs: [
        "Difficulty sleeping, dread before the phone rings, resentment, missed work, isolation, or feeling unable to step away may show that the arrangement is difficult to sustain. These experiences do not diagnose burnout, anxiety, depression, or trauma.",
        "The question is practical: What needs to stop, shrink, move, or gain backup?",
      ],
    },
    boundary: {
      id: "CG-M5-S05",
      title: "A boundary is about your action",
      examples: [
        [
          "Boundary",
          "“I can answer calls until nine. After that, use the agreed backup or emergency plan.”",
        ],
        ["Punishment", "“If you call after nine, I will stop helping with appointments.”"],
        ["Boundary", "“I can handle one insurance call a week.”"],
        ["Control", "“I will handle your insurance only if you show me your readings.”"],
      ],
      close:
        "A limit can disappoint someone and still be legitimate. It should not be used to force a medical decision or disclosure.",
    },
    backup: {
      id: "CG-M5-S06",
      title: "Backup changes the structure",
      paragraphs: [
        "Backup may include another relative or friend with permission, a transportation option, delivery, community support, a diabetes care and education specialist, a healthcare team contact, respite or caregiver services when relevant, or a revised task that no longer depends on one person.",
        "Do not share private health details simply to recruit help. Ask what can be shared and what the backup person actually needs to know.",
      ],
    },
    relationship: {
      id: "CG-M5-S07",
      title: "Keep the relationship larger than diabetes",
      paragraphs: [
        "Elena and Tomas can still talk about work, music, neighbors, or dinner without every call becoming a check-in. Preserving ordinary parts of the relationship is not avoidance. It can reduce the sense that one person is a patient and the other is a manager.",
      ],
      misunderstanding:
        "“If I feel resentful, I should hide it so I do not make them feel guilty.”",
      correction:
        "Resentment does not need to become blame or punishment. Name the arrangement that is difficult to sustain and the change you can make.",
    },
  },
  interactions: {
    responsibility: {
      id: "CG-M5-I01",
      title: "Who owns what?",
      prompt:
        "Place each item with the person or group that owns it. Shared does not mean permanent.",
      zones: ["Tomas", "Elena", "Agreed together", "Qualified professional"] as const,
      items: [
        { id: "medical", copy: "medical decisions", preferred: 0 },
        { id: "share", copy: "what health information to share", preferred: 0 },
        { id: "work", copy: "Elena's work availability", preferred: 1 },
        { id: "phone", copy: "Elena's overnight phone limit", preferred: 1 },
        { id: "rides", copy: "planned rides", preferred: 2 },
        { id: "backup", copy: "backup contact agreement", preferred: 2 },
        { id: "medication", copy: "medication changes", preferred: 3 },
        { id: "clinical", copy: "clinical assessment", preferred: 3 },
      ],
      submit: "Review responsibility",
      feedback: {
        preferred:
          "The map separates autonomy from availability and keeps clinical decisions with qualified care.",
        medical: "Support does not transfer medical authority.",
        availability: "The supporter decides what they can sustainably offer.",
        shared: "An agreement can be shared and still remain revisable.",
      },
      learningPoint: "Clear ownership reduces both takeover and impossible responsibility.",
    },
    sustainability: {
      id: "CG-M5-I02",
      title: "Can this arrangement last?",
      prompt:
        "Compare Plan A and Plan B. Select the differences that reduce dependence on one person.",
      planA: "Elena handles every ride, all mail, nightly calls, no backup.",
      planB:
        "Two planned rides, one weekly mail task, calls before nine, approved backup for another task, review in two weeks.",
      choices: [
        { id: "tasks", copy: "fewer tasks", preferred: true },
        { id: "limits", copy: "clearer time limits", preferred: true },
        { id: "backup", copy: "backup", preferred: true },
        { id: "permission", copy: "permission", preferred: false },
        { id: "control", copy: "medical control", preferred: false },
        { id: "review", copy: "planned review", preferred: true },
      ],
      feedback: {
        preferred:
          "Plan B does not prove that the arrangement will work. It makes responsibilities visible, limits dependence on one person, and creates a point to revise.",
        control: "Sustainability does not require the supporter to control medical decisions.",
      },
      learningPoint:
        "A sustainable plan has limits and backup, not simply a more efficient primary supporter.",
    },
    boundaries: {
      id: "CG-M5-I03",
      title: "Say the limit without punishment",
      prompt: "Choose the revision that names capacity without controlling Tomas.",
      statements: [
        {
          id: "everything",
          original: "I cannot keep doing everything",
          choices: [
            "I can handle one insurance call a week. We need another option for the rest.",
            "I cannot keep doing everything",
          ],
          preferred: 0,
          nonPreferredFeedback: "vague",
        },
        {
          id: "listen",
          original: "If you will not listen, I am done helping",
          choices: [
            "I will not make medical decisions. I can still offer the two rides we agreed.",
            "If you will not listen, I am done helping",
          ],
          preferred: 0,
          nonPreferredFeedback: "guilt",
        },
        {
          id: "whenever",
          original: "Call whenever",
          choices: [
            "I can answer before nine. After that, use the agreed backup or emergency plan.",
            "Call whenever",
          ],
          preferred: 0,
          nonPreferredFeedback: "vague",
        },
      ],
      feedback: {
        preferred:
          "This names what the supporter can do and keeps the other person's medical choices separate.",
        guilt: "This makes help conditional on obedience.",
        vague: "The feeling is clear, but the other person still cannot tell what will change.",
      },
      learningPoint: "A boundary becomes usable when it names a specific supporter action.",
    },
    network: {
      id: "CG-M5-I04",
      title: "Widen the support network",
      prompt:
        "Build backup for rides, paperwork, and an after-hours concern. Share only what each role needs.",
      backups: [
        "approved relative",
        "transportation service",
        "clinic office",
        "pharmacist",
        "regional urgent resource",
        "change the task",
      ] as const,
      information: [
        "pickup time",
        "document deadline",
        "full diagnosis history",
        "all readings",
        "agreed contact instruction",
      ] as const,
      tasks: [
        { id: "rides", copy: "rides", preferredBackups: [0, 1, 5], preferredInfo: 0 },
        { id: "paperwork", copy: "paperwork", preferredBackups: [0, 2, 5], preferredInfo: 1 },
        {
          id: "after",
          copy: "an after-hours concern",
          preferredBackups: [2, 3, 4],
          preferredInfo: 4,
        },
      ],
      submit: "Review the network",
      feedback: {
        preferred:
          "The network shares task-level information and preserves private health details.",
        private: "Recruiting backup does not authorize broad disclosure.",
        onePerson:
          "This network still depends on one person. Reassign or change at least one task.",
      },
      learningPoint:
        "Backup can reduce load without creating a larger audience for private health information.",
    },
    load: {
      id: "CG-M5-I05",
      title: "What is taking up room?",
      prompt:
        "In Elena's week, what appears difficult to sustain? Select the patterns, then choose one arrangement to discuss.",
      patterns: [
        { id: "sleep", copy: "interrupted sleep", preferred: true },
        { id: "work", copy: "missed work", preferred: true },
        { id: "backup", copy: "no backup", preferred: true },
        { id: "resentment", copy: "resentment", preferred: true },
        { id: "decisions", copy: "all health decisions", preferred: false },
        { id: "ride", copy: "one planned ride", preferred: false },
      ],
      discussions: [
        { id: "overnight", copy: "overnight availability", preferred: true },
        { id: "rides", copy: "ride schedule", preferred: true },
        { id: "medical", copy: "medical decisions", preferred: false },
        { id: "burnout", copy: "Elena has burnout", preferred: false },
      ],
      submit: "Review the load",
      feedback: {
        preferred:
          "These are descriptive patterns, not a diagnosis. Choosing one arrangement creates a practical conversation.",
        burnout: "This module does not diagnose burnout.",
        medical:
          "Those decisions belong to Tomas and qualified care, not to Elena's workload plan.",
      },
      learningPoint: "Notice the arrangement before assigning a clinical label.",
    },
  },
  scripts: [
    [
      "Ask for backup",
      "“Could you take one planned ride next Thursday? I will ask Tomas what details he is comfortable sharing.”",
    ],
    ["Name availability", "“I can talk until nine tonight. I will be unavailable after that.”"],
    [
      "Change a recurring arrangement",
      "“The daily call is becoming hard to sustain. Can we choose fewer planned times?”",
    ],
    ["State capacity", "“I can handle this form, but I cannot take on all of the mail.”"],
    [
      "Preserve the relationship",
      "“Can we have dinner Friday and leave diabetes tasks for another time?”",
    ],
    [
      "Discuss resentment",
      "“I am getting frustrated with the current schedule. I want to change the schedule before that frustration turns into blame.”",
    ],
    ["Separate decisions", "“I care about what happens. The medical decision is still yours.”"],
  ],
  questions: [
    {
      id: "CG-M5-Q01",
      question:
        "A friend has become the only person providing rides and is missing work. What is the most useful first change?",
      choices: [
        "Add backup and define which rides the friend can provide",
        "Take over appointment scheduling",
        "Ask for more health information",
        "Stop every ride without discussion.",
      ],
      preferredIndex: 0,
      explanation:
        "Backup and scope address the practical strain without expanding control or forcing an abrupt end.",
      relatedSection: "CG-M5-S06",
      reviewLabel: "Review backup support",
    },
    {
      id: "CG-M5-Q02",
      question:
        "A supporter says, “I will help only if you follow my food rules.” What makes this different from a boundary?",
      choices: [
        "It uses help to force another adult's choice",
        "It mentions food",
        "It is too short",
        "Boundaries cannot disappoint anyone.",
      ],
      preferredIndex: 0,
      explanation:
        "A boundary names what the supporter will or will not do. This condition uses support as leverage over someone else's decision.",
      relatedSection: "CG-M5-S05",
      reviewLabel: "Review boundary versus punishment",
    },
    {
      id: "CG-M5-Q03",
      question:
        "Two siblings share support for a parent. One can no longer handle weekly paperwork but can still provide monthly rides. What is the best interpretation?",
      choices: [
        "The sibling can revise one role without ending all support",
        "The original agreement must continue",
        "The sibling no longer cares",
        "The parent should give both siblings full account access.",
      ],
      preferredIndex: 0,
      explanation:
        "This gray area calls for revising the arrangement by task. Capacity can change without turning support into all or nothing.",
      relatedSection: "CG-M5-S03",
      reviewLabel: "Review shared and revisable responsibility",
    },
  ],
  reflection: {
    id: "CG-M5-R01",
    prompt:
      "Name one support task you can sustain, one limit you need to state, and one kind of backup that could reduce dependence on you. Do not include another person's health details.",
    privacy:
      "This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.",
    fields: ["One task I can sustain", "One limit I need to state", "One kind of backup"],
    skip: "Skip for Now",
    clear: "Clear all three fields",
    clearConfirmation: "Clear all three session-only fields?",
  },
  takeaway: {
    heading: "Make the arrangement possible to keep",
    centralIdea: "Caring does not make one supporter responsible for another adult's decisions.",
    practicalAction: "Name one task, one limit, and one backup.",
    boundary:
      "Do not turn exhaustion or resentment into punishment, control, or forced disclosure.",
  },
  completion: {
    completed: "Module completed",
    practiced:
      "You separated responsibility, compared support arrangements, rehearsed limits, and widened backup.",
    keyIdea:
      "Sustainable support has scope, review, and backup while medical decisions remain with the person and qualified care.",
    review: "Review the responsibility map",
    next: "Choose my next step",
    reviewModule: "Review a module",
    return: "Return to Support Someone You Care About",
  },
  source: caregiverModule5Source,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);
