"use client";

import { ArrowLeft, ArrowRight, Menu, RotateCcw, Timer, X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, Suspense, useCallback, useEffect, useState } from "react";

import {
  CompanionIllustration,
  SteadyingHandIllustration,
} from "@/components/illustrations/editorial-illustrations";
import { DiabetesMythCheck } from "@/features/mythbusters/components/diabetes-myth-check";
import { GlucoseInsulinAnimation } from "@/features/marketing/components/glucose-insulin-animation";

import { sceneLabels } from "../content/demo-content";
import { DemoQrCode } from "./demo-qr-code";
import { ProductDemoSurface } from "./product-demo-surface";
import styles from "./demo.module.css";

const LAST_SCENE = sceneLabels.length - 1;

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function Scene({
  children,
  className,
  eyebrow,
  title,
}: {
  children: ReactNode;
  className?: string | undefined;
  eyebrow: string;
  title: string;
}) {
  return (
    <article className={`${styles.pitchScene} ${className ?? ""}`}>
      <header className={styles.pitchHeading}>
        <p className="editorial-eyebrow">{eyebrow}</p>
        <h1 className="font-serif-display">{title}</h1>
      </header>
      {children}
    </article>
  );
}

function OpeningScene({ next }: { next: () => void }) {
  return (
    <article className={`${styles.pitchScene} ${styles.openingScene}`}>
      <div className={styles.openingCopy}>
        <p className="editorial-eyebrow">Working prototype</p>
        <h1 className="font-serif-display">Health Decoded</h1>
        <p className={styles.openingTagline}>Making Type 2 diabetes easier to understand.</p>
        <div className={styles.openingThought}>
          <p className="font-serif-display">A doctor&apos;s appointment ends.</p>
          <p className="font-serif-display">Managing diabetes doesn&apos;t.</p>
        </div>
        <p className={styles.openingSupport}>
          Most daily decisions happen between appointments. Health Decoded helps make those
          decisions easier to understand.
        </p>
        <button className={styles.appButton} onClick={next} type="button">
          See the problem <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <figure className={styles.openingArtwork}>
        <CompanionIllustration />
        <figcaption>Built for everyday questions</figcaption>
      </figure>
    </article>
  );
}

function ProblemScene({ next }: { next: () => void }) {
  return (
    <Scene eyebrow="The problem" title="Information isn't the same as understanding.">
      <div className={styles.problemScene}>
        <div className={styles.problemAnimation}>
          <GlucoseInsulinAnimation />
        </div>
        <div className={styles.problemList}>
          <div>
            <span>01</span>
            <h2 className="font-serif-display">Too much at once</h2>
            <p>A short appointment can introduce new terms, numbers, medicines, and routines.</p>
          </div>
          <div>
            <span>02</span>
            <h2 className="font-serif-display">Hard to use later</h2>
            <p>Knowing a medical fact does not always make the next everyday decision clear.</p>
          </div>
          <div>
            <span>03</span>
            <h2 className="font-serif-display">Questions arrive afterward</h2>
            <p>The moment someone needs context is often hours or days after the conversation.</p>
          </div>
        </div>
      </div>
      <footer className={styles.sceneFoot}>
        <p>
          <strong>For:</strong> people with Type 2 diabetes, caregivers, and family members.
          <span>
            The working product makes the idea testable now without claiming clinical validation.
          </span>
        </p>
        <button className={styles.appTextButton} onClick={next} type="button">
          See the product <ArrowRight aria-hidden="true" />
        </button>
      </footer>
    </Scene>
  );
}

function ProductScene({ next }: { next: () => void }) {
  return (
    <Scene className={styles.productScene} eyebrow="The product" title="Use the real product.">
      <p className={styles.sceneIntro}>
        Choose a feature. Every tab below uses the same component as the full application, with
        fictional local data.
      </p>
      <Suspense fallback={<p className={styles.demoLoading}>Opening the product…</p>}>
        <ProductDemoSurface compact initialFeature="journey" />
      </Suspense>
      <footer className={styles.sceneFoot}>
        <p>
          <strong>Try it here.</strong>
          <span>The panel scrolls independently and every control is interactive.</span>
        </p>
        <button className={styles.appButton} onClick={next} type="button">
          Try Myth Check <ArrowRight aria-hidden="true" />
        </button>
      </footer>
    </Scene>
  );
}

