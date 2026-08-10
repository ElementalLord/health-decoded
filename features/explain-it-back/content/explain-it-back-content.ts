import type { ExplainChallenge } from "@/features/explain-it-back/types/explain-it-back";

export const explainItBackChallenges = [
  {
    id: "blood-glucose",
    group: "Foundations",
    title: "Blood glucose",
    prompt: "Explain what blood glucose is and why your body uses it.",
    shortDescriptor: "Glucose in the bloodstream and its role as energy",
    referenceAnswer:
      "Blood glucose is glucose, or sugar, circulating in your blood. Your cells can use glucose for energy. Insulin helps glucose move from the bloodstream into cells.",
    essentialConcepts: [
      {
        id: "BG-1",
        meaning: "Blood glucose means glucose/sugar present in the bloodstream.",
        acceptedMeanings: [
          "sugar in your blood",
          "glucose traveling in the blood",
          "glucose in the bloodstream",
        ],
        missingFeedback:
          "Include what ‘blood glucose’ actually refers to: glucose, or sugar, in the bloodstream.",
      },
      {
        id: "BG-2",
        meaning: "Glucose can be used by cells/body for energy.",
        acceptedMeanings: [
          "cells use glucose for energy",
          "glucose provides energy",
          "the body uses glucose as an energy source",
        ],
        missingFeedback: "Add why glucose matters: cells can use it for energy.",
      },
    ],
    optionalConcepts: [
      { id: "BG-O1", meaning: "Insulin helps glucose move from the bloodstream into cells." },
    ],
    misconceptions: [
      {
        id: "BG-M1",
        meaning: "Blood glucose is insulin.",
        correction:
          "Blood glucose and insulin are different. Blood glucose is glucose in the blood; insulin is a hormone involved in helping glucose move into cells.",
      },
      {
        id: "BG-M2",
        meaning: "Glucose has no useful role and is only harmful.",
        correction:
          "Glucose is an important source of energy. The issue is not that glucose itself has no purpose.",
      },
    ],
    passingExample:
      "Blood glucose is the sugar moving around in your blood, and your cells use that glucose for energy.",
    almostExample: "Blood glucose is sugar in your bloodstream.",
    failingExample: "Blood glucose is another name for insulin.",
    sources: [
      {
        organization: "CDC",
        title: "About Insulin Resistance and Type 2 Diabetes",
        url: "https://www.cdc.gov/diabetes/about/insulin-resistance-type-2-diabetes.html",
      },
    ],
  },
  {
    id: "insulin",
    group: "Foundations",
    title: "Insulin",
    prompt: "Explain what insulin does in your own words.",
    shortDescriptor: "The hormone that helps glucose reach cells",
    referenceAnswer:
      "Insulin is a hormone that helps glucose move from the bloodstream into cells, where the glucose can be used for energy. The pancreas makes insulin.",
    essentialConcepts: [
      {
        id: "IN-1",
        meaning: "Insulin is a hormone.",
        acceptedMeanings: ["hormone", "chemical messenger/hormone in the body"],
        missingFeedback: "Include what insulin is: a hormone.",
      },
      {
        id: "IN-2",
        meaning:
          "Insulin helps glucose move from blood into cells or helps cells take up/use glucose.",
        acceptedMeanings: [
          "helps glucose enter cells",
          "helps move sugar from the blood into cells",
          "helps cells take in glucose",
        ],
        missingFeedback:
          "Add insulin's main role here: helping glucose move from the bloodstream into cells.",
      },
    ],
    optionalConcepts: [
      { id: "IN-O1", meaning: "The pancreas makes insulin." },
      { id: "IN-O2", meaning: "Cells can use the glucose for energy." },
    ],
    misconceptions: [
      {
        id: "IN-M1",
        meaning: "Insulin is glucose/sugar.",
        correction: "Insulin is not sugar. It is a hormone that helps the body handle glucose.",
      },
      {
        id: "IN-M2",
        meaning: "Insulin's purpose is to create glucose.",
        correction:
          "Insulin does not create blood glucose. Its role includes helping glucose move from the blood into cells.",
      },
    ],
    passingExample: "Insulin is a hormone that helps sugar in the blood get into the body's cells.",
    almostExample: "Insulin helps glucose get inside cells.",
    failingExample: "Insulin is the sugar floating around in your bloodstream.",
    sources: [
      {
        organization: "CDC",
        title: "About Insulin Resistance and Type 2 Diabetes",
        url: "https://www.cdc.gov/diabetes/about/insulin-resistance-type-2-diabetes.html",
      },
    ],
  },
  {
    id: "insulin-resistance",
    group: "Foundations",
    title: "Insulin resistance",
    prompt: "Explain what insulin resistance means in your own words.",
    shortDescriptor: "When cells do not respond to insulin as effectively",
    referenceAnswer:
      "Insulin resistance means the body's cells do not respond to insulin as well as they should. The body may need to make more insulin to help glucose enter cells, and blood glucose can rise over time.",
    essentialConcepts: [
      {
        id: "IR-1",
        meaning: "The body's cells respond less effectively/not normally to insulin.",
        acceptedMeanings: [
          "cells don't respond well to insulin",
          "insulin doesn't work as effectively on cells",
          "cells become less sensitive to insulin",
          "body needs more insulin to get a similar effect",
        ],
        missingFeedback:
          "The key idea is how the body's cells respond to insulin. Explain what changes about that response.",
      },
      {
        id: "IR-2",
        meaning:
          "This can make it harder to move glucose into cells and/or can contribute to glucose remaining elevated in the blood.",
        acceptedMeanings: [
          "glucose can stay in the blood",
          "it becomes harder for glucose to enter cells",
          "blood sugar can rise",
          "more insulin may be needed to move glucose into cells",
        ],
        missingFeedback:
          "Add what can happen when insulin is less effective: it becomes harder to move glucose into cells, so blood glucose can rise.",
      },
    ],
    optionalConcepts: [],
    misconceptions: [
      {
        id: "IR-M1",
        meaning: "Insulin resistance means the body is resistant to glucose/sugar.",
        correction:
          "‘Insulin resistance’ describes a reduced response to insulin—not resistance to glucose.",
      },
      {
        id: "IR-M2",
        meaning: "Insulin resistance means the body makes absolutely no insulin.",
        correction:
          "Insulin resistance does not mean the body necessarily makes no insulin. It means cells do not respond to insulin as effectively.",
      },
    ],
    passingExample:
      "The cells aren't responding to insulin as well, so the body may need more insulin and glucose can stay higher in the blood.",
    almostExample: "Insulin resistance means the cells don't listen to insulin as well.",
    failingExample: "It means your body becomes resistant to sugar.",
    sources: [
      {
        organization: "NIDDK",
        title: "Insulin Resistance & Prediabetes",
        url: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance",
      },
      {
        organization: "CDC",
        title: "About Insulin Resistance and Type 2 Diabetes",
        url: "https://www.cdc.gov/diabetes/about/insulin-resistance-type-2-diabetes.html",
      },
    ],
  },
  {
    id: "type-2-diabetes",
    group: "Foundations",
    title: "Type 2 diabetes",
    prompt: "Explain what is happening in the body in type 2 diabetes.",
    shortDescriptor: "Insulin resistance, insulin supply, and blood glucose",
    referenceAnswer:
      "In type 2 diabetes, the body does not use insulin as well as it should. Over time, the pancreas may also be unable to make enough insulin to keep up. As a result, too much glucose can remain in the bloodstream.",
    essentialConcepts: [
      {
        id: "T2-1",
        meaning: "The body/cells do not use or respond to insulin normally/effectively.",
        acceptedMeanings: [
          "insulin resistance",
          "cells don't respond well to insulin",
          "body doesn't use insulin properly",
        ],
        missingFeedback:
          "Include the insulin part of the picture: in type 2 diabetes, the body does not use insulin as effectively as it should.",
      },
      {
        id: "T2-2",
        meaning: "Blood glucose can become elevated/remain in the bloodstream.",
        acceptedMeanings: [
          "blood sugar rises",
          "too much glucose remains in blood",
          "glucose doesn't move into cells effectively",
        ],
        missingFeedback:
          "Add what this can mean for glucose: too much can remain in the bloodstream.",
      },
    ],
    optionalConcepts: [
      { id: "T2-O1", meaning: "Over time, the pancreas may not make enough insulin to keep up." },
    ],
    misconceptions: [
      {
        id: "T2-M1",
        meaning: "Everyone with type 2 diabetes makes zero insulin.",
        correction:
          "Type 2 diabetes does not automatically mean the body makes no insulin. Insulin resistance is a major part of the condition, and insulin production may also become insufficient over time.",
      },
      {
        id: "T2-M2",
        meaning: "Type 2 diabetes simply means someone ate too much sugar.",
        correction:
          "Type 2 diabetes is not defined as ‘eating too much sugar.’ It involves problems with how the body uses insulin and regulates blood glucose.",
      },
    ],
    passingExample:
      "In type 2 diabetes the cells don't respond to insulin well, and over time the body may not keep up with enough insulin, so glucose stays too high in the blood.",
    almostExample: "The body doesn't respond to insulin very well.",
    failingExample: "Type 2 diabetes means your body doesn't produce any insulin at all.",
    sources: [
      {
        organization: "CDC",
        title: "Type 2 Diabetes",
        url: "https://www.cdc.gov/diabetes/about/about-type-2-diabetes.html",
      },
      {
        organization: "NIDDK",
        title: "Type 2 Diabetes",
        url: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-2-diabetes",
      },
    ],
  },
  {
    id: "a1c",
    group: "Foundations",
    title: "A1C",
    prompt: "Explain what an A1C test tells you.",
    shortDescriptor: "A longer-term picture of blood glucose",
    referenceAnswer:
      "An A1C test is a blood test that gives information about average blood glucose levels over roughly the past three months. It is different from a single glucose reading taken at one moment.",
    essentialConcepts: [
      {
        id: "A1C-1",
        meaning: "A1C is a blood test/measurement related to blood glucose.",
        acceptedMeanings: [
          "blood test",
          "test of blood sugar over time",
          "measurement related to average glucose",
        ],
        missingFeedback: "Include what A1C is: a blood test related to blood glucose.",
      },
      {
        id: "A1C-2",
        meaning: "It reflects average blood glucose over approximately the previous 3 months.",
        acceptedMeanings: [
          "average blood sugar over about three months",
          "longer-term average glucose",
          "average glucose over the last few months",
        ],
        missingFeedback:
          "The key time frame is missing: A1C gives a longer-term picture, roughly the past three months.",
      },
    ],
    optionalConcepts: [],
    misconceptions: [
      {
        id: "A1C-M1",
        meaning: "A1C is a single current glucose reading.",
        correction:
          "A1C is not a moment-by-moment glucose reading. It reflects a longer-term average.",
      },
      {
        id: "A1C-M2",
        meaning: "A1C directly measures how much insulin is in the blood.",
        correction: "A1C reflects average blood glucose rather than directly measuring insulin.",
      },
    ],
    passingExample:
      "A1C is a blood test that gives you an idea of your average blood sugar over the last three months.",
    almostExample: "A1C tells you your average blood sugar.",
    failingExample: "A1C is what your blood sugar is right now.",
    sources: [
      {
        organization: "NIDDK",
        title: "The A1C Test & Diabetes",
        url: "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test",
      },
    ],
  },
  {
    id: "a1c-vs-glucose",
    group: "Foundations",
    title: "A1C vs. a glucose reading",
    prompt: "Explain why an A1C and a single glucose reading tell you different things.",
    shortDescriptor: "Long-term average versus a moment in time",
    referenceAnswer:
      "A single glucose reading measures blood glucose at that particular time. A1C provides information about average blood glucose over roughly the past three months. That is why the two measurements answer different questions.",
    essentialConcepts: [
      {
        id: "AVG-1",
        meaning: "A single glucose reading represents a particular moment/time.",
        missingFeedback:
          "Explain what a single glucose reading represents: blood glucose at that particular time.",
      },
      {
        id: "AVG-2",
        meaning: "A1C reflects a longer-term average of blood glucose over about 3 months.",
        missingFeedback:
          "Add the A1C side: it reflects average glucose over roughly the previous three months.",
      },
    ],
    optionalConcepts: [],
    misconceptions: [
      {
        id: "AVG-M1",
        meaning: "A single glucose reading and A1C measure exactly the same time period.",
        correction:
          "They cover different time scales: one is a point-in-time glucose measurement and A1C reflects a longer-term average.",
      },
    ],
    passingExample:
      "A glucose check tells you the level at that moment, while A1C gives a rough average across the last few months.",
    almostExample: "A1C is the long-term one.",
    failingExample: "They're basically two ways to measure your sugar at the same moment.",
    sources: [
      {
        organization: "NIDDK",
        title: "The A1C Test & Diabetes",
        url: "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test",
      },
    ],
  },
  {
    id: "carbohydrates",
    group: "Food & labels",
    title: "Carbohydrates and blood glucose",
    prompt: "Explain why carbohydrates matter when thinking about blood glucose.",
    shortDescriptor: "How carbohydrate-containing foods can affect glucose",
    referenceAnswer:
      "Carbohydrates include sugars, starches, and fiber. Sugars and starches can raise blood glucose after they are eaten, while fiber is handled differently by the body. People with diabetes can still eat carbohydrate-containing foods; the amount and type of carbohydrate provide useful context.",
    essentialConcepts: [
      {
        id: "CARB-1",
        meaning: "Carbohydrate-containing foods can affect/raise blood glucose.",
        acceptedMeanings: [
          "carbs affect blood sugar",
          "sugars and starches can raise glucose",
          "carbs can increase glucose after eating",
        ],
        missingFeedback:
          "Include the main connection: carbohydrate-containing foods can affect blood glucose.",
      },
      {
        id: "CARB-2",
        meaning: "Carbohydrates are not automatically forbidden for people with diabetes.",
        acceptedMeanings: [
          "people with diabetes can still eat carbs",
          "carbs aren't automatically off-limits",
          "carbohydrate is something to understand/manage rather than universally avoid",
        ],
        missingFeedback:
          "Remember that this isn't an ‘all carbs are forbidden’ rule. The point is understanding how carbohydrate fits into the overall picture.",
      },
    ],
    optionalConcepts: [
      { id: "CARB-O1", meaning: "Sugars, starches, and fiber are types of carbohydrate." },
      { id: "CARB-O2", meaning: "Fiber is handled differently from sugars and starches." },
    ],
    misconceptions: [
      {
        id: "CARB-M1",
        meaning: "People with diabetes must completely avoid all carbohydrates.",
        correction:
          "Carbohydrates are not automatically off-limits for people with diabetes. Understanding their amount and type can be useful.",
      },
      {
        id: "CARB-M2",
        meaning: "Only foods that taste sweet contain carbohydrates.",
        correction:
          "Carbohydrates include more than sweet foods. Starches and fiber are also types of carbohydrate.",
      },
    ],
    passingExample:
      "Carbs can affect blood sugar after you eat them, so knowing the amount and type can be useful, but having diabetes doesn't mean you can never eat carbs.",
    almostExample: "Carbs can raise blood sugar.",
    failingExample: "People with diabetes shouldn't eat any carbohydrates.",
    sources: [
      {
        organization: "CDC",
        title: "Carb Counting",
        url: "https://www.cdc.gov/diabetes/healthy-eating/carb-counting-manage-blood-sugar.html",
      },
      {
        organization: "CDC",
        title: "Choosing Healthy Carbs",
        url: "https://www.cdc.gov/diabetes/healthy-eating/choosing-healthy-carbs.html",
      },
    ],
  },
  {
    id: "serving-size",
    group: "Food & labels",
    title: "Serving size",
    prompt: "Explain why serving size matters when reading a Nutrition Facts label.",
    shortDescriptor: "The amount the label's numbers are based on",
    referenceAnswer:
      "Nutrition information on a Nutrition Facts label is usually based on one serving. If someone eats more or less than that amount, the calories and nutrient amounts they consume will be different. A serving size describes the amount used for the label; it is not automatically a recommendation of how much someone should eat.",
    essentialConcepts: [
      {
        id: "SERV-1",
        meaning: "Nutrition information is generally based on the listed serving size.",
        missingFeedback:
          "Include the connection between serving size and the rest of the label: the listed nutrition amounts are generally based on that serving.",
      },
      {
        id: "SERV-2",
        meaning:
          "Eating a different number/amount of servings changes the nutrient/calorie amounts consumed.",
        missingFeedback:
          "Add what happens when the amount eaten changes: the calories and nutrient amounts change too.",
      },
    ],
    optionalConcepts: [],
    misconceptions: [
      {
        id: "SERV-M1",
        meaning: "Serving size is automatically the recommended amount a person should eat.",
        correction:
          "The serving size on the label is not automatically a recommendation of how much someone should eat. It is the amount used to present the nutrition information.",
      },
    ],
    passingExample:
      "The numbers on the label are usually for one serving, so if you eat two servings you're getting about twice those listed amounts.",
    almostExample: "The label's numbers are based on the serving size.",
    failingExample: "Serving size is the amount the government says everyone should eat.",
    sources: [
      {
        organization: "FDA",
        title: "Serving Size on the Nutrition Facts Label",
        url: "https://www.fda.gov/food/nutrition-facts-label/serving-size-nutrition-facts-label",
      },
      {
        organization: "FDA",
        title: "What's on the Nutrition Facts Label",
        url: "https://www.fda.gov/food/nutrition-facts-label/whats-nutrition-facts-label",
      },
    ],
  },
  {
    id: "total-vs-added-sugars",
    group: "Food & labels",
    title: "Total sugars vs. added sugars",
    prompt:
      "Explain the difference between total sugars and added sugars on a Nutrition Facts label.",
    shortDescriptor: "Naturally occurring and added sugars",
    referenceAnswer:
      "Total sugars includes sugars naturally present in foods as well as added sugars. Added sugars are sugars added during processing or preparation. The added sugars amount is included within total sugars rather than being an extra amount added on top of it.",
    essentialConcepts: [
      {
        id: "SUGAR-1",
        meaning: "Total sugars includes both naturally occurring sugars and added sugars.",
        missingFeedback:
          "Add what ‘total sugars’ includes: both naturally occurring sugars and any added sugars.",
      },
      {
        id: "SUGAR-2",
        meaning: "Added sugars are sugars added during processing/preparation.",
        missingFeedback:
          "Explain what ‘added sugars’ means: sugars added during processing or preparation.",
      },
      {
        id: "SUGAR-3",
        meaning:
          "Added sugars are included within total sugars rather than added on top of the total-sugars number.",
        missingFeedback:
          "Include how the two numbers relate: added sugars are already included within total sugars.",
      },
    ],
    optionalConcepts: [],
    misconceptions: [
      {
        id: "SUGAR-M1",
        meaning:
          "Added sugars should be added numerically to total sugars to calculate the true amount.",
        correction:
          "Added sugars are already included in the Total Sugars amount; they should not be added to it again.",
      },
    ],
    passingExample:
      "Total sugar includes the sugar naturally in the food plus sugar that was added. Added sugar tells you how much was added during processing, and it's already part of the total sugar number.",
    almostExample: "Added sugars are sugars put into the food while it's being made.",
    failingExample: "You add the added-sugar grams to total sugar to find the real amount.",
    sources: [
      {
        organization: "FDA",
        title: "Added Sugars on the Nutrition Facts Label",
        url: "https://www.fda.gov/food/nutrition-facts-label/added-sugars-nutrition-facts-label",
      },
      {
        organization: "FDA",
        title: "How to Understand and Use the Nutrition Facts Label",
        url: "https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label",
      },
    ],
  },
  {
    id: "total-carbohydrate",
    group: "Food & labels",
    title: "Total carbohydrate vs. added sugar",
    prompt: "Explain why looking only at added sugar does not show the whole carbohydrate picture.",
    shortDescriptor: "Why one sugar number doesn't represent all carbohydrate",
    referenceAnswer:
      "Added sugar is only one part of the carbohydrate information on a Nutrition Facts label. Total carbohydrate gives a broader picture that includes carbohydrate from sources beyond added sugars, such as naturally occurring sugars, starches, and fiber. Serving size also matters because the listed amounts are based on it.",
    essentialConcepts: [
      {
        id: "TC-1",
        meaning: "Added sugar represents only one part/subset of the carbohydrate picture.",
        missingFeedback:
          "Include the main limitation: added sugar is only one piece of the carbohydrate information.",
      },
      {
        id: "TC-2",
        meaning: "Total carbohydrate is a broader measure than added sugar.",
        acceptedMeanings: [
          "total carb includes more than added sugar",
          "total carbohydrate gives the broader carbohydrate amount",
          "other carbohydrates exist beyond added sugars",
        ],
        missingFeedback:
          "Add why Total Carbohydrate is different: it represents more than just added sugar.",
      },
    ],
    optionalConcepts: [
      {
        id: "TC-O1",
        meaning: "Other carbohydrate includes naturally occurring sugars, starches, and fiber.",
      },
      { id: "TC-O2", meaning: "Serving size affects the listed amounts." },
    ],
    misconceptions: [
      {
        id: "TC-M1",
        meaning: "Added sugars and Total Carbohydrate are the same measurement.",
        correction:
          "Added sugars and Total Carbohydrate are not the same measurement. Added sugars are only one part of the broader carbohydrate information.",
      },
      {
        id: "TC-M2",
        meaning: "A food with 0g added sugar must have 0g total carbohydrate.",
        correction:
          "A food can have no added sugars and still contain carbohydrate from other sources.",
      },
    ],
    passingExample:
      "Added sugar is only one kind of carbohydrate information. Total carbs also reflects other carbs, so zero added sugar doesn't necessarily mean zero carbs.",
    almostExample: "Total carbs tells you more than just added sugar.",
    failingExample: "If added sugar is zero, total carbohydrate has to be zero too.",
    sources: [
      {
        organization: "FDA",
        title: "How to Understand and Use the Nutrition Facts Label",
        url: "https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label",
      },
      {
        organization: "CDC",
        title: "Carb Counting",
        url: "https://www.cdc.gov/diabetes/healthy-eating/carb-counting-manage-blood-sugar.html",
      },
    ],
  },
] as const satisfies readonly ExplainChallenge[];

export const explainItBackChallengeIds = explainItBackChallenges.map(({ id }) => id);

export function getExplainItBackChallenge(id: string) {
  return explainItBackChallenges.find((challenge) => challenge.id === id) ?? null;
}
