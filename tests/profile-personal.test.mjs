import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("app/(app)/profile/page.tsx", "utf8");
const component = readFileSync("features/profile/components/profile-content.tsx", "utf8");
const header = readFileSync("components/layout/app-header.tsx", "utf8");
const headerStyles = readFileSync("components/layout/app-header.module.css", "utf8");
const settings = readFileSync("features/profile/components/settings-content.tsx", "utf8");
const settingsAction = readFileSync("features/profile/actions/profile-settings.actions.ts", "utf8");
const settingsService = readFileSync(
  "features/profile/services/profile-settings.server.ts",
  "utf8",
);
const styles = readFileSync("features/profile/components/profile-content.module.css", "utf8");
const completionAction = readFileSync(
  "features/lessons/actions/lesson-completion.actions.ts",
  "utf8",
);
const completionSchema = readFileSync(
  "features/lessons/schemas/lesson-completion.schema.ts",
  "utf8",
);

test("profile stays distinct from Journey and Progress", () => {
  assert.doesNotMatch(page, /getProgressData/);
  assert.doesNotMatch(component, /Confidence XP|lessons done|current phase|90-day path/i);
  assert.match(component, /Your account, preferences, and learning progress live here/);
  assert.match(component, /Personalize your learning experience/);
});

test("profile omits the reflections archive and does not load it", () => {
  assert.doesNotMatch(page, /getProfileReflections|reflectionsUnavailable/);
  assert.doesNotMatch(
    component,
    /Words you kept along the way|Your private archive|Nothing is missing here/,
  );
  assert.doesNotMatch(component, /styles\.reflection/);
  assert.doesNotMatch(styles, /\.reflection|\.featuredReflection|\.archiveNote|\.emptyJournal/);
});

