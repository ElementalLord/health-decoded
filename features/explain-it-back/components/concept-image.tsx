import Image from "next/image";

import styles from "../styles/explain-it-back.module.css";

const conceptImages: Record<string, { alt: string; src: string }> = {
  "blood-glucose": {
    alt: "Watercolor ribbon carrying glucose dots toward an energy star",
    src: "/explain-it-back/concepts/blood-glucose-v2.png",
  },
  insulin: {
    alt: "Watercolor key opening a doorway for glucose dots",
    src: "/explain-it-back/concepts/insulin-v2.png",
  },
  "insulin-resistance": {
    alt: "Watercolor keys beside a partly closed doorway and waiting glucose dots",
    src: "/explain-it-back/concepts/insulin-resistance-v2.png",
  },
  "type-2-diabetes": {
    alt: "Watercolor signal, open doorway, and remaining glucose dots",
    src: "/explain-it-back/concepts/type-2-diabetes-v2.png",
  },
  a1c: {
    alt: "Watercolor marked discs following a ribbon toward a time symbol",
    src: "/explain-it-back/concepts/a1c-v2.png",
  },
  "a1c-vs-glucose": {
    alt: "Watercolor comparison of one magnified dot with many dots over time",
    src: "/explain-it-back/concepts/a1c-vs-glucose-v2.png",
  },
  carbohydrates: {
    alt: "Watercolor carbohydrate foods becoming glucose dots",
    src: "/explain-it-back/concepts/carbohydrates-v2.png",
  },
  "serving-size": {
    alt: "Watercolor small and large bowls of the same food",
    src: "/explain-it-back/concepts/serving-size-v2.png",
  },
  "total-vs-added-sugars": {
    alt: "Watercolor fruit and sugar being added to a bowl",
    src: "/explain-it-back/concepts/total-vs-added-sugars-v2.png",
  },
  "total-carbohydrate": {
    alt: "Watercolor basket of carbohydrate foods with a smaller sugar bowl",
    src: "/explain-it-back/concepts/total-carbohydrate-v2.png",
  },
};

export function ConceptImage({ id }: { id: string }) {
  const image = conceptImages[id];
  if (!image) return null;

  return (
    <div className={styles.conceptVisual}>
      <Image
        alt={image.alt}
        className={styles.conceptImage}
        height={866}
        sizes="(max-width: 42rem) 34vw, (max-width: 56rem) 38vw, 15rem"
        src={image.src}
        width={1817}
      />
    </div>
  );
}
