import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

const lessonImages = {
  "day-01": {
    component: "first-five-minutes-experience.tsx",
    images: ["gentle-beginning.jpg", "supported-not-alone.jpg"],
  },
  "day-02": {
    component: "day-two-experience.tsx",
    images: ["learning-together.jpg", "capable-life.jpg"],
  },
  "day-03": {
    component: "day-three-experience.tsx",
    images: ["reading-with-context.jpg", "reviewing-patterns.jpg"],
  },
  "day-04": {
    component: "day-four-experience.tsx",
    images: ["food-and-culture.jpg", "table-without-guilt.jpg"],
  },
  "day-05": {
    component: "day-five-experience.tsx",
    images: ["movement-joy.jpg", "everyday-play.jpg"],
  },
  "day-06": {
    component: "day-six-experience.tsx",
    images: ["after-dinner-walk.jpg", "workday-movement.jpg"],
  },
  "day-07": {
    component: "day-seven-experience.tsx",
    images: ["pharmacist-conversation.jpg", "everyday-medicine-routine.jpg"],
  },
  "day-08": {
    component: "day-eight-experience.tsx",
    images: ["context-not-judgment.jpg", "pattern-conversation.jpg"],
  },
  "day-09": {
    component: "day-nine-experience.tsx",
    images: ["ready-kit.jpg", "helping-moment.jpg"],
  },
  "day-10": {
    component: "day-ten-experience.tsx",
    images: ["routine-together.jpg", "kind-environment.jpg"],
  },
  "day-11": {
    component: "day-eleven-experience.tsx",
    images: ["eye-care.jpg", "preventive-visit.jpg"],
  },
  "day-12": {
    component: "day-twelve-experience.tsx",
    images: ["community-in-real-life.jpg", "sick-day-support.jpg", "plan-b-together.jpg"],
  },
  "day-13": {
    component: "day-thirteen-experience.tsx",
    images: ["listening-without-fixing.jpg", "community-belonging.jpg"],
  },
};

const storyComponent = readFileSync("features/lessons/components/lesson-story-image.tsx", "utf8");
const storyStyles = readFileSync(
  "features/lessons/components/lesson-story-image.module.css",
  "utf8",
);

test("Lessons 1 through 13 include 27 purposeful human story illustrations", () => {
  let totalImages = 0;

  for (const [day, lesson] of Object.entries(lessonImages)) {
    const experience = readFileSync(`features/lessons/components/${lesson.component}`, "utf8");
    const uses = experience.match(/<LessonStoryImage/g) ?? [];

    assert.equal(uses.length, lesson.images.length, `${day} should use its complete image set`);

    for (const image of lesson.images) {
      assert.match(experience, new RegExp(`/lessons/${day}/${image.replace(".", "\\.")}`));
      assert.ok(
        statSync(`public/lessons/${day}/${image}`).size > 100_000,
        `${day}/${image} should be a production-quality asset`,
      );
      totalImages += 1;
    }
  }

  assert.equal(totalImages, 27);
});

test("The shared story treatment is accessible, responsive, and only slightly rounded", () => {
  assert.match(storyComponent, /import Image from "next\/image"/);
  assert.match(storyComponent, /alt=\{alt\}/);
  assert.match(storyComponent, /<figcaption/);
  assert.match(storyComponent, /sizes="\(max-width: 1100px\) 100vw, 1020px"/);
  assert.match(storyStyles, /border-radius: 6px/);
  assert.match(storyStyles, /aspect-ratio: 16 \/ 8\.9/);
  assert.doesNotMatch(storyStyles, /border-radius:\s*(?:9999px|999px|50%)/);
});
