/**
 * Shared, reviewed vocabulary for recognizing general diabetes-medication questions.
 * Keep brand names beside their generic names so classification and evidence retrieval
 * cannot drift into different allow/refuse behavior.
 */
export const GLP1_MEDICATION_TERM_PATTERN =
  "(?:glp-?1(?: receptor)? agonists?|incretin mimetics?|mounjaro|tirzepatide|zepbound|ozempic|semaglutide|rybelsus|wegovy|trulicity|dulaglutide|victoza|liraglutide|byetta|exenatide|adlyxin|lixisenatide)";

export const SGLT2_MEDICATION_TERM_PATTERN =
  "(?:sglt-?2 inhibitors?|jardiance|empagliflozin|farxiga|dapagliflozin|invokana|canagliflozin|steglatro|ertugliflozin)";

export const DPP4_MEDICATION_TERM_PATTERN =
  "(?:dpp-?4 inhibitors?|januvia|zituvio|sitagliptin|tradjenta|linagliptin|onglyza|saxagliptin|nesina|alogliptin)";

export const SULFONYLUREA_MEDICATION_TERM_PATTERN =
  "(?:sulfonylureas?|glipizide|glucotrol|glyburide|diabeta|glynase|glimepiride|amaryl)";

export const TZD_MEDICATION_TERM_PATTERN =
  "(?:thiazolidinediones?|tzd|pioglitazone|actos|rosiglitazone|avandia)";

export const METFORMIN_MEDICATION_TERM_PATTERN =
  "(?:biguanides?|metformin|fortamet|glucophage|glumetza|riomet)";

export const INSULIN_MEDICATION_TERM_PATTERN =
  "(?:insulin|basal insulin|bolus insulin|rapid-acting insulin|short-acting insulin|intermediate-acting insulin|long-acting insulin)";

export const DIABETES_MEDICATION_TERM_PATTERN = `(?:medications?|medicines?|prescriptions?|drugs?|doses?|dosages?|${GLP1_MEDICATION_TERM_PATTERN}|${SGLT2_MEDICATION_TERM_PATTERN}|${DPP4_MEDICATION_TERM_PATTERN}|${SULFONYLUREA_MEDICATION_TERM_PATTERN}|${TZD_MEDICATION_TERM_PATTERN}|${METFORMIN_MEDICATION_TERM_PATTERN}|${INSULIN_MEDICATION_TERM_PATTERN})`;

const pattern = (source: string) => new RegExp(`\\b${source}\\b`, "i");

export const diabetesMedicationPattern = pattern(DIABETES_MEDICATION_TERM_PATTERN);
export const glp1MedicationPattern = pattern(GLP1_MEDICATION_TERM_PATTERN);
export const sglt2MedicationPattern = pattern(SGLT2_MEDICATION_TERM_PATTERN);
export const dpp4MedicationPattern = pattern(DPP4_MEDICATION_TERM_PATTERN);
export const sulfonylureaMedicationPattern = pattern(SULFONYLUREA_MEDICATION_TERM_PATTERN);
export const tzdMedicationPattern = pattern(TZD_MEDICATION_TERM_PATTERN);
export const metforminMedicationPattern = pattern(METFORMIN_MEDICATION_TERM_PATTERN);
