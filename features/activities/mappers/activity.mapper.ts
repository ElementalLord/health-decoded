import { matchPairConfigurationSchema } from "@/features/activities/schemas/activity-configuration.schema";
import type { LessonActivity } from "@/features/activities/types/activity";

type ActivityRow = {
  activity_type: string;
  configuration: unknown;
  id: string;
  instructions: string;
  title: string;
};

export function mapLessonActivity(
  activity: ActivityRow,
  isComplete: boolean,
): LessonActivity | null {
  if (activity.activity_type !== "match_pair") return null;

  const parsedConfiguration = matchPairConfigurationSchema.safeParse(activity.configuration);
  if (!parsedConfiguration.success) return null;

  return {
    configuration: {
      feedback: parsedConfiguration.data.feedback,
      helperText: parsedConfiguration.data.helper_text,
      leftItems: parsedConfiguration.data.left_items,
      prompt: parsedConfiguration.data.prompt,
      rightItems: parsedConfiguration.data.right_items,
    },
    id: activity.id,
    instructions: activity.instructions,
    isComplete,
    title: activity.title,
    type: "match_pair",
  };
}