function MythScene({ next }: { next: () => void }) {
  return (
    <article className={`${styles.pitchScene} ${styles.mythScene}`}>
      <div className={styles.productContextBar}>
        <p>
          <strong>Live product demo:</strong> choose a topic, spin, and answer one real claim.
        </p>
        <button className={styles.appTextButton} onClick={next} type="button">
          Continue pitch <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <div className={`app-page-container ${styles.actualMythCheck}`}>
        <DiabetesMythCheck demo />
      </div>
    </article>
  );
}

function MarketScene({ next }: { next: () => void }) {
  const rows = [
    ["Tracking apps", "Numbers, logging, and trends", "Tracking"],
    ["Virtual care", "Coaching and clinical support", "Care"],
    ["Health Decoded", "Learning and everyday explanations", "Understanding"],
  ] as const;

  return (
    <Scene className={styles.condensedScene} eyebrow="Market" title="Where Health Decoded fits.">
      <div className={styles.marketLead}>
        <p>
          <strong>For</strong>
          People learning to live with Type 2 diabetes, plus the people supporting them.
        </p>
        <p>
          <strong>Different because</strong>
          The product is organized around understanding, not data collection or care delivery.
        </p>
      </div>
      <div className={styles.marketTable} role="table" aria-label="Competitive positioning">
        <div role="row">
          <span role="columnheader">Product</span>
          <span role="columnheader">Primary emphasis</span>
          <span role="columnheader">Center</span>
        </div>
        {rows.map(([name, emphasis, center]) => (
          <div data-highlight={name === "Health Decoded" || undefined} key={name} role="row">
            <strong role="cell">{name}</strong>
            <span role="cell">{emphasis}</span>
            <span role="cell">{center}</span>
          </div>
        ))}
      </div>
      <footer className={styles.sceneFoot}>
        <p>It complements clinical care and tracking tools instead of trying to replace them.</p>
        <button className={styles.appTextButton} onClick={next} type="button">
          What guides it? <ArrowRight aria-hidden="true" />
        </button>
      </footer>
    </Scene>
  );
}

function MissionScene({ next }: { next: () => void }) {
  const principles = [
    ["Clear", "Explain one useful idea at a time."],
    ["Safe", "Keep diagnosis and treatment decisions with healthcare professionals."],
    ["Focused", "Build only what answers a repeated user need."],
  ] as const;

  return (
    <Scene
      className={styles.condensedScene}
      eyebrow="Mission and ethics"
      title="Three rules guide the product."
    >
      <div className={styles.missionColumns}>
        {principles.map(([title, copy], index) => (
          <section key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2 className="font-serif-display">{title}</h2>
            <p>{copy}</p>
          </section>
        ))}
      </div>
      <footer className={styles.sceneFoot}>
        <p>
          <strong>Mission</strong>
          Make diabetes education easier to understand and use.
          <span>Designed and built by Naitik Patel.</span>
        </p>
        <button className={styles.appTextButton} onClick={next} type="button">
          See the fit <ArrowRight aria-hidden="true" />
        </button>
      </footer>
    </Scene>
  );
}

function ClosingScene({ restart }: { restart: () => void }) {
  const [finished, setFinished] = useState(false);
  const pairs = [
    ["Where do I start?", "Guided Journey"],
    ["What does this mean?", "AI Tutor"],
    ["How can I practice?", "Myth Check and Stories"],
  ] as const;

  if (finished) {
    return (
      <article className={`${styles.pitchScene} ${styles.finalScene}`}>
        <SteadyingHandIllustration />
        <div>
          <p className="editorial-eyebrow">Health Decoded</p>
          <h1 className="font-serif-display">Make diabetes easier to understand.</h1>
          <p>Explore the same working product shown in the presentation.</p>
          <div className={styles.finalActions}>
            <Link className={styles.appButton} href="/demo/explore">
              Explore Health Decoded <ArrowRight aria-hidden="true" />
            </Link>
            <button className={styles.appSecondaryButton} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" /> Restart
            </button>
            <Link className={styles.appTextButton} href="/login">
              Open full app
            </Link>
          </div>
          <DemoQrCode compact />
        </div>
      </article>
    );
  }

  return (
    <Scene
      className={styles.condensedScene}
      eyebrow="Product fit"
      title="Three questions. Three clear paths."
    >
      <div className={styles.fitRows}>
        {pairs.map(([problem, solution]) => (
          <div key={problem}>
            <span>{problem}</span>
            <ArrowRight aria-hidden="true" />
            <strong>{solution}</strong>
          </div>
        ))}
      </div>
      <footer className={styles.sceneFoot}>
        <p>Next step: test these paths with more users and improve what causes friction.</p>
        <button className={styles.appButton} onClick={() => setFinished(true)} type="button">
          Show audience link <ArrowRight aria-hidden="true" />
        </button>
      </footer>
    </Scene>
  );
}

