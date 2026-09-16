import type { AiCredibleSourceContext } from "./credible-sources";
// @ts-expect-error -- Node's TypeScript test runner needs explicit extensions.
import { normalizeAiQuery } from "./query-normalizer.ts";
// @ts-expect-error -- Node's TypeScript test runner needs explicit extensions.
import { definitionSubjectFor } from "./question-intent.ts";

/** Locally bundled educational explanations. These links document provenance;
 * no page is fetched at runtime. Content checked against the listed sources
 * on 2026-09-15. Individual treatment decisions are outside this library. */
const references = {
  steroids: [
    "Diabetes UK",
    "https://www.diabetes.org.uk/about-diabetes/other-types-of-diabetes/steroid-induced-diabetes",
  ],
  immune: [
    "CDC",
    "https://www.cdc.gov/diabetes/diabetes-complications/diabetes-immune-system.html",
  ],
  flu: ["CDC", "https://www.cdc.gov/flu/highrisk/diabetes.html"],
  driving: [
    "ADA",
    "https://diabetesjournals.org/care/article/47/11/1889/157262/Diabetes-and-Driving-A-Statement-of-the-American",
  ],
  doubleDiabetes: [
    "ADA",
    "https://diabetes.org/living-with-diabetes/type-1/can-you-have-insulin-resistance-and-type-1-diabetes",
  ],
  hhs: [
    "Diabetes UK",
    "https://www.diabetes.org.uk/about-diabetes/looking-after-diabetes/complications/hyperosmolar-hyperglycaemic-state",
  ],
  surgeryMetabolic: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/weight-management/bariatric-surgery/definition-facts",
  ],
  supplements: ["ADA", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7011201/"],
  celiac: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis",
  ],
  autoimmuneThyroid: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/endocrine-diseases/hashimotos-disease",
  ],
  heat: ["CDC", "https://www.cdc.gov/diabetes/articles/managing-diabetes-in-the-heat.html"],
  femaleHormones: ["ADA", "https://diabetes.org/health-wellness/how-diabetes-impacts-women-health"],
  menopause: [
    "Diabetes UK",
    "https://www.diabetes.org.uk/living-with-diabetes/life-with-diabetes/menopause",
  ],

  monogenic: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/monogenic-neonatal-mellitus-mody",
  ],
  lada: ["ADA", "https://diabetes.org/about-diabetes/lada"],
  type3c: [
    "Diabetes UK",
    "https://www.diabetes.org.uk/about-diabetes/other-types-of-diabetes/type3c-diabetes",
  ],
  cfrd: [
    "Cystic Fibrosis Foundation",
    "https://www.cff.org/managing-cf/cystic-fibrosis-related-diabetes",
  ],
  pregnancy: ["NIDDK", "https://www.niddk.nih.gov/health-information/diabetes/diabetes-pregnancy"],
  gestationalDetail: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/gestational",
  ],
  school: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/diabetes/helping-student-diabetes-succeed-guide-school-personnel",
  ],
  youth: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/unique-challenges-youth-diabetes",
  ],
  older: [
    "ADA",
    "https://diabetesjournals.org/care/article/49/Supplement_1/S277/163921/13-Older-Adults-Standards-of-Care-in-Diabetes-2026",
  ],
  autonomic: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/nerve-damage-diabetic-neuropathies/autonomic-neuropathy",
  ],
  gastroparesis: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/how-gastroparesis-affect-people-with-diabetes",
  ],
  dka: ["CDC", "https://www.cdc.gov/diabetes/about/diabetic-ketoacidosis.html"],
  ramadan: [
    "Diabetes UK",
    "https://www.diabetes.org.uk/about-diabetes/looking-after-diabetes/ramadan",
  ],
  hospital: ["ADA", "https://doi.org/10.2337/dc26-s016"],
  autoantibodies: [
    "CDC",
    "https://www.cdc.gov/diabetes/diabetes-testing/screening-type-1-diabetes.html",
  ],
  meterSafe: [
    "FDA",
    "https://www.fda.gov/consumers/consumer-updates/how-safely-use-glucose-meters-and-test-strips-diabetes",
  ],
  meterAccuracy: [
    "FDA",
    "https://www.fda.gov/medical-devices/home-health-and-consumer-devices/home-healthcare-medical-devices-blood-glucose-meters-getting-most-out-your-meter",
  ],
  stripCompatibility: [
    "FDA",
    "https://www.fda.gov/medical-devices/blood-glucose-monitoring-devices/users-blood-glucose-meters-must-use-only-test-strip-recommended-use-their-meter",
  ],

  dawn: ["ADA", "https://diabetes.org/living-with-diabetes/high-morning-blood-glucose"],
  remission: [
    "ADA",
    "https://diabetes.org/newsroom/international-experts-outline-diabetes-remission-diagnosis-criteria",
  ],
  timeInRange: ["ADA", "https://diabetes.org/about-diabetes/devices-technology/cgm-time-in-range"],
  unawareness: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/low-blood-glucose-hypoglycemia",
  ],
  intenseActivity: [
    "ADA",
    "https://diabetes.org/health-wellness/fitness/why-does-exercise-sometimes-raise-blood-sugar",
  ],
  storage: [
    "FDA",
    "https://www.fda.gov/drugs/emergency-preparedness-drugs/information-regarding-insulin-storage-and-switching-between-products-emergency",
  ],
  high: ["ADA", "https://diabetes.org/living-with-diabetes/treatment-care/hyperglycemia"],
  types: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes",
  ],
  causes: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/symptoms-causes",
  ],
  resistance: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance",
  ],
  diagnosis: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis",
  ],
  a1c: ["NIDDK", "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test"],
  monitoring: ["CDC", "https://www.cdc.gov/diabetes/treatment/index.html"],
  cgm: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/managing-diabetes/continuous-glucose-monitoring",
  ],
  carbs: [
    "CDC",
    "https://www.cdc.gov/diabetes/healthy-eating/carb-counting-manage-blood-sugar.html",
  ],
  meals: ["CDC", "https://www.cdc.gov/diabetes/healthy-eating/diabetes-meal-planning.html"],
  fiber: ["CDC", "https://www.cdc.gov/diabetes/healthy-eating/fiber-helps-diabetes.html"],
  living: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/healthy-living-with-diabetes",
  ],
  activity: ["CDC", "https://www.cdc.gov/diabetes/living-with/physical-activity.html"],
  sleep: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/the-impact-of-poor-sleep-on-type-2-diabetes",
  ],
  emotions: ["CDC", "https://www.cdc.gov/diabetes/living-with/mental-health.html"],
  low: ["CDC", "https://www.cdc.gov/diabetes/about/low-blood-sugar-hypoglycemia.html"],
  lowTreatment: [
    "CDC",
    "https://www.cdc.gov/diabetes/treatment/treatment-low-blood-sugar-hypoglycemia.html",
  ],
  sick: ["CDC", "https://www.cdc.gov/diabetes/living-with/managing-sick-days.html"],
  insulin: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments",
  ],
  metformin: [
    "DailyMed",
    "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4d4021ba-4b28-6b81-e063-6294a90a5ea7",
  ],
  glp1: ["FDA", "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/209637s025lbl.pdf"],
  gip: ["FDA", "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/215866s039lbl.pdf"],
  sglt2: ["FDA", "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/204629s063lbl.pdf"],
  dpp4: [
    "DailyMed",
    "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1b03c82f-b52e-4092-b9dc-f2c9b0d6ab40",
  ],
  sulfonylurea: [
    "DailyMed",
    "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5ca7e38b-84cb-4043-b97e-e2f5cd82b442",
  ],
  tzd: [
    "DailyMed",
    "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=060e3169-46a7-419d-9acc-05586cb2406b",
  ],
  kidney: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/diabetic-kidney-disease",
  ],
  eyes: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/diabetic-eye-disease",
  ],
  nerves: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/nerve-damage-diabetic-neuropathies/what-is-diabetic-neuropathy",
  ],
  feet: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/foot-problems",
  ],
  heart: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/heart-disease-stroke",
  ],
  mouth: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/gum-disease-dental-problems",
  ],
  sexual: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/sexual-bladder-problems",
  ],
  travel: ["CDC", "https://www.cdc.gov/diabetes/about/tips-for-traveling-with-diabetes.html"],
  management: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/managing-diabetes",
  ],
  prevention: [
    "NIDDK",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-type-2-diabetes/game-plan",
  ],
  education: ["CDC", "https://www.cdc.gov/diabetes/education-support-programs/index.html"],
} as const;

