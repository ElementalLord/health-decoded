import { createEntries } from "./create-entries";

export const urgentAndLongTermTerms = createEntries(
  "Urgent and long-term health",
  ["SRC-NIDDK-OVERVIEW", "SRC-NIDDK-KIDNEY", "SRC-ADA-TERMS"],
  [
    [
      "Severe hypoglycemia",
      "Hypoglycemia serious enough that a person needs help from someone else to recover.",
    ],
    [
      "Diabetic ketoacidosis",
      "A medical emergency caused by a dangerous buildup of ketones and acid in the blood.",
      {
        abbreviation: "DKA",
        confused: {
          term: "Hyperosmolar hyperglycemic state",
          explanation:
            "DKA involves substantial ketone and acid buildup. HHS usually involves extreme dehydration and very high glucose with little or no major ketoacidosis.",
        },
      },
    ],
    [
      "Hyperosmolar hyperglycemic state",
      "A medical emergency involving very high blood glucose and severe dehydration, usually with little or no major ketoacidosis.",
      {
        abbreviation: "HHS",
        confused: {
          term: "Diabetic ketoacidosis",
          explanation:
            "HHS is marked mainly by extreme glucose elevation and dehydration. DKA is marked by ketone and acid buildup.",
        },
      },
    ],
    ["Dehydration", "A state in which the body has lost more fluid than it has taken in."],
    [
      "Sick-day management",
      "Instructions created with a health-care team for managing diabetes during illness.",
      { aliases: ["Sick-day plan"] },
    ],
    [
      "Emergency department",
      "A hospital department equipped to evaluate and treat medical emergencies.",
      { abbreviation: "ED", aliases: ["Emergency room", "ER"] },
    ],
    [
      "Urgent care",
      "A setting for prompt evaluation of concerns that need timely attention but may not require an emergency department.",
    ],
    [
      "Loss of consciousness",
      "A state in which a person is not awake and cannot respond normally.",
    ],
    [
      "Cardiovascular disease",
      "A group of conditions affecting the heart and blood vessels.",
      { abbreviation: "CVD" },
    ],
    [
      "Heart attack",
      "Damage to heart muscle caused by a sudden loss or major reduction of its blood supply.",
      { aliases: ["Myocardial infarction"] },
    ],
    ["Stroke", "Brain injury caused by blocked blood flow or bleeding in the brain."],
    [
      "Chronic kidney disease",
      "Long-term kidney damage or reduced kidney function.",
      { abbreviation: "CKD" },
    ],
    [
      "Diabetic kidney disease",
      "Kidney disease caused by diabetes.",
      { abbreviation: "DKD", aliases: ["Diabetic nephropathy", "Kidney disease of diabetes"] },
    ],
    [
      "Retinopathy",
      "Disease or damage affecting the retina, the light-sensing tissue at the back of the eye.",
    ],
    ["Diabetic retinopathy", "Damage to blood vessels in the retina associated with diabetes."],
    [
      "Macular edema",
      "Swelling in the macula, the central part of the retina used for detailed vision.",
    ],
    ["Neuropathy", "Damage or disease affecting nerves."],
    [
      "Peripheral neuropathy",
      "Nerve damage affecting areas away from the center of the body, often the feet, legs, hands, or arms.",
    ],
    [
      "Foot ulcer",
      "An open sore on the foot that may be slow to heal and needs professional evaluation.",
    ],
    ["Amputation", "Surgical removal of all or part of a limb or other body part."],
    [
      "Periodontal disease",
      "Infection and inflammation affecting the gums and structures that support the teeth.",
      { aliases: ["Gum disease"] },
    ],
    [
      "Sleep apnea",
      "A condition in which breathing repeatedly stops or becomes shallow during sleep.",
    ],
    [
      "Metabolic dysfunction-associated steatotic liver disease",
      "A condition involving excess fat in the liver associated with metabolic risk factors.",
      { abbreviation: "MASLD", aliases: ["Fatty liver disease"] },
    ],
    [
      "Charcot foot",
      "A rare but serious diabetes-related foot problem in which reduced sensation and inflammation can weaken bones and joints in the foot.",
    ],
    [
      "Peripheral artery disease",
      "Narrowing of arteries that reduces blood flow, often in the legs or feet. Diabetes can increase the risk.",
      { abbreviation: "PAD" },
    ],
    [
      "Diabetic gastroparesis",
      "Delayed movement of food from the stomach that can occur when diabetes-related nerve damage affects digestion.",
    ],
    [
      "Autonomic neuropathy",
      "Nerve damage that affects automatic body functions such as digestion, heart rate, blood pressure, or bladder function.",
    ],
    [
      "Erectile dysfunction",
      "Difficulty getting or keeping an erection. It can have many causes, including blood vessel or nerve changes related to diabetes.",
    ],
    [
      "Hypoglycemia treatment",
      "The steps in an individual diabetes safety plan for treating low blood glucose, including when to get urgent help.",
    ],
    [
      "Hyperglycemia symptoms",
      "Possible signs of high blood glucose, such as increased thirst, urination, or tiredness. These symptoms can have other causes.",
    ],
    [
      "Diabetes-related infection",
      "An infection that may need added attention in diabetes care because illness can affect glucose and healing.",
    ],
    [
      "Dental exam",
      "A checkup with a dental professional to examine teeth, gums, and oral health. Gum health is an important part of diabetes care.",
    ],
    [
      "Foot self-check",
      "Looking at the feet regularly for cuts, sores, redness, swelling, or other changes to share with a care team.",
    ],
  ],
);
