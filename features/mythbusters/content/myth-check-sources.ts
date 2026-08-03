import type { MythCheckSource } from "@/features/mythbusters/types/myth-check";

const accessedAt = "2026-08-02";

const sourceSeeds = [
  ["ADA_MYTHS", "American Diabetes Association", "Know Your Facts About Diabetes", "https://diabetes.org/about-diabetes/diabetes-myths"],
  ["ADA_TYPE2", "American Diabetes Association", "Understanding Type 2 Diabetes", "https://diabetes.org/about-diabetes/type-2"],
  ["ADA_CARBS", "American Diabetes Association", "Understanding Carbs", "https://diabetes.org/food-nutrition/understanding-carbs"],
  ["ADA_CARB_TYPES", "American Diabetes Association", "Get to Know Carbs", "https://diabetes.org/food-nutrition/understanding-carbs/get-to-know-carbs"],
  ["ADA_FRUIT", "American Diabetes Association", "Fruit and Diabetes", "https://diabetes.org/food-nutrition/reading-food-labels/fruit"],
  ["ADA_EATING", "American Diabetes Association", "Eating Well and Managing Diabetes", "https://diabetes.org/food-nutrition/eating-healthy"],
  ["ADA_A1C", "American Diabetes Association", "Understanding A1C", "https://diabetes.org/about-diabetes/a1c"],
  ["ADA_CHECKS", "American Diabetes Association", "Type 2 and Blood Glucose Checks", "https://diabetes.org/about-diabetes/devices-technology/blood-sugar-checks-type-2"],
  ["CDC_TYPE2", "Centers for Disease Control and Prevention", "Type 2 Diabetes", "https://www.cdc.gov/diabetes/about/about-type-2-diabetes.html"],
  ["CDC_TESTING", "Centers for Disease Control and Prevention", "Diabetes Testing", "https://www.cdc.gov/diabetes/diabetes-testing/index.html"],
  ["CDC_PREDIABETES", "Centers for Disease Control and Prevention", "Prediabetes: Your Chance to Prevent Type 2 Diabetes", "https://www.cdc.gov/diabetes/prevention-type-2/prediabetes-prevent-type-2.html"],
  ["CDC_CARBS", "Centers for Disease Control and Prevention", "Carb Counting", "https://www.cdc.gov/diabetes/healthy-eating/carb-counting-manage-blood-sugar.html"],
  ["CDC_A1C", "Centers for Disease Control and Prevention", "A1C Test for Diabetes and Prediabetes", "https://www.cdc.gov/diabetes/diabetes-testing/prediabetes-a1c-test.html"],
  ["CDC_MONITORING", "Centers for Disease Control and Prevention", "Monitoring Your Blood Sugar", "https://www.cdc.gov/diabetes/diabetes-testing/monitoring-blood-sugar.html"],
  ["CDC_RISK_TEST", "Centers for Disease Control and Prevention", "About the Prediabetes Risk Test", "https://www.cdc.gov/prediabetes/risktest/about-the-test.html"],
  ["NIDDK_A1C", "National Institute of Diabetes and Digestive and Kidney Diseases", "The A1C Test and Diabetes", "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test"],
  ["NIDDK_TESTING", "National Institute of Diabetes and Digestive and Kidney Diseases", "Diabetes Tests and Diagnosis", "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis"],
  ["NIDDK_REMISSION", "National Institute of Diabetes and Digestive and Kidney Diseases", "Achieving Type 2 Diabetes Remission Through Weight Loss", "https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/achieving-type-2-diabetes-remission-through-weight-loss"],
  ["NIDDK_MANAGEMENT", "National Institute of Diabetes and Digestive and Kidney Diseases", "Managing Diabetes", "https://www.niddk.nih.gov/health-information/diabetes/overview/managing-diabetes"],
  ["FDA_DIABETES_SCAMS", "U.S. Food and Drug Administration", "Illegally Sold Diabetes Treatments", "https://www.fda.gov/consumers/health-fraud-scams/illegally-sold-diabetes-treatments"],
  ["FDA_HEALTH_FRAUD", "U.S. Food and Drug Administration", "Health Fraud Scams", "https://www.fda.gov/consumers/health-fraud-scams"],
  ["FDA_SCAM_SIGNS", "U.S. Food and Drug Administration", "Six Tip-offs to Rip-offs", "https://www.fda.gov/consumers/consumer-updates/6-tip-offs-rip-offs-dont-fall-health-fraud-scams"],
] as const;

export const mythCheckSources = sourceSeeds.map(([id, organization, title, url]) => ({
  id,
  organization,
  title,
  url,
  accessedAt,
})) satisfies MythCheckSource[];

export const mythCheckSourceById: ReadonlyMap<string, MythCheckSource> = new Map(
  mythCheckSources.map((source) => [source.id, source]),
);
