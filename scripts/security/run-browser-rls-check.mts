import { createHmac, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

import { createClient } from "@supabase/supabase-js";

function localEnvironment() {
  const output = execFileSync("supabase", ["status", "-o", "env"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  const values = new Map(
    output
      .split("\n")
      .map((line) => /^([A-Z_]+)=(.*)$/.exec(line.trim()))
      .filter((match): match is RegExpExecArray => Boolean(match))
      .map((match) => [match[1]!, match[2]!.replace(/^"|"$/g, "")]),
  );
  const url = values.get("API_URL");
  const publishableKey = values.get("PUBLISHABLE_KEY") ?? values.get("ANON_KEY");
  const jwtSecret = values.get("JWT_SECRET");
  if (!url || !publishableKey || !jwtSecret)
    throw new Error("Local Supabase credentials are unavailable.");
  const origin = new URL(url);
  if (origin.hostname !== "127.0.0.1" && origin.hostname !== "localhost")
    throw new Error("Refusing to run browser RLS attacks against a non-local Supabase project.");
  return { jwtSecret, publishableKey, url: origin.origin };
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function checkedUuid(value: string | undefined, label: string) {
  assert(value && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value), `${label} is not a UUID.`);
  return value;
}

function runTrustedSql(sql: string) {
  return execFileSync(
    "docker",
    [
      "exec",
      "-i",
      "supabase_db_health-decoded",
      "psql",
      "-XAt",
      "-U",
      "postgres",
      "-d",
      "postgres",
    ],
    { encoding: "utf8", input: sql, stdio: ["pipe", "pipe", "ignore"] },
  ).trim();
}

function expiredToken(secret: string, userId: string) {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({
    aud: "authenticated",
    exp: 1,
    iat: 1,
    role: "authenticated",
    sub: userId,
  })}`;
  return `${unsigned}.${createHmac("sha256", secret).update(unsigned).digest("base64url")}`;
}

const env = localEnvironment();
const anonymous = createClient(env.url, env.publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const suffix = randomUUID();
const emailA = `security-a-${suffix}@example.invalid`;
const emailB = `security-b-${suffix}@example.invalid`;
const password = `Local-security-${randomUUID()}!`;
const journeyA = randomUUID();
const journeyB = randomUUID();
const progressA = randomUUID();
const progressB = randomUUID();
let accountA: string | undefined;
let accountB: string | undefined;

try {
  const createdA = await anonymous.auth.signUp({ email: emailA, password });
  const createdB = await anonymous.auth.signUp({ email: emailB, password });
  if (createdA.error || !createdA.data.user || createdB.error || !createdB.data.user)
    throw new Error(
      `Could not create disposable local Auth fixtures: ${createdA.error?.message ?? createdB.error?.message ?? "missing user"}`,
    );
  accountA = checkedUuid(createdA.data.user.id, "Account A");
  accountB = checkedUuid(createdB.data.user.id, "Account B");

  runTrustedSql(`
    update auth.users set email_confirmed_at = pg_catalog.now()
    where id in ('${accountA}'::uuid, '${accountB}'::uuid);
    update public.profiles set display_name = 'Security Test A' where id = '${accountA}'::uuid;
    update public.profiles set display_name = 'Security Test B' where id = '${accountB}'::uuid;
    insert into public.user_journeys (id, user_id, journey_id, current_journey_lesson_id)
    select '${journeyA}'::uuid, '${accountA}'::uuid, assignment.journey_id, assignment.id
    from public.journey_lessons assignment order by assignment.display_order limit 1;
    insert into public.user_journeys (id, user_id, journey_id, current_journey_lesson_id)
    select '${journeyB}'::uuid, '${accountB}'::uuid, assignment.journey_id, assignment.id
    from public.journey_lessons assignment order by assignment.display_order limit 1;
    insert into public.lesson_progress (
      id, user_journey_id, journey_lesson_id, status, started_at, last_viewed_block
    ) select '${progressA}'::uuid, '${journeyA}'::uuid, assignment.id, 'in_progress', pg_catalog.now(), 1
      from public.journey_lessons assignment order by assignment.display_order limit 1;
    insert into public.lesson_progress (
      id, user_journey_id, journey_lesson_id, status, started_at, last_viewed_block
    ) select '${progressB}'::uuid, '${journeyB}'::uuid, assignment.id, 'in_progress', pg_catalog.now(), 2
      from public.journey_lessons assignment order by assignment.display_order limit 1;
    insert into public.user_spaced_review_state (
      user_id, challenge_id, learned_at, next_due_at, successful_review_count
    ) values
      ('${accountA}'::uuid, 'a1c', pg_catalog.now() - interval '10 days', pg_catalog.now() - interval '1 day', 1),
      ('${accountB}'::uuid, 'a1c', pg_catalog.now() - interval '20 days', pg_catalog.now() - interval '1 day', 9);
  `);

  const browserA = createClient(env.url, env.publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const signedIn = await browserA.auth.signInWithPassword({ email: emailA, password });
  if (signedIn.error || !signedIn.data.session)
    throw new Error(
      `Could not establish Account A browser session: ${signedIn.error?.message ?? "missing session"}`,
    );

  const assignment = await browserA
    .from("journey_lessons")
    .select("id")
    .eq("status", "published")
    .order("display_order")
    .limit(1)
    .single();
  if (assignment.error || !assignment.data) throw new Error("Published assignment unavailable.");

  const ownProfile = await browserA.from("profiles").select("id, display_name");
  assert(
    !ownProfile.error && ownProfile.data.length === 1 && ownProfile.data[0]?.id === accountA,
    "A broad profile read did not return exactly A.",
  );
  const readProfileB = await browserA.from("profiles").select("id").eq("id", accountB);
  assert(
    !readProfileB.error && readProfileB.data.length === 0,
    "A read B profile through PostgREST.",
  );
  const writeProfileB = await browserA
    .from("profiles")
    .update({ display_name: "ATTACKED" })
    .eq("id", accountB)
    .select("id");
  assert(
    !writeProfileB.error && writeProfileB.data.length === 0,
    "A updated B profile through PostgREST.",
  );

  const readProgressB = await browserA.from("lesson_progress").select("id").eq("id", progressB);
  assert(
    !readProgressB.error && readProgressB.data.length === 0,
    "A read B progress through PostgREST.",
  );
  const writeProgressB = await browserA
    .from("lesson_progress")
    .update({ last_viewed_block: 99 })
    .eq("id", progressB)
    .select("id");
  assert(
    Boolean(writeProgressB.error) || writeProgressB.data?.length === 0,
    "A updated B progress through PostgREST.",
  );
  const insertProgressB = await browserA.from("lesson_progress").insert({
    journey_lesson_id: assignment.data.id,
    status: "in_progress",
    user_journey_id: journeyB,
  });
  assert(Boolean(insertProgressB.error), "A inserted progress owned by B through PostgREST.");
  const rpcB = await browserA.rpc("save_lesson_block_position", {
    p_block_index: 3,
    p_lesson_progress_id: progressB,
  });
  assert(Boolean(rpcB.error), "A invoked an ownership-sensitive RPC against B.");

  const readReviewB = await browserA
    .from("user_spaced_review_state")
    .select("user_id")
    .eq("user_id", accountB);
  assert(
    !readReviewB.error && readReviewB.data.length === 0,
    "A read B Spaced Review state through PostgREST.",
  );
  const writeReviewB = await browserA
    .from("user_spaced_review_state")
    .update({ successful_review_count: 99 })
    .eq("user_id", accountB);
  assert(Boolean(writeReviewB.error), "A modified B Spaced Review state through PostgREST.");

  const anonProfiles = await anonymous.from("profiles").select("id");
  assert(
    Boolean(anonProfiles.error) || anonProfiles.data?.length === 0,
    "Anonymous browser client read private profiles.",
  );
  const expiredResponse = await fetch(`${env.url}/rest/v1/profiles?select=id`, {
    headers: {
      apikey: env.publishableKey,
      authorization: `Bearer ${expiredToken(env.jwtSecret, accountA)}`,
    },
  });
  assert(expiredResponse.status === 401, "Expired/invalid JWT was not rejected by PostgREST.");

  const trustedState = runTrustedSql(`
    select concat_ws('|',
      (select display_name from public.profiles where id = '${accountB}'::uuid),
      (select last_viewed_block::text from public.lesson_progress where id = '${progressB}'::uuid),
      (select status from public.lesson_progress where id = '${progressB}'::uuid),
      (select successful_review_count::text from public.user_spaced_review_state
        where user_id = '${accountB}'::uuid and challenge_id = 'a1c')
    );
  `);
  assert(trustedState === "Security Test B|2|in_progress|9", "B state changed after attacks.");

  process.stdout.write("Browser/PostgREST A/B isolation: PASS\n");
  process.stdout.write("Expired/invalid-session rejection: PASS\n");
  process.stdout.write("Trusted B-state verification: PASS\n");
} finally {
  if (accountA || accountB) {
    const ids = [accountA, accountB]
      .filter((value): value is string => Boolean(value))
      .map((value) => `'${checkedUuid(value, "cleanup account")}'::uuid`)
      .join(", ");
    if (ids) runTrustedSql(`delete from auth.users where id in (${ids});`);
  }
}
