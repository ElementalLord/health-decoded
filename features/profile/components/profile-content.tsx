"use client";

import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  NotebookPen,
  Pill,
  Settings,
  Stethoscope,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import {
  updateDisplayNameAction,
  type ProfileActionState,
} from "@/features/profile/actions/profile-settings.actions";
import styles from "@/features/profile/components/profile-content.module.css";
import type { ProfileSettings } from "@/features/profile/types/profile-settings";
import { cn } from "@/lib/utils";

const initialState: ProfileActionState = { status: "idle", message: "" };
const PROFILE_CONFETTI_KEY = "health-decoded:profile-confetti-date";
const CONFETTI_COLORS = ["#c87860", "#6f947a", "#e0ad59", "#7f9ead"];

type ConfettiParticle = {
  angle: number;
  angularVelocity: number;
  color: string;
  height: number;
  lifetime: number;
  rotation: number;
  width: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

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

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function DailyProfileConfetti({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const today = localDateKey(new Date());

    try {
      if (window.localStorage.getItem(PROFILE_CONFETTI_KEY) === today) return;
      window.localStorage.setItem(PROFILE_CONFETTI_KEY, today);
    } catch {
      // When browser storage is unavailable, avoid replaying during this mounted visit.
    }

    if (reducedMotion) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 3000);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!visible || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { innerHeight: height, innerWidth: width } = window;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles: ConfettiParticle[] = Array.from({ length: 18 }, (_, index) => {
      const fromLeft = index % 2 === 0;
      const angle = ((fromLeft ? 56 : 124) + Math.random() * 22) * (Math.PI / 180);
      const speed = 780 + Math.random() * 460;

      return {
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 16,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length]!,
        height: 5 + Math.random() * 5,
        lifetime: 1850 + Math.random() * 650,
        rotation: Math.random() * Math.PI * 2,
        width: 7 + Math.random() * 7,
        x: width * (fromLeft ? 0.13 : 0.87),
        y: height * (0.76 + Math.random() * 0.08),
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
      };
    });

    let animationFrame = 0;
    let previousTime = performance.now();
    const startedAt = previousTime;

    const render = (now: number) => {
      const elapsed = now - startedAt;
      const delta = Math.min((now - previousTime) / 1000, 0.04);
      previousTime = now;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.vx *= 0.997 ** (delta * 60);
        particle.vy += 1250 * delta;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.rotation += particle.angularVelocity * delta;

        const age = elapsed / particle.lifetime;
        if (age >= 1) continue;

        context.save();
        context.globalAlpha = age > 0.72 ? 1 - (age - 0.72) / 0.28 : 1;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.scale(1, Math.sin(elapsed / 90 + particle.angle) * 0.35 + 0.65);
        context.fillStyle = particle.color;
        context.fillRect(
          -particle.width / 2,
          -particle.height / 2,
          particle.width,
          particle.height,
        );
        context.restore();
      }

      if (elapsed < 2600) animationFrame = window.requestAnimationFrame(render);
    };

    animationFrame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [visible]);

  if (!visible) return null;

  return <canvas aria-hidden="true" className={styles.confettiBurst} ref={canvasRef} />;
}