test("optional lesson reflections remain private backend records", () => {
  assert.match(
    completionSchema,
    /reflection: z\.string\(\)\.trim\(\)\.min\(1\)\.max\(300\)\.optional/,
  );
  assert.match(completionAction, /\.from\("reflection_entries"\)/);
  assert.match(completionAction, /\.insert\(\{/);
  assert.match(completionAction, /const reflection = parsed\.data\.reflection/);
  assert.match(completionAction, /\.update\(\{ reflection \}\)/);
  assert.match(completionAction, /revalidatePath\("\/profile"\)/);

  for (const file of [
    "first-five-minutes-experience.tsx",
    "day-two-experience.tsx",
    "day-three-experience.tsx",
    "day-four-experience.tsx",
    "day-five-experience.tsx",
    "day-six-experience.tsx",
    "day-seven-experience.tsx",
    "day-eight-experience.tsx",
    "day-nine-experience.tsx",
    "day-ten-experience.tsx",
    "day-eleven-experience.tsx",
    "day-twelve-experience.tsx",
    "day-thirteen-experience.tsx",
    "day-fourteen-experience.tsx",
  ]) {
    const lesson = readFileSync(`features/lessons/components/${file}`, "utf8");
    assert.match(lesson, /completeLessonAction\(\{[\s\S]{0,180}reflection:/);
  }
});

test("the profile uses the Stories watercolor language instead of a dashboard", () => {
  assert.match(component, /src="\/profile\/profile-journal-watercolor\.png"/);
  assert.doesNotMatch(component, /StoryJourneyPath|journeyPath|markerClassName|strokeDasharray/);
  assert.doesNotMatch(styles, /\.journeyPath|\.journeyMarker/);
  assert.match(styles, /profile-page-background-v3\.png/);
  assert.match(styles, /background-size: 100% 100%/);
  assert.match(styles, /\.heroIllustration/);
  assert.match(styles, /\.heroImage/);
  assert.match(styles, /\.page \{[\s\S]*margin-inline: calc\(50% - 50vw\)[\s\S]*width: 100vw/);
  assert.match(styles, /grid-template-columns: minmax\(0, 0\.95fr\) minmax\(0, 1\.35fr\)/);
  assert.match(styles, /column-gap: clamp\(1\.5rem, 3vw, 2\.75rem\)/);
  assert.match(styles, /padding: clamp\(2\.75rem, 4vw, 4rem\) clamp\(1\.5rem, 4vw, 4rem\)/);
  assert.match(
    styles,
    /\.sectionHeader h2[\s\S]*font-size: clamp\(1\.8rem, 2vw, 2\.1rem\)[\s\S]*max-width: none/,
  );
  assert.match(styles, /@media \(min-width: 75rem\)[\s\S]*white-space: nowrap/);
  assert.match(styles, /\.settingsColumn \{[\s\S]*gap: clamp\(1\.5rem, 3vw, 2\.75rem\)/);
  assert.equal(component.split("className={styles.settingsColumn}").length - 1, 2);
  assert.match(
    styles,
    /\.section \{[\s\S]*align-self: stretch[\s\S]*border: 1px solid[\s\S]*width: 100%/,
  );
  assert.match(styles, /\.account \{[\s\S]*border-radius/);
  assert.match(styles, /\.preferences \{[\s\S]*border-radius/);
  assert.match(styles, /\.privacy \{[\s\S]*border-radius/);
  assert.match(styles, /\.editorialNote[\s\S]*border-radius/);
  assert.match(component, /src="\/profile\/profile-settings-watercolor-v4\.png"/);
  assert.match(component, /src="\/profile\/profile-dna-watercolor-v5\.png"/);
  assert.match(styles, /editorial-still-life\.png/);
  assert.match(component, /className=\{styles\.editorialNote\}/);
  assert.match(component, /A healthier you builds a brighter tomorrow/);
  assert.doesNotMatch(styles, /margin-top: clamp\(7rem, 14vw, 12rem\)/);
  assert.match(component, /<span data-profile-section-marker="1">01<\/span> Account/);
  assert.match(component, /<span data-profile-section-marker="2">02<\/span> Learning preferences/);
  assert.match(component, /<span data-profile-section-marker="3">03<\/span> Privacy/);
  assert.doesNotMatch(component, /detailsGrid|leftColumn|rightColumn|brandPanel/);
  assert.doesNotMatch(component, /orbitPath|orbitAvatar|ProfileOrbitScene/);
  assert.doesNotMatch(styles, /@keyframes profile-orbit|@keyframes profile-counter-orbit/);
  assert.ok(existsSync("public/profile/profile-journal-watercolor.png"));
  assert.ok(existsSync("public/profile/profile-page-background-v3.png"));
  assert.ok(existsSync("public/profile/profile-settings-watercolor-v4.png"));
  assert.ok(existsSync("public/profile/profile-dna-watercolor-v5.png"));
  assert.doesNotMatch(styles, /gradient\(/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("the profile celebrates milestones and saves learning preferences", () => {
  assert.doesNotMatch(component, /localStorage/i);
  assert.match(component, /className=\{styles\.confettiBurst\}/);
  assert.match(component, /router\.push\("\/milestones"\)/);
  assert.match(styles, /@keyframes milestone-confetti/);
  assert.match(component, /<CheckCircle2 aria-hidden="true"/);
  assert.match(component, /updateSettingsAction/);
  assert.match(component, /name="preferredTextScale"/);
  assert.match(component, /name="reducedMotion"/);
  assert.match(component, /name="lessonReminders"/);
  assert.match(component, /name="learningPace"/);
  assert.equal(component.split("<ProgressivePreference").length - 1, 2);
  assert.doesNotMatch(component, /<Select|components\/ui\/select/);
  assert.match(styles, /\.progressFill[\s\S]*width: var\(--preference-fill\)/);
  assert.match(styles, /\.progressOptions/);
  assert.match(
    component,
    /className=\{styles\.progressTrack\}[\s\S]{0,100}onClick=\{selectFromTrack\}/,
  );
  assert.match(component, /querySelectorAll<HTMLInputElement>\('input\[type="radio"\]'\)/);
  assert.match(component, /radioInputs\?\.\[nextIndex\]\?\.click\(\)/);
  assert.match(component, /className=\{styles\.preferenceFeedback\}/);
  assert.match(styles, /\.preferenceFeedback \{[\s\S]*min-height: 2rem/);
  assert.match(styles, /\.preferencesForm \{[\s\S]*display: grid[\s\S]*gap: 0/);
  assert.match(styles, /\.preferenceRow \{[\s\S]*border-radius: 0/);
  assert.match(component, /requestSubmit\(\)/);
  assert.match(settings, /<CheckCircle2 aria-hidden="true"/);
  assert.match(settings, /type="submit"/);
  assert.match(settings, /Settings saved/);
});

test("the hero has one prominent milestone button and the profile photo is not clickable", () => {
  assert.equal(component.split("<MilestonesButton />").length - 1, 1);
  assert.match(component, /aria-label="View your milestones"/);
  assert.doesNotMatch(component, /Learning settings/);
  assert.match(styles, /\.heroActions[\s\S]*justify-content: center/);
  assert.match(styles, /\.milestonesButton[\s\S]*background: #315b4e/);
  assert.match(header, /className=\{styles\.profileAvatar\}/);
  assert.match(header, /role="img"/);
  assert.doesNotMatch(header, /<details|<summary|Open profile menu|profileMenuPanel/);
  assert.match(headerStyles, /\.profileAvatar/);
  assert.doesNotMatch(headerStyles, /\.profileMenu/);
});

test("one section orb hops between the numbered markers and respects reduced motion", () => {
  assert.equal(component.split("<ProfileSectionOrb />").length - 1, 1);
  assert.match(component, /closest<HTMLElement>\("\[data-profile-settings\]"\)/);
  assert.match(component, /querySelectorAll<HTMLElement>\("\[data-profile-section-marker\]"\)/);
  assert.match(component, /Number\(first\.dataset\.profileSectionMarker\)/);
  assert.match(component, /window\.requestAnimationFrame\(placeOrb\)/);
  assert.match(component, /orb\.animate\(/);
  assert.match(component, /window\.innerHeight \* 0\.72/);
  assert.match(component, /progress \+ 0\.2/);
  assert.match(component, /if \(reachedPageEnd\) nextIndex = markers\.length - 1/);
  assert.match(component, /targetRect\.left - gridRect\.left \+ targetRect\.width \/ 2/);
  assert.match(component, /orb\.style\.left = `\$\{nextPosition\.x\}px`/);
  assert.match(component, /translate3d\(-50%, -50%, 0\)/);
  assert.match(component, /cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.sectionOrb/);
  assert.match(styles, /\.sectionMarker span[\s\S]*color: #254b40[\s\S]*z-index: 4/);
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.sectionOrb[\s\S]*display: none/,
  );
});

test("settings submit and persist deterministically for the authenticated user", () => {
  assert.match(settings, /<form action=\{action\}/);
  assert.match(settings, /type="submit"/);
  assert.match(settingsAction, /\.upsert\(/);
  assert.match(settingsAction, /\{ onConflict: "user_id" \}/);
  assert.match(settingsAction, /\.select\("user_id"\)\s*\.maybeSingle\(\)/);
  assert.match(settingsAction, /revalidatePath\("\/settings"\)/);
  assert.match(settingsAction, /revalidatePath\("\/profile"\)/);
});

test("profile settings remain available before the learning-preferences migration is deployed", () => {
  assert.match(settingsService, /code === "42703" \|\| code === "PGRST204"/);
  assert.match(
    settingsService,
    /select\("reduced_motion, preferred_text_scale, locale, timezone"\)/,
  );
  assert.match(settingsService, /settings\.learning_pace \?\? "normal"/);
  assert.match(settingsService, /settings\.lesson_reminders \?\? true/);
  assert.match(settingsAction, /usedLegacySettings = true/);
});

test("the profile has one name form and omits the redundant identity strip", () => {
  assert.equal(component.split('name="displayName"').length - 1, 1);
  assert.match(component, /<Button disabled=\{pending\} fullWidth=\{false\} type="submit">/);
  assert.match(
    component,
    /<form action=\{logoutAction\}>\s*<button className=\{styles\.actionRow\} type="submit">/,
  );
  assert.doesNotMatch(component, /This profile says|Your space began|Visible to/);
  assert.doesNotMatch(component, /styles\.identityStrip/);
  assert.doesNotMatch(component, />Edit your name</);
});

test("the redesigned profile remains responsive and keyboard friendly", () => {
  assert.match(styles, /@media \(max-width: 60rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-label="Profile actions"/);
  assert.doesNotMatch(component, /Profile navigation|sideRail|profileNavigation/);
  assert.match(styles, /width: 100vw/);
  assert.match(styles, /\.settingsColumn \{\s*display: contents/);
  assert.match(styles, /\.account \{\s*order: 1/);
  assert.match(styles, /\.settingsArtwork \{\s*order: 2/);
  assert.match(styles, /\.preferences \{\s*order: 3/);
  assert.match(styles, /\.privacy \{\s*order: 4/);
  assert.doesNotMatch(styles, /\.detailsGrid|\.rightColumn|border-left:/);
});
