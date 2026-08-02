import { createEntries } from "./create-entries";

export const testAndMonitoringTerms = createEntries(
  "Tests and monitoring",
  ["SRC-NIDDK-TESTS", "SRC-ADA-TERMS", "SRC-HD-LESSONS"],
  [
    [
      "A1C",
      "A blood test that estimates average glucose over roughly the previous two to three months.",
      {
        aliases: ["Hemoglobin A1C", "HbA1c"],
        confused: {
          term: "Blood glucose reading",
          explanation:
            "A blood glucose reading shows glucose at one moment. A1C estimates an average over a longer period.",
        },
      },
    ],
    [
      "Fasting blood glucose",
      "A laboratory blood glucose test taken after a period without food, usually overnight.",
      { abbreviation: "FPG", aliases: ["Fasting glucose", "Fasting plasma glucose"] },
    ],
    [
      "Random plasma glucose",
      "A laboratory blood glucose test taken without a required fasting period.",
      { abbreviation: "RPG", aliases: ["Random glucose"] },
    ],
    [
      "Oral glucose tolerance test",
      "A test that measures blood glucose before and after a person drinks a measured glucose solution.",
      { abbreviation: "OGTT" },
    ],
    [
      "Blood glucose monitoring",
      "Checking blood glucose with an approved device according to a person’s care plan.",
    ],
    [
      "Blood glucose meter",
      "A device that uses a small blood sample and test strip to measure glucose at that moment.",
      {
        abbreviation: "BGM",
        aliases: ["Glucose meter"],
        confused: {
          term: "Continuous glucose monitor",
          explanation:
            "A meter checks a blood sample at one moment. A CGM estimates glucose repeatedly through a sensor.",
        },
      },
    ],
    [
      "Continuous glucose monitor",
      "A system that uses a sensor to estimate glucose levels repeatedly throughout the day and night.",
      {
        abbreviation: "CGM",
        confused: {
          term: "Blood glucose meter",
          explanation:
            "A CGM gives repeated sensor readings. A blood glucose meter checks a blood sample at one moment.",
        },
      },
    ],
    [
      "Continuous glucose monitor sensor",
      "The wearable part of a continuous glucose monitor that estimates glucose repeatedly.",
      { aliases: ["CGM sensor", "Sensor"] },
    ],
    [
      "Test strip",
      "A disposable strip used with a compatible meter and small blood sample to measure glucose.",
    ],
    ["Lancet", "A small sharp tool used to make a shallow skin puncture for a drop of blood."],
    [
      "Target range",
      "The range a person and their health-care team agree to use when reviewing a health measurement.",
    ],
    [
      "Time in range",
      "The percentage of time sensor glucose readings are within a range selected for diabetes management.",
      { abbreviation: "TIR" },
    ],
    [
      "Ketones",
      "Substances the body makes when it breaks down fat for energy. A health professional can explain when ketone testing is needed.",
    ],
    [
      "Blood test",
      "A test performed on a blood sample to measure or examine something in the body.",
    ],
    [
      "Urine test",
      "A test performed on a urine sample to look for or measure particular substances.",
    ],
    [
      "Blood pressure",
      "The force of blood pushing against artery walls, usually recorded as two numbers.",
    ],
    [
      "Lipid panel",
      "A blood test that measures several fats in the blood, often including cholesterol and triglycerides.",
    ],
    [
      "Cholesterol",
      "A waxy substance the body uses to build cells and hormones. It also travels in the blood in particles called lipoproteins.",
    ],
    [
      "LDL cholesterol",
      "Cholesterol carried mainly in low-density lipoprotein particles.",
      {
        abbreviation: "LDL",
        confused: {
          term: "HDL cholesterol",
          explanation:
            "LDL and HDL are different particles that carry cholesterol through the blood.",
        },
      },
    ],
    [
      "HDL cholesterol",
      "Cholesterol carried mainly in high-density lipoprotein particles.",
      {
        abbreviation: "HDL",
        confused: {
          term: "LDL cholesterol",
          explanation:
            "HDL and LDL are different particles that carry cholesterol through the blood.",
        },
      },
    ],
    ["Triglycerides", "A form of fat that circulates in the blood and stores energy."],
    [
      "Creatinine",
      "A waste product measured in blood and sometimes urine as part of checking kidney function.",
    ],
    [
      "Estimated glomerular filtration rate",
      "An estimate based on a blood test that helps describe how well the kidneys filter blood.",
      { abbreviation: "eGFR" },
    ],
    [
      "Urine albumin-to-creatinine ratio",
      "A urine test that compares albumin with creatinine to look for signs of kidney damage.",
      { abbreviation: "UACR" },
    ],
    [
      "Body mass index",
      "A calculation based on height and weight used as one general screening measure. It does not directly measure health or body composition.",
      { abbreviation: "BMI" },
    ],
    [
      "Ambulatory glucose profile",
      "A standardized report that summarizes continuous glucose monitor patterns over several days.",
      { abbreviation: "AGP" },
    ],
    [
      "CGM trend arrow",
      "A symbol on a continuous glucose monitor that shows the direction and speed glucose is changing.",
      { aliases: ["Trend arrow"] },
    ],
    [
      "Control solution",
      "A liquid used to check whether a blood glucose meter and test strips are working together as expected.",
    ],
    [
      "Glucose management indicator",
      "An estimate based on continuous glucose monitor readings that may be compared with A1C. It is not the same laboratory test as A1C.",
      { abbreviation: "GMI" },
    ],
    [
      "Glucose pattern",
      "A repeated change or trend in glucose readings that may be reviewed with a diabetes care team.",
    ],
    [
      "Glucose log",
      "A record of glucose readings and related details such as meals, activity, medicines, or symptoms.",
    ],
    [
      "Intermittently scanned continuous glucose monitor",
      "A continuous glucose monitor that requires scanning the sensor with a reader or phone to view stored glucose readings.",
      { abbreviation: "isCGM", aliases: ["Flash glucose monitor"] },
    ],
    [
      "Time above range",
      "The percentage of time sensor glucose readings are above the range selected for diabetes management.",
      { abbreviation: "TAR" },
    ],
    [
      "Coefficient of variation",
      "A calculation used on glucose reports to describe how much readings vary around their average.",
      { abbreviation: "CV" },
    ],
    [
      "Ketone testing",
      "Checking blood or urine for ketones during situations identified in a person’s diabetes sick-day or safety plan.",
    ],
  ],
);
