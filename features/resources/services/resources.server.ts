import "server-only";

import { type2DiabetesResources } from "@/content/resources/type-2-diabetes-resources";
import { resourceSchema, type Resource } from "@/features/stories/schemas/resource.schema";

export function listReviewedResources(): Resource[] {
  return type2DiabetesResources.map((resource) => resourceSchema.parse(resource));
}
