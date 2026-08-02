export const caregiverModule4Source = Object.freeze({
  document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
  heading: "MODULE 4: WHEN SOMETHING FEELS WRONG",
  claims: ["CG-CLAIM-006", "CG-CLAIM-007", "CG-CLAIM-008", "CG-CLAIM-009"] as const,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);

export const caregiverModule4 = Object.freeze({
  id: "CG-M4",
  slug: "when-something-feels-wrong",
  metadata: {
    purpose:
      "Help a supporter respond to uncertainty without diagnosing, improvising treatment, or delaying professional help.",
    estimatedTime: "10 to 12 minutes, except urgent interruption leaves learning immediately.",
    medicalRiskLevel: "High",
    reviewStatus:
      "All learner-facing medical, symptom, medication, glucose, device, plan, urgent, and emergency content is not-reviewed and requires qualified clinical review before relevant external testing or public release.",
  },
  safety: {
    immediateLink: "Emergency help",
    productLimit:
      "Health Decoded provides general education. It cannot diagnose symptoms, interpret a personal glucose reading, decide whether a situation is safe, or create treatment instructions.",
    plan: "Use the person's clinician-created plan for individualized instructions and the support role they agreed to. General information in this module is not a replacement for that plan. If the plan is missing, unclear, or does not fit what is happening, contact the appropriate healthcare professional.",
    professional:
      "Contact the appropriate member of the person's healthcare team, pharmacist, diabetes care and education specialist, urgent care service, poison service, or emergency service based on the person's plan and the reviewed options available in your region. Health Decoded cannot choose the service for an individual situation.",
    doNotDelay:
      "Do not delay urgent or emergency help to check another reading, search this application, complete an interaction, sign in, or gather every detail.",
    medication:
      "Do not change, skip, add, repeat, or adjust another person's medication based on this module. Use their current clinician-created plan and contact an appropriate healthcare professional for medication questions.",
    reading:
      "Do not enter a glucose reading here. Health Decoded does not interpret personal readings or decide what action a number requires. Use the person's clinician-created plan, current device instructions, or appropriate professional help.",
  },
  sections: {
    opening: {
      id: "CG-M4-S01",
      eyebrow: "MODULE 4 OF 5",
      title: "When Something Feels Wrong",
      opening:
        "A supporter does not need to name the problem before taking it seriously. The useful question is not “Can I diagnose this?” It is “What is happening, what plan already exists, and what level of human help belongs here?”",
      layers: [
        "General education",
        "The person's clinician-created plan",
        "Professional or emergency help",
      ] as const,
    },
    immediate: { id: "CG-M4-S02", title: "Immediate route" },
    scenario: {
      id: "CG-M4-S03",
      title: "The unfinished errand",
      paragraphs: [
        "Omar is helping his neighbor, Celeste, carry groceries upstairs. Halfway up, Celeste stops and sits on a step. She looks unsteady and answers more slowly than usual.",
        "Omar asks, “Do you want me to call someone?”",
        "Celeste says, “Wait. I have a plan in my bag.”",
        "Omar feels an urge to ask for a glucose number and search what it means. He also thinks about offering food and telling Celeste to walk around. He does not know what is happening.",
        "The module pauses here. It does not diagnose Celeste or decide that the situation is safe.",
      ],
    },
    notice: {
      id: "CG-M4-S04",
      title: "Notice without diagnosing",
      paragraphs: [
        "Useful observations are concrete: what changed, when it began, whether the person can respond, and what they ask for. Do not turn those observations into a diagnosis.",
        "When urgent action is needed, emergency help comes first. Otherwise, use the person's plan and appropriate professional guidance.",
        "Symptoms and readings have context. One number does not give this application enough information to determine safety.",
      ],
    },
    plan: {
      id: "CG-M4-S05",
      title: "The person's plan is the individualized layer",
      paragraphs: [
        "A clinician-created plan may identify the person's known signs, what they want a supporter to do, where supplies or instructions are kept, and whom to contact. It is not the same as an online article, another person's plan, or a supporter-created checklist.",
        "Use current manufacturer instructions for a specific device or medicine. Do not improvise operation from memory or a generic example.",
      ],
    },
    handoff: {
      id: "CG-M4-S06",
      title: "A concise professional handoff",
      introduction:
        "When contacting an appropriate healthcare professional, organize only what is useful and available:",
      items: [
        "what you observed",
        "when it started or changed",
        "what the person can tell you",
        "actions already taken under their plan",
        "current medicines or device details only if the person chooses to share them and the professional asks",
        "how to call back",
      ],
      close: "Do not delay contact to make the summary complete.",
    },
    unsafe: {
      id: "CG-M4-S07",
      title: "Unsafe improvisation",
      paragraphs: [
        "This module does not direct a supporter to change medication, repeat a dose, provide food or drink as a guessed treatment, use exercise to correct a reading, operate an unfamiliar device, or keep checking until the situation feels clearer.",
        "Some severe diabetes-related events can require immediate treatment. That is why the person's reviewed plan, current product instructions, trained response, and professional or emergency help matter.",
      ],
    },
    misunderstanding: {
      id: "CG-M4-S08",
      title: "Common misunderstanding correction",
      misunderstanding: "“If I can get one more reading, I will know whether to call.”",
      correction:
        "Repeated checking can delay help and still cannot make this application a triage tool. Follow urgent direction, the person's plan, and appropriate professional guidance.",
    },
  },
  interactions: {
    context: {
      id: "CG-M4-I01",
      title: "Gather context without naming the cause",
      prompt: "Select the details Omar can report without diagnosing Celeste.",
      choices: [
        { id: "stopped", copy: "Celeste stopped halfway upstairs", preferred: true },
        { id: "sat", copy: "She sat down", preferred: true },
        { id: "slow", copy: "Her answers became slower than usual", preferred: true },
        { id: "diagnosis", copy: "She is definitely having low blood glucose", preferred: false },
        { id: "timing", copy: "The change began while carrying groceries", preferred: true },
        { id: "judgment", copy: "Her diabetes is out of control", preferred: false },
        { id: "plan", copy: "She said a plan is in her bag.", preferred: true },
      ],
      submit: "Build the summary",
      feedback: {
        preferred:
          "This summary reports a change, timing, and the person's own words. It leaves diagnosis to qualified care.",
        diagnosis:
          "This conclusion is not established by the observation. Report what changed instead.",
        judgment: "This label is neither useful context nor a diagnosis the supporter can make.",
      },
      learningPoint: "A concise description can support help without pretending to know the cause.",
    },
    sources: {
      id: "CG-M4-I02",
      title: "Which source belongs here?",
      prompt: "Choose the source that should guide each need.",
      layers: [
        "General education",
        "Their clinician-created plan",
        "Professional or emergency help",
      ] as const,
      needs: [
        { id: "why", copy: "Learn why individualized plans matter", preferred: 0, kind: "general" },
        { id: "role", copy: "Find their agreed supporter role", preferred: 1, kind: "plan" },
        {
          id: "known",
          copy: "Know what their clinician told them to do in a known situation",
          preferred: 1,
          kind: "plan",
        },
        {
          id: "unclear",
          copy: "Respond when the plan is unclear and the situation is concerning",
          preferred: 2,
          kind: "professional",
        },
        {
          id: "danger",
          copy: "Respond to an emergency",
          preferred: 2,
          kind: "emergency",
        },
      ],
      feedback: {
        general: "Education explains the framework, not an individual action.",
        plan: "The individualized layer belongs to the person and their care team.",
        professional: "Uncertainty outside the plan requires human guidance.",
        emergency: "An emergency interrupts education.",
      },
      learningPoint:
        "Safe support depends on using the right source, not gathering the most information.",
    },
    urgent: {
      id: "CG-M4-I03",
      title: "Urgent direction interrupts learning",
      trigger: "The person is unresponsive or having a seizure.",
      leave: "Leave this module",
    },
    handoff: {
      id: "CG-M4-I04",
      title: "Prepare the first 20 seconds",
      prompt:
        "Build the beginning of Omar's call. Use only supplied scenario facts. A complete record is not required.",
      items: [
        { id: "with", copy: "I am with Celeste", include: true },
        { id: "stopped", copy: "She stopped on the stairs and sat down", include: true },
        { id: "slow", copy: "Her responses are slower than usual", include: true },
        { id: "time", copy: "The change began a few minutes ago", include: true },
        { id: "cause", copy: "I think her medication caused it", include: false },
        { id: "search", copy: "I searched three websites.", include: false },
      ],
      submit: "Review the handoff",
      feedback: {
        preferred:
          "This gives identity context, observable change, and timing without delaying for a diagnosis.",
        cause: "Possible causes belong to qualified assessment.",
        search: "This does not help the first handoff and may distract from the change.",
      },
      learningPoint: "A short, factual opening is enough to begin getting help.",
    },
    improvisation: {
      id: "CG-M4-I05",
      title: "Do not improvise treatment",
      prompt: "Mark actions that should not be invented by a supporter from this module.",
      actions: [
        {
          id: "medicine",
          copy: "Repeat a medicine dose",
          unsafe: true,
          feedback: "Do not change or repeat another person's medication.",
        },
        {
          id: "food",
          copy: "Give food as a guessed treatment",
          unsafe: true,
          feedback: "This module does not recommend food or drink as a guessed treatment.",
        },
        {
          id: "exercise",
          copy: "Tell the person to exercise to change a reading",
          unsafe: true,
          feedback: "Do not use exercise as an improvised correction.",
        },
        {
          id: "plan",
          copy: "Follow the person's immediately available clinician-created plan",
          unsafe: false,
          feedback: "Use the individualized plan when available without delaying urgent contact.",
        },
        {
          id: "device",
          copy: "Operate an unfamiliar device from memory",
          unsafe: true,
          feedback: "Use current instructions and trained help.",
        },
        {
          id: "professional",
          copy: "Contact appropriate professional help when the plan is unclear.",
          unsafe: false,
          feedback: "Human guidance is the next layer when the plan is unclear.",
        },
      ],
      submit: "Review the actions",
      learningPoint: "Not improvising is an active safety choice.",
    },
  },
  scripts: [
    [
      "Ask before helping when it is not an emergency",
      "“Something seems different. Do you want me to get your plan or contact someone?”",
    ],
    [
      "Describe change",
      "“You stopped and your answers became slower than usual. I do not know what it means.”",
    ],
    ["Use the plan", "“Where is the plan you want me to use?”"],
    [
      "Contact professional help",
      "“The plan is unclear. I am contacting the appropriate healthcare professional.”",
    ],
    [
      "Decline to interpret",
      "“I cannot tell you what that reading means. Let us use your plan or contact someone qualified.”",
    ],
    [
      "Avoid medication change",
      "“I will not change or repeat medication. We need the plan or a healthcare professional.”",
    ],
    ["Urgent action", "“I am contacting emergency help now.”"],
  ],
  questions: [
    {
      id: "CG-M4-Q01",
      question:
        "A relative sends a screenshot of a glucose reading and asks, “Is this safe?” What can Health Decoded do?",
      choices: [
        "Interpret the number using a standard range",
        "Ask for more readings",
        "State that it cannot interpret the reading and direct them to their plan or appropriate professional help",
        "Recommend food or exercise.",
      ],
      preferredIndex: 2,
      explanation:
        "A personal reading needs individual context. This application does not interpret it or recommend treatment.",
      relatedSection: "CG-M4-S04",
      reviewLabel: "Review the reading boundary",
    },
    {
      id: "CG-M4-Q02",
      question:
        "A person feels unwell and their plan is nearby. What comes first when emergency help may be needed?",
      choices: [
        "Search the whole plan before calling",
        "Contact emergency help, using the plan only if it does not delay contact",
        "Finish the module",
        "Collect every medication name.",
      ],
      preferredIndex: 1,
      explanation:
        "An emergency interrupts education. The plan can support action when immediately available, but finding it must not delay emergency contact.",
      relatedSection: "CG-M4-S02",
      reviewLabel: "Review emergency response",
    },
    {
      id: "CG-M4-Q03",
      question:
        "A supporter notices a change, but the person's plan does not clearly cover it and there is no clear emergency cue. What is the safest next layer?",
      choices: [
        "Invent a response from general articles",
        "Contact an appropriate healthcare professional",
        "Keep checking until the answer is obvious",
        "Change medication as a precaution.",
      ],
      preferredIndex: 1,
      explanation:
        "This is uncertain because the situation is concerning without an obvious emergency cue. When the plan is unclear, qualified human guidance is the next layer. If emergency help becomes necessary, emergency direction takes over.",
      relatedSection: "CG-M4-S05",
      reviewLabel: "Review the three layers",
    },
  ],
  reflection: {
    id: "CG-M4-R01",
    prompt:
      "Without writing symptoms, readings, medicines, names, or emergency details, note one nonmedical preparation task you could discuss later, such as where an existing plan is kept or who has agreed to be contacted.",
    privacy:
      "This reflection is optional and stays in this session. Do not enter current symptoms, readings, medication details, names, or emergency information. It is not sent to the AI Tutor, added to your account, or shared.",
    skip: "Skip for Now",
    clear: "Clear reflection",
    clearConfirmation: "Clear this session-only reflection?",
  },
  takeaway: {
    heading: "Know the next layer",
    centralIdea: "Your role is to notice, use the person's plan, and reach appropriate human help.",
    practicalAction: "Report concrete changes and timing without naming the cause.",
    boundary:
      "Do not interpret readings, change medication, invent food or exercise treatment, operate unfamiliar devices, or delay urgent help.",
  },
  completion: {
    completed: "Module completed",
    practiced:
      "You separated observation from diagnosis, chose the correct safety layer, prepared a concise handoff, and identified unsafe improvisation.",
    keyIdea:
      "Health Decoded cannot determine safety. Use the person's plan and appropriate professional or emergency help.",
    review: "Review the three safety layers",
    continue: "Continue to Module 5",
    return: "Return to Support Someone You Care About",
  },
  source: caregiverModule4Source,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);
