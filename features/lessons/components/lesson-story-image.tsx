import Image from "next/image";

import styles from "./lesson-story-image.module.css";

type LessonStoryImageProps = {
  alt: string;
  caption: string;
  emphasis: string;
  height?: number;
  priority?: boolean;
  src: string;
  width?: number;
};

export function LessonStoryImage({
  alt,
  caption,
  emphasis,
  height = 928,
  priority = false,
  src,
  width = 1664,
}: LessonStoryImageProps) {
  return (
    <figure className={styles.figure}>
      <Image
        alt={alt}
        className={styles.image}
        height={height}
        priority={priority}
        sizes="(max-width: 1100px) 100vw, 1020px"
        src={src}
        width={width}
      />
      <figcaption className={styles.caption}>
        <strong>{emphasis}</strong> {caption}
      </figcaption>
    </figure>
  );
}
