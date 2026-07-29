import type { InteractiveStory } from "@/features/stories/types/interactive-story";

export const ashaRiceOnTheTableStory: InteractiveStory = {
  id: "asha-rice-on-the-table",
  slug: "asha-rice-on-the-table",
  title: "The Rice Was Still on the Table",
  characterName: "Asha",
  disclosure:
    "About this story: Asha is a placeholder name. This is an original illustrative scenario inspired by emotions and questions commonly reported by people living with Type 2 diabetes. It does not describe one specific individual or provide a personalized eating plan.",
  topic: "Food and family",
  themes: [
    "fear of food",
    "cultural meals",
    "family connection",
    "restrictive thinking",
    "carbohydrates",
    "portion awareness",
    "meal balance",
    "asking for helpful support",
    "returning to shared meals",
  ],
  learningObjective:
    "A Type 2 diabetes diagnosis does not require abandoning familiar or culturally meaningful foods. Carbohydrate-containing foods affect blood glucose, but portion size, fiber, protein, vegetables, preparation, and the overall eating pattern all matter. Sustainable food choices should support health without isolating the learner from family, culture, or enjoyment.",
  relatedLessonId: "lesson-4",
  estimatedMinutes: 8,
  medicalRiskLevel: "low",
  reviewStatus: "not-reviewed",
  version: "1.0",
  sourceThemeNote:
    "Original composite narrative informed by recurring themes commonly reported in diabetes education, including fear of carbohydrates, loss of cultural foods, family pressure, and the need for sustainable meal changes. No single person’s wording, identity, or chronology is reproduced.",
  visualTheme: "family-warmth",
  emotionalArc: "distance to shared agency",
  dominantInteractionType: "apply",
  primaryAccent: "table terracotta",
  closingTone: "warmly connected",
  imagePath: "/stories/asha-rice-on-the-table-cover.webp",
  imagePrompt:
    "Create a cinematic editorial illustration of a warm South Asian family dinner at home in the early evening. A middle-aged South Asian woman sits at a dining table with several family members, but the composition focuses on the table and the emotional distance she feels rather than on clearly identifiable faces. In front of her is a very small, separate plate, while familiar shared dishes remain in the center of the table, including rice, lentils, vegetables, flatbread, and a protein dish. Her family is engaged in the meal, while she looks quietly uncertain about what she is allowed to eat. Show natural body language, warm household lighting, and a realistic family setting. Use restrained warm cream, deep green, muted terracotta, soft gold, and natural wood colors. No text, medical devices, logos, exaggerated emotion, stereotypical decoration, or moral contrast between foods. Polished cinematic editorial illustration, not stock photography or a cartoon.",
  imageAlt:
    "An editorial illustration of a South Asian woman sitting with her family at a dinner table, looking uncertain as familiar shared dishes remain in the center of the table.",
  introduction:
    "After her diagnosis, Asha began removing familiar foods from her plate and eating separately from her family. One Sunday dinner helped her see that caring for her health did not require leaving her culture or the table behind.",
  whyItMatters:
    "This story explores food fear, family meals, and how familiar carbohydrate-containing foods can remain part of a thoughtful eating pattern.",
  estimatedTimeLabel: "6 to 8 minutes",
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
      title: "Everything Looked Different",
      layout: "narrative-left",
      tone: "tension",
      paragraphs: [
        "The first grocery trip after her diagnosis took Asha almost two hours.",
        "She picked up a bag of rice, read the nutrition label, and placed it back on the shelf.",
        "She did the same with bread.",
        "Then yogurt.",
        "Then fruit.",
        "Then lentils.",
        "Nearly everything seemed to contain carbohydrates, sugar, or a number she did not understand.",
        "Before her diagnosis, grocery shopping had been routine. She bought ingredients for meals her family had eaten for years.",
        "Now every aisle felt like a test she had not studied for.",
        "By the time Asha reached the checkout area, her cart contained spinach, eggs, chicken, and water.",
        "She looked into it and wondered whether this was what eating with diabetes would be like forever.",
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
      title: "The Separate Plate",
      layout: "narrative-right",
      tone: "tension",
      paragraphs: [
        "That Sunday, Asha’s family gathered for dinner.",
        "The table held many of the foods they usually shared: rice, dal, vegetables, flatbread, yogurt, and chicken.",
        "Asha had prepared a separate plate for herself.",
        "Grilled chicken.",
        "A pile of spinach.",
        "No rice.",
        "No dal.",
        "No flatbread.",
        "She sat down with everyone else, but the meal no longer felt shared.",
        "Her husband reached for the rice.",
        "Her mother spooned dal onto a child’s plate.",
        "Everyone talked about the week.",
        "Asha looked down at her food and tried to convince herself that being disciplined was supposed to feel this lonely.",
      ],
      interactionType: "separate-plate",
      interaction: {
        id: "asha-shared-versus-identical",
        purpose: "compare",
        engagement: "optional-exploration",
        prompt: "What needs to be shared for a meal to still feel shared?",
        instructions:
          "Compare identical plates with a shared ritual that leaves room for personal choices.",
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
      title: "“Are You Not Eating With Us?”",
      layout: "perspective-split",
      tone: "tension",
      paragraphs: [
        "Asha’s daughter looked across the table.",
        "“Are you not eating with us?” she asked.",
        "“I am eating,” Asha replied.",
        "Her daughter looked at the separate plate.",
        "“But not our food.”",
        "The table became quiet for a moment.",
        "Asha’s husband tried to help.",
        "“Maybe we should stop making rice,” he said. “Then you won’t have to worry about it.”",
        "Asha knew he meant well.",
        "But the idea of removing a food her family had eaten for generations did not make her feel supported.",
        "It made her feel as though the diagnosis had entered the kitchen and rearranged everyone’s life.",
        "She did not want her family to monitor her plate.",
        "She also did not want to pretend that food choices no longer mattered.",
        "She did not yet know how to ask for something between those two extremes.",
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
      title: "Learning What the Meal Was Doing",
      layout: "stacked",
      tone: "clarity",
      paragraphs: [
        "At her next appointment, Asha described the grocery trip and the separate plate.",
        "The dietitian listened and then said:",
        "“You started removing food before anyone helped you understand what the food was doing.”",
        "They looked at one of Asha’s usual dinners.",
        "The rice and flatbread contained carbohydrates.",
        "The dal also contained carbohydrates, along with fiber and protein.",
        "The vegetables added volume, fiber, and variety.",
        "The chicken provided protein.",
        "The yogurt could play a different role depending on the type and portion.",
        "The dietitian did not hand Asha a list of foods she could never eat again.",
        "Instead, they discussed the meal as a whole.",
        "How much of each food was present?",
        "Which foods were eaten together?",
        "What left Asha feeling satisfied?",
        "What would she be willing to continue months from now?",
        "For the first time since her diagnosis, the question changed from:",
        "“What must I remove?”",
        "to:",
        "“How can I build this meal thoughtfully?”",
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
          { id: "rice", label: "Rice" },
          { id: "dal", label: "Dal" },
          { id: "vegetables", label: "Vegetables" },
          { id: "protein", label: "Chicken" },
          { id: "flatbread", label: "Flatbread" },
          { id: "yogurt", label: "Plain yogurt" },
          { id: "water", label: "Water" },
          { id: "dessert", label: "Dessert" },
        ],
        feedbackMode: "single-explanation",
        requiredForProgress: false,
        learningPoint:
          "A sustainable meal considers nourishment alongside familiarity, satisfaction, culture, access, and what someone can realistically continue.",
      },
      continueLabel: "Return to Sunday dinner",
    },
    {
      id: "the-choice-at-sunday-dinner",
      number: 5,
      title: "The Choice at Sunday Dinner",
      layout: "decision-focus",
      tone: "pause",
      paragraphs: [
        "The following Sunday, the same dishes returned to the table.",
        "Asha still felt nervous.",
        "Understanding the meal did not instantly remove every fear she had attached to it.",
        "The serving spoon rested beside the rice.",
        "Her family waited without saying anything.",
        "Asha realized there were several ways she could respond.",
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
            feedback:
              "Asha keeps agency over her plate while the meal remains a shared family experience.",
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
      title: "The Same Table",
      layout: "closing-wide",
      tone: "clarity",
      paragraphs: [
        "Asha’s daughter watched her serve the rice.",
        "“I thought you could not eat that anymore,” she said.",
        "Asha took a moment before answering.",
        "“I can still eat the foods we make,” she said. “I am learning how they fit together.”",
        "Her husband asked whether he should remind her about portions.",
        "Asha shook her head.",
        "“What would help is making sure there are vegetables and protein on the table too. You do not need to watch what I eat.”",
        "The conversation moved on.",
        "Someone asked about school.",
        "Someone else complained that the chicken was too spicy.",
        "Asha noticed that she had stopped studying everyone else’s plate.",
        "She was eating dinner with her family again.",
        "The rice was still on the table.",
        "It had not become harmless, dangerous, allowed, or forbidden.",
        "It was food.",
        "Asha now had more information about how she wanted it to fit into her life.",
        "That understanding felt far more sustainable than fear.",
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
  predictionPrompt: "What changed most for Asha?",
  predictionChoices: [
    { id: "one-food", label: "She discovered one food that would solve diabetes" },
    { id: "stopped-carbs", label: "She stopped eating carbohydrates" },
    {
      id: "whole-meal",
      label:
        "She learned to think about the whole meal instead of treating familiar foods as forbidden",
    },
    { id: "family-chose", label: "Her family began choosing all of her food for her" },
  ],
  quiz: [
    {
      id: "asha-sustainable-approach",
      prompt: "What made Asha’s new approach more sustainable than her first separate plate?",
      choices: [
        { id: "a", label: "She removed every carbohydrate-containing food" },
        {
          id: "b",
          label:
            "She kept familiar foods while considering portions and how the meal worked together",
        },
        { id: "c", label: "Her family began deciding what she could eat" },
        { id: "d", label: "She found one meal that would work for everyone with diabetes" },
      ],
      correctChoiceId: "b",
      explanation:
        "Asha’s approach became more sustainable when she could remain part of the shared meal while making informed decisions about portions, pairings, and the overall pattern. There is no single meal that works for every person.",
      relatedSceneId: "learning-what-the-meal-was-doing",
    },
    {
      id: "asha-carbohydrate-accuracy",
      prompt: "Which statement about carbohydrate-containing foods is most accurate?",
      choices: [
        {
          id: "a",
          label: "They must be removed completely after a Type 2 diabetes diagnosis",
        },
        { id: "b", label: "They do not affect blood glucose when eaten with family" },
        {
          id: "c",
          label:
            "They can affect blood glucose, but portion, pairing, preparation, and the overall eating pattern also matter",
        },
        { id: "d", label: "Only sweet foods contain carbohydrates" },
      ],
      correctChoiceId: "c",
      explanation:
        "Carbohydrate-containing foods can influence blood glucose, but their effect is not understood by labeling every food as allowed or forbidden. The amount, other foods in the meal, personal response, and care plan all matter.",
      relatedSceneId: "learning-what-the-meal-was-doing",
    },
    {
      id: "asha-family-support",
      prompt:
        "A family member says, “You have diabetes, so we should stop making rice.” Which response is most supportive?",
      choices: [
        { id: "a", label: "“Yes. Removing it for everyone is the only safe option.”" },
        { id: "b", label: "“Food does not matter, so nothing needs to change.”" },
        {
          id: "c",
          label:
            "“Let’s ask what kind of support would help and find a way to keep shared meals balanced and familiar.”",
        },
        {
          id: "d",
          label: "“We should watch every serving to make sure the person follows the rules.”",
        },
      ],
      correctChoiceId: "c",
      explanation:
        "Helpful support respects the person’s independence while making balanced choices easier. It does not require banning a cultural food or monitoring every bite.",
      relatedSceneId: "the-same-table",
    },
  ],
  keyIdeaUnderstoodMessage:
    "You identified the central idea: familiar foods can remain part of a thoughtful pattern when the whole meal, personal needs, and sustainable support are considered.",
  lessonEyebrow: "What Asha’s experience can teach us",
  lessonHeading: "Understanding changed the question Asha was asking.",
  interpretation: [
    "Asha’s first response came from fear. She believed protecting her health required removing every familiar food before she understood how those foods affected the larger meal.",
    "What changed was not that rice suddenly stopped affecting blood glucose. What changed was the question she asked.",
    "Instead of asking, “Am I allowed to eat this?” she began asking, “How does this fit into the meal and into a pattern I can actually continue?”",
    "That shift allowed her to make informed choices without leaving her family, culture, or enjoyment behind.",
  ],
  takeaway:
    "Caring for your blood glucose does not require treating familiar foods as enemies. Sustainable choices consider the whole meal, your personal needs, and the life you want those choices to fit within.",
  privateReflectionPrompt:
    "Is there a familiar food or family meal you are afraid diabetes might take away from you?",
  privateReflectionSupportPrompt:
    "What would you want to understand about how that food could fit into your life?",
  completionHeading: "The rice was still on the table.",
  completionMessage:
    "You followed Asha from food fear and a separate plate back to a shared family meal. Her experience showed that familiar foods can be approached with understanding, flexibility, and support rather than automatic restriction.",
};
