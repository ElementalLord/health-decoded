// TODO: Replace these temporary interfaces with generated Supabase types after local generation.

export type ContentStatus = "approved" | "archived" | "draft" | "in_review" | "published";

export type Journey = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration_days: number;
  version: number;
  published_at: string | null;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  primary_topic: string;
  learning_objective: string;
  estimated_minutes: number;
  content_blocks: unknown[];
  key_takeaway: string | null;
};

export type Activity = {
  id: string;
  lesson_id: string;
  display_order: number;
  activity_type: string;
  title: string;
  instructions: string;
  configuration: Record<string, unknown>;
  explanation: string | null;
};

export type Medication = {
  id: string;
  slug: string;
  generic_name: string;
  brand_names: string[];
  category: string;
  content_blocks: unknown[];
};

export type CaregiverContent = {
  id: string;
  slug: string;
  journey_lesson_id: string | null;
  title: string;
  content_blocks: unknown[];
  support_tip: string | null;
  what_not_to_say: string | null;
  conversation_prompt: string | null;
};

export type Profile = {
  id: string;
  display_name: string | null;
  onboarding_completed_at: string | null;
};