type KnowledgeSeed = readonly [
  slug: string,
  title: string,
  reference: keyof typeof references,
  keywords: readonly string[],
  questions: readonly string[],
  answer: string,
];
const seeds: readonly KnowledgeSeed[] = [
  [
    "diabetes-meaning",
    "Diabetes",
    "types",
    ["diabetes", "diabetic"],
    ["What is diabetes?"],
    "Diabetes means glucose, also called blood sugar, stays too high because your body does not make enough insulin or does not use insulin effectively. Insulin helps glucose enter cells to provide energy. The different types have different causes, but managing glucose and looking after your overall health can reduce long-term complications. If you know which type you have, I can explain what that means in more detail.",
  ],
  [
    "type2-meaning",
    "Type 2 diabetes",
    "types",
    ["type 2", "type two", "t2d", "insulin resistance"],
    ["What is type 2 diabetes?"],
    "Type 2 diabetes means your body does not respond to insulin as well as it should, and over time it may not make enough insulin to keep up. Insulin helps glucose move from your blood into cells for energy, so glucose can build up in your blood. Managing it involves food, activity, glucose checks, and sometimes medicines to keep glucose in a suitable range and reduce long-term complications.",
  ],
  [
    "dawn",
    "Dawn phenomenon and morning glucose",
    "dawn",
    ["dawn phenomenon", "morning", "overnight", "liver", "before breakfast", "wake up", "waking"],
    ["What is the dawn phenomenon?", "Why can blood sugar be high in the morning without eating?"],
    "The dawn phenomenon is an early-morning glucose rise caused by hormones signaling the liver to release glucose. Diabetes can make it harder for insulin to counter that rise. Overnight glucose records help distinguish this from other causes of morning highs.",
  ],
  [
    "morning-patterns",
    "Different causes of morning highs",
    "dawn",
    ["morning", "bedtime", "overnight", "insulin"],
    ["Is every morning high caused by the dawn phenomenon?"],
    "Not every morning high is the dawn phenomenon. Evening food, insufficient overnight insulin coverage, and other factors can contribute. Bedtime and overnight readings help identify patterns, rather than assuming the cause or changing insulin from one reading.",
  ],
  [
    "remission",
    "Type 2 diabetes remission",
    "remission",
    ["remission", "reverse", "cure", "reversed"],
    ["What does diabetes remission mean?", "Does remission mean diabetes is permanently cured?"],
    "Type 2 diabetes remission means glucose stays below the diabetes threshold without usual glucose-lowering medication for at least three months. It is not a guaranteed permanent cure. Ongoing glucose and complication checks remain important; medication stopping requires a clinical plan.",
  ],
  [
    "remission-criterion",
    "How remission is assessed",
    "remission",
    ["remission", "6.5", "three months", "a1c"],
    ["How do clinicians assess type 2 diabetes remission?"],
    "The usual consensus criterion for Type 2 remission is A1C below 6.5% sustained for at least three months without usual glucose-lowering medicines. Alternative measurements may be needed when A1C is unreliable. This is a clinical assessment, not an instruction to stop treatment.",
  ],
  [
    "time-in-range",
    "CGM time in range",
    "timeInRange",
    ["time in range", "tir", "70", "180", "cgm"],
    ["What is time in range?", "How is time in range different from A1C?"],
    "Time in range is the percentage of time glucose stays within a defined target range, often 70–180 mg/dL for many adults. Unlike A1C's average, CGM reports also show time spent high or low. Targets are individualized.",
  ],
  [
    "unawareness",
    "Hypoglycemia unawareness",
    "unawareness",
    ["unawareness", "low", "symptoms", "no warning"],
    ["What is hypoglycemia unawareness?", "Can low blood sugar happen without warning symptoms?"],
    "Hypoglycemia unawareness means someone does not reliably notice warning symptoms as glucose falls. Repeated lows can contribute. Glucose monitoring, appropriate alerts, and an individualized prevention plan become especially important because feeling well does not prove glucose is safe.",
  ],
  [
    "exercise-high",
    "Why intense exercise can raise glucose",
    "intenseActivity",
    ["exercise", "sprints", "weightlifting", "adrenaline", "workout"],
    ["Why can blood sugar rise after intense exercise?", "Does exercise always lower blood sugar?"],
    "Intense activity such as sprinting or heavy lifting can release adrenaline, prompting the liver to release glucose. That can temporarily raise glucose even though activity has long-term benefits. The response varies; workout and glucose records help reveal personal patterns.",
  ],
  [
    "insulin-storage",
    "Insulin storage and product instructions",
    "storage",
    ["insulin", "storage", "refrigerator", "freeze", "expiry"],
    [
      "Does insulin need refrigeration?",
      "Can all opened insulin products be used for the same number of days?",
    ],
    "Unopened insulin generally needs refrigeration according to its label. In-use storage time and temperature limits depend on the specific product and device, so do not assume one duration fits every insulin. Protect insulin from freezing, excessive heat, and direct sunlight.",
  ],
  [
    "high-definition",
    "Hyperglycemia and symptoms",
    "high",
    ["hyperglycemia", "high", "thirst", "urination"],
    ["What is hyperglycemia?", "What symptoms can high blood sugar cause?"],
    "Hyperglycemia means blood glucose is above the intended range. It can cause thirst and frequent urination, though symptoms may be absent. Meals, illness, stress, activity changes, and insufficient effective insulin can contribute; readings and circumstances help explain the pattern.",
  ],
  [
    "exercise-ketones",
    "Why exercise with ketones can be dangerous",
    "high",
    ["exercise", "ketones", "high", "dka"],
    ["Why should exercise be avoided when glucose is high and ketones are present?"],
    "Exercise with high glucose and ketones can make glucose rise further and worsen the situation. Ketones can signal inadequate effective insulin and risk of ketoacidosis. Use the established sick-day or urgent-care plan rather than trying to exercise the high away.",
  ],
  [
    "type-differences",
    "Type 1 versus Type 2 diabetes",
    "types",
    ["type 1", "type 2", "difference", "turn into"],
    [
      "What is the difference between type 1 and type 2 diabetes?",
      "Can type 2 diabetes turn into type 1?",
    ],
    "Type 1 and Type 2 diabetes have different underlying processes. Type 1 involves immune damage to insulin-producing cells; Type 2 involves insulin resistance and insufficient insulin. Needing insulin for Type 2 does not turn it into Type 1.",
  ],
  [
    "pregnancy-diabetes",
    "Gestational diabetes",
    "types",
    ["gestational", "pregnancy", "baby"],
    ["What is gestational diabetes?", "Does gestational diabetes go away after pregnancy?"],
    "Gestational diabetes develops during pregnancy and often goes away after birth. It still raises the chance of Type 2 diabetes later, so follow-up testing remains important. Diabetes found during pregnancy can sometimes be pre-existing Type 2 diabetes.",
  ],
  [
    "insulin-glucose",
    "Why glucose stays in the blood",
    "types",
    ["insulin", "cells", "energy", "pancreas"],
    [
      "Why does blood sugar stay high in diabetes?",
      "What does the pancreas have to do with diabetes?",
    ],
    "Blood sugar stays high when the body makes too little insulin or does not use it effectively. Insulin from the pancreas helps glucose enter cells for energy. Without enough effective insulin, more glucose remains in the bloodstream.",
  ],
  [
    "symptoms",
    "Common diabetes symptoms",
    "causes",
    ["symptoms", "thirst", "tired", "urinate", "blurry"],
    ["What are common symptoms of diabetes?", "Can diabetes develop without obvious symptoms?"],
    "Diabetes symptoms can include thirst, frequent urination, hunger, tiredness, blurred vision, slow-healing sores, and frequent infections. Type 2 symptoms may develop gradually or be unnoticed. Symptoms alone cannot establish a diagnosis; blood tests are needed.",
  ],
  [
    "causes",
    "Why Type 2 diabetes develops",
    "causes",
    ["cause", "sugar", "genetics", "family", "fault"],
    ["Is type 2 diabetes caused only by eating sugar?", "Why do people develop type 2 diabetes?"],
    "Type 2 diabetes has multiple causes, including inherited susceptibility, insulin resistance, and changes in insulin production. Body weight and activity can influence risk, but eating sugar is not the sole explanation. The condition cannot be reduced to one habit.",
  ],
  [
    "resistance",
    "Insulin resistance and compensation",
    "resistance",
    [
      "resistance",
      "resistant",
      "compensate",
      "beta cells",
      "cells",
      "responding",
      "less effective",
    ],
    [
      "Why does the pancreas make more insulin with insulin resistance?",
      "How does insulin resistance lead to diabetes?",
    ],
    "Insulin resistance means cells respond less effectively to insulin. The pancreas can initially make extra insulin to compensate. If insulin production can no longer keep up, glucose rises and may reach prediabetes or diabetes levels.",
  ],
  [
    "prediabetes",
    "Prediabetes is a risk state",
    "resistance",
    ["prediabetes", "borderline", "inevitable"],
    ["Does prediabetes always become diabetes?", "What does borderline diabetes mean?"],
    "Prediabetes means blood glucose is above the usual range but below diabetes diagnostic thresholds. Progression to Type 2 is not inevitable. Activity, sustainable eating changes, and appropriate weight management can lower risk; follow-up testing tracks changes.",
  ],
  [
    "diagnosis-tests",
    "Laboratory tests and confirmation",
    "diagnosis",
    ["diagnosis", "fasting", "ogtt", "test", "confirm"],
    ["How is diabetes diagnosed?", "Can a home glucose meter diagnose diabetes?"],
    "Diabetes is diagnosed using appropriate laboratory blood tests, such as A1C, fasting glucose, or an oral glucose tolerance test. A home meter is useful for monitoring but does not establish a diagnosis. Abnormal results often need confirmation.",
  ],
  [
    "diagnosis-thresholds",
    "General diagnostic thresholds",
    "diagnosis",
    ["threshold", "126", "200", "6.5", "range"],
    ["What are the general diagnostic thresholds for diabetes?"],
    "For nonpregnant adults, diabetes-range laboratory results include A1C of at least 6.5%, fasting plasma glucose of at least 126 mg/dL, or two-hour glucose tolerance results of at least 200 mg/dL. Diagnosis requires clinical assessment and usually confirmation.",
  ],
  [
    "test-types",
    "Tests do not automatically identify diabetes type",
    "diagnosis",
    ["type", "antibodies", "which test"],
    ["Does an A1C test tell which type of diabetes someone has?"],
    "An A1C or glucose test can show high blood glucose, but it does not by itself identify the type of diabetes. Clinical history and, when appropriate, additional tests help distinguish the underlying cause.",
  ],
  [
    "a1c-mechanism",
    "How A1C measures an average",
    "a1c",
    ["a1c", "hemoglobin", "average", "three months"],
    ["How does the A1C test work?", "Why does A1C measure several months?"],
    "A1C measures the percentage of hemoglobin with glucose attached to it. That reflects average blood glucose over roughly three months. It summarizes a longer pattern rather than the glucose level at the moment blood is drawn.",
  ],
  [
    "a1c-spikes",
    "A1C and glucose swings",
    "a1c",
    ["a1c", "spikes", "lows", "average", "finger prick"],
    [
      "Can A1C hide high and low blood sugar swings?",
      "How is A1C different from a finger prick blood sugar test?",
    ],
    "A1C is a longer-term average, while a finger-prick test measures glucose at one moment. An average can hide short-lived highs and lows. Meter records or CGM trends add information about timing and variability.",
  ],
  [
    "a1c-fasting",
    "A1C preparation and limitations",
    "a1c",
    ["a1c", "fasting", "anemia", "accurate"],
    ["Do I need to fast for an A1C test?", "Is A1C always accurate?"],
    "An A1C test does not usually require fasting. Some conditions affecting red blood cells or hemoglobin can make the result misleading, so a clinician may use additional glucose tests when A1C and other evidence do not agree.",
  ],
  [
    "monitoring-patterns",
    "Blood glucose patterns",
    "monitoring",
    ["monitor", "patterns", "log", "reading"],
    [
      "Why track blood sugar rather than just one reading?",
      "What should I record with glucose readings?",
    ],
    "Glucose records can reveal patterns that one reading cannot. Recording timing, meals, activity, medicines, and illness helps explain changes. Individual targets and monitoring schedules depend on the person's care plan.",
  ],
  [
    "monitoring-timing",
    "Fasting versus after-meal glucose",
    "monitoring",
    ["fasting", "after meal", "post meal", "before meal"],
    ["Why is blood sugar different before and after meals?"],
    "Blood sugar changes as food is digested and glucose enters the bloodstream. A before-meal reading and an after-meal reading describe different points in that process. Compare readings taken at similar times rather than treating them as interchangeable.",
  ],
  [
    "cgm-fluid",
    "Why CGM and meters can differ",
    "cgm",
    ["cgm", "sensor", "lag", "different", "meter"],
    ["Why can a CGM reading differ from a fingerstick?", "Does a CGM measure blood directly?"],
    "A CGM estimates glucose in fluid between cells, while a fingerstick meter measures a blood sample. Readings can differ, particularly when glucose changes quickly. Follow the device instructions about when to confirm a reading with a meter.",
  ],
  [
    "cgm-trends",
    "CGM arrows and alerts",
    "cgm",
    ["cgm", "arrows", "alerts", "trend"],
    ["What are CGM trend arrows for?", "Why are CGM alarms useful?"],
    "CGM trend arrows show the direction glucose is moving, adding context to the current number. Alerts can warn about high or low glucose. Device settings and action thresholds should follow the person's plan and the manufacturer's instructions.",
  ],
  [
    "carb-types",
    "Sugars, starches, and fiber",
    "carbs",
    ["carbohydrates", "carbs", "starch", "sugar"],
    ["Do only sweet foods raise blood sugar?", "What are the three types of carbohydrates?"],
    "Carbohydrates include sugars, starches, and fiber. Starchy foods such as bread, rice, potatoes, and beans can affect blood glucose even when they do not taste sweet. Fiber is handled differently from sugars and starches.",
  ],
  [
    "carb-labels",
    "Carbohydrate counting and labels",
    "carbs",
    ["carb counting", "label", "total carbohydrate", "serving"],
    [
      "Should I look at total carbohydrates or just sugar on a label?",
      "What does carb counting mean?",
    ],
    "Carb counting tracks grams of total carbohydrate in foods and drinks, rather than only the sugar line. The label's serving size matters: eating two listed servings doubles the carbohydrate amount. Personal carbohydrate goals are not the same for everyone.",
  ],
  [
    "carb-serving",
    "Carbohydrate servings",
    "carbs",
    ["carb serving", "15 grams", "portion"],
    ["What is a carbohydrate serving?"],
    "A carbohydrate serving is commonly counted as about 15 grams of carbohydrate. It is a counting unit, not necessarily one ordinary serving of food. A larger portion may contain several carbohydrate servings.",
  ],
  [
    "plate",
    "Balanced plate method",
    "meals",
    ["plate method", "balanced", "vegetables", "protein"],
    ["How does the diabetes plate method work?", "What does a balanced diabetes meal look like?"],
    "The plate method uses half the plate for nonstarchy vegetables, one quarter for lean protein, and one quarter for carbohydrate foods. It is a visual starting point for balanced meals, rather than a rigid prescription.",
  ],
  [
    "fruit-juice",
    "Whole fruit versus juice",
    "meals",
    ["fruit", "juice", "orange", "apple"],
    [
      "Why does juice raise blood sugar faster than whole fruit?",
      "Can fruit fit into diabetes meals?",
    ],
    "Whole fruit can fit into diabetes meals. Fruit juice generally raises glucose faster than whole fruit because the meal's form and fiber change how quickly carbohydrate is absorbed. Portion size and the total meal still matter.",
  ],
  [
    "mixed-meals",
    "Protein and fat with carbohydrates",
    "meals",
    ["protein", "fat", "mixed meal", "absorption"],
    ["Why does eating protein with carbs affect blood sugar?"],
    "Protein, fat, and fiber eaten with carbohydrate can slow how quickly glucose rises. They do not erase the carbohydrate in the meal. Both food combinations and portion size help explain different after-meal patterns.",
  ],
  [
    "fiber-soluble",
    "Soluble fiber",
    "fiber",
    ["fiber", "soluble", "oats", "beans"],
    ["How does soluble fiber help with diabetes?", "What foods contain soluble fiber?"],
    "Soluble fiber forms a gel with water and slows digestion, which can help manage blood glucose and cholesterol. Foods such as oats, beans, and some fruits contain it. Fiber-rich choices can also support fullness.",
  ],
  [
    "fiber-practical",
    "Adding fiber gradually",
    "fiber",
    ["fiber", "whole grain", "vegetables", "constipation"],
    ["How can I add more fiber to meals?"],
    "Whole grains, beans, nuts, seeds, fruits, and vegetables provide fiber. Adding these foods gradually and drinking water can make the change easier on digestion. Fiber supports bowel health as well as glucose management.",
  ],
  [
    "no-perfect-diet",
    "Flexible diabetes eating patterns",
    "living",
    ["diet", "ban", "rice", "bread", "perfect"],
    ["Do I have to stop eating bread and rice?", "Is there one perfect diet for diabetes?"],
    "There is no single perfect diabetes diet. Carbohydrate foods can fit into a balanced eating pattern; portions, food combinations, and timing matter. Sustainable choices that fit culture, budget, and routine are more useful than an unrealistic food ban.",
  ],
  [
    "drinks",
    "Everyday drink choices",
    "living",
    ["drinks", "soda", "water", "tea", "coffee"],
    ["What are useful everyday drink choices with diabetes?"],
    "Water, unsweetened tea or coffee, and unsweetened sparkling water avoid the added sugar in many drinks. Sugary drinks can deliver carbohydrate quickly. Juice used to treat a low has a different purpose from an everyday drink.",
  ],
  [
    "alcohol",
    "Alcohol and low glucose",
    "living",
    ["alcohol", "beer", "wine", "drinking"],
    ["Why can alcohol cause low blood sugar?", "Can alcohol affect blood sugar with insulin?"],
    "Alcohol can increase low-glucose risk in people using insulin or certain diabetes medicines, especially without food. Eating with alcohol and monitoring according to the care plan matter. Individual safety also depends on medicines and other health conditions.",
  ],
  [
    "activity-small",
    "Starting activity in small steps",
    "activity",
    ["exercise", "walking", "start", "gym"],
    ["Do I need a gym to exercise with diabetes?", "Can a short walk help with diabetes?"],
    "Activity does not require a gym. Short walks, dancing, household movement, and exercises for strength or balance can help build a routine. Starting slowly and increasing gradually makes activity easier to maintain.",
  ],
  [
    "activity-week",
    "Weekly activity goals",
    "activity",
    ["exercise", "150", "minutes", "moderate"],
    ["What is the general weekly physical activity goal for adults?"],
    "A common general goal for adults is at least 150 minutes of moderate activity per week, built up gradually. The appropriate activities and amount may differ with health, mobility, and complications. Shorter sessions can help build a routine.",
  ],
  [
    "activity-glucose",
    "Activity and delayed lows",
    "living",
    ["exercise", "low", "insulin", "after workout"],
    ["Can exercise cause low blood sugar later?"],
    "Activity can lower glucose during exercise and afterward, especially with insulin or medicines that increase insulin release. Monitoring, accessible fast-acting carbohydrate, and an established activity plan help manage that risk. Medication adjustments need individualized instructions.",
  ],
  [
    "sleep-insulin",
    "Sleep and insulin sensitivity",
    "sleep",
    ["sleep", "insulin", "tired", "irregular"],
    [
      "Why can poor sleep affect blood sugar?",
      "Does an irregular sleep schedule matter for diabetes?",
    ],
    "Too little or irregular sleep can reduce insulin sensitivity and glucose tolerance. That makes glucose management harder even without a change in food. Sleep is one part of diabetes care alongside activity, meals, monitoring, and medicines.",
  ],
  [
    "sleep-apnea",
    "Sleep apnea and diabetes",
    "sleep",
    ["sleep apnea", "snoring", "breathing"],
    ["How is sleep apnea related to diabetes?"],
    "Obstructive sleep apnea repeatedly interrupts breathing and sleep, and is associated with insulin resistance and poorer glucose management. Persistent snoring, breathing pauses, or daytime sleepiness deserve assessment; those symptoms alone do not establish sleep apnea.",
  ],
  [
    "stress-glucose",
    "Stress hormones and glucose",
    "emotions",
    ["stress", "anxiety", "hormones", "worried"],
    ["Can stress change blood sugar without eating?"],
    "Stress hormones can make blood glucose rise or fall unpredictably, even without a meal. Stress also affects sleep and routines. Relaxation, enjoyable activity, connection, and support can make coping easier.",
  ],
  [
    "distress",
    "Diabetes distress and burnout",
    "emotions",
    ["distress", "burnout", "overwhelmed", "guilt"],
    ["What is diabetes distress?", "Why can diabetes care feel exhausting?"],
    "Diabetes distress is the emotional burden of managing a demanding condition. Feeling overwhelmed by monitoring, meals, or medicines is a reason to seek practical support, not evidence of failure. A diabetes educator can help simplify difficult routines.",
  ],
  [
    "depression",
    "Depression versus everyday frustration",
    "emotions",
    ["depression", "sad", "interest", "mental health"],
    ["Is depression different from diabetes distress?"],
    "Depression is a medical condition that can affect mood, interest, sleep, energy, and daily functioning. Diabetes distress is specifically the burden of diabetes care, though both can occur together. Persistent symptoms deserve professional assessment and support.",
  ],
  [
    "low-causes",
    "Why low glucose happens",
    "low",
    ["hypoglycemia", "low", "missed meal", "insulin"],
    ["Why can skipping a meal cause low blood sugar?", "What can cause hypoglycemia?"],
    "Low glucose can happen when insulin or some other medicines lower glucose more than the available food supports. Missed meals, activity, alcohol, illness, and schedule changes can contribute. Repeated lows need a review of the established care plan.",
  ],
  [
    "low-symptoms",
    "Recognizing low glucose",
    "low",
    ["hypoglycemia", "shaky", "sweating", "confused"],
    ["What symptoms can low blood sugar cause?"],
    "Low blood sugar can cause shaking, sweating, hunger, dizziness, weakness, confusion, or a fast heartbeat. Symptoms vary and can overlap with other conditions. Severe confusion, fainting, or inability to swallow requires urgent help.",
  ],
  [
    "low-treatment",
    "The general 15-15 rule",
    "lowTreatment",
    ["15-15", "treat low", "glucose tablets", "fast acting"],
    ["What is the 15-15 rule?"],
    "For an adult who is awake and can swallow, the general 15-15 rule uses 15 grams of fast-acting carbohydrate, then checks glucose after 15 minutes and repeats if still low. A person's prescribed plan takes priority; severe lows need urgent help.",
  ],
  [
    "low-chocolate",
    "Why chocolate is slow for a low",
    "lowTreatment",
    ["chocolate", "low", "fat", "juice"],
    ["Why is chocolate not the best choice for treating low blood sugar?"],
    "Chocolate contains fat that slows sugar absorption, making it less suitable for quickly treating low blood sugar. Glucose tablets or a measured fast-acting sugar source work more promptly. Never give food or drink to someone unable to swallow safely.",
  ],
  [
    "sick-glucose",
    "Illness can raise glucose",
    "sick",
    ["sick", "flu", "fever", "infection"],
    ["Why can blood sugar rise when someone is sick?"],
    "Illness triggers hormones that can raise glucose, even when someone eats less. Vomiting or reduced intake can create other risks. A sick-day plan covers monitoring, fluids, food, medication instructions, and when urgent help is needed.",
  ],
  [
    "ketones",
    "Ketones and ketoacidosis",
    "sick",
    ["ketones", "dka", "ketoacidosis", "insulin"],
    ["What are ketones in diabetes?", "Why is diabetic ketoacidosis dangerous?"],
    "Ketones are produced when the body breaks down fat for fuel because too little effective insulin is available. Excess ketones can lead to diabetic ketoacidosis, a dangerous emergency. A personal sick-day plan specifies testing and urgent-care actions.",
  ],
  [
    "insulin-types",
    "Different insulin action profiles",
    "insulin",
    ["insulin", "rapid", "long acting", "basal", "bolus"],
    [
      "Why are there different types of insulin?",
      "What is the difference between basal and mealtime insulin?",
    ],
    "Insulins differ in how quickly they start working and how long they last. Background insulin covers ongoing needs; faster-acting insulin can cover meals. They are not interchangeable, and timing and doses must follow the prescribed plan.",
  ],
  [
    "insulin-rotation",
    "Rotating insulin injection sites",
    "insulin",
    ["injection", "rotate", "lumps", "skin"],
    ["Why should insulin injection spots be rotated?"],
    "Repeated insulin injections into the same exact spot can harden or change the tissue. Rotating spots helps avoid those changes. Common areas include the abdomen, thigh, buttocks, and upper arm; use the technique taught for the specific device.",
  ],
  [
    "insulin-pumps",
    "Insulin pump basics",
    "insulin",
    ["pump", "pen", "injection", "delivery"],
    ["What does an insulin pump do?"],
    "An insulin pump delivers programmed insulin through a small tube or pod under the skin. It can provide background delivery and additional mealtime insulin. It is a delivery tool, rather than a cure or a reason to stop monitoring.",
  ],
  [
    "metformin-action",
    "Metformin mechanism",
    "metformin",
    ["metformin", "liver", "biguanide"],
    [
      "What does metformin do in the body?",
      "Does metformin make the pancreas produce more insulin?",
    ],
    "Metformin mainly reduces glucose production by the liver and improves the body's response to insulin. It does not work primarily by pushing the pancreas to release more insulin. It is an oral medicine used for Type 2 diabetes.",
  ],
  [
    "metformin-stomach",
    "Metformin digestive effects",
    "metformin",
    ["metformin", "diarrhea", "nausea", "stomach"],
    ["What are common digestive side effects of metformin?"],
    "Metformin can cause diarrhea, nausea, vomiting, gas, indigestion, or abdominal discomfort. Effects and tolerability vary. Persistent or severe symptoms need assessment, and a medication change should follow the prescriber's instructions rather than an improvised dose change.",
  ],
  [
    "glp1-action",
    "GLP-1 medicines",
    "glp1",
    ["glp-1", "glp1", "semaglutide", "ozempic", "glucagon"],
    ["How do GLP-1 medicines help control blood sugar?", "What does semaglutide do?"],
    "GLP-1 receptor medicines such as semaglutide increase insulin secretion and reduce glucagon when glucose is elevated. They also affect stomach emptying and can reduce body weight. Products differ in approved uses and instructions.",
  ],
  [
    "tirzepatide-action",
    "Dual GIP and GLP-1 action",
    "gip",
    ["tirzepatide", "mounjaro", "gip", "glp-1"],
    ["How is tirzepatide different from a GLP-1 medicine?"],
    "Tirzepatide activates both GIP and GLP-1 receptors, rather than only GLP-1 receptors. These signals help increase insulin and reduce glucagon when glucose is elevated, slow stomach emptying, and can reduce food intake and weight.",
  ],
  [
    "tirzepatide-effects",
    "Tirzepatide common side effects",
    "gip",
    ["tirzepatide", "mounjaro", "side effects", "nausea"],
    ["What are common side effects of Mounjaro?"],
    "Common Mounjaro side effects include nausea, diarrhea, reduced appetite, vomiting, constipation, indigestion, and abdominal pain. A common-effect list cannot determine whether a particular symptom is harmless; severity and the person's circumstances matter.",
  ],
  [
    "sglt2-action",
    "SGLT2 medicines and the kidneys",
    "sglt2",
    ["sglt2", "jardiance", "empagliflozin", "urine"],
    ["Why do SGLT2 medicines put glucose in urine?", "How does Jardiance work?"],
    "SGLT2 normally helps return filtered glucose from the kidneys to the blood. Medicines such as empagliflozin block that process, allowing more glucose to leave in urine. They act differently from medicines that stimulate insulin release.",
  ],
  [
    "dpp4-action",
    "DPP-4 medicines and incretins",
    "dpp4",
    ["dpp4", "dpp-4", "januvia", "sitagliptin", "incretin"],
    ["How do DPP-4 medicines work?", "How does Januvia work?"],
    "DPP-4 inhibitors such as sitagliptin slow the breakdown of incretin hormones. Those signals help increase insulin release and reduce glucagon when glucose is normal or elevated, reducing fasting and after-meal glucose.",
  ],
  [
    "sulfonylurea-action",
    "Sulfonylurea action",
    "sulfonylurea",
    ["sulfonylurea", "glipizide", "pancreas"],
    ["How does glipizide lower blood sugar?"],
    "Glipizide belongs to the sulfonylurea class. Its main short-term action is stimulating insulin release from functioning pancreatic beta cells, particularly in response to a meal. It works differently from metformin's main liver effect.",
  ],
  [
    "tzd-action",
    "Pioglitazone and insulin sensitivity",
    "tzd",
    ["pioglitazone", "tzd", "thiazolidinedione", "sensitivity"],
    ["How does pioglitazone work?"],
    "Pioglitazone reduces insulin resistance in tissues and the liver, helping the body use glucose and reducing liver glucose output. It needs insulin to be present and does not directly stimulate insulin secretion.",
  ],
  [
    "kidney-tests",
    "Kidney blood and urine tests",
    "kidney",
    ["kidney", "egfr", "albumin", "urine"],
    ["Why are both blood and urine tests used to check kidneys?"],
    "Kidney blood tests estimate filtering ability, while urine tests look for albumin leaking into urine. These describe different aspects of kidney health. Early kidney damage may have no obvious symptoms, so both tests are useful.",
  ],
  [
    "kidney-protection",
    "Protecting kidneys over time",
    "kidney",
    ["kidney", "blood pressure", "damage", "nephropathy"],
    ["How can diabetes damage the kidneys?"],
    "High blood glucose can damage kidney blood vessels over time, and high blood pressure adds strain. Managing glucose and blood pressure, monitoring kidney tests, and following the care plan can help prevent or slow damage.",
  ],
  [
    "eye-screening",
    "Eye disease may be silent",
    "eyes",
    ["eye", "vision", "retinopathy", "dilated"],
    ["Why are eye exams needed when vision seems normal?"],
    "Early diabetic eye disease may have no noticeable symptoms. A dilated eye exam can find retinal damage before major vision loss. Glucose, blood pressure, and cholesterol management also help protect eye health.",
  ],
  [
    "eye-conditions",
    "Different diabetic eye conditions",
    "eyes",
    ["retinopathy", "macular", "cataract", "glaucoma"],
    ["What eye conditions are associated with diabetes?"],
    "Diabetes-related eye disease includes retinopathy, diabetic macular edema, cataracts, and glaucoma. They affect different parts or processes in the eye. New vision changes need assessment because symptoms do not identify the specific cause.",
  ],
  [
    "nerve-types",
    "Peripheral and autonomic neuropathy",
    "nerves",
    ["neuropathy", "peripheral", "autonomic", "numb", "digestion", "organs"],
    ["What is the difference between peripheral and autonomic neuropathy?"],
    "Peripheral neuropathy commonly affects feet, legs, hands, or arms. Autonomic neuropathy affects nerves controlling organs, including digestion, bladder function, blood pressure, and recognition of low glucose. The location and symptoms depend on which nerves are affected.",
  ],
  [
    "nerve-damage",
    "How diabetes affects nerves",
    "nerves",
    ["nerve", "tingling", "neuropathy", "blood fats"],
    ["Why can diabetes cause nerve damage?"],
    "High blood glucose and blood fats can damage nerves and the small vessels that supply them over time. Managing glucose, blood pressure, and cholesterol can reduce risk. Tingling or numbness still needs assessment because it can have other causes.",
  ],
  [
    "feet-checks",
    "Daily foot checks",
    "feet",
    ["feet", "foot", "cuts", "check", "mirror"],
    ["Why should someone with diabetes check their feet daily?"],
    "Nerve damage can hide pain from a cut or blister, and reduced circulation can make healing harder. Daily checks help find changes early. A mirror or another person's help can make it easier to inspect soles and between toes.",
  ],
  [
    "feet-protection",
    "Shoes and skin protection",
    "feet",
    ["barefoot", "shoes", "socks", "hot water", "feet"],
    [
      "Why is walking barefoot risky with diabetes?",
      "Why should bath water temperature be checked?",
    ],
    "Shoes and socks protect feet from cuts, pressure, and temperature injury. Reduced sensation can make a sharp object or hot water harder to notice. Well-fitting footwear, gentle washing, careful drying, and regular checks help prevent problems.",
  ],
  [
    "heart-risk",
    "Diabetes and cardiovascular risk",
    "heart",
    ["heart", "stroke", "blood pressure", "cholesterol"],
    ["Why does diabetes care include blood pressure and cholesterol?"],
    "Diabetes care includes blood pressure and cholesterol because heart and blood vessel risk depends on more than glucose. High pressure strains vessels, and LDL cholesterol can build up in them. Managing these factors together helps reduce risk.",
  ],
  [
    "smoking",
    "Smoking adds vascular risk",
    "heart",
    ["smoking", "tobacco", "circulation"],
    ["Why is smoking especially concerning with diabetes?"],
    "Smoking and diabetes both damage or narrow blood vessels, increasing heart, stroke, and leg circulation risks. Stopping smoking is an important part of protecting vessels and reducing diabetes complications; practical cessation support can help.",
  ],
  [
    "mouth-glucose",
    "Glucose and gum health",
    "mouth",
    ["gum", "teeth", "saliva", "plaque"],
    ["How does diabetes affect gums and teeth?"],
    "High glucose can increase glucose in saliva, helping harmful bacteria and plaque build up. Dry mouth also reduces saliva's protective effect. Brushing, cleaning between teeth, glucose management, and dental care support mouth health.",
  ],
  [
    "mouth-signs",
    "Dental symptoms worth checking",
    "mouth",
    ["bleeding gums", "dry mouth", "thrush", "dentist"],
    ["What mouth problems can be associated with diabetes?"],
    "Diabetes can increase the risk of gum disease, cavities, dry mouth, and thrush. Bleeding or swollen gums, loose teeth, persistent bad breath, or mouth sores need dental assessment. These symptoms can have several causes.",
  ],
  [
    "sexual-bladder",
    "Sexual and bladder health",
    "sexual",
    ["sexual", "bladder", "erectile", "urinary"],
    ["Can diabetes affect sexual or bladder function?"],
    "Diabetes can affect sexual and bladder function through changes in nerves, blood vessels, hormones, and emotional health. These concerns are appropriate to discuss with a clinician and may be treatable. New symptoms should not automatically be attributed to diabetes.",
  ],
  [
    "travel-packing",
    "Accessible travel supplies",
    "travel",
    ["travel", "flying", "pack", "carry on"],
    ["What should someone with diabetes pack for travel?"],
    "Pack extra medicines, monitoring supplies, snacks, and fast-acting carbohydrate where they are accessible, such as a carry-on. Plan for delayed meals and schedule changes. Medication timing across time zones should use instructions arranged before travel.",
  ],
  [
    "travel-storage",
    "Temperature and travel routines",
    "travel",
    ["travel", "heat", "cold", "storage", "car"],
    ["Why does medicine storage matter when traveling?"],
    "Extreme heat or cold can damage insulin and diabetes supplies. Avoid hot cars, direct sunlight, and placing insulin directly on ice. Follow product-specific storage instructions, and keep food, fluids, monitoring, and medicine routines accessible while traveling.",
  ],
  [
    "care-abcs",
    "The diabetes ABCs",
    "management",
    ["abcs", "a1c", "blood pressure", "cholesterol"],
    ["What are the diabetes ABCs?"],
    "The diabetes ABCs are A1C, blood pressure, and cholesterol. They summarize several important areas of risk management. A care plan also includes medicines, meals, activity, smoking cessation, preventive checks, and practical support.",
  ],
  [
    "visit-prep",
    "Preparing useful appointment questions",
    "management",
    ["appointment", "questions", "medication list", "visit"],
    ["What can I bring to a diabetes appointment?"],
    "Bring a medication list, glucose records when relevant, and a short list of questions or concerns. Mention side effects, cost, daily routines, and what is difficult to follow. Those details help make the plan practical.",
  ],
  [
    "prevention",
    "Preventing or delaying Type 2",
    "prevention",
    ["prevent", "delay", "risk", "prediabetes"],
    ["Can type 2 diabetes be prevented or delayed?"],
    "Type 2 diabetes can sometimes be prevented or delayed through sustained activity and eating changes, and weight loss when appropriate. Family history and other factors still influence risk. A prevention program provides structure and support rather than promising certainty.",
  ],
  [
    "small-habits",
    "Sustainable habit changes",
    "prevention",
    ["habit", "small changes", "routine", "motivation"],
    ["How can I make diabetes habit changes easier to maintain?"],
    "Start with a specific, manageable change such as a short walk or replacing a sugary drink with water. Tracking progress and getting support can help. Sustainable routines matter more than an ambitious plan that cannot fit everyday life.",
  ],
  [
    "education-skills",
    "Practical diabetes education",
    "education",
    ["educator", "dsmes", "skills", "support"],
    ["What can a diabetes educator help with?"],
    "A diabetes educator helps with eating, activity, medicines, monitoring, reducing risks, coping, and problem-solving. Education can be useful at diagnosis and when treatment, complications, or life circumstances change. It helps adapt diabetes care to everyday life.",
  ],
  [
    "support",
    "Helpful family support",
    "education",
    ["family", "support", "partner", "caregiver"],
    ["How can family help someone manage diabetes?"],
    "Family can help with practical tasks, learning glucose-monitoring or low-glucose procedures, shared meals, and encouragement. Asking which help is wanted respects the person's independence. A diabetes education program can teach useful skills to both the person and supporters.",
  ],
  [
    "monogenic",
    "Single-gene monogenic diabetes",
    "monogenic",
    ["monogenic", "single gene", "genetic testing"],
    ["What is monogenic diabetes?", "Can a single gene cause diabetes?"],
    "Monogenic diabetes results from a change in one gene affecting insulin production or function. It includes MODY and neonatal diabetes. Genetic testing can identify the subtype, which matters because treatment and family implications differ from typical type 1 or type 2 diabetes.",
  ],
  [
    "mody",
    "Maturity-onset diabetes of the young",
    "monogenic",
    ["MODY", "inherited", "family history"],
    ["What is MODY?", "Is MODY the same as type 2 diabetes?"],
    "MODY is a group of inherited single-gene forms of diabetes, often recognized in younger people and across generations of a family. It is not simply early type 2 diabetes. Its specific gene subtype helps determine whether medication is needed and which treatments may work.",
  ],
  [
    "neonatal",
    "Neonatal diabetes",
    "monogenic",
    ["neonatal", "infant", "baby"],
    ["What is neonatal diabetes?"],
    "Neonatal diabetes is rare diabetes appearing in the first months of life, often from a single-gene change. Some forms are temporary and others persist. Genetic evaluation is important because the subtype can change treatment; infant glucose problems require specialist pediatric care.",
  ],
  [
    "lada",
    "Slowly progressing autoimmune diabetes in adults",
    "lada",
    ["LADA", "autoimmune", "adult onset"],
    ["What is LADA?", "Can adults develop autoimmune diabetes?"],
    "LADA is adult autoimmune diabetes in which insulin-producing cells are lost more slowly than in classic rapidly presenting type 1 diabetes. It can initially resemble type 2 diabetes. Over time insulin production falls, and insulin treatment becomes necessary.",
  ],
  [
    "c-peptide",
    "C-peptide and antibody tests",
    "lada",
    ["C-peptide", "antibody", "antibodies", "insulin production"],
    ["What does a C-peptide test show?", "Why test diabetes antibodies?"],
    "C-peptide helps assess how much insulin the body is making. Diabetes antibody tests look for evidence of an immune attack on insulin-producing cells. Clinicians interpret these alongside glucose tests and the clinical history to clarify diabetes type; neither is a home diagnosis.",
  ],
  [
    "type3c",
    "Pancreatic or type 3c diabetes",
    "type3c",
    ["type 3c", "pancreatogenic", "pancreatitis", "pancreas removed"],
    ["What is type 3c diabetes?", "Can pancreatitis cause diabetes?"],
    "Type 3c diabetes develops after disease or damage to the pancreas reduces insulin production. Pancreatitis and pancreatic surgery are possible causes. The pancreas may also produce fewer digestive enzymes, so care may need to address both glucose control and food digestion.",
  ],
  [
    "pancreatic-enzymes",
    "Digestive enzyme problems with pancreatic diabetes",
    "type3c",
    ["exocrine insufficiency", "oily stools", "digestive enzymes", "PEI"],
    ["Why can pancreatic diabetes cause oily stools?"],
    "Damage to the pancreas can reduce digestive enzyme production as well as insulin. Poor digestion may cause oily stools, diarrhea, and unplanned weight loss. These symptoms need evaluation; some people require prescribed enzyme replacement and nutrition support as part of pancreatic diabetes care.",
  ],
  [
    "type3-vs3c",
    "Type 3 terminology versus type 3c",
    "type3c",
    ["type 3", "Alzheimer", "type 3c"],
    ["Is type 3 diabetes the same as type 3c?"],
    "Type 3c describes diabetes caused by pancreatic damage. The phrase type 3 has also been used unofficially in discussion of Alzheimer disease and insulin signaling. These terms are not interchangeable, and the unofficial phrase does not establish a separate routine diabetes diagnosis.",
  ],
  [
    "cfrd",
    "Cystic fibrosis-related diabetes",
    "cfrd",
    ["CFRD", "cystic fibrosis"],
    ["What is cystic fibrosis-related diabetes?"],
    "Cystic fibrosis-related diabetes is a distinct form of diabetes in people with cystic fibrosis. Pancreatic damage can reduce insulin production, and insulin resistance can also contribute. Diabetes care must support CF nutrition and lung health, rather than automatically copying a usual weight-loss plan.",
  ],
  [
    "pregnancy-planning",
    "Planning pregnancy with established diabetes",
    "pregnancy",
    ["preconception", "planning pregnancy", "pregnant"],
    ["How should someone with diabetes prepare for pregnancy?"],
    "Preconception care reviews glucose control, medicines, nutrition, and existing complications before pregnancy. Glucose targets and suitable medicines may change. Planning with the diabetes and pregnancy teams helps reduce risks for parent and baby; discovering a pregnancy is a reason to arrange an early review.",
  ],
  [
    "pregnancy-targets",
    "Why pregnancy glucose goals differ",
    "pregnancy",
    ["pregnancy targets", "pregnancy glucose", "baby"],
    ["Why are glucose goals different during pregnancy?"],
    "High maternal glucose can affect the developing baby and increase pregnancy complications. Pregnancy care therefore uses goals and monitoring plans specific to pregnancy. Insulin needs can change during pregnancy and after birth, so ordinary adult targets or previous doses should not be assumed to fit.",
  ],
  [
    "breastfeeding",
    "Breastfeeding and glucose changes",
    "pregnancy",
    ["breastfeeding", "nursing baby", "postpartum"],
    ["Can breastfeeding affect blood sugar?"],
    "Breastfeeding has benefits for the baby and can affect the parent’s glucose needs. People using glucose-lowering treatment may need a plan to prevent lows around feeding. After birth, medication and monitoring needs should be reviewed with the care team rather than assuming the pregnancy plan still applies.",
  ],
  [
    "gestational-screening",
    "Gestational diabetes screening",
    "gestationalDetail",
    ["glucose challenge", "24 weeks", "28 weeks", "gestational screening"],
    [
      "When is gestational diabetes usually tested?",
      "What is the pregnancy glucose challenge test?",
    ],
    "Gestational diabetes is commonly tested between 24 and 28 weeks of pregnancy. A glucose challenge test may be followed by an oral glucose tolerance test if the screening result is high. Pregnancy testing protocols differ from ordinary adult diabetes diagnosis; symptoms alone cannot exclude it.",
  ],
  [
    "gestational-treatment",
    "Treatment options during gestational diabetes",
    "gestationalDetail",
    ["gestational insulin", "gestational treatment"],
    ["Does gestational diabetes always need insulin?"],
    "Gestational diabetes care includes a suitable eating plan, activity, and glucose checks. Some people also need insulin when those measures do not keep glucose within pregnancy goals. Needing medicine is not a personal failure; the plan responds to pregnancy-related changes in insulin needs.",
  ],
  [
    "gestational-later",
    "Diabetes risk after gestational diabetes",
    "gestationalDetail",
    ["after gestational", "after birth", "future pregnancy"],
    ["Does gestational diabetes matter after the baby is born?"],
    "Having gestational diabetes increases the chance of later type 2 diabetes, even if glucose improves after delivery. Follow-up testing and ongoing prevention support matter. Healthy eating, activity, and appropriate weight management help lower future risk; a normal postpartum result does not erase the history.",
  ],
  [
    "school-plan",
    "Diabetes support at school",
    "school",
    ["school", "school nurse", "student", "classroom"],
    [
      "What support does a child with diabetes need at school?",
      "Can a child with diabetes take part in school activities?",
    ],
    "Students need access to glucose checks, prescribed treatment, food, and adults prepared to respond to low or high glucose. A school health team coordinates with family and the child’s diabetes team. The aim is safe participation in learning, sports, and trips alongside other students.",
  ],
  [
    "child-independence",
    "Age-appropriate help with diabetes care",
    "school",
    ["child independence", "toddler", "preschool", "parents"],
    ["When can children manage diabetes by themselves?"],
    "Readiness depends on age, maturity, knowledge, and the task. Young children need adult help with all diabetes care; older students may take on more tasks while still receiving support. Responsibility should be shared gradually, with a clear plan for situations requiring an adult.",
  ],
  [
    "youth-transition",
    "Moving from pediatric to adult diabetes care",
    "youth",
    ["transition", "teenager", "adult clinic", "college"],
    ["How can teenagers prepare for adult diabetes care?"],
    "A gradual transition helps young people build skills in monitoring, treatment, prescriptions, appointments, and asking for help. Pediatric and adult teams can coordinate the handover. Readiness and emotional or social needs matter; reaching a particular birthday does not mean someone should suddenly manage alone.",
  ],
  [
    "device-burden",
    "Device alarms and skin irritation",
    "youth",
    ["alarm fatigue", "adhesive", "skin irritation", "device burden"],
    ["Why can diabetes device alarms feel overwhelming?", "Can diabetes devices irritate skin?"],
    "CGM and pump technology can improve flexibility while also creating alarm fatigue, skin irritation, and the burden of wearing a device. These concerns deserve a review with the care team. Device choice, training, and settings should balance useful alerts with a manageable daily experience.",
  ],
  [
    "older-goals",
    "Diabetes goals in older adults",
    "older",
    ["older adults", "frailty", "elderly", "individual goals"],
    ["Why might an older adult have different diabetes goals?"],
    "Older adults vary widely in health, function, and support. Glucose goals may be adjusted for frailty, other illnesses, cognition, and low-glucose risk. Avoiding hypoglycemia and preserving quality of life can be more important than pursuing a lower A1C at the cost of treatment burden.",
  ],
  [
    "older-support",
    "Memory, falls, and treatment complexity",
    "older",
    ["memory", "falls", "cognitive", "polypharmacy", "care partner"],
    ["How can memory problems affect diabetes care?"],
    "Memory or physical difficulties can make glucose checks, doses, and meals harder to coordinate. Older-adult reviews consider cognition, falls, frailty, hypoglycemia, and multiple medicines. A clinician may simplify the plan and involve a trusted care partner while respecting the person’s preferences and independence.",
  ],
  [
    "autonomic-detail",
    "Automatic body functions and nerve damage",
    "autonomic",
    ["autonomic", "heart rate", "blood pressure", "sweating"],
    ["What body functions can autonomic neuropathy affect?"],
    "Autonomic neuropathy affects nerves controlling automatic functions such as heart rate, blood pressure, digestion, bladder emptying, and sweating. Symptoms depend on the nerves involved. It can also reduce warning signs of low glucose, so care often includes symptom review and a tailored monitoring plan.",
  ],
  [
    "standing-dizziness",
    "Blood pressure drops on standing",
    "autonomic",
    ["standing", "orthostatic", "dizziness", "fainting"],
    ["Can diabetic nerve damage cause dizziness when standing?"],
    "Autonomic nerve damage can impair the blood-pressure response to standing, causing dizziness or faintness. Many other conditions and medicines can do this too. Recurrent symptoms need assessment of blood pressure and possible causes rather than automatically attributing them to diabetes or changing treatment independently.",
  ],
  [
    "gastroparesis-detail",
    "Delayed stomach emptying",
    "gastroparesis",
    ["gastroparesis", "stomach emptying", "full quickly", "nausea"],
    [
      "What is diabetic gastroparesis?",
      "Why can delayed stomach emptying make glucose unpredictable?",
    ],
    "Gastroparesis is delayed stomach emptying without a physical blockage. Diabetes can contribute through nerve damage. Food may reach the intestine later than expected, disrupting the match between glucose absorption and insulin action. Early fullness, nausea, or vomiting can occur, but symptoms alone do not establish the diagnosis.",
  ],
  [
    "gastroparesis-testing",
    "How delayed stomach emptying is evaluated",
    "gastroparesis",
    ["gastric emptying study", "gastroparesis diagnosis", "breath test"],
    ["How is gastroparesis diagnosed?"],
    "A clinician reviews digestive symptoms and uses a gastric emptying test to check how quickly food leaves the stomach. Further tests may exclude a physical blockage. Similar symptoms have other causes, so fullness or nausea alone is not enough to diagnose gastroparesis.",
  ],
  [
    "dka-mechanism",
    "Why diabetic ketoacidosis happens",
    "dka",
    ["DKA", "ketoacidosis", "fat fuel", "ketone acids"],
    ["What causes diabetic ketoacidosis?", "Can type 2 diabetes cause DKA?"],
    "DKA occurs when too little effective insulin leads the body to break down fat rapidly, producing an unsafe buildup of ketone acids. It is more common in type 1 diabetes but can occur in type 2. DKA is a medical emergency, not a routine high reading.",
  ],
  [
    "dka-warning",
    "Warning features of ketoacidosis",
    "dka",
    ["fruity breath", "deep breathing", "DKA symptoms", "vomiting"],
    ["What are the warning signs of DKA?"],
    "DKA may begin with thirst and frequent urination and progress to nausea, vomiting, stomach pain, fruity breath, and fast deep breathing. It can worsen quickly and needs emergency care when suspected. A sick-day plan helps identify when glucose and ketone checks or urgent help are needed.",
  ],
  [
    "fasting-ramadan",
    "Fasting for Ramadan with diabetes",
    "ramadan",
    ["Ramadan", "religious fasting", "iftar", "suhoor"],
    ["Why does Ramadan fasting need a diabetes plan?", "Can everyone with diabetes safely fast?"],
    "Fasting changes meal, drink, and medicine timing and may cause low glucose, high glucose, or dehydration. Risk depends on diabetes type, treatment, previous lows, and health. A pre-Ramadan review should establish whether fasting is suitable and a plan for monitoring and when to break the fast.",
  ],
  [
    "fasting-monitoring",
    "Glucose checks during religious fasting",
    "ramadan",
    ["fasting checks", "finger prick", "Ramadan monitoring"],
    ["Does checking blood sugar break a Ramadan fast?"],
    "Diabetes UK explains that checking glucose with a finger-prick test does not break the Ramadan fast. Monitoring remains important for safety. Medical advice and religious guidance can help someone plan fasting or alternatives when health risks make fasting unsuitable.",
  ],
  [
    "surgery-plan",
    "Diabetes and planned procedures",
    "hospital",
    ["surgery", "anesthesia", "procedure", "hospital", "operation"],
    ["Why should a surgery team know about diabetes medicines?"],
    "Fasting, anesthesia, illness, and recovery can change glucose needs. The procedure team needs the complete diabetes medicine and device list to plan monitoring and treatment. SGLT2 drugs carry ketoacidosis concerns around surgery; GLP-1 medicines can affect stomach emptying. Medicine changes require procedure-specific instructions.",
  ],
  [
    "early-type1",
    "Type 1 diabetes before symptoms",
    "autoantibodies",
    ["early stage", "autoantibodies", "screening type 1"],
    ["Can type 1 diabetes be detected before symptoms?", "What are diabetes autoantibodies?"],
    "Type 1 diabetes can develop through stages before symptoms appear. Blood tests can identify diabetes-related autoantibodies, which reflect an immune response against insulin-producing cells. Confirmed results and glucose testing guide specialist staging and follow-up; an antibody result is different from an ordinary glucose reading.",
  ],
  [
    "type1-stages",
    "Stages of type 1 diabetes",
    "autoantibodies",
    ["stage 1", "stage 2", "stage 3", "early type 1"],
    ["What are the stages of type 1 diabetes?"],
    "Stage 1 involves two or more confirmed diabetes-related autoantibodies with normal glucose and no symptoms. Stage 2 adds abnormal glucose without symptoms. Stage 3 includes high glucose and clinical symptoms. Specialist follow-up determines the stage and appropriate care; screening results need confirmation.",
  ],
  [
    "meter-clean-hands",
    "Clean hands and accurate meter readings",
    "meterAccuracy",
    ["wash hands", "food on fingers", "dirty fingers"],
    ["Why should I wash my hands before a glucose test?"],
    "Small amounts of food or sugar on fingers can distort a glucose reading. Wash hands and follow the meter’s sampling instructions, including adequate blood volume. If a result seems unexpected, check testing technique and repeat according to the device instructions; persistent discrepancies need review.",
  ],
  [
    "meter-control",
    "Control solution checks",
    "meterSafe",
    ["control solution", "quality control", "meter test"],
    ["What is glucose meter control solution for?"],
    "Control solution checks whether the meter and test strips are working together as expected. It is not a blood-glucose result. The device instructions specify how and when to use it and the acceptable range; an out-of-range control test needs troubleshooting before relying on the system.",
  ],
  [
    "alternate-test-site",
    "Finger versus alternate test sites",
    "meterSafe",
    ["forearm", "palm", "alternate site", "fingertip"],
    ["Why can forearm glucose tests differ from fingertip tests?"],
    "Alternate-site readings may be less reliable when glucose changes quickly after food, insulin, or exercise. Fingertip testing is preferred when low glucose is suspected or an alternate-site result does not match symptoms. Use only sites supported by the meter instructions.",
  ],
  [
    "strip-expiry",
    "Expired and poorly stored test strips",
    "meterAccuracy",
    ["expired strips", "humidity", "strip storage", "heat"],
    ["Can expired test strips give wrong results?"],
    "Expired, damaged, or poorly stored strips can give inaccurate readings. Heat and humidity may damage strips, so follow storage instructions and close the container promptly. Keep the meter clean, maintain its batteries, and use the correct strip and blood sample size.",
  ],
  [
    "strip-match",
    "Why test strips must match the meter",
    "stripCompatibility",
    ["compatible strips", "wrong strips", "fit meter"],
    ["Can I use any test strip that fits my meter?"],
    "No. Strips that physically fit a meter may still have different chemistry or design and produce wrong results. Use only the strips specified for that meter in its instructions and check the strip packaging for compatibility; apparent fit is not evidence that they work together.",
  ],
  [
    "secondhand-strips",
    "Previously owned test strip risks",
    "meterSafe",
    ["secondhand strips", "preowned strips", "opened vial"],
    ["Why are secondhand glucose test strips risky?"],
    "Previously owned strips may have been stored incorrectly, expired, contaminated, or tampered with. These problems can make results unreliable. FDA advises buying new unopened vials and discussing affordability with the care team when obtaining suitable supplies is difficult.",
  ],
  [
    "steroid-diabetes",
    "Steroid-related high glucose",
    "steroids",
    ["steroids", "prednisone", "prednisolone", "corticosteroid"],
    ["Can steroids raise blood sugar?", "What is steroid-induced diabetes?"],
    "Steroid medicines can raise glucose by affecting insulin action and glucose production. They may worsen established diabetes or reveal new diabetes. The effect depends on the medicine, dose, and duration. A monitoring and treatment review is useful; prescribed steroids should not be stopped abruptly without medical instructions.",
  ],
  [
    "steroid-followup",
    "Glucose after steroid treatment",
    "steroids",
    ["steroid stopping", "after steroids", "steroid taper"],
    ["Does steroid-induced diabetes always go away?"],
    "Glucose may improve when steroid treatment ends, but diabetes can persist in some people. Follow-up glucose testing helps determine what happens. During dose changes, diabetes treatment needs can change too, so the steroid and diabetes prescribers should coordinate the plan.",
  ],
  [
    "type1-resistance",
    "Insulin resistance alongside type 1 diabetes",
    "doubleDiabetes",
    ["double diabetes", "type 1 resistance", "puberty"],
    [
      "Can someone with type 1 diabetes also have insulin resistance?",
      "Why can puberty change insulin needs?",
    ],
    "Yes. Type 1 diabetes involves loss of insulin production, while insulin resistance means the body responds less effectively to insulin. They can occur together. Puberty, pregnancy, steroids, and other factors may increase resistance; this does not mean the original autoimmune diabetes has disappeared.",
  ],
  [
    "infection-risk",
    "Diabetes and infection risk",
    "immune",
    ["infection", "immune system", "healing"],
    ["Why can diabetes make infections harder to fight?"],
    "Diabetes can impair immune defenses, and high glucose can make infection harder to control. Some infections are more common or more severe. Infection can also raise glucose, creating a cycle that makes monitoring and a sick-day plan useful; routine prevention and prompt assessment of concerning symptoms matter.",
  ],
  [
    "vaccine-principle",
    "Vaccination as diabetes prevention care",
    "immune",
    ["vaccination", "vaccines", "immunization"],
    ["Why are vaccines important for people with diabetes?"],
    "Vaccines help prevent infections and reduce severe illness, which is especially useful when diabetes increases complication risk. The vaccines and timing appropriate for a person depend on age, previous doses, and other health factors. A current schedule review with a clinician or pharmacist establishes what is due.",
  ],
  [
    "flu-diabetes",
    "Influenza with diabetes",
    "flu",
    ["flu", "influenza", "sick day"],
    ["Why is flu more concerning with diabetes?"],
    "People with diabetes have a higher risk of serious flu complications, and illness may disrupt glucose control and eating. Flu prevention and a sick-day plan help reduce risk. Symptoms may warrant early contact with a clinician because treatment decisions can be time-sensitive.",
  ],
  [
    "driving-diabetes",
    "Diabetes and driving safety",
    "driving",
    ["driving", "car", "pedals", "road safety"],
    ["Can people with diabetes drive safely?", "How can diabetes affect driving?"],
    "Most people with diabetes can drive safely. Important concerns include low glucose that impairs attention, nerve damage affecting pedal use, and vision problems. A personal plan addresses glucose checks and supplies when relevant; licensing requirements depend on the jurisdiction and should be checked separately.",
  ],
  [
    "driving-low",
    "Low glucose and driving",
    "driving",
    ["driving low", "hypoglycemia driving", "driving confused"],
    ["Why is low blood sugar dangerous while driving?"],
    "Low glucose can impair judgment, reaction time, and coordination. Someone who suspects a low should not continue driving: stop safely and follow their low-glucose treatment plan. Glucose and thinking need to recover before resuming; feeling slightly better alone does not establish that driving is safe.",
  ],
  [
    "hhs",
    "Hyperosmolar hyperglycemic state",
    "hhs",
    ["HHS", "hyperosmolar", "severe dehydration"],
    ["What is HHS?", "Can severe high glucose cause dehydration?"],
    "HHS is a life-threatening emergency involving very high glucose and severe dehydration, often in type 2 diabetes. It can develop over days, sometimes with infection or another illness. Loss of water and rising glucose reinforce each other; suspected HHS needs hospital treatment rather than routine home adjustments.",
  ],
  [
    "hhs-vs-dka",
    "Two different high-glucose emergencies",
    "hhs",
    ["HHS versus DKA", "hyperosmolar ketoacidosis"],
    ["How is HHS different from DKA?"],
    "HHS is characterized mainly by very high glucose and severe dehydration; DKA involves a dangerous buildup of ketone acids from insufficient insulin. They can overlap. Both are emergencies, and symptoms or a glucose number alone cannot reliably distinguish them at home.",
  ],
  [
    "metabolic-surgery",
    "Metabolic surgery and type 2 diabetes",
    "surgeryMetabolic",
    ["metabolic surgery", "bariatric", "gastric bypass", "sleeve"],
    ["Can metabolic surgery improve type 2 diabetes?"],
    "Metabolic or bariatric surgery changes the digestive system and can improve type 2 diabetes in suitable people with obesity. Benefits, surgical risks, nutrition needs, and ongoing follow-up all matter. Eligibility is an individual clinical decision; improvement does not remove the need for future diabetes checks.",
  ],
  [
    "supplement-claims",
    "Supplements and diabetes claims",
    "supplements",
    ["cinnamon", "herbal", "supplement", "vitamin", "natural cure"],
    ["Can supplements replace diabetes medicine?", "Does cinnamon cure diabetes?"],
    "Evidence does not support supplements as a replacement for diabetes treatment or a diabetes cure. A documented nutrient deficiency may need treatment, but that differs from taking a product to lower glucose. Herbal products can have adverse effects or interactions, so review them alongside prescribed medicines.",
  ],
  [
    "celiac-testing",
    "Celiac disease and type 1 diabetes",
    "celiac",
    ["celiac", "coeliac", "gluten", "gluten free"],
    [
      "Why is celiac testing discussed in type 1 diabetes?",
      "Should I stop gluten before a celiac test?",
    ],
    "People with type 1 diabetes have a higher chance of celiac disease and can discuss testing with their clinician. Blood tests and sometimes intestinal biopsy are used. Avoid starting a gluten-free diet before the diagnostic review because removing gluten can affect test results.",
  ],
  [
    "thyroid-autoimmunity",
    "Autoimmune thyroid disease and diabetes",
    "autoimmuneThyroid",
    ["thyroid", "Hashimoto", "hypothyroidism", "autoimmune"],
    ["Why can type 1 diabetes occur with thyroid disease?"],
    "Type 1 diabetes and Hashimoto thyroid disease are autoimmune conditions, and having one autoimmune condition can increase the chance of another. Hashimoto disease can cause an underactive thyroid. Thyroid symptoms and blood tests help guide evaluation; fatigue alone does not determine whether thyroid disease is present.",
  ],
  [
    "heat-diabetes",
    "Heat, dehydration, and glucose",
    "heat",
    ["heat", "hot weather", "summer", "dehydrated"],
    ["How can hot weather affect diabetes?"],
    "Heat can increase dehydration risk and change glucose needs. Diabetes-related nerve or blood-vessel damage may also affect cooling. Drink water as appropriate to your care plan, monitor more closely when needed, and protect medicines, strips, and devices from excessive heat according to their instructions.",
  ],
  [
    "menstrual-patterns",
    "Menstrual hormones and glucose patterns",
    "femaleHormones",
    ["period", "periods", "menstrual", "cycle", "cycles", "hormonal", "hormone changes"],
    ["Can menstrual periods affect blood sugar?"],
    "Hormonal changes across the menstrual cycle can affect glucose levels and insulin needs. Patterns differ between people, so tracking cycle timing alongside glucose, symptoms, food, and activity is more useful than assuming a fixed effect. Repeated patterns can be reviewed with the diabetes team.",
  ],
  [
    "menopause-patterns",
    "Menopause and changing diabetes needs",
    "menopause",
    ["menopause", "perimenopause", "hot flushes"],
    ["Can menopause change blood sugar patterns?"],
    "Hormonal changes during perimenopause and menopause can make glucose patterns less predictable, alongside changes in sleep, activity, and weight. Symptoms such as sweating can also resemble low glucose. Monitoring and a review of symptoms and treatment help separate the causes and adapt care.",
  ],
];

