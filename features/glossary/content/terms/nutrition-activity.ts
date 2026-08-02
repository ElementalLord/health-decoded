import { createEntries } from "./create-entries";

export const nutritionAndActivityTerms = createEntries(
  "Food, nutrition, and activity",
  ["SRC-CDC-PLAIN", "SRC-ADA-TERMS", "SRC-HD-LESSONS"],
  [
    [
      "Carbohydrate",
      "A nutrient found in foods such as grains, fruit, milk, beans, and starchy vegetables. The body breaks many carbohydrates into glucose.",
    ],
    [
      "Total carbohydrate",
      "The amount of carbohydrate in one labeled serving, including starches, sugars, and fiber.",
    ],
    [
      "Carbohydrate counting",
      "A method of tracking the grams of carbohydrate in foods and drinks.",
    ],
    ["Starch", "A type of carbohydrate made of many glucose units joined together."],
    [
      "Sugar",
      "A type of carbohydrate that includes glucose, fructose, sucrose, and other simple sugars.",
    ],
    [
      "Added sugar",
      "Sugar added during processing, cooking, or preparation rather than occurring naturally in the food.",
    ],
    ["Fiber", "A type of carbohydrate in plant foods that the body does not fully digest."],
    [
      "Protein",
      "A nutrient the body uses to build, maintain, and repair tissues and to make many body substances.",
    ],
    [
      "Fat",
      "A nutrient that supplies energy and helps the body absorb certain vitamins and build cells.",
    ],
    [
      "Saturated fat",
      "A type of fat found in varying amounts in animal foods and some plant oils.",
    ],
    [
      "Unsaturated fat",
      "A group of fats that are usually liquid at room temperature and are found in many plant foods and fish.",
    ],
    [
      "Portion",
      "The amount of a food or drink a person chooses to eat or drink.",
      {
        confused: {
          term: "Serving size",
          explanation:
            "A portion is the amount chosen. A serving size is the standardized amount shown on a label.",
        },
      },
    ],
    [
      "Serving size",
      "A standardized amount used to present nutrition information on a food label.",
      {
        confused: {
          term: "Portion",
          explanation:
            "Serving size organizes label information. A portion is what someone actually chooses.",
        },
      },
    ],
    [
      "Nutrition Facts label",
      "The standardized panel on packaged foods that lists serving information, nutrients, and other required details.",
    ],
    [
      "Glycemic index",
      "A system that ranks carbohydrate-containing foods by their effect on blood glucose under standardized test conditions.",
      { abbreviation: "GI" },
    ],
    [
      "Eating pattern",
      "The overall combination of foods and drinks a person usually consumes over time.",
    ],
    [
      "Meal plan",
      "A structured approach to meals and snacks developed around a person’s needs, preferences, and care plan.",
    ],
    [
      "Sodium",
      "A mineral found in salt and many foods that helps regulate fluid and nerve function.",
    ],
    [
      "Physical activity",
      "Any body movement that uses energy.",
      {
        confused: {
          term: "Exercise",
          explanation:
            "Physical activity includes everyday movement. Exercise is planned activity done to support fitness or health.",
        },
      },
    ],
    [
      "Exercise",
      "Planned physical activity done to support fitness, function, or health.",
      {
        confused: {
          term: "Physical activity",
          explanation:
            "Exercise is one kind of physical activity. Everyday movement is physical activity even when it is not a workout.",
        },
      },
    ],
    ["Aerobic activity", "Activity that raises heart rate and breathing for a period of time."],
    [
      "Resistance training",
      "Activity that makes muscles work against resistance.",
      { aliases: ["Strength training"] },
    ],
    [
      "Sedentary behavior",
      "Time spent awake while sitting, reclining, or moving very little.",
      { aliases: ["Sedentary time"] },
    ],
    [
      "Diabetes Plate Method",
      "A meal-planning visual that uses a plate to help organize nonstarchy vegetables, protein foods, and carbohydrate foods.",
      { aliases: ["Plate method"] },
    ],
    [
      "Carbohydrate serving",
      "A portion of food counted as a set amount of carbohydrate in some diabetes meal-planning approaches.",
    ],
    [
      "Net carbohydrate",
      "A marketing term sometimes calculated by subtracting fiber and certain sugar alcohols from total carbohydrate. Food labels list total carbohydrate.",
    ],
    [
      "Whole grain",
      "A grain food that contains the bran, germ, and endosperm of the grain kernel.",
    ],
    [
      "Legume",
      "A plant food in the bean, pea, or lentil family that provides carbohydrate, fiber, and protein.",
      { aliases: ["Pulses"] },
    ],
    [
      "Meal timing",
      "The usual timing of meals and snacks, which can be considered alongside medicines, activity, and glucose patterns.",
    ],
    [
      "Snack",
      "A food or drink consumed between meals. Its role in a diabetes plan depends on individual needs and treatment.",
    ],
    [
      "Food diary",
      "A record of meals, drinks, portions, and related details that can help identify nutrition and glucose patterns.",
    ],
    [
      "Hydration",
      "Getting enough fluids for the body’s needs. Fluid needs can change with illness, activity, weather, and health conditions.",
    ],
    [
      "Post-meal walk",
      "A walk after eating. Some people include this activity in a diabetes routine after discussing what is safe for them with their care team.",
    ],
  ],
);
