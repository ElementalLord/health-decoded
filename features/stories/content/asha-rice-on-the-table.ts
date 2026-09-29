import type { InteractiveStory } from "@/features/stories/types/interactive-story";

export const ashaRiceOnTheTableStory: InteractiveStory = {
  id: "asha-rice-on-the-table",
  slug: "asha-rice-on-the-table",
  title: "Sunday Dinner",
  characterName: "Asha",
  disclosure:
    "Asha is a placeholder name. This is an original illustrative scenario based on common questions people report about food after a Type 2 diabetes diagnosis. It does not describe one specific individual or provide a personalized eating plan.",
  topic: "Food and family",
  themes: [
    "fear of food",
    "familiar meals",
    "family connection",
    "restrictive thinking",
    "carbohydrates",
    "portion awareness",
    "meal balance",
    "asking for helpful support",
    "returning to shared meals",
  ],
  learningObjective:
    "Show how familiar foods can be considered in the context of portions, preparation, the rest of the meal, personal needs, and family routines.",
  relatedLessonId: "lesson-4",
  estimatedMinutes: 7,
  readerPartCount: 8,
  medicalRiskLevel: "low",
  reviewStatus: "not-reviewed",
  version: "2.1",
  sourceThemeNote:
    "Original composite narrative informed by recurring themes commonly reported in diabetes education, including fear of carbohydrates, loss of familiar foods, family pressure, and the need for sustainable meal changes. No single person’s wording, identity, or chronology is reproduced.",
  visualTheme: "family-warmth",
  emotionalArc: "food worry to a shared meal",
  dominantInteractionType: "apply",
  primaryAccent: "table terracotta",
  closingTone: "ordinary and connected",
  imagePath: "/stories/asha-rice-on-the-table-cover.webp",
  imagePrompt:
    "Create a cinematic editorial illustration of a warm multigenerational family dinner at home in the early evening. A middle-aged woman sits at a dining table with several family members, but the composition focuses on the table and the emotional distance she feels rather than on clearly identifiable faces. In front of her is a very small, separate plate, while a range of familiar shared dishes remain in the center of the table, including a grain dish, beans, vegetables, bread, and a protein dish. Her family is engaged in the meal, while she looks quietly uncertain about what she is allowed to eat. Show natural body language, warm household lighting, and a realistic family setting without tying the meal to one culture. Use restrained warm cream, deep green, muted terracotta, soft gold, and natural wood colors. No text, medical devices, logos, exaggerated emotion, stereotypical decoration, or moral contrast between foods. Polished cinematic editorial illustration, not stock photography or a cartoon.",
  imageAlt:
    "An editorial illustration of a woman sitting with her family at a dinner table, looking uncertain as familiar shared dishes remain in the center of the table.",
  introduction:
    "After her diagnosis, Asha worries that familiar family meals no longer fit her care plan.",
  whyItMatters:
    "This story explores food fear, family meals, and how familiar carbohydrate-containing foods can remain part of a thoughtful eating pattern.",
  estimatedTimeLabel: "About 7 minutes",
  relatedLessonLabel: "Lesson 4",
  relatedLessonTitle: "Lesson 4, Food Is Not the Enemy",
  relatedLessonHref: "/lessons/4",
  introEyebrow: "Sunday dinner",
  introHeading: "Begin at the grocery store, where every familiar food suddenly felt uncertain.",
  introDescription:
    "Six scenes follow Asha from food fear and a separate plate toward an informed choice she can share with her family. The story advances only when you choose Continue, and its exploratory activities are optional.",
  scenes: [
    {
      id: "everything-looked-different",
      number: 1,
      title: "At the grocery store",
      layout: "narrative-left",
      tone: "tension",
      paragraphs: [
        "Asha picked up a familiar pantry staple, read the nutrition label, and put it back. She did the same with bread, yogurt, fruit, and beans.",
        "Nearly every familiar food seemed to contain a number she didn’t understand. After an hour, her cart held leafy greens, eggs, a protein option, and water.",
      ],
      interactionType: "grocery-fear",
      interaction: {
        id: "asha-label-context",
        purpose: "apply",
        engagement: "optional-exploration",
        prompt: "Which label clue would help you understand the food without judging it?",
        instructions:
          "Explore serving size, total carbohydrate, fiber and protein, usual amount, or meal context.",
        options: [
          { id: "serving-size", label: "Serving size" },
          { id: "total-carbohydrate", label: "Total carbohydrate" },
          { id: "fiber-protein", label: "Fiber and protein" },
          { id: "usual-amount", label: "Your usual amount" },
          { id: "meal-context", label: "The rest of the meal" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "A package label provides comparison clues, but it cannot decide whether a familiar food belongs in one person’s overall eating pattern.",
      },
      continueLabel: "Continue to Asha’s first family dinner",
    },
    {
      id: "the-separate-plate",
      number: 2,
      title: "A separate plate",
      layout: "narrative-right",
      tone: "tension",
      paragraphs: [
        "The table held a grain dish, beans, vegetables, bread, yogurt, and a protein dish. Asha had made herself a different dinner: plain protein and leafy greens.",
        "Everyone talked about the week and passed dishes across the table. Asha was sitting with them, but the meal no longer felt shared.",
      ],
      interactionType: "separate-plate",
      interaction: {
        id: "asha-shared-versus-identical",
        purpose: "compare",
        engagement: "optional-exploration",
        prompt: "What needs to be shared for a meal to still feel shared?",
        instructions:
          "Compare identical plates with a shared meal where each person can make their own choices.",
        options: [
          { id: "connected", label: "Shared meal, individual choices" },
          { id: "identical", label: "Everyone needs the same plate" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "Connection can come from shared time, food, labor, and conversation without requiring identical portions or care decisions.",
      },
      continueLabel: "Hear what her daughter noticed",
    },
    {
      id: "are-you-not-eating-with-us",
      number: 3,
      title: "Her daughter noticed",
      layout: "perspective-split",
      tone: "tension",
      paragraphs: [
        "Asha’s daughter looked at the separate plate. Her husband offered to stop serving one of their familiar dishes so Asha wouldn’t have to worry about it.",
        "He meant to help. Asha didn’t want the family to change every meal for her, and she didn’t want anyone monitoring her plate. She wasn’t sure how to say that yet.",
      ],
      interactionType: "family-dialogue",
      interaction: {
        id: "asha-boundary-language",
        purpose: "choose-response",
        engagement: "knowledge-application",
        prompt: "Which boundary could Asha borrow for a future family meal?",
        instructions: "Choose language that protects both family connection and Asha’s autonomy.",
        options: [
          {
            id: "plate-agency",
            label: "Please let me decide what goes on my plate. Ask before offering advice.",
          },
          {
            id: "planning-help",
            label: "Invite me to plan with you, but do not create a separate menu for me.",
          },
          {
            id: "normal-conversation",
            label: "Keep dinner conversation ordinary unless I choose to discuss diabetes.",
          },
          {
            id: "question-list",
            label: "Help me save concerns for my appointment instead of correcting me.",
          },
        ],
        feedbackMode: "choice-consequence",
        requiredForProgress: false,
        learningPoint:
          "Clear, consent-based language can redirect concern without rejecting the people who want to help.",
      },
      continueLabel: "See what Asha learned next",
    },
    {
      id: "learning-what-the-meal-was-doing",
      number: 4,
      title: "Looking at the whole meal",
      layout: "stacked",
      tone: "clarity",
      paragraphs: [
        "Asha described the grocery trip and the separate plate. The dietitian asked what her family usually ate, then looked at the whole dinner with her.",
        "The grain dish wasn’t the only part of the meal. There were beans, vegetables, protein, side dishes, the amount of each food, and what Asha could realistically keep doing.",
      ],
      interactionType: "meal-builder",
      interaction: {
        id: "asha-three-f-meal",
        purpose: "apply",
        engagement: "optional-exploration",
        prompt: "Can one possible dinner feel familiar, filling, and feasible?",
        instructions:
          "Build and adjust a familiar meal. This is a sustainability exercise, not a personalized prescription.",
        options: [
          { id: "grain", label: "Grain or starchy food" },
          { id: "beans", label: "Beans or legumes" },
          { id: "vegetables", label: "Vegetables" },
          { id: "protein", label: "Protein food" },
          { id: "bread", label: "Bread or another side" },
          { id: "dairy", label: "Dairy or alternative" },
          { id: "water", label: "Water" },
          { id: "dessert", label: "Dessert" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "A sustainable meal considers nourishment alongside familiarity, satisfaction, access, personal preferences, and what someone can realistically continue.",
      },
      continueLabel: "Return to Sunday dinner",
    },
    {
      id: "the-choice-at-sunday-dinner",
      number: 5,
      title: "The next Sunday",
      layout: "decision-focus",
      tone: "pause",
      paragraphs: [
        "The same dishes came back to the table. Asha still felt nervous. One appointment hadn’t removed every worry she had attached to the meal.",
        "This time, nobody made her a separate plate. The serving spoons stayed with the shared dishes, and her family let her choose.",
      ],
      interactionType: "meaningful-food-choice",
      interaction: {
        id: "asha-small-meal-experiment",
        purpose: "explore-consequences",
        engagement: "meaningful-decision",
        prompt: "Which small experiment could Asha choose without making a permanent rule?",
        instructions: "Choose one low-pressure next step and observe what it could make possible.",
        options: [
          {
            id: "serve-self",
            label: "Keep the dishes family-style and let Asha serve her own plate",
            feedback: "Asha chooses what goes on her plate while still eating with her family.",
          },
          {
            id: "one-experiment",
            label: "Choose one small meal experiment instead of creating a permanent food rule",
            feedback:
              "A small experiment can create useful experience without asking one dinner to solve everything.",
          },
          {
            id: "satisfaction-note",
            label: "Notice what feels satisfying and bring that observation to the dietitian",
            feedback:
              "Satisfaction and sustainability become information Asha can use in a qualified conversation.",
          },
          {
            id: "pause-experiment",
            label: "Keep tonight familiar and choose a calmer meal for the first experiment",
            feedback:
              "Asha can choose timing as well as food. Waiting for a calmer moment is different from abandoning the question.",
          },
        ],
        feedbackMode: "choice-consequence",
        requiredForProgress: true,
        learningPoint:
          "A small, reversible experiment can create useful experience without asking one meal to prove success or failure.",
      },
      continueLabel: "See what changed at the table",
    },
    {
      id: "the-same-table",
      number: 6,
      title: "Dinner continued",
      layout: "closing-wide",
      tone: "clarity",
      paragraphs: [
        "Asha served herself from the shared dishes. When her daughter asked about one of her choices, Asha said, “I’m learning how it fits with the rest of my meal.”",
        "Her husband asked if he should remind her about portions. “No,” Asha said. “Just ask before giving advice.” Then the conversation moved on.",
      ],
      interactionType: "shared-table",
      interaction: {
        id: "asha-family-meal-agreement",
        purpose: "apply",
        engagement: "knowledge-application",
        prompt: "Which agreements could make future meals calmer for everyone?",
        instructions:
          "Choose any agreements that preserve routine, consent, privacy, and personal agency.",
        options: [
          { id: "neutral-language", label: "Use neutral words for food" },
          { id: "rotate-planning", label: "Rotate who helps choose the family menu" },
          { id: "agreed-check-in", label: "Save health questions for an agreed check-in" },
          { id: "public-praise", label: "Praise or correct Asha’s plate publicly" },
          { id: "self-service", label: "Let each person serve themselves" },
          { id: "secret-substitutions", label: "Change Asha’s ingredients without telling her" },
        ],
        feedbackMode: "open-interpretation",
        requiredForProgress: false,
        learningPoint:
          "Families can change the environment around a meal without monitoring or taking ownership of another person’s plate.",
      },
      continueLabel: "Pause and Think",
    },
  ],
  predictionPrompt: "What information helped Asha make a decision?",
  predictionChoices: [
    { id: "one-food", label: "She found one food that works for everyone" },
    { id: "stopped-carbs", label: "She removed every carbohydrate-containing food" },
    {
      id: "whole-meal",
      label:
        "She considered the amount, the rest of the meal, and what she could realistically continue",
    },
    { id: "family-chose", label: "Her family chose her portions for her" },
  ],
  quiz: [
    {
      id: "asha-sustainable-approach",
      prompt: "What was different about Asha’s second Sunday dinner?",
      choices: [
        { id: "a", label: "She removed every carbohydrate-containing food" },
        {
          id: "b",
          label: "She kept familiar foods and considered the whole meal",
        },
        { id: "c", label: "Her family began deciding what she could eat" },
        { id: "d", label: "She found one meal that would work for everyone with diabetes" },
      ],
      correctChoiceId: "b",
      explanation:
        "Asha stayed part of the shared meal and made her own choices with more context. There is no single meal that works for every person.",
      relatedSceneId: "learning-what-the-meal-was-doing",
    },
    {
      id: "asha-carbohydrate-accuracy",
      prompt: "What context did the dietitian add?",
      choices: [
        {
          id: "a",
          label: "They must be removed completely after a Type 2 diabetes diagnosis",
        },
        { id: "b", label: "They do not affect blood glucose when eaten with family" },
        {
          id: "c",
          label:
            "Amount, preparation, other foods, personal response, and the care plan all matter",
        },
        { id: "d", label: "Only sweet foods contain carbohydrates" },
      ],
      correctChoiceId: "c",
      explanation:
        "Carbohydrate-containing foods can influence blood glucose. The amount, other foods in the meal, personal response, and care plan add context.",
      relatedSceneId: "learning-what-the-meal-was-doing",
    },
    {
      id: "asha-family-support",
      prompt: "Which family response leaves the food decision with Asha?",
      choices: [
        { id: "a", label: "“Yes. Removing it for everyone is the only safe option.”" },
        { id: "b", label: "“Food does not matter, so nothing needs to change.”" },
        {
          id: "c",
          label: "“Let’s ask what kind of support would help at family meals.”",
        },
        {
          id: "d",
          label: "“We should watch every serving to make sure the person follows the rules.”",
        },
      ],
      correctChoiceId: "c",
      explanation:
        "Helpful support respects the person’s independence. It does not require removing a familiar food or monitoring every bite.",
      relatedSceneId: "the-same-table",
    },
  ],
  keyIdeaUnderstoodMessage:
    "Asha considered the whole meal, her own needs, and the support she wanted from her family.",
  lessonEyebrow: "What changed",
  lessonHeading: "Asha looked at the whole meal.",
  interpretation: [
    "Asha removed familiar foods before she had enough context to understand how they fit into the meal.",
    "The dietitian helped her look at portions, preparation, the other foods present, and what she could realistically continue.",
    "Her family could support her by asking what was helpful instead of monitoring her plate.",
  ],
  takeaway:
    "Familiar foods can stay part of a meal. Personal needs, portions, preparation, and the rest of the meal provide context.",
  privateReflectionPrompt:
    "Is there a familiar food or family meal you are afraid diabetes might take away from you?",
  privateReflectionSupportPrompt:
    "What would you want to understand about how that food could fit into your life?",
  completionHeading: "Finished",
  completionMessage:
    "Asha left the separate plate behind and asked her family to support her without managing her food choices.",
};
