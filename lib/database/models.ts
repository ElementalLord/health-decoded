import type { Database } from "@/types/database";

export type ContentStatus = "approved" | "archived" | "draft" | "in_review" | "published";

export type Journey = Pick<
  Database["public"]["Tables"]["journeys"]["Row"],
  "id" | "slug" | "title" | "description" | "duration_days" | "version" | "published_at"
>;

export type Lesson = Pick<
  Database["public"]["Tables"]["lessons"]["Row"],
  | "id"
  | "slug"
  | "title"
  | "subtitle"
  | "primary_topic"
  | "learning_objective"
  | "estimated_minutes"
  | "content_blocks"
  | "key_takeaway"
>;

export type Activity = Pick<
  Database["public"]["Tables"]["activities"]["Row"],
  | "id"
  | "lesson_id"
  | "display_order"
  | "activity_type"
  | "title"
  | "instructions"
  | "configuration"
  | "explanation"
>;

export type Medication = Pick<
  Database["public"]["Tables"]["medications"]["Row"],
  "id" | "slug" | "generic_name" | "brand_names" | "category" | "content_blocks"
>;

export type CaregiverContent = Pick<
  Database["public"]["Tables"]["caregiver_content"]["Row"],
  | "id"
  | "slug"
  | "journey_lesson_id"
  | "title"
  | "content_blocks"
  | "support_tip"
  | "what_not_to_say"
  | "conversation_prompt"
>;

export type Profile = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "display_name" | "onboarding_completed_at"
>;
