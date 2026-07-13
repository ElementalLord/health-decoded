import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const { medicationSeedRecordSchema } = await import(
  new URL("../features/medications/schemas/medication-content.schema.mts", import.meta.url).href
);

const seedDirectory = new URL("../supabase/seed/content/medications/", import.meta.url);

async function readSeedRecords() {
  const entries = await readdir(seedDirectory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"));

  return Promise.all(
    files.map(async (file) => {
      const path = join(seedDirectory.pathname, file.name);
      const text = await readFile(path, "utf8");
      return { fileName: file.name, record: JSON.parse(text) as unknown };
    }),
  );
}

function assertContractGuards(record: unknown) {
  const validRecord = medicationSeedRecordSchema.safeParse(record);
  if (!validRecord.success) throw new Error("Development fixture must be structurally valid.");

  const publishedWithoutReview = {
    ...validRecord.data,
    published_at: "2026-01-01T00:00:00Z",
    status: "published",
  };
  if (medicationSeedRecordSchema.safeParse(publishedWithoutReview).success) {
    throw new Error("Published records without review metadata must be rejected.");
  }

  const htmlContent = {
    ...validRecord.data,
    content: { ...validRecord.data.content, short_summary: "<script>alert('unsafe')</script>" },
  };
  if (medicationSeedRecordSchema.safeParse(htmlContent).success) {
    throw new Error("HTML-like content must be rejected.");
  }

  const oversizedContent = {
    ...validRecord.data,
    content: { ...validRecord.data.content, short_summary: "x".repeat(241) },
  };
  if (medicationSeedRecordSchema.safeParse(oversizedContent).success) {
    throw new Error("Oversized content must be rejected.");
  }

  if (medicationSeedRecordSchema.safeParse({ ...validRecord.data, unexpected: true }).success) {
    throw new Error("Unknown fields must be rejected.");
  }
}

const records = await readSeedRecords();
const fixture = records.find((entry) => entry.fileName === "development-fixture.json");

if (!fixture) throw new Error("A development medication fixture is required.");
assertContractGuards(fixture.record);

for (const { fileName, record } of records) {
  const result = medicationSeedRecordSchema.safeParse(record);
  if (!result.success) {
    const messages = result.error.issues.map(
      (issue: { message: string; path: (string | number)[] }) =>
        `${issue.path.join(".")}: ${issue.message}`,
    );
    throw new Error(`${fileName} is invalid.\n${messages.join("\n")}`);
  }
}

process.stdout.write(`Validated ${records.length} medication content record(s).\n`);
