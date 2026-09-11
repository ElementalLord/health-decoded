import type { AiCredibleSource } from "@/features/ai/types/ai";

import {
  diabetesMedicationPattern,
  dpp4MedicationPattern,
  glp1MedicationPattern,
  metforminMedicationPattern,
  sglt2MedicationPattern,
  sulfonylureaMedicationPattern,
  tzdMedicationPattern,
  // @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
} from "./medication-lexicon.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { diabetesEducationTopicPattern } from "./topic-lexicon.ts";
// @ts-expect-error -- Node's built-in TypeScript test runner requires explicit extensions.
import { normalizeAiQuery } from "./query-normalizer.ts";

export type AiCredibleSourceContext = AiCredibleSource & {
  readonly id: string;
  readonly summary: string;
};

const sources = {
  diagnosticTests: {
    id: "NIDDK-DIABETES-TESTS-DIAGNOSIS",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis",
    organization: "NIDDK",
    summary:
      "No—a high score by itself does not mean someone has diabetes, because the meaning depends on which test was used and how the result is measured. For nonpregnant adults, diabetes-range results include an A1C of 6.5% or above, fasting plasma glucose of 126 mg/dL or above, or a two-hour glucose-tolerance result of 200 mg/dL or above. A diagnosis is usually confirmed with a second test, and the tests do not determine which type of diabetes a person has.",
    title: "Diabetes Tests & Diagnosis",
  },
  a1c: {
    id: "NIDDK-A1C",
    href: "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test",
    organization: "NIDDK",
    summary:
      "The A1C test reflects average blood glucose over roughly the past three months and is used for diabetes diagnosis and management.",
    title: "The A1C Test & Diabetes",
  },
  basics: {
    id: "CDC-DIABETES-BASICS",
    href: "https://www.cdc.gov/diabetes/about/",
    organization: "CDC",
    summary:
      "Diabetes affects how the body turns food into energy; insulin helps glucose enter cells, and diabetes can involve too little insulin or reduced response to it.",
    title: "Diabetes Basics",
  },
  careSchedule: {
    id: "CDC-DIABETES-CARE-SCHEDULE",
    href: "https://www.cdc.gov/diabetes/treatment/your-diabetes-care-schedule.html",
    organization: "CDC",
    summary:
      "Regular diabetes care includes recurring appointments, laboratory tests, and preventive checks. Preparing questions and sharing concerns with the care team can help make visits more useful.",
    title: "Your Diabetes Care Schedule",
  },
  cgm: {
    id: "CDC-CONTINUOUS-GLUCOSE-MONITORS",
    href: "https://www.cdc.gov/diabetes/treatment/continuous-glucose-monitors.html",
    organization: "CDC",
    summary:
      "A continuous glucose monitor uses a sensor just under the skin to estimate glucose in the fluid between cells, updates readings every few minutes, and can show changes and trends over time.",
    title: "Continuous Glucose Monitors",
  },
  education: {
    id: "CDC-DIABETES-EDUCATION-SUPPORT",
    href: "https://www.cdc.gov/diabetes/education-support-programs/index.html",
    organization: "CDC",
    summary:
      "Diabetes self-management education and support helps people learn practical skills for everyday diabetes care, including eating, activity, medicines, monitoring, coping, and reducing risks.",
    title: "Diabetes Self-Management Education and Support",
  },
  diabetesGuide: {
    id: "NIDDK-DIABETES-GUIDE",
    href: "https://www.niddk.nih.gov/-/media/Files/Diabetes/YourGuide2Diabetes_508.pdf",
    organization: "NIDDK",
    summary:
      "Common diabetes terms include glucose or blood sugar, insulin, insulin resistance, A1C, hypoglycemia for low blood glucose, and hyperglycemia for high blood glucose.",
    title: "Your Guide to Diabetes",
  },
  exercise: {
    id: "CDC-PHYSICAL-ACTIVITY",
    href: "https://www.cdc.gov/diabetes/living-with/physical-activity.html",
    organization: "CDC",
    summary:
      "Regular physical activity is an important part of diabetes management and can help the body use insulin more effectively.",
    title: "Get Active",
  },
  healthyLiving: {
    id: "NIDDK-HEALTHY-LIVING",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/healthy-living-with-diabetes",
    organization: "NIDDK",
    summary:
      "Healthy living with diabetes includes sustainable eating, physical activity, sleep, and weight-management habits tailored with a health care team when needed.",
    title: "Healthy Living with Diabetes",
  },
  sleepAndGlucose: {
    id: "NIDDK-SLEEP-AND-GLUCOSE",
    href: "https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/the-impact-of-poor-sleep-on-type-2-diabetes",
    organization: "NIDDK",
    summary:
      "Too little or irregular sleep can reduce insulin sensitivity and glucose tolerance. When insulin works less effectively, blood glucose can be harder to manage.",
    title: "The Impact of Poor Sleep on Type 2 Diabetes",
  },
  insulinResistance: {
    id: "NIDDK-INSULIN-RESISTANCE",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance",
    organization: "NIDDK",
    summary:
      "Insulin resistance occurs when cells do not respond well to insulin, which can contribute to higher blood glucose and prediabetes.",
    title: "Insulin Resistance & Prediabetes",
  },
  medicines: {
    id: "NIDDK-DIABETES-MEDICINES",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments",
    organization: "NIDDK",
    summary:
      "Diabetes medicines work in different ways; metformin generally reduces glucose made by the liver and helps the body use insulin better.",
    title: "Insulin, Medicines, & Other Diabetes Treatments",
  },
  medicineLabels: {
    id: "FDA-MEDICINE-LABELS",
    href: "https://www.fda.gov/drugs/understanding-over-counter-medicines/over-counter-drug-facts-label",
    organization: "FDA",
    summary:
      "Medicine labels identify active ingredients, purpose, uses, warnings, directions, inactive ingredients, storage information, and expiration details. Prescription medicines may also include FDA-required patient information or a Medication Guide.",
    title: "The Over-the-Counter Drug Facts Label",
  },
  metformin: {
    id: "DAILYMED-METFORMIN-LABEL",
    href: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4d4021ba-4b28-6b81-e063-6294a90a5ea7",
    organization: "DailyMed",
    summary:
      "Metformin is an oral biguanide medicine used with diet and exercise to improve blood glucose in adults with Type 2 diabetes. It lowers glucose mainly by reducing glucose production in the liver and improving the body's response to insulin. Common side effects include diarrhea, nausea or vomiting, gas, indigestion, and abdominal discomfort.",
    title: "METFORMIN HYDROCHLORIDE Official Label",
  },
  medicationClasses: {
    id: "ADA-2026-GLUCOSE-LOWERING-MEDICATIONS",
    href: "https://diabetesjournals.org/care/article/49/Supplement_1/S183/163934/9-Pharmacologic-Approaches-to-Glycemic-Treatment",
    organization: "ADA",
    summary:
      "The ADA's 2026 standards describe multiple glucose-lowering medication classes, including metformin, SGLT2 inhibitors, DPP-4 inhibitors, GLP-1 receptor agonists, dual GIP/GLP-1 receptor agonists, sulfonylureas, thiazolidinediones, meglitinides, and insulin. The classes differ in glucose-lowering effect, low-blood-sugar risk, weight effects, heart and kidney effects, adverse effects, cost, and treatment burden.",
    title: "Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026",
  },
  mounjaro: {
    id: "FDA-MOUNJARO-LABEL",
    href: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/215866s039lbl.pdf",
    organization: "FDA",
    summary:
      "Mounjaro is the brand name for tirzepatide, a once-weekly injected medicine used with diet and exercise to improve blood glucose in people with Type 2 diabetes. It activates GIP and GLP-1 receptors, increases insulin secretion and lowers glucagon when glucose is elevated, slows stomach emptying, and can reduce food intake and body weight. Common side effects include nausea, diarrhea, reduced appetite, vomiting, constipation, indigestion, and abdominal pain.",
    title: "MOUNJARO (tirzepatide) Prescribing Information",
  },
  ozempic: {
    id: "FDA-OZEMPIC-LABEL",
    href: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/209637s025lbl.pdf",
    organization: "FDA",
    summary:
      "Ozempic contains semaglutide, a GLP-1 receptor agonist. It lowers blood glucose by increasing insulin secretion and reducing glucagon secretion when glucose is elevated. It also causes a minor delay in stomach emptying after a meal and can reduce fasting and after-meal glucose and body weight.",
    title: "OZEMPIC (semaglutide) Prescribing Information",
  },
  jardiance: {
    id: "FDA-JARDIANCE-LABEL",
    href: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/204629s063lbl.pdf",
    organization: "FDA",
    summary:
      "Jardiance contains empagliflozin, an SGLT2 inhibitor. SGLT2 normally returns filtered glucose from the kidneys to the bloodstream. Blocking it reduces glucose reabsorption and increases the amount of glucose passed in urine; the medicine also reduces sodium reabsorption.",
    title: "JARDIANCE (empagliflozin) Prescribing Information",
  },
  januvia: {
    id: "DAILYMED-JANUVIA-LABEL",
    href: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1b03c82f-b52e-4092-b9dc-f2c9b0d6ab40",
    organization: "DailyMed",
    summary:
      "Januvia contains sitagliptin, a DPP-4 inhibitor. It slows the inactivation of incretin hormones, prolonging signals that increase insulin release and reduce glucagon when glucose is normal or elevated. Those changes are associated with lower fasting and after-meal glucose.",
    title: "JANUVIA (sitagliptin) Official Label",
  },
  glipizide: {
    id: "DAILYMED-GLIPIZIDE-LABEL",
    href: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5ca7e38b-84cb-4043-b97e-e2f5cd82b442",
    organization: "DailyMed",
    summary:
      "Glipizide is an oral glucose-lowering medicine in the sulfonylurea class. Its main short-term action is stimulating insulin release from functioning beta cells in the pancreas, especially in response to a meal. The official label notes that its long-term glucose-lowering mechanism is not fully established.",
    title: "GLIPIZIDE Official Label",
  },
  pioglitazone: {
    id: "DAILYMED-PIOGLITAZONE-LABEL",
    href: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=060e3169-46a7-419d-9acc-05586cb2406b",
    organization: "DailyMed",
    summary:
      "Pioglitazone is a thiazolidinedione that works only when insulin is present. It reduces insulin resistance in the body's tissues and liver, which helps tissues use glucose and reduces glucose output from the liver. It does not directly stimulate insulin secretion.",
    title: "PIOGLITAZONE Official Label",
  },
  mentalHealth: {
    id: "CDC-DIABETES-MENTAL-HEALTH",
    href: "https://www.cdc.gov/diabetes/living-with/mental-health.html",
    organization: "CDC",
    summary:
      "Stress hormones can make blood glucose rise or fall unpredictably, and the ongoing work of diabetes care can itself be a source of stress. Activity, relaxation, connection, and adequate sleep can support coping.",
    title: "Diabetes and Mental Health",
  },
  monitoring: {
    id: "CDC-MONITORING-BLOOD-SUGAR",
    href: "https://www.cdc.gov/diabetes/diabetes-testing/monitoring-blood-sugar.html",
    organization: "CDC",
    summary:
      "Blood glucose can change throughout the day in response to factors such as food, medicines, and physical activity. A meter measures one moment, while regular monitoring can reveal patterns over time.",
    title: "Monitoring Your Blood Sugar",
  },
  management: {
    id: "NIDDK-MANAGING-DIABETES",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/managing-diabetes",
    organization: "NIDDK",
    summary:
      "Diabetes management can include blood glucose, blood pressure, and cholesterol; food, activity, weight, sleep, mental health, medicines, monitoring, planning for special situations, and preventive care. Managing these areas can help reduce the chance of heart, eye, kidney, nerve, and foot problems.",
    title: "Managing Diabetes",
  },
  lowBloodSugar: {
    id: "CDC-LOW-BLOOD-SUGAR",
    href: "https://www.cdc.gov/diabetes/about/low-blood-sugar-hypoglycemia.html",
    organization: "CDC",
    summary:
      "Hypoglycemia means blood glucose is below the healthy range. It can be related to insulin or some other diabetes medicines, eating fewer carbohydrates than planned, activity, alcohol, illness, or schedule changes. Symptoms can include shaking, sweating, hunger, dizziness, confusion, weakness, or a fast heartbeat; severe low blood glucose is an emergency.",
    title: "Low Blood Sugar (Hypoglycemia)",
  },
  sickDays: {
    id: "CDC-DIABETES-SICK-DAYS",
    href: "https://www.cdc.gov/diabetes/living-with/managing-sick-days.html",
    organization: "CDC",
    summary:
      "Illness can make diabetes harder to manage because stress hormones can raise blood glucose, while eating or drinking less can create other risks. A sick-day plan commonly covers monitoring, hydration, food, medicines, ketones when relevant, and signs that require urgent care. Individual medication instructions must come from a person's established plan.",
    title: "Managing Sick Days",
  },
  kidneyHealth: {
    id: "NIDDK-DIABETIC-KIDNEY-DISEASE",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/diabetic-kidney-disease",
    organization: "NIDDK",
    summary:
      "Diabetes can damage kidney blood vessels over time. Diabetic kidney disease often has no early symptoms, so blood and urine tests are used to check kidney filtering and urine albumin. Managing blood glucose and blood pressure and following healthy habits can help prevent or slow kidney damage.",
    title: "Diabetic Kidney Disease",
  },
  nerveHealth: {
    id: "NIDDK-DIABETIC-NEUROPATHY",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/nerve-damage-diabetic-neuropathies/what-is-diabetic-neuropathy",
    organization: "NIDDK",
    summary:
      "Diabetic neuropathy is nerve damage caused by diabetes. Peripheral neuropathy often affects the feet and legs; autonomic neuropathy can affect organs and the ability to sense low blood glucose. Over time, high blood glucose and blood fats can damage nerves and the small blood vessels that nourish them. Foot care and management of glucose, blood pressure, and cholesterol can reduce risk.",
    title: "What Is Diabetic Neuropathy?",
  },
  eyeHealth: {
    id: "NIDDK-DIABETIC-EYE-DISEASE",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/diabetic-eye-disease",
    organization: "NIDDK",
    summary:
      "Diabetic eye disease includes several eye problems that can affect people with diabetes, including diabetic retinopathy, diabetic macular edema, cataracts, and glaucoma. High blood glucose can damage small blood vessels in the retina over time. Regular dilated eye exams can find disease early, when treatment may be more effective.",
    title: "Diabetic Eye Disease",
  },
  heartHealth: {
    id: "NIDDK-DIABETES-HEART-STROKE",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/heart-disease-stroke",
    organization: "NIDDK",
    summary:
      "Diabetes raises the chance of heart disease and stroke. High blood glucose can damage blood vessels and the nerves controlling them over time. Blood pressure, cholesterol, smoking, kidney disease, weight, activity, and family history also affect risk. Managing glucose, blood pressure, cholesterol, and smoking can help protect heart and blood vessels.",
    title: "Diabetes, Heart Disease, & Stroke",
  },
  oralHealth: {
    id: "NIDDK-DIABETES-ORAL-HEALTH",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/gum-disease-dental-problems",
    organization: "NIDDK",
    summary:
      "Diabetes can increase the risk of gum disease, cavities, dry mouth, thrush, and other mouth problems. High blood glucose can increase glucose in saliva and contribute to harmful bacteria and plaque. Regular dental care and daily care of teeth and gums can help prevent problems or keep them from worsening.",
    title: "Diabetes, Gum Disease, & Other Dental Problems",
  },
  sexualBladderHealth: {
    id: "NIDDK-DIABETES-SEXUAL-BLADDER",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/sexual-bladder-problems",
    organization: "NIDDK",
    summary:
      "Diabetes-related changes in blood vessels, nerves, hormones, and emotional health can contribute to sexual or bladder problems. General risk reduction includes managing blood glucose, blood pressure, cholesterol, weight, activity, smoking, and emotional health. New personal symptoms need individual assessment because they can have multiple causes.",
    title: "Diabetes, Sexual, & Bladder Problems",
  },
  travel: {
    id: "CDC-TRAVEL-WITH-DIABETES",
    href: "https://www.cdc.gov/diabetes/about/tips-for-traveling-with-diabetes.html",
    organization: "CDC",
    summary:
      "Travel planning with diabetes can include packing extra medicines and supplies, keeping medicines and monitoring equipment accessible, accounting for storage needs, carrying fast-acting carbohydrate, maintaining food and hydration routines, and planning for time-zone or schedule changes without improvising medication doses.",
    title: "Tips for Traveling With Diabetes",
  },
  riskFactors: {
    id: "NIDDK-TYPE-2-RISK-FACTORS",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview/risk-factors-type-2-diabetes",
    organization: "NIDDK",
    summary:
      "Type 2 diabetes risk reflects a combination of factors rather than one cause. Factors can include family history, age, activity, body weight and fat distribution, prior gestational diabetes, and some health conditions. Some factors cannot be changed, while sustainable activity and weight-related changes may lower risk for some people.",
    title: "Risk Factors for Type 2 Diabetes",
  },
  nutrition: {
    id: "CDC-HEALTHY-EATING",
    href: "https://www.cdc.gov/diabetes/healthy-eating/",
    organization: "CDC",
    summary:
      "Food choices and meal patterns can affect blood glucose, and healthy eating is a core part of living well with diabetes.",
    title: "Healthy Eating",
  },
  mealPlanning: {
    id: "CDC-DIABETES-MEAL-PLANNING",
    href: "https://www.cdc.gov/diabetes/healthy-eating/diabetes-meal-planning.html",
    organization: "CDC",
    summary:
      "The body breaks many carbohydrates into glucose, so carbohydrate-containing foods can raise blood glucose. The plate method uses half nonstarchy vegetables, one quarter lean protein, and one quarter carbohydrate foods as a visual meal-planning starting point.",
    title: "Diabetes Meal Planning",
  },
  fiber: {
    id: "CDC-FIBER-AND-DIABETES",
    href: "https://www.cdc.gov/diabetes/healthy-eating/fiber-helps-diabetes.html",
    organization: "CDC",
    summary:
      "Fiber is a carbohydrate the body does not absorb and break down, so it does not cause a blood glucose spike in the same way as many other carbohydrates. Fiber also supports digestion, fullness, and heart health.",
    title: "Fiber: The Carb That Helps You Manage Diabetes",
  },
  overview: {
    id: "NIDDK-DIABETES-OVERVIEW",
    href: "https://www.niddk.nih.gov/health-information/diabetes/overview",
    organization: "NIDDK",
    summary:
      "Diabetes occurs when blood glucose is too high; the NIDDK overview covers causes, testing, management, healthy living, and prevention of complications.",
    title: "Diabetes Overview",
  },
} as const satisfies Record<string, AiCredibleSourceContext>;

