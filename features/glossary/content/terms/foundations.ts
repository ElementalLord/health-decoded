import { createEntries } from "./create-entries";

export const foundationTerms = createEntries(
  "Foundations",
  ["SRC-NIDDK-OVERVIEW", "SRC-ADA-TERMS", "SRC-HD-LESSONS"],
  [
    [
      "Diabetes",
      "A chronic condition in which blood glucose is higher than the body can manage effectively.",
      { aliases: ["Diabetes mellitus"], misspellings: ["diabtes"] },
    ],
    [
      "Type 1 diabetes",
      "A type of diabetes in which the immune system damages the pancreas cells that make insulin.",
      {
        confused: {
          term: "Type 2 diabetes",
          explanation:
            "Type 1 is an autoimmune condition with little or no insulin production. Type 2 involves insulin resistance and changes in insulin production.",
        },
      },
    ],
    [
      "Type 2 diabetes",
      "A type of diabetes in which the body does not use insulin effectively and may not make enough insulin over time.",
      {
        confused: {
          term: "Type 1 diabetes",
          explanation:
            "Type 2 is not a later or more severe form of Type 1. The conditions have different underlying processes.",
        },
      },
    ],
    [
      "Prediabetes",
      "A condition in which blood glucose is higher than expected but does not meet the criteria used to diagnose diabetes.",
      {
        confused: {
          term: "Diabetes",
          explanation:
            "Prediabetes and diabetes use different diagnostic criteria. A health professional uses appropriate testing to make the distinction.",
        },
      },
    ],
    [
      "Gestational diabetes",
      "Diabetes first diagnosed during pregnancy in someone who did not already have diabetes.",
    ],
    [
      "Blood glucose",
      "The amount of glucose present in the blood at a particular time.",
      {
        aliases: ["Blood sugar"],
        confused: {
          term: "A1C",
          explanation:
            "A blood glucose reading reflects one moment. A1C estimates average glucose over a longer period.",
        },
      },
    ],
    [
      "Glucose",
      "A type of sugar that travels in the blood and can be used by cells for energy.",
      { misspellings: ["glocose"] },
    ],
    ["Insulin", "A hormone made by the pancreas that helps the body manage glucose."],
    [
      "Insulin resistance",
      "A condition in which cells do not respond to insulin as effectively as they should.",
    ],
    ["Insulin sensitivity", "How effectively the body’s cells respond to insulin."],
    ["Pancreas", "An organ that makes insulin and substances involved in digestion."],
    ["Beta cell", "A cell in the pancreas that makes and releases insulin."],
    ["Liver", "An organ that stores and releases glucose as part of the body’s energy system."],
    ["Hormone", "A chemical messenger made in the body that sends signals to cells or organs."],
    [
      "Metabolism",
      "The body’s processes for turning food and stored nutrients into energy and other materials it needs.",
    ],
    [
      "Hyperglycemia",
      "Blood glucose that is higher than a person’s intended range.",
      {
        confused: {
          term: "Hypoglycemia",
          explanation: "Hyperglycemia means higher glucose; hypoglycemia means lower glucose.",
        },
      },
    ],
    [
      "Hypoglycemia",
      "Blood glucose that is lower than a person’s intended range.",
      {
        confused: {
          term: "Hyperglycemia",
          explanation: "Hypoglycemia means lower glucose; hyperglycemia means higher glucose.",
        },
      },
    ],
    [
      "Diagnosis",
      "The identification of a condition by a qualified health professional using appropriate information and tests.",
    ],
    [
      "Risk factor",
      "A characteristic or circumstance associated with a greater chance of developing a condition. It does not guarantee that the condition will occur.",
    ],
    [
      "Chronic condition",
      "A health condition that lasts a long time and may need ongoing care or management.",
    ],
    [
      "Complication",
      "A health problem that can develop in connection with another condition. A complication is not inevitable.",
      {
        confused: {
          term: "Symptom",
          explanation:
            "A symptom is something a person experiences. A complication is an additional health problem connected with a condition.",
        },
      },
    ],
    [
      "Remission",
      "A period when Type 2 diabetes measures remain below the diabetes range without glucose-lowering medicine. Remission is not the same as a permanent cure.",
      {
        confused: {
          term: "Cure",
          explanation:
            "Remission may last for a time and still needs follow-up. A cure would mean the condition cannot return.",
        },
      },
    ],
    [
      "Autoimmune disease",
      "A condition in which the immune system mistakenly attacks the body’s own healthy cells or tissues.",
      { sourceIds: ["SRC-MEDLINEPLUS-AUTOIMMUNE", "SRC-ADA-TERMS"] },
    ],
    [
      "Autoantibody",
      "A protein made by the immune system that mistakenly targets the body’s own cells or tissues.",
      { sourceIds: ["SRC-NIDDK-TESTS", "SRC-MEDLINEPLUS-AUTOANTIBODY"] },
    ],
    [
      "Islet",
      "A cluster of cells in the pancreas that includes beta cells, which make insulin.",
      { aliases: ["Islet of Langerhans"], sourceIds: ["SRC-NIDDK-ISLETS", "SRC-ADA-INSULIN"] },
    ],
    [
      "Monogenic diabetes",
      "A group of uncommon forms of diabetes caused by a change in a single gene.",
      { sourceIds: ["SRC-NIDDK-MONOGENIC", "SRC-NIDDK-TESTS"] },
    ],
    [
      "Maturity-onset diabetes of the young",
      "A group of monogenic diabetes conditions that typically begin before age 30, although they can occur later.",
      { abbreviation: "MODY", sourceIds: ["SRC-NIDDK-MONOGENIC", "SRC-MEDLINEPLUS-MODY"] },
    ],
    [
      "Alpha cell",
      "A cell in a pancreatic islet that makes and releases glucagon when the body needs glucose raised.",
      { sourceIds: ["SRC-NIDDK-ISLETS", "SRC-ADA-TERMS"] },
    ],
    [
      "Latent autoimmune diabetes in adults",
      "A slowly progressing form of autoimmune Type 1 diabetes that begins in adulthood.",
      { abbreviation: "LADA", sourceIds: ["SRC-ADA-LADA", "SRC-ADA-TERMS"] },
    ],
    [
      "Neonatal diabetes mellitus",
      "A rare monogenic form of diabetes that begins during infancy, usually within the first 6 months after birth.",
      { abbreviation: "NDM", sourceIds: ["SRC-NIDDK-MONOGENIC", "SRC-MEDLINEPLUS-NEONATAL"] },
    ],
    [
      "Impaired fasting glucose",
      "A term for prediabetes identified by a fasting plasma glucose result in the prediabetes range.",
      { abbreviation: "IFG", sourceIds: ["SRC-NIDDK-TESTS", "SRC-ADA-DIAGNOSIS"] },
    ],
    [
      "Impaired glucose tolerance",
      "A term for prediabetes identified by an oral glucose tolerance test result in the prediabetes range.",
      { abbreviation: "IGT", sourceIds: ["SRC-NIDDK-TESTS", "SRC-ADA-DIAGNOSIS"] },
    ],
  ],
);
