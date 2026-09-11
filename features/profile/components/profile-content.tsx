"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import {
  updateDisplayNameAction,
  updateSettingsAction,
  type ProfileActionState,
} from "@/features/profile/actions/profile-settings.actions";
import styles from "@/features/profile/components/profile-content.module.css";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { cn } from "@/lib/utils";

const initialState: ProfileActionState = { status: "idle", message: "" };

const CONFETTI_PIECES = [
  { color: "#c9785d", delay: "0ms", rotate: "-110deg", x: "-5.5rem", y: "-4.5rem" },
  { color: "#d9a36c", delay: "35ms", rotate: "80deg", x: "-3.4rem", y: "-6rem" },
  { color: "#6f947a", delay: "70ms", rotate: "145deg", x: "-1.2rem", y: "-5rem" },
  { color: "#b96c55", delay: "20ms", rotate: "35deg", x: "1.2rem", y: "-6.2rem" },
  { color: "#8eaa91", delay: "90ms", rotate: "-70deg", x: "3.4rem", y: "-5.2rem" },
  { color: "#d6b57a", delay: "45ms", rotate: "120deg", x: "5.5rem", y: "-3.8rem" },
  { color: "#c9785d", delay: "80ms", rotate: "55deg", x: "6.2rem", y: "-0.8rem" },
  { color: "#557a69", delay: "10ms", rotate: "-145deg", x: "5rem", y: "2.2rem" },
  { color: "#d9a36c", delay: "65ms", rotate: "100deg", x: "2.9rem", y: "3.6rem" },
  { color: "#b96c55", delay: "100ms", rotate: "-40deg", x: "0.5rem", y: "4rem" },
  { color: "#8eaa91", delay: "30ms", rotate: "70deg", x: "-2.1rem", y: "3.8rem" },
  { color: "#d6b57a", delay: "75ms", rotate: "-95deg", x: "-4.7rem", y: "2.5rem" },
  { color: "#557a69", delay: "50ms", rotate: "135deg", x: "-6.2rem", y: "-0.6rem" },
] as const;

type ProgressiveOption = { label: string; value: string };

function getInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "HD";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts.at(-1)![0]}`.toUpperCase();
}

function formatMemberDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
    new Date(value),
  );
}

function StatusMessage({ id, state }: { id: string; state: ProfileActionState }) {
  if (!state.message) return null;

  const failed = state.status === "error" || state.status === "auth";
  return (
    <p
      aria-live="polite"
      className={cn(styles.saveStatus, failed ? "text-destructive" : "text-success")}
      id={id}
      role={failed ? "alert" : "status"}
    >
      {!failed ? <CheckCircle2 aria-hidden="true" /> : null}
      <span>{state.message}</span>
      {state.status === "auth" ? <Link href="/login?next=/profile">Sign in</Link> : null}
    </p>
  );
}

function MilestonesButton() {
  const router = useRouter();
  const [celebrating, setCelebrating] = useState(false);
  const navigationTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (navigationTimer.current) window.clearTimeout(navigationTimer.current);
    },
    [],
  );

  const openMilestones = () => {
    if (celebrating) return;

    setCelebrating(true);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    navigationTimer.current = window.setTimeout(
      () => router.push("/milestones"),
      reduceMotion ? 120 : 650,
    );
  };

  return (
    <span className={styles.milestonesAction}>
      <button
        aria-label="View your milestones"
        className={styles.milestonesButton}
        disabled={celebrating}
        onClick={openMilestones}
        type="button"
      >
        <span>View milestones</span>
        <ArrowRight aria-hidden="true" />
      </button>
      {celebrating ? (
        <span aria-hidden="true" className={styles.confettiBurst}>
          {CONFETTI_PIECES.map((piece) => (
            <span
              key={`${piece.x}-${piece.y}`}
              style={
                {
                  "--confetti-color": piece.color,
                  "--confetti-delay": piece.delay,
                  "--confetti-rotate": piece.rotate,
                  "--confetti-x": piece.x,
                  "--confetti-y": piece.y,
                } as CSSProperties
              }
            />
          ))}
        </span>
      ) : null}
      <span aria-live="polite" className={styles.visuallyHidden}>
        {celebrating ? "Opening your milestones" : ""}
      </span>
    </span>
  );
}

function ProgressivePreference({
  describedBy,
  disabled,
  initialValue,
  invalid,
  label,
  name,
  options,
}: {
  describedBy: string | undefined;
  disabled: boolean;
  initialValue: string;
  invalid: boolean;
  label: string;
  name: string;
  options: readonly ProgressiveOption[];
}) {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === selectedValue),
  );
  const fill = options.length > 1 ? `${(selectedIndex / (options.length - 1)) * 100}%` : "100%";

  const selectFromTrack = (event: MouseEvent<HTMLButtonElement>) => {
    const trackBounds = event.currentTarget.getBoundingClientRect();
    const position = Math.min(
      1,
      Math.max(0, (event.clientX - trackBounds.left) / trackBounds.width),
    );
    const nextIndex = Math.round(position * (options.length - 1));
    const radioInputs = event.currentTarget
      .closest("fieldset")
      ?.querySelectorAll<HTMLInputElement>('input[type="radio"]');

    radioInputs?.[nextIndex]?.click();
  };

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={styles.progressControl}
      disabled={disabled}
      style={{ "--preference-fill": fill } as CSSProperties}
    >
      <legend className={styles.visuallyHidden}>{label}</legend>
      <button
        aria-hidden="true"
        className={styles.progressTrack}
        onClick={selectFromTrack}
        tabIndex={-1}
        type="button"
      >
        <span className={styles.progressFill} />
        <span className={styles.progressStops}>
          {options.map((option, index) => (
            <span data-selected={index <= selectedIndex} key={option.value} />
          ))}
        </span>
      </button>
      <span className={styles.progressOptions}>
        {options.map((option) => (
          <label data-selected={option.value === selectedValue} key={option.value}>
            <input
              checked={option.value === selectedValue}
              name={name}
              onChange={(event) => {
                setSelectedValue(option.value);
                event.currentTarget.form?.requestSubmit();
              }}
              type="radio"
              value={option.value}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </span>
    </fieldset>
  );
}

function ProfileSectionOrb() {
  const orbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const orb = orbRef.current;
    const settingsGrid = orb?.closest<HTMLElement>("[data-profile-settings]");
    if (!orb || !settingsGrid) return;

    const markers = Array.from(
      settingsGrid.querySelectorAll<HTMLElement>("[data-profile-section-marker]"),
    ).sort(
      (first, second) =>
        Number(first.dataset.profileSectionMarker) - Number(second.dataset.profileSectionMarker),
    );
    if (markers.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = -1;
    let animationFrame = 0;
    let hop: Animation | null = null;
    let currentPosition = { x: 0, y: 0 };

    const placeOrb = () => {
      animationFrame = 0;
      const documentHeight = document.documentElement.scrollHeight;
      const maximumScroll = Math.max(1, documentHeight - window.innerHeight);
      const gridTop = window.scrollY + settingsGrid.getBoundingClientRect().top;
      const activationStart = Math.min(
        maximumScroll,
        Math.max(0, gridTop - window.innerHeight * 0.72),
      );
      const progress = Math.min(
        1,
        Math.max(
          0,
          (window.scrollY - activationStart) / Math.max(1, maximumScroll - activationStart),
        ),
      );
      const earlyProgress = Math.min(0.999, progress + 0.2);
      let nextIndex = Math.min(markers.length - 1, Math.floor(earlyProgress * markers.length));
      const reachedPageEnd = window.scrollY + window.innerHeight >= documentHeight - 24;
      if (reachedPageEnd) nextIndex = markers.length - 1;

      const target = markers[nextIndex];
      if (!target) return;

      const gridRect = settingsGrid.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const nextPosition = {
        x: targetRect.left - gridRect.left + targetRect.width / 2,
        y: targetRect.top - gridRect.top + targetRect.height / 2,
      };
      const changedSection = activeIndex !== -1 && activeIndex !== nextIndex;

      orb.style.opacity = "1";
      orb.style.left = `${nextPosition.x}px`;
      orb.style.top = `${nextPosition.y}px`;

      if (changedSection) {
        hop?.cancel();
        if (!reducedMotion.matches) {
          const deltaX = currentPosition.x - nextPosition.x;
          const deltaY = currentPosition.y - nextPosition.y;
          hop = orb.animate(
            [
              {
                transform: `translate3d(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px), 0) scale(1)`,
              },
              {
                transform: `translate3d(calc(-50% + ${deltaX / 2}px), calc(-50% + ${deltaY / 2 - 24}px), 0) scale(1.16)`,
              },
              { transform: "translate3d(-50%, -50%, 0) scale(1)" },
            ],
            {
              duration: 240,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
          );
        }
      }

      activeIndex = nextIndex;
      currentPosition = nextPosition;
    };

    const scheduleOrb = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(placeOrb);
    };

    const resizeObserver = new ResizeObserver(scheduleOrb);
    resizeObserver.observe(settingsGrid);
    window.addEventListener("resize", scheduleOrb);
    window.addEventListener("scroll", scheduleOrb, { passive: true });
    reducedMotion.addEventListener("change", scheduleOrb);
    scheduleOrb();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      hop?.cancel();
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleOrb);
      window.removeEventListener("scroll", scheduleOrb);
      reducedMotion.removeEventListener("change", scheduleOrb);
    };
  }, []);

  return <span aria-hidden="true" className={styles.sectionOrb} ref={orbRef} />;
}

export function ProfileContent({
  data,
  memberSince,
}: {
  data: ProfileSettings;
  memberSince: string;
}) {
  const [nameState, nameAction, pending] = useActionState(updateDisplayNameAction, initialState);
  const [preferencesState, preferencesAction, preferencesPending] = useActionState(
    updateSettingsAction,
    initialState,
  );
  const displayName = data.displayName.trim() || "you";
  const firstName = displayName.split(/\s+/)[0] ?? "you";
  const initials = getInitials(data.displayName);
  const nameFailed = nameState.status === "error" || nameState.status === "auth";
  const preferencesFailed =
    preferencesState.status === "error" || preferencesState.status === "auth";

  return (
    <div className={styles.page}>
      <section aria-labelledby="profile-title" className={styles.intro}>
        <div className={styles.introCopy}>
          <p className={styles.eyebrow}>Profile</p>
          <h1 id="profile-title">
            Welcome back,
            <br />
            {firstName}.
          </h1>
          <p className={styles.introDescription}>
            Your account, preferences, and learning progress live here. Keep building a healthier,
            more informed you.
          </p>

          <div className={styles.identityRow}>
            <span aria-label={`${displayName}'s initials`} className={styles.avatar} role="img">
              {initials}
            </span>
            <span className={styles.identityCopy}>
              <strong>{displayName}</strong>
              <small>{data.email}</small>
            </span>
          </div>

          <nav aria-label="Profile actions" className={styles.heroActions}>
            <MilestonesButton />
          </nav>
        </div>

        <div aria-hidden="true" className={styles.heroIllustration}>
          <Image
            alt=""
            className={styles.heroImage}
            height={1024}
            priority
            sizes="(max-width: 960px) 100vw, 58vw"
            src="/profile/profile-journal-watercolor.png"
            width={1536}
          />
        </div>
      </section>

      <div className={styles.settingsGrid} data-profile-settings>
        <ProfileSectionOrb />

        <div className={styles.settingsColumn}>
          <section aria-labelledby="account-heading" className={cn(styles.section, styles.account)}>
            <header className={styles.sectionHeader}>
              <p className={styles.sectionMarker}>
                <span data-profile-section-marker="1">01</span> Account
              </p>
              <h2 id="account-heading">The essentials, kept simple.</h2>
              <p>Your basic account information.</p>
            </header>

            <div className={styles.sectionBody}>
              <form action={nameAction} className={styles.nameForm}>
                <label htmlFor="profile-display-name">Display name</label>
                <div className={styles.nameFields}>
                  <Input
                    aria-describedby={nameState.message ? "profile-name-status" : undefined}
                    aria-invalid={nameFailed || undefined}
                    defaultValue={data.displayName}
                    id="profile-display-name"
                    name="displayName"
                    required
                  />
                  <Button disabled={pending} fullWidth={false} type="submit">
                    {pending ? "Saving…" : "Save name"}
                  </Button>
                </div>
                <StatusMessage id="profile-name-status" state={nameState} />
              </form>

              <dl className={styles.accountFacts}>
                <div>
                  <dt>Email</dt>
                  <dd>{data.email}</dd>
                </div>
                <div>
                  <dt>Member since</dt>
                  <dd>{formatMemberDate(memberSince)}</dd>
                </div>
              </dl>
            </div>
          </section>

          <div aria-hidden="true" className={styles.settingsArtwork}>
            <figure className={cn(styles.settingsArtworkTile, styles.settingsArtworkDna)}>
              <Image
                alt=""
                className={styles.settingsArtworkImage}
                height={887}
                sizes="(max-width: 960px) 65vw, 26vw"
                src="/profile/profile-dna-watercolor-v5.png"
                width={1774}
              />
            </figure>
            <figure className={cn(styles.settingsArtworkTile, styles.settingsArtworkJournal)}>
              <Image
                alt=""
                className={styles.settingsArtworkImage}
                height={724}
                sizes="(max-width: 960px) 30vw, 13vw"
                src="/profile/profile-settings-watercolor-v4.png"
                width={2172}
              />
            </figure>
          </div>

          <section aria-labelledby="privacy-heading" className={cn(styles.section, styles.privacy)}>
            <header className={styles.sectionHeader}>
              <p className={styles.sectionMarker}>
                <span data-profile-section-marker="3">03</span> Privacy
              </p>
              <h2 id="privacy-heading">Your space stays yours.</h2>
              <p>Manage your data and account access.</p>
            </header>

            <div className={styles.actionRows}>
              <Link className={styles.actionRow} href="/privacy">
                <span>
                  <strong>Manage your data</strong>
                  <small>View how your data is handled or make a privacy request.</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
              <form action={logoutAction}>
                <button className={styles.actionRow} type="submit">
                  <span>
                    <strong>Sign out</strong>
                    <small>Sign out of your account on this device.</small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </button>
              </form>
            </div>
          </section>
        </div>

        <div className={styles.settingsColumn}>
          <section
            aria-labelledby="learning-preferences-heading"
            className={cn(styles.section, styles.preferences)}
            id="learning-preferences"
          >
            <header className={styles.sectionHeader}>
              <p className={styles.sectionMarker}>
                <span data-profile-section-marker="2">02</span> Learning preferences
              </p>
              <h2 id="learning-preferences-heading">Learn in the way that feels right.</h2>
              <p>Personalize your learning experience.</p>
            </header>

            <form action={preferencesAction} className={styles.preferencesForm}>
              <input name="locale" type="hidden" value={data.locale} />
              <input name="timezone" type="hidden" value={data.timezone} />
              <input name="reducedMotion" type="hidden" value="false" />
              <input name="lessonReminders" type="hidden" value="false" />

              <div className={cn(styles.preferenceRow, styles.progressPreferenceRow)}>
                <span className={styles.preferenceCopy}>
                  <strong>Reading comfort</strong>
                  <small>Adjust text size and reading experience.</small>
                </span>
                <ProgressivePreference
                  describedBy={preferencesState.message ? "profile-preferences-status" : undefined}
                  disabled={preferencesPending}
                  initialValue={data.preferredTextScale}
                  invalid={preferencesFailed}
                  label="Reading comfort"
                  name="preferredTextScale"
                  options={[
                    { label: "Default", value: "default" },
                    { label: "Large", value: "large" },
                    { label: "Extra large", value: "extra_large" },
                  ]}
                />
              </div>

              <label className={styles.preferenceRow}>
                <span className={styles.preferenceCopy}>
                  <strong>Reduced motion</strong>
                  <small>Minimize animations across the site.</small>
                </span>
                <span className={styles.switchControl}>
                  <input
                    defaultChecked={data.reducedMotion}
                    disabled={preferencesPending}
                    name="reducedMotion"
                    onChange={(event) => event.currentTarget.form?.requestSubmit()}
                    type="checkbox"
                    value="true"
                  />
                  <span aria-hidden="true" />
                </span>
              </label>

              <label className={styles.preferenceRow}>
                <span className={styles.preferenceCopy}>
                  <strong>Lesson reminders</strong>
                  <small>Get gentle reminders to keep learning.</small>
                </span>
                <span className={styles.switchControl}>
                  <input
                    defaultChecked={data.lessonReminders}
                    disabled={preferencesPending}
                    name="lessonReminders"
                    onChange={(event) => event.currentTarget.form?.requestSubmit()}
                    type="checkbox"
                    value="true"
                  />
                  <span aria-hidden="true" />
                </span>
              </label>

              <div className={cn(styles.preferenceRow, styles.progressPreferenceRow)}>
                <span className={styles.preferenceCopy}>
                  <strong>Learning pace</strong>
                  <small>Control the pace of lesson content.</small>
                </span>
                <ProgressivePreference
                  describedBy={preferencesState.message ? "profile-preferences-status" : undefined}
                  disabled={preferencesPending}
                  initialValue={data.learningPace}
                  invalid={preferencesFailed}
                  label="Learning pace"
                  name="learningPace"
                  options={[
                    { label: "Gentle", value: "gentle" },
                    { label: "Normal", value: "normal" },
                    { label: "Focused", value: "focused" },
                  ]}
                />
              </div>

              <button className={styles.visuallyHidden} tabIndex={-1} type="submit">
                Save preferences
              </button>
              <div className={styles.preferenceFeedback}>
                {preferencesPending ? (
                  <p aria-live="polite" className={styles.preferencePending} role="status">
                    Saving preferences…
                  </p>
                ) : (
                  <StatusMessage id="profile-preferences-status" state={preferencesState} />
                )}
              </div>
            </form>
          </section>

          <aside aria-label="Health Decoded note" className={styles.editorialNote}>
            <blockquote>A healthier you builds a brighter tomorrow.</blockquote>
            <p>
              <span aria-hidden="true" /> Health Decoded
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