export const diabetesKnowledge = seeds.map(
  ([slug, title, reference, keywords, questions, answer]) => ({
    id: `KB-${slug.toUpperCase()}`,
    title,
    organization: references[reference][0],
    href: references[reference][1],
    summary: answer,
    keywords,
    questions,
  }),
) satisfies readonly (AiCredibleSourceContext & {
  readonly keywords: readonly string[];
  readonly questions: readonly string[];
})[];

const key = (text: string) =>
  normalizeAiQuery(text)
    .replace(/what['’]s\b/g, "what is")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const directAnswers = new Map(
  diabetesKnowledge.flatMap((entry) =>
    entry.questions.map((question) => [key(question), entry] as const),
  ),
);

export function diabetesAnswerFor(question: string) {
  const entry = directAnswers.get(key(question));
  return entry ? { answer: entry.summary, reviewedSourceKeys: [entry.id] } : null;
}

const stopWords = new Set([
  "how",
  "why",
  "can",
  "are",
  "the",
  "and",
  "for",
  "from",
  "into",
  "work",
  "works",
  "what",
  "which",
  "does",
  "this",
  "that",
  "with",
  "have",
  "about",
  "please",
  "explain",
  "could",
  "would",
  "should",
  "diabetes",
  "diabetic",
  "blood",
  "sugar",
  "glucose",
  "someone",
]);
const terms = (text: string) =>
  new Set(
    key(text)
      .split(" ")
      .filter((word) => word.length > 2 && !stopWords.has(word))
      .map((word) =>
        word.length > 4 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word,
      ),
  );

/** Retrieval-only synonyms. Preserve the original question for Gemini and
 * safety checks; these phrases help select evidence, not choose an answer. */
function retrievalQuery(text: string) {
  return normalizeAiQuery(text)
    .replace(/\b(?:waking up|wake up|first thing|before breakfast)\b/g, "$& morning dawn")
    .replace(/\b(?:tummy|belly)\b/g, "$& stomach")
    .replace(/\b(?:poop|poo)\b/g, "$& stools")
    .replace(
      /\b(?:sugars?|readings?) (?:shoot|jump|spike|go|climb)(?:s|ing)? up\b/g,
      "$& glucose rise",
    )
    .replace(
      /\b(?:not feel|cannot feel|cant feel|can't feel|dont feel|don't feel|no warning)\b/g,
      "$& unawareness",
    )
    .replace(
      /\b(?:cant|can't|cannot|dont|don't) (?:someone |people |they |i )?feel\b/g,
      "$& unawareness",
    )
    .replace(/\b(?:prick|poke|poking)\b/g, "$& fingertip")
    .replace(/\b(?:periods?|monthly cycle)\b/g, "$& menstrual")
    .replace(/\b(?:runs? in (?:my |the )?family)\b/g, "$& inherited genetic")
    .replace(/\b(?:going low|go low|lows)\b/g, "$& hypoglycemia");
}

const searchIndex = diabetesKnowledge.map((entry) => ({
  entry,
  titleTerms: terms(entry.title),
  answerTerms: terms(entry.summary),
  questionTerms: terms(entry.questions.join(" ")),
  phrases: entry.keywords
    .filter((phrase) => terms(phrase).size)
    .map((phrase) => ` ${key(phrase)} `),
}));

/** Retrieve full explanations locally, including misspellings and follow-ups. */
export function diabetesKnowledgeFor(
  question: string,
  previousQuestion?: string,
): readonly AiCredibleSourceContext[] {
  function ranked(query: string) {
    const expanded = retrievalQuery(query);
    const normalized = key(expanded);
    const queryKey = ` ${normalized} `;
    const queryTerms = terms(expanded);
    const direct = directAnswers.get(key(query));
    const definitionSubject = definitionSubjectFor(query);
    return searchIndex
      .map(({ entry, titleTerms, answerTerms, questionTerms, phrases }) => {
        const phraseScore = phrases.reduce(
          (score, phrase) => (queryKey.includes(phrase) ? score + 6 : score),
          0,
        );
        const score =
          (definitionSubject && key(entry.title) === key(definitionSubject) ? 100 : 0) +
          (direct === entry ? 1000 : 0) +
          phraseScore +
          [...queryTerms].reduce(
            (sum, term) =>
              sum +
              (titleTerms.has(term)
                ? 4
                : questionTerms.has(term)
                  ? 2
                  : answerTerms.has(term)
                    ? 1
                    : 0),
            0,
          );
        return { entry, score };
      })
      .filter(({ score }) => score >= 3)
      .sort((a, b) => b.score - a.score);
  }
  const current = ranked(question);
  const currentTerms = terms(retrievalQuery(question));
  const namesTopic = searchIndex.some(({ titleTerms }) =>
    [...currentTerms].some((term) => titleTerms.has(term)),
  );
  if (
    !namesTopic &&
    previousQuestion &&
    /\b(it|that|those|they|them|this|simpler|again)\b/i.test(question)
  ) {
    const contextual = ranked(`${previousQuestion} ${question}`);
    return [
      ...new Map([...contextual, ...current].map(({ entry }) => [entry.id, entry])).values(),
    ].slice(0, 12);
  }
  const matches = current.length || !previousQuestion ? current : ranked(previousQuestion);
  return matches.slice(0, 12).map(({ entry }) => entry);
}

/** Rich relevant explanations take priority, followed by glossary definitions
 * and core references. Reserve room for the question and conversation history. */
export function boundedDiabetesKnowledge(sources: readonly AiCredibleSourceContext[]) {
  const selected: AiCredibleSourceContext[] = [];
  const seen = new Set<string>();
  let characters = 0;
  for (const source of sources) {
    const size =
      JSON.stringify({
        id: source.id,
        title: source.title,
        organization: source.organization,
        summary: source.summary,
      }).length + 1;
    if (seen.has(source.id) || characters + size > 22_000) continue;
    selected.push(source);
    seen.add(source.id);
    characters += size;
  }
  return selected;
}

/** Give Gemini every topic card, plus core references and relevant glossary
 * entries. Local question ranking is reserved for the provider-outage fallback. */
export function diabetesSourceBank(additionalSources: readonly AiCredibleSourceContext[]) {
  const bank = new Map<string, AiCredibleSourceContext>();
  let characters = 0;
  for (const source of [...diabetesKnowledge, ...additionalSources]) {
    if (bank.has(source.id)) continue;
    const size =
      JSON.stringify({
        id: source.id,
        title: source.title,
        organization: source.organization,
        summary: source.summary,
      }).length + 1;
    if (characters + size > 116_000) continue;
    bank.set(source.id, source);
    characters += size;
  }
  return [...bank.values()];
}
