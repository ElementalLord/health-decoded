import { createEntries } from "./create-entries";

export const insuranceAndAppointmentTerms = createEntries(
  "Insurance, access, and appointments",
  ["SRC-CMS-TERMS", "SRC-CDC-DSMES", "SRC-CDC-PLAIN", "SRC-NIDDK-TESTS", "SRC-ADA-TERMS"],
  [
    [
      "Durable medical equipment",
      "Medical equipment intended for repeated use, such as certain home-use diabetes devices.",
      { abbreviation: "DME" },
    ],
    [
      "Sign",
      "A health finding that can be observed or measured, such as a glucose reading or a result from an exam.",
    ],
    [
      "Medication list",
      "A current list of medicines and supplements a person uses, often including names and instructions. Bringing it to diabetes visits can help the care team review treatment safely.",
    ],
    [
      "Referral",
      "A recommendation or formal request for care from another professional or service, such as diabetes education, eye care, or foot care.",
    ],
    [
      "Follow-up",
      "Care, communication, or another visit after an earlier diabetes visit, test, or treatment change.",
    ],
    [
      "Diabetes screening",
      "Testing used to look for diabetes or prediabetes before a person has a confirmed diagnosis.",
      {
        confused: {
          term: "Diagnosis",
          explanation:
            "Screening looks for possible diabetes risk or disease. Diagnosis determines whether diabetes is present using appropriate evaluation.",
        },
      },
    ],
    [
      "Diabetes preventive care",
      "Regular diabetes care intended to find or reduce risks early, such as recommended kidney, eye, and foot checks.",
    ],
    [
      "Diabetes care plan",
      "A documented approach to diabetes goals, care responsibilities, and next steps developed with a care team.",
    ],
    [
      "Diabetes self-management",
      "The day-to-day actions a person takes to manage diabetes in partnership with their care team.",
    ],
    [
      "Post-meal blood glucose",
      "A blood glucose reading taken after eating. It can help show how a meal, medicine, and activity relate to glucose.",
      { aliases: ["Postprandial glucose", "After-meal blood glucose"] },
    ],
    [
      "Glycemic variability",
      "How much glucose readings rise and fall over time, rather than the average reading alone.",
    ],
    [
      "Time below range",
      "The percentage of time sensor glucose readings are below the range selected for diabetes management.",
      { abbreviation: "TBR" },
    ],
    [
      "Dawn phenomenon",
      "A rise in blood glucose that can happen in the early morning because of normal hormone changes.",
    ],
    [
      "Glucose spike",
      "A rapid rise in blood glucose, often discussed in relation to meals, medicines, activity, or illness.",
    ],
    [
      "Glucose target",
      "A blood glucose goal chosen with a health-care team for reviewing diabetes readings.",
      { aliases: ["Glucose goal"] },
    ],
    [
      "Insulin pen",
      "A pen-shaped device that delivers insulin through a disposable or replaceable needle.",
    ],
    [
      "Insulin pump",
      "A small device that delivers insulin through tubing or a patch worn on the body according to its programmed settings.",
    ],
    [
      "Insulin injection site",
      "The place on the body where insulin is injected. A care team can explain safe site selection and rotation.",
    ],
    [
      "Correction dose",
      "An insulin dose used according to an individual care plan to address glucose that is above a chosen target.",
    ],
    [
      "Insulin-to-carbohydrate ratio",
      "Part of an individual insulin plan that relates a planned insulin amount to grams of carbohydrate in a meal or snack.",
      { aliases: ["Insulin carb ratio", "ICR"] },
    ],
    [
      "CGM alert",
      "A notification from a continuous glucose monitor about a glucose reading, trend, or device issue.",
      { aliases: ["Continuous glucose monitor alert"] },
    ],
    [
      "Fingerstick",
      "A small skin puncture, usually on a fingertip, used to obtain a drop of blood for a glucose meter.",
    ],
    [
      "Lancing device",
      "A handheld device that holds a lancet and helps make a shallow skin puncture for a blood sample.",
    ],
    [
      "Ketone meter",
      "A device that measures ketones in a blood sample using a compatible test strip.",
    ],
    [
      "Sharps container",
      "A puncture-resistant container used to dispose of used lancets, pen needles, and other sharps safely.",
    ],
    [
      "Hypoglycemia awareness",
      "The ability to notice early symptoms or signs that blood glucose may be low.",
    ],
    [
      "Hypoglycemia unawareness",
      "Reduced ability to notice early symptoms or signs of low blood glucose. A health professional can help with a personal safety plan.",
    ],
    [
      "Diabetic foot exam",
      "A foot check that looks for changes in skin, circulation, sensation, shape, and areas at risk of injury.",
    ],
    [
      "Monofilament test",
      "A foot sensation test that uses a small nylon filament to check for reduced feeling in the feet.",
    ],
    [
      "Dilated eye exam",
      "An eye examination in which drops widen the pupils so the eye-care professional can examine the retina.",
    ],
    [
      "Albuminuria",
      "Albumin in the urine, which can be a sign of kidney damage and is checked as part of diabetes kidney care.",
    ],
    [
      "Microalbuminuria",
      "A term sometimes used for a small increase in albumin in urine. Many clinicians now use the broader term albuminuria.",
      {
        confused: {
          term: "Albuminuria",
          explanation:
            "Microalbuminuria is an older term for a smaller amount of urine albumin. Albuminuria is the broader current term.",
        },
      },
    ],
    [
      "Acanthosis nigricans",
      "Darkened, thickened, velvety skin patches, often on the neck or body folds, that can occur with insulin resistance.",
    ],
    [
      "Metabolic syndrome",
      "A group of related risk factors, including high blood glucose, blood pressure, and blood fats, that can raise heart and diabetes risk.",
    ],
    [
      "Carbohydrate consistency",
      "Eating a relatively similar amount of carbohydrate at planned meals or snacks when that approach is part of a person’s diabetes plan.",
    ],
    [
      "Nonstarchy vegetable",
      "A vegetable lower in starch, such as leafy greens, broccoli, peppers, or green beans.",
      { aliases: ["Non-starchy vegetable"] },
    ],
    [
      "Glycemic load",
      "A measure that considers both a food’s glycemic index and the amount of carbohydrate in a usual portion.",
      { abbreviation: "GL" },
    ],
    [
      "Sugar alcohol",
      "A type of carbohydrate sweetener used in some foods labeled sugar-free. Its effect on blood glucose can differ by product and amount.",
    ],
    [
      "Nonnutritive sweetener",
      "A sweetener that provides little or no energy, sometimes called a high-intensity sweetener.",
      { aliases: ["Non-nutritive sweetener"] },
    ],
  ],
);
