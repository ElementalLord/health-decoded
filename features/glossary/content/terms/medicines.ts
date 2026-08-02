import { createEntries } from "./create-entries";

export const medicineTerms = createEntries(
  "Medicines and treatments",
  ["SRC-FDA-MEDS", "SRC-ADA-TERMS", "SRC-HD-LESSONS"],
  [
    [
      "Prescription",
      "An instruction from an authorized health professional for a medicine, device, or treatment.",
    ],
    [
      "Generic medicine",
      "A medicine with the same active ingredient and intended clinical use as its approved brand-name version.",
      {
        confused: {
          term: "Brand-name medicine",
          explanation:
            "Generic and brand-name versions may look different, but approved versions share the same active ingredient and intended use.",
        },
      },
    ],
    [
      "Brand-name medicine",
      "A medicine sold under a company’s chosen product name.",
      {
        confused: {
          term: "Generic medicine",
          explanation:
            "A brand name identifies a product. The generic name identifies its active medicine ingredient.",
        },
      },
    ],
    [
      "Dose",
      "The amount of medicine taken or given at one time.",
      {
        confused: {
          term: "Dosage",
          explanation:
            "Dose is the amount at one time. Dosage describes how much, how often, and sometimes for how long.",
        },
      },
    ],
    [
      "Dosage",
      "The planned amount, timing, and frequency for using a medicine.",
      {
        confused: {
          term: "Dose",
          explanation: "A dose is one amount. Dosage describes the broader schedule for using it.",
        },
      },
    ],
    ["Medication schedule", "The written or agreed timing for taking medicines."],
    [
      "Side effect",
      "An effect that can happen in addition to a medicine’s intended effect.",
      {
        confused: {
          term: "Adverse effect",
          explanation:
            "Side effect is a broad term for additional effects. Adverse effect usually refers to an unwanted or harmful effect.",
        },
      },
    ],
    ["Adverse effect", "An unwanted or harmful effect associated with a medicine or treatment."],
    [
      "Drug interaction",
      "A change in how a medicine works when it is combined with another medicine, substance, food, or supplement.",
    ],
    [
      "Contraindication",
      "A reason a particular medicine or procedure may be unsafe or inappropriate in a specific situation.",
    ],
    [
      "Missed dose",
      "A scheduled medicine dose that was not taken at its planned time. Instructions vary by medicine.",
    ],
    ["Refill", "An additional supply of a prescribed medicine authorized under the prescription."],
    [
      "Metformin",
      "A medicine commonly used in Type 2 diabetes that primarily reduces glucose release by the liver and improves insulin response.",
      { misspellings: ["metphormin"] },
    ],
    [
      "Basal insulin",
      "Longer-acting insulin intended to provide background insulin between meals and overnight.",
      {
        confused: {
          term: "Mealtime insulin",
          explanation:
            "Basal insulin provides background coverage. Mealtime insulin is used in relation to food according to a care plan.",
        },
      },
    ],
    [
      "Mealtime insulin",
      "Insulin used in relation to meals according to an individual treatment plan.",
      {
        aliases: ["Bolus insulin"],
        confused: {
          term: "Basal insulin",
          explanation:
            "Mealtime insulin is timed around food. Basal insulin provides longer background coverage.",
        },
      },
    ],
    [
      "Rapid-acting insulin",
      "Insulin designed to begin working relatively quickly and last for a shorter period than long-acting insulin.",
    ],
    ["Long-acting insulin", "Insulin designed to work gradually for an extended period."],
    [
      "GLP-1 receptor agonist",
      "A class of medicines that acts on GLP-1 pathways involved in glucose regulation, digestion, appetite, and fullness.",
      { abbreviation: "GLP-1" },
    ],
    [
      "Dual GIP and GLP-1 receptor agonist",
      "A class of medicines that acts on both GIP and GLP-1 pathways involved in glucose regulation and digestion.",
      { aliases: ["Dual incretin receptor agonist"] },
    ],
    [
      "SGLT2 inhibitor",
      "A class of medicines that helps the kidneys release some glucose through urine.",
      { abbreviation: "SGLT2" },
    ],
    [
      "DPP-4 inhibitor",
      "A class of medicines that helps incretin hormones remain active longer, supporting glucose-dependent insulin release.",
      { abbreviation: "DPP-4" },
    ],
    ["Sulfonylurea", "A class of medicines that prompts the pancreas to release more insulin."],
    [
      "Thiazolidinedione",
      "A class of medicines that improves how some body tissues respond to insulin.",
      { abbreviation: "TZD" },
    ],
    [
      "Glucagon",
      "A hormone that raises blood glucose. Prescription glucagon products may be used for severe hypoglycemia according to their instructions.",
    ],
    [
      "Insulin regimen",
      "The overall insulin plan prescribed by a diabetes care team, including the types and timing of insulin.",
    ],
    [
      "Premixed insulin",
      "An insulin product that combines two types of insulin in a set proportion.",
    ],
    [
      "Concentrated insulin",
      "An insulin product with more insulin in each unit of liquid than a standard concentration. Products are used only with their matching instructions and devices.",
    ],
    [
      "Insulin cartridge",
      "A container of insulin designed for use with a compatible reusable insulin pen or pump system.",
    ],
    [
      "Pen needle",
      "A short disposable needle attached to a compatible insulin pen for an injection.",
    ],
    [
      "Infusion set",
      "The tubing and small cannula or patch that connects an insulin pump to the body.",
    ],
    [
      "Patch pump",
      "A tubeless insulin pump worn directly on the body that delivers insulin through a small cannula.",
    ],
    [
      "Insulin storage",
      "Keeping insulin according to the product instructions so it remains usable until its labeled expiration or in-use date.",
    ],
    [
      "Injection site rotation",
      "Using different recommended body areas for insulin injections over time to help protect the skin and tissue.",
    ],
    [
      "Medication adherence",
      "Taking or using medicine as agreed in a care plan. Barriers can include cost, side effects, access, and daily routines.",
    ],
  ],
);
