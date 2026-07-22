import Image from "next/image";

import styles from "./lesson-story-image.module.css";

type LessonStoryImageProps = {
  alt: string;
  caption: string;
  emphasis: string;
  priority?: boolean;
  src: string;
};

export function LessonStoryImage({
  alt,
  caption,
  emphasis,
  priority = false,
  src,
}: LessonStoryImageProps) {
  return (
    <figure className={styles.figure}>
      <Image
        alt={alt}
        className={styles.image}
        height={928}
        priority={priority}
        sizes="(max-width: 1100px) 100vw, 1020px"
        src={src}
        width={1664}
      />
      <figcaption className={styles.caption}>
        <strong>{emphasis}</strong> {caption}
      </figcaption>
    </figure>
  );
}