function uniqueSources(selected: readonly AiCredibleSourceContext[]) {
  return [...new Map(selected.map((source) => [source.href, source])).values()].slice(0, 3);
}

/** Selects authoritative patient-education references relevant to a general question. */
export function credibleSourcesForQuestion(message: string): readonly AiCredibleSourceContext[] {
  const normalized = normalizeAiQuery(message);

  const requiresSpecializedOrCurrentEvidence =
    /\b(?:latest|newest|current|202\d)\b.{0,60}\b(?:trial|drug|device|guideline|research|firmware|therapy|model|recommendation)s?\b|\b(?:pharmacokinetic|algorithm|firmware|genetics?|gene therap(?:y|ies)|transplant|antibiotic|surgery guideline|eligibility criteria|thresholds?|renal failure)\b/i;
  if (requiresSpecializedOrCurrentEvidence.test(message)) {
    return [];
  }

  const selected: AiCredibleSourceContext[] = [];
  const addWhen = (matches: boolean, source: AiCredibleSourceContext) => {
    if (matches) selected.push(source);
    return matches;
  };

  const vagueDiagnosticScore = addWhen(
    /\b(?:high|elevated|abnormal|positive)\s+(?:score|result|number|reading)\b.{0,80}\b(?:diabetes|diabetic|prediabetes|prediabetic)\b|\b(?:diabetes|diabetic|prediabetes|prediabetic)\b.{0,80}\b(?:score|result|number|reading)\b/.test(
      normalized,
    ),
    sources.diagnosticTests,
  );
  const a1c = addWhen(/\b(a1c|hba1c|hemoglobin a1c)\b/.test(normalized), sources.a1c);
  const cgm = addWhen(/\b(continuous glucose monitor|cgm)\b/.test(normalized), sources.cgm);
  const emotional = addWhen(
    /\b(stress|stressed|anxiety|anxious|mental health|diabetes distress)\b/.test(normalized),
    sources.mentalHealth,
  );
  const sleep = addWhen(
    /\b(sleep|sleeping|rest|circadian)\b/.test(normalized),
    sources.sleepAndGlucose,
  );
  const care = addWhen(
    /\b(checkups?|check-ups?|appointments?|healthcare visits?|health care visits?|doctor visits?|care team)\b/.test(
      normalized,
    ),
    sources.careSchedule,
  );
  const education = addWhen(
    /\b(diabetes education|self-management education|dsmes|learn about diabetes)\b/.test(
      normalized,
    ),
    sources.education,
  );
  addWhen(
    /\b(common diabetes terms?|diabetes terms?|hypoglycemia and hyperglycemia)\b/.test(normalized),
    sources.diabetesGuide,
  );
  const caregiver = addWhen(
    /\b(caregiver|care partner|spouse|partner|family support|supporting someone|help someone)\b/.test(
      normalized,
    ),
    sources.education,
  );
  const insulinResistance = addWhen(
    /\b(insulin (?:resistance|sensitivity)|prediabetes)\b/.test(normalized),
    sources.insulinResistance,
  );

  if (/\b(mounjaro|tirzepatide|zepbound)\b/.test(normalized)) {
    selected.push(sources.mounjaro);
  } else if (glp1MedicationPattern.test(normalized)) {
    selected.push(sources.ozempic);
  }
  addWhen(sglt2MedicationPattern.test(normalized), sources.jardiance);
  addWhen(dpp4MedicationPattern.test(normalized), sources.januvia);
  addWhen(sulfonylureaMedicationPattern.test(normalized), sources.glipizide);
  addWhen(tzdMedicationPattern.test(normalized), sources.pioglitazone);
  addWhen(metforminMedicationPattern.test(normalized), sources.metformin);
  const insulinBasics = addWhen(
    /\b(?:how does insulin help|what does insulin do|role of (?:the )?insulin|insulin helps? (?:the )?(?:body|cells?))\b/.test(
      normalized,
    ),
    sources.basics,
  );
  addWhen(/\binsulin\b/.test(normalized) && !insulinBasics, sources.medicines);
  addWhen(
    /\b(?:medicine|medication|prescription|drug) labels?\b/.test(normalized),
    sources.medicineLabels,
  );
  const generalMedication = addWhen(
    /\b(medicine|medication|prescription|drug)s?\b/.test(normalized) &&
      !diabetesMedicationPattern.test(
        normalized.replace(/\b(medicine|medication|prescription|drug)s?\b/g, ""),
      ),
    sources.medicationClasses,
  );

  const lowBloodSugar = addWhen(
    /\b(hypoglyc(?:emia|emic)|low blood (?:glucose|sugar)|blood (?:glucose|sugar) (?:drop|crash|low)|glucagon)\b/.test(
      normalized,
    ),
    sources.lowBloodSugar,
  );
  const sickDays = addWhen(
    /\b(sick day|illness|fever|infection|cold|flu|dehydration|ketones?)\b/.test(normalized),
    sources.sickDays,
  );
  addWhen(
    /\b(kidneys?|renal|urine albumin|albuminuria|egfr|nephropathy)\b/.test(normalized),
    sources.kidneyHealth,
  );
  addWhen(
    /\b(neuropathy|nerve damage|numbness|tingling|foot care|feet|foot ulcer)\b/.test(normalized),
    sources.nerveHealth,
  );
  addWhen(
    /\b(eyes?|vision|retina|retinopathy|cataracts?|glaucoma)\b/.test(normalized),
    sources.eyeHealth,
  );
  addWhen(
    /\b(heart|cardiovascular|stroke|blood pressure|cholesterol|triglycerides?)\b/.test(normalized),
    sources.heartHealth,
  );
  addWhen(
    /\b(teeth|tooth|gums?|dental|dentist|mouth|oral health|dry mouth|thrush)\b/.test(normalized),
    sources.oralHealth,
  );
  addWhen(
    /\b(sexual|sex life|erectile|erection|libido|bladder|urination|urinary)\b/.test(normalized),
    sources.sexualBladderHealth,
  );
  addWhen(
    /\b(travel|trip|vacation|airport|flying|flight|time zone)\b/.test(normalized),
    sources.travel,
  );
  const prevention = addWhen(
    /\b(risk factors?|prevent(?:ion|ing)?|family history|gestational diabetes)\b/.test(normalized),
    sources.riskFactors,
  );
  const healthyLiving = addWhen(
    /\b(weight|overweight|obesity|bmi|waist|smok(?:e|ing)|tobacco|alcohol)\b/.test(normalized),
    sources.healthyLiving,
  );
  const exercise = addWhen(
    /\b(exercise|walk|walking|movement|workout|active|activity)\b/.test(normalized),
    sources.exercise,
  );
  const nutrition = addWhen(
    /\b(food|meal|eat|eating|carbs?|carbohydrates?|nutrition|fruit|bread|plate|serving size|added sugars?|total sugars?|fiber|food label|nutrition facts)\b/.test(
      normalized,
    ),
    sources.nutrition,
  );
  addWhen(
    /\b(carbs?|carbohydrates?|balanced plate|plate method|meals? affect|food has carbohydrates?)\b/.test(
      normalized,
    ),
    sources.mealPlanning,
  );
  addWhen(/\bfiber\b/.test(normalized), sources.fiber);
  const monitoring = addWhen(
    /\b(monitor|monitoring|meter|fingerstick|throughout the day|change during the day)\b/.test(
      normalized,
    ),
    sources.monitoring,
  );

  if (a1c || cgm || lowBloodSugar || sickDays || monitoring) selected.push(sources.monitoring);
  if (vagueDiagnosticScore) selected.push(sources.a1c);
  if (generalMedication) selected.push(sources.medicines);
  if (
    emotional ||
    sleep ||
    insulinResistance ||
    prevention ||
    healthyLiving ||
    exercise ||
    nutrition
  ) {
    selected.push(sources.healthyLiving);
  }
  if (care || education || caregiver) selected.push(sources.education);

  const generalDiabetes = diabetesEducationTopicPattern.test(normalized);
  if (selected.length > 0 || generalDiabetes) {
    selected.push(sources.management, sources.overview, sources.basics);
  }

  return uniqueSources(selected);
}