function ProfileOrbitScene({ initials }: { initials: string }) {
  return (
    <div
      aria-label="Your profile at the center of notes, settings, lessons, medicine, care, and your calendar"
      className={styles.orbitScene}
      role="img"
    >
      <span aria-hidden="true" className={`${styles.orbitRing} ${styles.orbitRingInner}`} />
      <span aria-hidden="true" className={`${styles.orbitRing} ${styles.orbitRingOuter}`} />
      <span aria-hidden="true" className={styles.orbitAvatar}>
        {initials}
      </span>

      <span aria-hidden="true" className={`${styles.orbitPath} ${styles.orbitPathOne}`}>
        <span className={styles.orbitItem}>
          <NotebookPen />
        </span>
      </span>
      <span aria-hidden="true" className={`${styles.orbitPath} ${styles.orbitPathTwo}`}>
        <span className={styles.orbitItem}>
          <Settings />
        </span>
      </span>
      <span aria-hidden="true" className={`${styles.orbitPath} ${styles.orbitPathThree}`}>
        <span className={styles.orbitItem}>
          <Pill />
        </span>
      </span>
      <span aria-hidden="true" className={`${styles.orbitPath} ${styles.orbitPathFour}`}>
        <span className={styles.orbitItem}>
          <BookOpenText />
        </span>
      </span>
      <span aria-hidden="true" className={`${styles.orbitPath} ${styles.orbitPathFive}`}>
        <span className={styles.orbitItem}>
          <Stethoscope />
        </span>
      </span>
      <span aria-hidden="true" className={`${styles.orbitPath} ${styles.orbitPathSix}`}>
        <span className={`${styles.orbitItem} ${styles.orbitItemTiny}`}>
          <CalendarDays />
        </span>
      </span>
    </div>
  );
}

export function ProfileContent({
  data,
  memberSince,
}: {
  data: ProfileSettings;
  memberSince: string;
}) {
  const [state, action, pending] = useActionState(updateDisplayNameAction, initialState);
  const hasError = state.status === "error";
  const sessionEnded = state.status === "auth";
  const displayName = data.displayName.trim() || "you";
  const firstName = displayName.split(/\s+/)[0] ?? "you";
  const initials = getInitials(data.displayName);

  return (
    <section className={styles.profilePage}>
      <DailyProfileConfetti reducedMotion={data.reducedMotion} />
      <section aria-labelledby="profile-title" className={styles.hero}>
        <div className={styles.heroCopy}>
          <div aria-label={`${displayName}'s initials`} className={styles.avatar} role="img">
            {initials}
          </div>
          <p className="editorial-eyebrow">Profile</p>
          <h1 className={styles.heroTitle} id="profile-title">
            Welcome back, {firstName}.
          </h1>
          <p className={styles.heroDescription}>
            The lessons live in your journey. Your name, account details, and learning preferences
            live here.
          </p>
          <nav aria-label="Profile actions" className={styles.heroActions}>
            <Link className={styles.primaryTextAction} href="/milestones">
              View milestones
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className={styles.quietAction} href="/settings">
              Learning settings
            </Link>
          </nav>
        </div>
        <ProfileOrbitScene initials={initials} />
      </section>

      <section
        aria-labelledby="profile-details-title"
        className={styles.accountSection}
        id="profile-details"
      >
        <div className={styles.accountIntro}>
          <p className="editorial-eyebrow">Account and privacy</p>
          <h2 id="profile-details-title">Your account details.</h2>
          <p>
            Change the name Health Decoded uses for you. Reading comfort and motion choices remain
            in Settings.
          </p>
          <Link className={styles.settingsLink} href="/settings">
            <Settings aria-hidden="true" />
            Review reading and motion settings
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.accountPanel}>
          <form action={action} className={styles.nameForm}>
            <label htmlFor="profile-display-name">Display name</label>
            <div className={styles.nameFields}>
              <Input
                aria-describedby={state.message ? "profile-form-message" : undefined}
                aria-invalid={hasError || sessionEnded || undefined}
                defaultValue={data.displayName}
                id="profile-display-name"
                name="displayName"
                required
              />
              <Button disabled={pending} fullWidth={false} type="submit">
                {pending ? "Saving…" : "Save name"}
              </Button>
            </div>
            {state.message ? (
              <p
                aria-live="polite"
                className={cn(
                  styles.saveStatus,
                  hasError || sessionEnded ? "text-destructive" : "text-success",
                )}
                id="profile-form-message"
                role={hasError || sessionEnded ? "alert" : "status"}
              >
                {!hasError && !sessionEnded ? <CheckCircle2 aria-hidden="true" /> : null}
                {state.message}
                {sessionEnded ? <Link href="/login?next=/profile">Sign in</Link> : null}
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
            <p>Using a shared device?</p>
            <form action={logoutAction}>
              <Button fullWidth={false} type="submit" variant="secondary">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
}
