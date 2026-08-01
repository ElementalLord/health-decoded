export const caregiverModule2Source = Object.freeze({
  document: "docs/caregiver/01-CAREGIVER-CONTENT.md",
  heading: "MODULE 2: SUPPORT WITHOUT TAKING OVER",
  correction: "CG-TOOL-ISSUE-001",
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);

export const caregiverModule2 = Object.freeze({
  id: "CG-M2",
  slug: "support-without-taking-over",
  metadata: {
    purpose:
      "Teach the difference between support and control while acknowledging that overstepping often begins with worry, love, uncertainty, or responsibility.",
    audienceProblem:
      "A supporter may believe helpful intention authorizes reminders, information access, appointment involvement, or disclosure.",
    emotionalObjective:
      "Move from fear-driven action to recognition of impact, permission, repair, and reliable support.",
    estimatedTime: "14 to 18 minutes",
    medicalRiskLevel:
      "Moderate because readings, medications, appointments, and emergency fear appear only as relational contexts.",
    reviewStatus:
      "Prototype-quality content requiring editorial, clinical-boundary, privacy, accessibility, cultural, and emotional-safety review.",
  },
  sections: {
    opening: {
      id: "CG-M2-S01",
      eyebrow: "MODULE 2 OF 5",
      title: "Support Without Taking Over",
      opening:
        "Overstepping often starts with a reasonable fear: What if I miss something? What if they need help and do not ask? What if staying quiet looks careless?",
      centralIdea:
        "Good support begins with permission and stays specific, proportional, private, easy to decline, and open to change.",
    },
    scenario: {
      id: "CG-M2-S02",
      title: "The phone on the counter",
      paragraphs: [
        "Leah and Andre have been partners for six years. Andre was diagnosed with Type 2 diabetes several months ago. One Saturday, Leah is putting away groceries while Andre is making coffee.",
        "Leah takes cookies from a bag. “I thought we agreed not to keep these here.”",
        "Andre says, “We did not agree. You said you were not buying them.”",
        "Leah lowers her voice. “Fine. Did you take your medication?”",
        "Andre looks at her. “Please stop checking.”",
        "Later, while Andre showers, his phone lights up on the counter. Leah knows his passcode. She opens his health app because she wants to know whether the week has been okay. She sees a screen she does not understand and closes it.",
        "That evening, Leah tells her sister, “I think Andre is slipping. I do not know how to get through to him.”",
        "Andre hears from the next room. “Why are you talking about me?”",
        "Leah replies, “Because I am worried. I am trying to help.”",
        "Andre picks up his phone and leaves the kitchen. The conversation is not resolved.",
      ],
    },
    intentionImpact: {
      id: "CG-M2-S03",
      title: "Intention and impact can both be real",
      paragraphs: [
        "Leah may be trying to reduce risk, make the household easier, and manage her own fear. Those intentions do not create permission to set Andre's food rules, check medication, open private information, or share it with someone else.",
        "Possible impact includes feeling watched at home, exposed to family, or expected to report. Andre may also feel something different. The exact impact belongs to him to describe or not describe.",
        "Recognizing impact is not the same as declaring Leah uncaring. It identifies what needs to change.",
      ],
    },
    distinction: {
      id: "CG-M2-S04",
      title: "A useful distinction",
      definitions: [
        { term: "Invited support", example: "“Could you pick up my prescription?”" },
        { term: "Offered support", example: "“Would it help if I picked it up?”" },
        {
          term: "Negotiated support",
          example: "“Do you still want one reminder on weekday mornings?”",
        },
        { term: "Pressure", example: "“I am going to keep asking until you answer.”" },
        {
          term: "Monitoring",
          example:
            "Checking behavior or information as a routine. This requires a clear, specific, revisable agreement.",
        },
        {
          term: "Surveillance",
          example:
            "Secret, continuous, coercive, or unauthorized access. Concern does not make it support.",
        },
      ],
      closing:
        "One yes covers one agreed action. Permission to attend an appointment does not authorize speaking. Access to a phone does not authorize opening health information. A reminder requested last month can be changed today.",
    },
    permission: {
      id: "CG-M2-S05",
      title: "Permission should answer five questions",
      questions: [
        "What action are you offering?",
        "What information, if any, is involved?",
        "When does the agreement apply?",
        "How can either person pause or change it?",
        "Can no be given without guilt, argument, or repeated asking?",
      ],
      examples: [
        {
          label: "Specific offer",
          copy: "“Would you like one text reminder before Thursday's appointment?”",
        },
        { label: "Assumed offer", copy: "“I will remind you so you do not forget.”" },
        { label: "Accepting no", copy: "“Okay. I will not send one.”" },
      ],
    },
    appointments: {
      id: "CG-M2-S06",
      title: "Appointments and private information",
      paragraphs: [
        "Ask before attending an appointment. If invited, ask what role is wanted.",
        "“Would you like me there?”",
        "“If I come, would you like me to listen, take notes, ask a question you choose, or wait outside?”",
        "The person may change the role in the room. They speak for themselves unless a different role is clearly requested and appropriate.",
        "Before sharing with relatives, friends, clinicians, or digital services, ask what can be shared, with whom, and for what purpose.",
      ],
    },
    repair: {
      id: "CG-M2-S07",
      title: "Repair after an overstep",
      opening: "A repair does not erase the action or guarantee forgiveness.",
      steps: [
        { label: "Name it", copy: "“I opened your health app without asking.”" },
        {
          label: "Acknowledge impact without deciding it",
          copy: "“That may have made home feel less private.”",
        },
        { label: "Apologize without a defense", copy: "“I am sorry.”" },
        { label: "Change the behavior", copy: "“I will not open it again.”" },
        {
          label: "Clarify future permission",
          copy: "“If I am worried, I will ask what you want me to know.”",
        },
      ],
      closing:
        "Do not add, “but I only did it because I love you,” or ask the other person to say the apology is accepted.",
    },
    boundaries: {
      id: "CG-M2-S08",
      title: "Supporter boundaries",
      opening:
        "Respecting autonomy does not require agreeing to every request or being available at every hour.",
      usableBoundary:
        "“I can drive on Tuesdays, but I cannot leave work without notice. We need another option for last-minute rides.”",
      punitiveBoundary: "“If you will not follow my advice, do not ask me for anything.”",
      explanation:
        "The first line names the supporter's capacity. The second uses help as leverage over another adult's decisions.",
      misunderstanding: "“If I ask permission every time, I will sound distant.”",
      correction:
        "Recurring support can be agreed without repeating a formal question each time. The agreement still needs a clear scope and an easy way to change it.",
    },
  },
  interactions: {
    intentionImpact: {
      id: "CG-M2-I01",
      title: "What Leah meant, what Andre may have received",
      prompt:
        "For each action, choose Leah's likely intention, one possible impact on Andre, and the fact that still requires Andre's perspective.",
      actions: [
        { id: "cookie", label: "Cookie comment", preferredImpact: "pressure" },
        { id: "medication", label: "Medication question", preferredImpact: "pressure" },
        {
          id: "privacy",
          label: "App access and disclosure",
          preferredImpact: "loss of privacy",
        },
      ],
      intentions: ["reduce risk", "keep a routine", "seek reassurance"],
      impacts: ["support", "pressure", "loss of privacy", "feeling discussed rather than included"],
      unknown: "Andre's exact experience remains unknown.",
      submit: "Map the consequences",
      feedback: {
        preferred:
          "The intention can be understandable while the action still adds pressure or removes privacy. Both belong in the map.",
        support:
          "An action does not become support from intention alone. Check whether permission, privacy, and an easy no were present.",
        unknown:
          "The scenario supports possible impacts, not Andre's exact feelings. Keep his perspective open.",
      },
      learningPoint: "Intention explains an action; it does not settle its impact or authorize it.",
    },
    continuum: {
      id: "CG-M2-I02",
      title: "Support, pressure, monitoring, or surveillance?",
      prompt:
        "Place each behavior under the closest category. Use the permission, repetition, and privacy details, not the topic alone.",
      categories: ["Offered support", "Pressure", "Monitoring with an agreement", "Surveillance"],
      behaviors: [
        {
          id: "one-offer",
          copy: "One offer to order supplies, with no repeated asking",
          preferredCategory: "Offered support",
          feedback: "Specific, visible, and easy to decline.",
        },
        {
          id: "third-text",
          copy: "A third medication text after two unanswered messages",
          preferredCategory: "Pressure",
          feedback: "Repetition changes the impact even when each message sounds polite.",
        },
        {
          id: "shared-list",
          copy: "A weekly check of a shared list that both people agreed to and can stop",
          preferredCategory: "Monitoring with an agreement",
          feedback: "This is monitoring only within a clear, revisable agreement.",
        },
        {
          id: "secret-app",
          copy: "Opening a glucose app in secret",
          preferredCategory: "Surveillance",
          feedback: "Secret access removes permission and privacy.",
        },
        {
          id: "conditional-ride",
          copy: "Saying a ride is available only if the person shares a reading",
          preferredCategory: "Pressure",
          feedback:
            "The condition uses needed help to force disclosure. That is coercive pressure, not an ordinary offer.",
        },
        {
          id: "continued-alert",
          copy: "Checking an agreed alert, then continuing after the agreement was withdrawn.",
          preferredCategory: "Surveillance",
          feedback:
            "An old agreement does not survive withdrawal. Continued access is unauthorized.",
        },
      ],
      submit: "Review the line",
      revise: "Revise",
      learningPoint:
        "The same topic can be support or control depending on permission, privacy, repetition, and freedom to decline.",
    },
    permissionBuilder: {
      id: "CG-M2-I03",
      title: "Make the offer clear enough to decline",
      prompt:
        "Build an offer for a ride to an appointment. Keep the appointment private unless the person chooses to share more.",
      groups: [
        {
          id: "opening",
          label: "Opening",
          options: ["Would you like", "I am going to", "You need me to"],
        },
        {
          id: "action",
          label: "Action",
          options: [
            "a ride to Thursday's appointment",
            "me involved in your care",
            "me to handle the appointment",
          ],
        },
        {
          id: "decline",
          label: "Decline clause",
          options: ["It is fine to say no", "because I am worried", "so I know what is happening"],
        },
        {
          id: "followup",
          label: "Role follow-up",
          options: [
            "If you want a ride, we can separately decide whether I come inside",
            "A ride means I will join you",
            "You can tell me the details afterward",
          ],
        },
      ],
      submit: "Review the offer",
      read: "Read my offer",
      feedback: {
        preferred:
          "This offer names one action, keeps attendance separate, and makes no easier. A ride does not purchase appointment access.",
        opening: "This wording assumes the role",
        action: "This scope is too broad",
        decline: "This adds emotional pressure",
        followup: "This bundles transportation with private involvement.",
      },
      learningPoint:
        "Specific permission protects both people from reading different meanings into the same yes.",
    },
    refusal: {
      id: "CG-M2-I04",
      title: "When the answer is no",
      prompt: "Andre says, “I do not want medication reminders.” Choose Leah's next response.",
      firstChoices: [
        {
          id: "accept",
          label: "Okay. I will stop.",
          feedback:
            "This accepts the answer. Leah can manage her worry without making Andre defend the boundary.",
        },
        {
          id: "fear",
          label: "But what if you forget?",
          feedback:
            "The question reopens a decision Andre just made and asks him to manage Leah's fear.",
        },
        {
          id: "withdraw",
          label: "Fine, I guess you do not need me.",
          feedback: "Withdrawal and guilt make no costly. The offer was not freely declinable.",
        },
        {
          id: "bargain",
          label: "What about just one reminder?",
          feedback:
            "A smaller offer may be reasonable at another time, but bargaining immediately can turn no into a negotiation.",
        },
      ],
      continue: "Continue",
      secondPrompt: "Two weeks later, Leah wants to revisit household support. What can she ask?",
      secondChoices: [
        "Is there any support agreement you want to revisit, including keeping reminders off?",
        "Are you ready to admit reminders would help?",
        "Can I ask your clinician instead?",
      ],
      consequence:
        "Andre says, “Not today.” Leah replies, “Okay.” The branch ends without resolution.",
      learningPoint:
        "Permission is visible in what happens after no, not only in how the first offer is worded.",
    },
    repair: {
      id: "CG-M2-I05",
      title: "Repair the privacy overstep",
      prompt:
        "Put the repair in a usable order. Remove the line that asks Andre to excuse the action.",
      lines: [
        {
          id: "action",
          copy: "I opened your health app and talked to my sister without asking",
        },
        { id: "impact", copy: "That may have made home feel less private" },
        { id: "apology", copy: "I am sorry" },
        { id: "change", copy: "I will not open or share that information again" },
        {
          id: "future",
          copy: "If I am worried, I will ask what you want me to know",
        },
        { id: "defense", copy: "You know I only did it because I care." },
      ],
      preferredOrder: ["action", "impact", "apology", "change", "future"],
      remove: "Remove from repair",
      submit: "Review the repair",
      feedback: {
        preferred:
          "The repair names what happened before explaining what will change. It does not require Andre to reassure Leah.",
        defense:
          "The intention may be true, but placing it in the apology asks Andre to soften the impact.",
        changeFirst: "The promise is clearer after the action has been named directly.",
      },
      learningPoint:
        "Repair centers the action and future behavior, not the supporter's need to be understood.",
    },
  },
  scripts: [
    {
      label: "Ask before helping",
      copy: "“Would you like help with one part of this, or would you rather handle it yourself?”",
    },
    {
      label: "Offer one action",
      copy: "“I can pick up the prescription after work. Would that help?”",
    },
    { label: "Accept no", copy: "“Okay. I will leave it with you.”" },
    {
      label: "Clarify reminders",
      copy: "“Do you still want one reminder on weekday mornings? You can pause or change that.”",
    },
    {
      label: "Ask before an appointment",
      copy: "“Would you like me there? If yes, what role would be useful?”",
    },
    {
      label: "Apologize after access or disclosure",
      copy: "“I opened and shared information that was not mine to access. I am sorry. I will not do that again.”",
    },
    {
      label: "Name a supporter boundary",
      copy: "“I can help with planned rides, but I cannot be on call during work.”",
    },
    {
      label: "Revisit an agreement",
      copy: "“Does our current arrangement still work, or should something change?”",
    },
    {
      label: "Remote digital boundary",
      copy: "“I will not ask for app access. If there is information you want me to know, you can choose what to share.”",
    },
  ],
  questions: [
    {
      id: "CG-M2-Q01",
      question:
        "Sam asked his cousin Priya to text once after a monthly supply delivery. This month, Priya also opens the delivery account to inspect the order. Which statement fits best?",
      choices: [
        "The account check is covered by the text agreement",
        "The text is agreed support, but account access needs separate permission",
        "Family members can check when supplies are important",
        "Priya should stop all support.",
      ],
      preferredIndex: 1,
      explanation:
        "Consent for one update does not authorize access to related private information. The original support can continue within its scope.",
      relatedSection: "CG-M2-S04",
      reviewLabel: "Review one yes, one scope",
    },
    {
      id: "CG-M2-Q02",
      question:
        "A spouse offers to cook on busy clinic days. The offer is declined twice, but the spouse asks again each evening “just in case.” What changed?",
      choices: [
        "Nothing, because cooking is helpful",
        "The repeated offer may now add pressure",
        "The spouse is monitoring",
        "The person lost the right to ask later.",
      ],
      preferredIndex: 1,
      explanation:
        "Repetition can make refusal harder even when the action is ordinary and caring. A later offer may be appropriate after time or a request, but daily bargaining should stop.",
      relatedSection: "CG-M2-S04",
      reviewLabel: "Review how repetition changes an offer",
    },
    {
      id: "CG-M2-Q03",
      question:
        "Devon agrees that his friend may receive one device alert while he travels. Midway through the trip, Devon says, “Turn it off. I will use my own plan.” What should the friend do?",
      choices: [
        "Keep it on until the trip ends because that was the original agreement",
        "Turn it off and ask later whether any different support is wanted",
        "Keep it on but promise not to look",
        "Ask Devon's family to decide.",
      ],
      preferredIndex: 1,
      explanation:
        "This is a gray area because the agreement had a time period, but consent can be withdrawn before that period ends. Turning it off respects the current decision.",
      relatedSection: "CG-M2-S05",
      reviewLabel: "Review revisable permission",
    },
  ],
  reflection: {
    id: "CG-M2-R01",
    prompt:
      "Which kind of help are you most likely to assume because it feels obviously useful? Write one question that would make the action specific and easy to decline.",
    privacy:
      "This reflection is optional and stays in this session. It is not sent to the AI Tutor, added to your account, or shared with the person you support.",
    skip: "Skip for Now",
    clear: "Clear reflection",
  },
  takeaway: {
    heading: "Keep help inside the agreement",
    centralIdea: "Caring intention does not create access or authority.",
    practicalAction:
      "Offer one specific action, make no easy, and clarify when the agreement can change.",
    boundary:
      "Do not use worry, repeated reminders, private access, disclosure, or withdrawal of help to force involvement.",
  },
  completion: {
    completed: "Module completed",
    practiced:
      "You mapped intention and impact, distinguished support from control, built a permission-based offer, accepted no, and practiced repair.",
    understood:
      "Key idea appears understood: permission is specific, private, declinable, and revisable.",
    revisit:
      "One idea may be worth revisiting: an earlier yes does not authorize a new action or survive withdrawal.",
    review: "Review the key idea",
    continue: "Continue to Everyday Support That Actually Helps",
    return: "Return to Support Someone You Care About",
  },
  sourceClaims: ["CG-CLAIM-002", "CG-CLAIM-003", "CG-CLAIM-004"],
  source: caregiverModule2Source,
  renderingMode: "deterministic",
  runtimeGeneration: false,
} as const);

export type CaregiverModule2 = typeof caregiverModule2;