/**
 * Gives the current question first claim on the evidence budget. Earlier turns
 * are used only to resolve short follow-ups such as "How does it work?".
 */
export function credibleSourcesForConversation({
  message,
  priorUserMessages = [],
}: {
  readonly message: string;
  readonly priorUserMessages?: readonly string[];
}): readonly AiCredibleSourceContext[] {
  const currentQuestionSources = credibleSourcesForQuestion(message);
  const explicitReference =
    /\b(it|its|this|that|they|them|those|the same (?:one|thing)|the medicine|the medication)\b/i.test(
      message,
    );
  const vagueFollowUp =
    /^(?:and\b|also\b|but\b|what about\b|how about\b|why\??$|how\??$|tell me more\b|can you explain (?:more|that)\b|(?:say|explain) that another way\b|(?:make|say) it simpler\b)/i.test(
      message.trim(),
    );

  // A complete new question is a topic shift. Earlier evidence is eligible only
  // when this turn actually depends on it to resolve a reference.
  if (!explicitReference && !(currentQuestionSources.length === 0 && vagueFollowUp)) {
    return currentQuestionSources;
  }

  const priorContextSources = credibleSourcesForQuestion(priorUserMessages.slice(-2).join(" "));

  return uniqueSources([...currentQuestionSources, ...priorContextSources]);
}

export function publicCredibleSources(
  selected: readonly AiCredibleSourceContext[],
): readonly AiCredibleSource[] {
  return selected.map(({ href, organization, title }) => ({ href, organization, title }));
}
