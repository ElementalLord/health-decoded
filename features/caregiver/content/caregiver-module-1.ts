export const caregiverModule1Source = Object.freeze({
  document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
  heading: "MODULE 1: WHAT THEY MAY BE FEELING",
  claims: ["CG-CLAIM-001", "CG-CLAIM-002"] as const,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);

export const caregiverModule1 = Object.freeze({
  id: "CG-M1",
  slug: "what-they-may-be-feeling",
  metadata: {
    purpose: "Help supporters interpret emotional reactions with curiosity rather than assumption.",
    audienceProblem:
      "A supporter sees silence, anger, withdrawal, denial, or frustration and feels pressure to decide what it means or fix it.",
    emotionalObjective: "Move from confusion to curiosity to patient attention.",
    estimatedTime: "8 to 10 minutes",
    medicalRiskLevel:
      "Low to moderate. Emotional content must not become diagnosis; medical symptoms are outside this module.",
    reviewStatus:
      "Editorial, cultural, emotional-safety, accessibility, and clinical-boundary review required.",
  },
  passiveReading: {
    title: "Curiosity does not require certainty",
    paragraphs: [
      "When a person gives less information than you hoped for, it can be tempting to search for a hidden meaning. A caring response can be simpler: acknowledge what was said, leave room for what was not said, and avoid making the person prove that they are okay.",
      "A pause is not a failure of the relationship. It can be a way of protecting energy, privacy, or an ordinary part of the day. Respecting a pause makes a later conversation easier because the person does not have to defend why they needed one.",
      "You can remain available without becoming watchful. One brief, agreed check-in is different from repeated attempts to get an answer. The difference is whether the person still has a real choice about when, how, and whether to respond.",
    ],
    subsections: [
      {
        title: "Feelings can have more than one source",
        paragraphs: [
          "A reaction to diabetes may be mixed with work stress, family conflict, money worries, fatigue, grief, or simply a wish to have a day that is not centered on health. Treating every short reply as a health signal can make ordinary life feel smaller.",
          "You do not have to choose between caring and being careful. It is possible to say, “I noticed a change,” without adding, “and I know why it happened.” That distinction gives the person space to correct you, say more, or move on.",
        ],
      },
      {
        title: "A response can be brief and still be respectful",
        paragraphs: [
          "Supportive language does not need to be perfect or therapeutic. A simple acknowledgment, such as “I hear you,” “Thanks for telling me,” or “We can leave it there,” can communicate that the person does not need to manage your worry before taking care of themselves.",
          "When you are unsure what to say, slowing down is often enough. Notice the fact, ask one permission-based question if it fits, and accept the answer. This keeps the relationship open without turning uncertainty into pressure.",
        ],
      },
    ],
  },
  sections: {
    opening: {
      id: "CG-M1-S01",
      eyebrow: "MODULE 1 OF 5",
      title: "What They May Be Feeling",
      opening:
        "A short answer can sound like anger. Silence can look like denial. A changed subject can feel like rejection. What you observe is real, but the meaning may still be unclear.",
      centralIdea:
        "Notice what happened. Stay uncertain about what it means. Ask whether the person wants to talk, wants another kind of help, or wants to leave it for now.",
    },
    scenario: {
      id: "CG-M1-S02",
      title: "The unanswered call",
      paragraphs: [
        "Jules lives in another city from his older sister, Mira. Since Mira mentioned a new diabetes medication at dinner last week, Jules has texted every evening.",
        "On Tuesday he writes, “How are you feeling? Did you figure everything out?”",
        "Mira replies three hours later: “Busy. Can we not do diabetes tonight?”",
        "Jules stares at the message. He thinks she may be scared and avoiding it. He also wonders whether she is angry with him. He starts typing, “I’m only asking because I care.”",
        "He deletes it, then calls. Mira does not answer.",
      ],
      observable:
        "Mira replied after three hours, said she was busy, asked not to discuss diabetes that night, and did not answer the call.",
      unknown:
        "Why she replied late, what she feels, whether she wants support later, and whether the call felt caring, pressuring, or unrelated to her silence.",
    },
    explanations: {
      id: "CG-M1-S03",
      title: "One event, several explanations",
      paragraphs: [
        "The same response could come from fear, irritation, information overload, embarrassment, fatigue, grief, wanting a normal evening, conflict unrelated to diabetes, or something else. Listing possibilities is useful only if it protects uncertainty. It is not a way to diagnose the person from a distance.",
        "Repeated questions can add pressure even when each question sounds gentle. If the person has already said not now, more questions may make the conversation harder to reopen.",
      ],
    },
    readiness: {
      id: "CG-M1-S04",
      title: "Readiness changes",
      paragraphs: [
        "Someone may want to talk in the morning and not after work. They may want practical help without discussing feelings. They may want to explain something once but not provide ongoing updates.",
        "Readiness is not a test of trust. A pause can be a preference for this moment.",
      ],
      language: [
        {
          label: "Language to open",
          copy: "“Is now a good time to ask about how things have been going?”",
        },
        {
          label: "Language to clarify",
          copy: "“Would listening, practical help, or some space be more useful?”",
        },
        {
          label: "Language to pause",
          copy: "“Okay. I’ll leave it here. If you want, I can check another day.”",
        },
        {
          label: "Language for uncertainty",
          copy: "“I noticed you got quiet, but I do not want to decide what that means.”",
        },
      ],
    },
    listening: {
      id: "CG-M1-S05",
      title: "Listening is an action",
      paragraphs: [
        "Listening does not require silence forever. It means the first response follows the kind of conversation the person agreed to have.",
        "If they want listening, stay with what they said before introducing advice. If they want practical help, agree on one task. If they want space, accept the pause without making them reassure you.",
      ],
      listeningResponse: "“That sounds like a lot to take in. Do you want to keep talking?”",
      fixingResponse: "“Here is what you need to do.”",
      closing:
        "The second line may be well intended, but it changes the speaker, subject, and goal. Advice belongs only when it is wanted and within your role.",
    },
    returning: {
      id: "CG-M1-S06",
      title: "Returning later",
      opening: "A paused conversation does not need a dramatic reopening.",
      tryLine:
        "Try: “You asked not to talk about diabetes Tuesday. Would you rather leave it alone, or is there a better time to check in?”",
      noLine:
        "If the answer is no, accept it: “Okay. I will not keep asking. If you want something specific later, tell me.”",
    },
    misunderstanding: {
      id: "CG-M1-S07",
      title: "Common misunderstanding correction",
      misunderstanding: "“If I do not keep asking, they will think I do not care.”",
      correction:
        "Care can be visible without repeated questioning. A specific offer, a normal conversation, or respecting a pause may communicate steadiness more clearly than another request for an update.",
    },
  },
  interactions: {
    observation: {
      id: "CG-M1-I01",
      title: "What happened, and what are you adding?",
      prompt:
        "Place each statement under Observed or Possible interpretation. Then write one other explanation that remains possible.",
      groups: ["Observed", "Possible interpretation"] as const,
      statements: [
        { id: "reply", copy: "Mira replied after three hours", preferredGroup: "Observed" },
        {
          id: "afraid",
          copy: "Mira is afraid of the medication",
          preferredGroup: "Possible interpretation",
        },
        {
          id: "pause",
          copy: "She asked not to discuss diabetes that night",
          preferredGroup: "Observed",
        },
        { id: "angry", copy: "She is angry with Jules", preferredGroup: "Possible interpretation" },
        { id: "call", copy: "She did not answer the call", preferredGroup: "Observed" },
        { id: "trust", copy: "She does not trust him", preferredGroup: "Possible interpretation" },
      ],
      textLabel: "Another possible explanation, without deciding it is true.",
      submit: "Check the distinction",
      revise: "Revise",
      clear: "Clear",
      feedback: {
        preferred:
          "You kept the visible events separate from the meaning attached to them. The added possibility matters because it leaves room for asking instead of assuming.",
        interpretationAsObserved:
          "One or more statements describe a possible reason, not something Jules can verify from the message. Move feelings, motives, and relationship conclusions to Possible interpretation.",
        eventAsInterpretation:
          "One or more statements can be verified from the exchange itself. Keeping those facts clear makes uncertainty easier to hold.",
        blank:
          "The categories are checked. Add another possible explanation if you want more practice. This field is optional.",
      },
      learningPoint:
        "Uncertainty is not inattention. It is the space that keeps observation from becoming a label.",
    },
    timing: {
      id: "CG-M1-I02",
      title: "Check the timing",
      prompt:
        "For each moment, choose the response that best protects Mira's ability to decide whether to talk.",
      moments: [
        {
          id: "evening",
          label: "That evening",
          choices: [
            {
              id: "A",
              copy: "Call again",
              feedback:
                "Concern may be real, but another call or a why-question presses after a clear not tonight.",
            },
            {
              id: "B",
              copy: "Reply, ‘Okay. I’ll leave it here tonight’",
              feedback: "This accepts the stated limit without demanding an explanation.",
            },
            {
              id: "C",
              copy: "Ask why she is avoiding it.",
              feedback:
                "Concern may be real, but another call or a why-question presses after a clear not tonight.",
            },
          ],
          preferred: "B",
        },
        {
          id: "workday",
          label: "Two days later during her workday",
          choices: [
            {
              id: "A",
              copy: "Send three questions at once",
              feedback: "Several questions make refusal harder and repeat the pressure.",
            },
            {
              id: "B",
              copy: "Ask, ‘Is there a better time to check in, or would you rather leave it?’",
              feedback: "This asks about both timing and whether the topic should be reopened.",
            },
            {
              id: "C",
              copy: "Contact another relative for an update.",
              feedback:
                "Seeking private updates from someone else bypasses Mira rather than checking what she wants.",
            },
          ],
          preferred: "B",
        },
        {
          id: "weekend",
          label: "At their normal weekend call",
          choices: [
            {
              id: "A",
              copy: "Talk normally, then ask if she wants to revisit it",
              feedback:
                "A normal conversation preserves the relationship beyond diabetes, and the later question leaves the choice with Mira.",
            },
            {
              id: "B",
              copy: "Begin with medication questions",
              feedback: "Starting with health questions treats access as expected.",
            },
            {
              id: "C",
              copy: "Avoid her because the topic feels awkward.",
              feedback:
                "Space can be respectful when requested. Silent withdrawal is different because Mira is left to guess what changed.",
            },
          ],
          preferred: "A",
        },
      ],
      submit: "Review the timing",
      learningPoint:
        "Respecting not now includes both stopping and asking carefully before returning.",
    },
    response: {
      id: "CG-M1-I03",
      title: "Listen, help, or leave space",
      prompt:
        "A friend says, “I spent my whole lunch break on insurance calls, and I do not want advice right now.” Build the next response.",
      openings: [
        { id: "listen", copy: "That sounds exhausting" },
        { id: "advice", copy: "You should call again tomorrow" },
        { id: "minimize", copy: "At least it is handled." },
      ],
      followups: [
        { id: "choice", copy: "Do you want to tell me what happened, or change the subject?" },
        { id: "fix", copy: "I can fix the insurance problem" },
        { id: "why", copy: "Why did it take so long?" },
      ],
      preferred: { opening: "listen", followup: "choice" },
      submit: "Hear the response",
      feedback: {
        preferred:
          "This stays with what the friend said and offers two directions without sneaking advice back in.",
        advice:
          "The friend already declined advice. A solution offered immediately changes the kind of conversation.",
        minimize: "This closes the experience before the friend has decided whether to say more.",
        fix: "The offer assumes both permission and that the problem can be taken over.",
        why: "The question may sound like a request for justification. A choice about continuing is easier to decline.",
      },
      learningPoint: "Listening can include a small choice about what happens next.",
    },
  },
  scripts: [
    {
      label: "Ask about timing",
      copy: "“Is now a good time to ask about diabetes, or would you rather not?”",
    },
    {
      label: "Offer three modes",
      copy: "“Would listening, one practical task, or some space be more useful?”",
    },
    {
      label: "Acknowledge uncertainty",
      copy: "“I noticed the conversation stopped. I do not know what that means for you.”",
    },
    { label: "Accept a pause", copy: "“Okay. I will not keep asking tonight.”" },
    {
      label: "Offer a return",
      copy: "“Would you like me to check another day, or leave it with you?”",
    },
    {
      label: "Remote support",
      copy: "“I am thinking about you. No update is needed. If you want help with one call or errand, ask me.”",
    },
    {
      label: "Listen before fixing",
      copy: "“Do you want ideas, or do you want me to hear how frustrating this was?”",
    },
  ],
  questions: [
    {
      id: "CG-M1-Q01",
      question:
        "At dinner, Rowan becomes quiet after a relative comments on dessert. What is the most careful first interpretation?",
      choices: [
        "Rowan is ashamed",
        "Rowan is refusing to face diabetes",
        "Something changed, but the reason is not clear",
        "Rowan wants someone to defend the food choice.",
      ],
      preferredIndex: 2,
      explanation:
        "Quiet is observable. Shame, denial, and wanting intervention are possible interpretations. Begin with uncertainty and ask privately only if the timing is appropriate.",
      relatedSection: "CG-M1-S03",
      reviewLabel: "Review one event, several explanations",
    },
    {
      id: "CG-M1-Q02",
      question:
        "A coworker says, “I cannot talk about appointments right now, but could you cover the front desk Thursday?” What response fits the request?",
      choices: [
        "Sure. I can cover Thursday. We can leave the appointment topic alone",
        "Only if you promise to tell me later",
        "Are you sure the appointment is okay?",
        "I will ask the manager what happened.",
      ],
      preferredIndex: 0,
      explanation:
        "The coworker made one practical request and set one conversation limit. Accepting both avoids turning help into a trade for private information.",
      relatedSection: "CG-M1-S04",
      reviewLabel: "Review readiness and specific help",
    },
    {
      id: "CG-M1-Q03",
      question:
        "A friend who previously wanted weekly check-ins replies, “Can we skip this week?” What is the best next step?",
      choices: [
        "Skip it and ask later whether the weekly arrangement still works",
        "Continue because the weekly plan was already agreed",
        "Stop all contact until the friend reaches out",
        "Ask another friend to check instead.",
      ],
      preferredIndex: 0,
      explanation:
        "This is a gray area because a recurring agreement exists. A current pause still matters, and the ongoing arrangement can be revisited without treating one skipped week as permanent withdrawal.",
      relatedSection: "CG-M1-S06",
      reviewLabel: "Review returning later",
    },
  ],
  reflection: {
    id: "CG-M1-R01",
    prompt:
      "Think of a recent moment when you filled in the meaning of someone else's silence or short answer. What observable fact could you keep separate from your interpretation next time?",
    privacy:
      "This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.",
    skip: "Skip for Now",
    clear: "Clear reflection",
    clearConfirmation: "Clear this session-only reflection?",
  },
  takeaway: {
    heading: "Before you decide what it means",
    centralIdea: "One reaction can have several explanations.",
    practicalAction:
      "Name what you observed, then ask whether the person wants listening, practical help, or space.",
    boundary: "If they say not now, stop. Do not turn concern into repeated questioning.",
  },
  completion: {
    completed: "Module completed",
    practiced:
      "You separated observation from interpretation, checked timing, and matched a response to the kind of support requested.",
    understood: "Key idea appears understood: stay uncertain, then ask.",
    revisit:
      "One idea may be worth revisiting: a previous agreement or caring intention does not remove the need to notice current readiness.",
    review: "Review the key idea",
    next: "Next: Support Without Taking Over",
    continue: "Continue to Module 2",
    return: "Return to Support Someone You Care About",
  },
  source: caregiverModule1Source,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);