export function PresenterExperience() {
  const [scene, setScene] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const go = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(LAST_SCENE, index));
      if (scene === 0 && next > 0) setStartedAt((value) => value ?? Date.now());
      setScene(next);
      setMenuOpen(false);
    },
    [scene],
  );

  const next = useCallback(() => go(scene + 1), [go, scene]);
  const back = useCallback(() => go(scene - 1), [go, scene]);
  const restart = useCallback(() => {
    setScene(0);
    setStartedAt(null);
    setElapsed(0);
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!startedAt) return;
    const update = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, button, a, summary, [contenteditable='true']"))
        return;
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        setMenuOpen((value) => !value);
      } else if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        setShowTimer((value) => !value);
      } else if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        back();
      } else if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [back, next]);

  let content: ReactNode;
  switch (scene) {
    case 0:
      content = <OpeningScene next={next} />;
      break;
    case 1:
      content = <ProblemScene next={next} />;
      break;
    case 2:
      content = <ProductScene next={next} />;
      break;
    case 3:
      content = <MythScene next={next} />;
      break;
    case 4:
      content = <MarketScene next={next} />;
      break;
    case 5:
      content = <MissionScene next={next} />;
      break;
    default:
      content = <ClosingScene restart={restart} />;
  }

  return (
    <main className={styles.presenterPage}>
      <header className={styles.presenterHeader}>
        <Link href="/demo">
          <span className="font-serif-display">Health Decoded</span>
          <small>Presenter mode</small>
        </Link>
        <div>
          {showTimer ? (
            <span
              className={styles.timer}
              data-level={
                elapsed >= 180
                  ? "late"
                  : elapsed >= 170
                    ? "warn"
                    : elapsed >= 150
                      ? "notice"
                      : undefined
              }
            >
              <Timer aria-hidden="true" /> {formatTime(elapsed)}
            </span>
          ) : null}
          <span className={styles.sceneCount}>{String(scene + 1).padStart(2, "0")} / 07</span>
          <button aria-label="Open presenter menu" onClick={() => setMenuOpen(true)} type="button">
            <Menu aria-hidden="true" /> <kbd>P</kbd>
          </button>
        </div>
      </header>
      <section className={styles.presenterViewport} key={scene}>
        {content}
      </section>
      <footer className={styles.presenterFooter}>
        <button disabled={scene === 0} onClick={back} type="button">
          <ArrowLeft aria-hidden="true" /> Back
        </button>
        <span>{sceneLabels[scene]}</span>
        <button disabled={scene === LAST_SCENE} onClick={next} type="button">
          Next <ArrowRight aria-hidden="true" />
        </button>
      </footer>
      {menuOpen ? (
        <div className={styles.presenterMenuBackdrop} onMouseDown={() => setMenuOpen(false)}>
          <nav className={styles.presenterMenu} onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <p className="editorial-eyebrow">Jump to a scene</p>
              <button aria-label="Close menu" onClick={() => setMenuOpen(false)} type="button">
                <X aria-hidden="true" />
              </button>
            </header>
            <ol>
              {sceneLabels.map((label, index) => (
                <li key={label}>
                  <button
                    aria-current={scene === index ? "step" : undefined}
                    onClick={() => go(index)}
                    type="button"
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong className="font-serif-display">{label}</strong>
                    <ArrowRight aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
            <button
              className={styles.menuUtility}
              onClick={() => setShowTimer((value) => !value)}
              type="button"
            >
              <Timer aria-hidden="true" /> {showTimer ? "Hide timer" : "Show timer"} <kbd>T</kbd>
            </button>
            <button className={styles.menuUtility} onClick={restart} type="button">
              <RotateCcw aria-hidden="true" /> Restart demo
            </button>
          </nav>
        </div>
      ) : null}
    </main>
  );
}
