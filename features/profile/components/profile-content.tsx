"use client";

import { ArrowRight, CalendarDays, LockKeyhole, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import {
  updateDisplayNameAction,
  type ProfileActionState,
} from "@/features/profile/actions/profile-settings.actions";
import styles from "@/features/profile/components/profile-content.module.css";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import type { ProfileReflectionArchive } from "@/features/profile/types/profile-reflection";
import { cn } from "@/lib/utils";

const initialState: ProfileActionState = { status: "idle", message: "" };

function getInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "HD";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts.at(-1)![0]}`.toUpperCase();
}

function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(
    undefined,
    options ?? {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(value));
}

function PersonalJournalScene({ initials }: { initials: string }) {
  return (
    <div aria-hidden="true" className={styles.scene}>
      <span className={styles.lampGlow} />
      <span className={styles.lampShade} />
      <span className={styles.lampStem} />
      <span className={styles.plantLeafOne} />
      <span className={styles.plantLeafTwo} />
      <span className={styles.plantLeafThree} />
      <span className={styles.plantPot} />
      <span className={styles.desk} />
      <span className={styles.journalLeft}>
        <span className={styles.journalInitials}>{initials}</span>
        <span className={styles.journalCaption}>MY SPACE</span>
      </span>
      <span className={styles.journalRight}>
        <span />
        <span />
        <span />
      </span>
      <span className={styles.bookmark} />
    </div>
  );
}

export function ProfileContent({
  data,
  memberSince,
  reflections,
}: {
  data: ProfileSettings;
  memberSince: string;
  reflections: ProfileReflectionArchive;
}) {
  const [state, action, pending] = useActionState(updateDisplayNameAction, initialState);
  const hasError = state.status === "error";
  const displayName = data.displayName.trim() || "you";
  const firstName = displayName.split(/\s+/)[0] ?? "you";
  const initials = getInitials(data.displayName);
  const featuredReflection = reflections.entries[0];
  const recentReflections = reflections.entries.slice(1);

  return (
    <section className={styles.profilePage}>
      <section aria-labelledby="profile-title" className={styles.hero}>
        <div className={styles.heroCopy}>
          <div aria-label={`${displayName}'s initials`} className={styles.avatar} role="img">
            {initials}
          </div>
          <p className="editorial-eyebrow">Your private space</p>
          <h1 className={styles.heroTitle} id="profile-title">
            A space that belongs to {firstName}.
          </h1>
          <p className={styles.heroDescription}>
            The lessons live in your journey. This is where the details that make Health Decoded
            yours stay close—your name, the words you chose to keep, and the way you prefer to
            learn.
          </p>
          <nav aria-label="Profile actions" className={styles.heroActions}>
            <a className={styles.primaryTextAction} href="#profile-details">
              Edit your name
              <ArrowRight aria-hidden="true" />
            </a>
            <Link className={styles.quietAction} href="/settings">
              Open settings
            </Link>
          </nav>
        </div>
        <PersonalJournalScene initials={initials} />
      </section>

      <section aria-labelledby="profile-identity-title" className={styles.identityStrip}>
        <div>
          <p className={styles.stripLabel}>This profile says</p>
          <p className={styles.stripValue}>{displayName}</p>
        </div>
        <div>
          <p className={styles.stripLabel}>Your space began</p>
          <p className={styles.stripValue}>
            {formatDate(memberSince, { month: "long", year: "numeric" })}
          </p>
        </div>
        <div>
          <p className={styles.stripLabel}>Visible to</p>
          <p className={styles.stripValue}>Only you</p>
        </div>
        <h2 className="sr-only" id="profile-identity-title">
          Your profile identity
        </h2>
      </section>

      <section
        aria-labelledby="reflection-title"
        className={styles.reflectionSection}
        id="reflections"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className="editorial-eyebrow">Your private archive</p>
            <h2 id="reflection-title">Words you kept along the way</h2>
          </div>
          {reflections.total > 0 ? (
            <p>
              {reflections.total} saved {reflections.total === 1 ? "reflection" : "reflections"}
            </p>
          ) : null}
        </div>

        {featuredReflection ? (
          <div className={styles.reflectionLayout}>
            <article className={styles.featuredReflection}>
              <div className={styles.reflectionMeta}>
                <span>Day {featuredReflection.dayNumber}</span>
                <time dateTime={featuredReflection.createdAt}>
                  {formatDate(featuredReflection.createdAt)}
                </time>
              </div>
              <h3>{featuredReflection.lessonTitle}</h3>
              <p>{featuredReflection.reflection}</p>
              <Link href={`/lessons/${featuredReflection.dayNumber}`}>
                Revisit this lesson
                <ArrowRight aria-hidden="true" />
              </Link>
            </article>

            {recentReflections.length > 0 ? (
              <div aria-label="Earlier saved reflections" className={styles.reflectionList}>
                {recentReflections.map((reflection) => (
                  <details key={reflection.id}>
                    <summary>
                      <span>
                        <span className={styles.reflectionDay}>Day {reflection.dayNumber}</span>
                        <span className={styles.reflectionTitle}>{reflection.lessonTitle}</span>
                      </span>
                      <span className={styles.reflectionDate}>
                        {formatDate(reflection.createdAt, {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </summary>
                    <div>
                      <p>{reflection.reflection}</p>
                      <Link href={`/lessons/${reflection.dayNumber}`}>
                        Revisit lesson
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className={styles.archiveNote}>
                <p className={styles.stripLabel}>One entry, kept with care</p>
                <p>
                  When another reflection is intentionally saved, it will join this private archive.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.reflectionEmpty}>
            <div aria-hidden="true" className={styles.emptyJournal}>
              <span />
              <span />
              <span />
            </div>
            <div>
              <h3>Nothing is missing here.</h3>
              <p>
                You do not have any reflections saved to your profile. If you choose to save one in
                the future, it will have a quiet place here.
              </p>
            </div>
          </div>
        )}
      </section>

      <section
        aria-labelledby="profile-details-title"
        className={styles.accountSection}
        id="profile-details"
      >
        <div className={styles.accountIntro}>
          <p className="editorial-eyebrow">Account and privacy</p>
          <h2 id="profile-details-title">The practical details, kept in their place.</h2>
          <p>
            Change the name Health Decoded uses for you here. Reading comfort and motion choices
            remain in Settings, where they can be changed without cluttering this page.
          </p>
          <Link className={styles.settingsLink} href="/settings">
            <Settings aria-hidden="true" />
            Review reading and motion settings
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.accountPanel}>
          <form action={action} className={styles.nameForm}>
            <label htmlFor="profile-display-name">The name you use here</label>
            <div className={styles.nameFields}>
              <Input
                aria-describedby={state.message ? "profile-form-message" : undefined}
                aria-invalid={hasError || undefined}
                defaultValue={data.displayName}
                id="profile-display-name"
                name="displayName"
                required
              />
              <Button disabled={pending} fullWidth={false}>
                {pending ? "Saving…" : "Save name"}
              </Button>
            </div>
            {state.message ? (
              <p
                aria-live="polite"
                className={cn(
                  "motion-status text-sm",
                  hasError ? "text-destructive" : "text-success",
                )}
                id="profile-form-message"
                role={hasError ? "alert" : "status"}
              >
                {state.message}
              </p>
            ) : null}
          </form>

          <dl className={styles.accountFacts}>
            <div>
              <dt>
                <UserRound aria-hidden="true" />
                Email
              </dt>
              <dd>{data.email}</dd>
            </div>
            <div>
              <dt>
                <CalendarDays aria-hidden="true" />
                Member since
              </dt>
              <dd>{formatDate(memberSince)}</dd>
            </div>
            <div>
              <dt>
                <LockKeyhole aria-hidden="true" />
                Privacy
              </dt>
              <dd>
                Your profile and educational progress are private. AI conversations clear when you
                leave the page and are not added here.
              </dd>
            </div>
          </dl>

          <div className={styles.signOutRow}>
            <p>Finished for now?</p>
            <form action={logoutAction}>
              <Button fullWidth={false} variant="secondary">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
}
