import type { NutritionLabel } from "@/features/decode-the-label/types/decode-the-label";

import styles from "../styles/decode-the-label.module.css";

type NutritionFactsProps = {
  readonly compact?: boolean;
  readonly label: NutritionLabel;
};

function NutritionRow({
  label,
  value,
  indented = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly indented?: boolean;
}) {
  return (
    <div className={indented ? styles.nutritionRowIndented : styles.nutritionRow}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function NutritionFacts({ compact = false, label }: NutritionFactsProps) {
  return (
    <section
      aria-label={`Nutrition facts for ${label.name}`}
      className={`${styles.nutritionLabel} ${compact ? styles.nutritionLabelCompact : ""}`}
    >
      <p className={styles.productName}>{label.name}</p>
      <h2>Nutrition Facts</h2>
      {label.servingsPerContainer ? (
        <p className={styles.servings}>
          About {label.servingsPerContainer.replace("about ", "")} servings per container
        </p>
      ) : null}
      <dl>
        <NutritionRow label="Serving size" value={label.servingSize} />
        <div className={styles.caloriesRow}>
          <dt>Calories</dt>
          <dd>{label.calories}</dd>
        </div>
        {label.totalFat ? <NutritionRow label="Total Fat" value={label.totalFat} /> : null}
        {label.saturatedFat ? (
          <NutritionRow indented label="Saturated Fat" value={label.saturatedFat} />
        ) : null}
        {label.sodium ? <NutritionRow label="Sodium" value={label.sodium} /> : null}
        <NutritionRow label="Total Carbohydrate" value={label.totalCarbohydrate} />
        <NutritionRow indented label="Dietary Fiber" value={label.dietaryFiber} />
        {label.totalSugars ? (
          <NutritionRow indented label="Total Sugars" value={label.totalSugars} />
        ) : null}
        <NutritionRow indented label="Includes Added Sugars" value={label.addedSugars} />
        <NutritionRow label="Protein" value={label.protein} />
      </dl>
      <p className={styles.educationalLabel}>Fictional label for educational practice</p>
    </section>
  );
}
