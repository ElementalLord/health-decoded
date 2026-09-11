export type ProfileSettings = {
  displayName: string;
  email: string;
  learningPace: "gentle" | "normal" | "focused";
  lessonReminders: boolean;
  onboardingComplete: boolean;
  reducedMotion: boolean;
  preferredTextScale: "default" | "large" | "extra_large";
  locale: "en";
  timezone: string;
};
