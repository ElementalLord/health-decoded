import {
  ClipboardCheck,
  Footprints,
  HeartHandshake,
  Layers3,
  LibraryBig,
  ListChecks,
  MessageCircleQuestion,
  MessagesSquare,
  Printer,
  RotateCcw,
  Route,
  SearchCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { CSSProperties } from "react";

import {
  milestoneCategoryLabels,
  milestoneDefinitions,
} from "@/features/achievements/content/milestone-definitions";
import type {
  EarnedMilestone,
  MilestoneDefinition,
} from "@/features/achievements/types/milestone";
import styles from "@/features/achievements/styles/milestones.module.css";

const icons = {
  appointment: ClipboardCheck,
  conversation: MessagesSquare,
  evidence: LibraryBig,
  "first-step": Footprints,
  foundation: Layers3,
  "learning-motion": Route,
  "myth-checker": SearchCheck,
  permission: HeartHandshake,
  plan: Printer,
  priorities: ListChecks,
  questions: MessageCircleQuestion,
  "second-look": RotateCcw,
  "trusted-support": ShieldCheck,
  toolkit: Wrench,
};

const milestoneTones = [
  ["#b84f3b", "#f8d6c9"], ["#9a6615", "#f5dfaa"],
  ["#347861", "#cfe8dc"], ["#7e56a0", "#e7d8f2"],
  ["#b34f70", "#f4d3df"], ["#367595", "#d0e7f1"],
  ["#c2622f", "#f7d7bd"], ["#93466f", "#f0d2e1"],
  ["#477a91", "#d4e8ef"], ["#7f5d2d", "#edddbf"],
  ["#397963", "#d0e9df"], ["#ad5146", "#f4d3cc"],
  ["#4d6f9f", "#dae3f3"], ["#8d641d", "#f4dfa9"],
] as const;

type MilestoneStyle = CSSProperties & {
  "--milestone-accent": string;
  "--milestone-soft": string;
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(value),
  );
}

function MilestoneItem({
  definition,
  earned,
}: {
  definition: MilestoneDefinition;
  earned?: EarnedMilestone | undefined;
}) {
  const Icon = icons[definition.icon];
  const tone = milestoneTones[(definition.order - 1) % milestoneTones.length] ?? milestoneTones[0];
  const itemStyle: MilestoneStyle = {
    "--milestone-accent": tone[0],
    "--milestone-soft": tone[1],
  };
  return (
    <li
      className={earned ? styles.earned : styles.available}
      data-shape={definition.order % 4}
      id={definition.slug}
      style={itemStyle}
    >
      <span aria-hidden="true" className={styles.symbol}><Icon /></span>
      <div>
        <p>{earned ? `Earned ${dateLabel(earned.unlockedAt)}` : "Still available"}</p>
        <h3>{definition.name}</h3>
        <span>{definition.description}</span>
        <small><strong>Recognized when:</strong> {definition.criteriaLabel}</small>
      </div>
    </li>
  );
}

export function MilestonesPage({ earned }: { earned: readonly EarnedMilestone[] }) {
  const earnedById = new Map(earned.map((entry) => [entry.definition.id, entry]));
  const recent = earned.slice(0, 3);
  const categories = Object.keys(milestoneCategoryLabels) as Array<keyof typeof milestoneCategoryLabels>;
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className="editorial-eyebrow">Meaningful steps</p>
        <h1>Milestones</h1>
        <p>Meaningful steps you have taken while learning, preparing, and finding support.</p>
        <div className={styles.count}><strong>{earned.length}</strong><span>milestones earned</span></div>
        <p className={styles.boundary}>Milestones recognize learning and preparation inside Health Decoded. They do not measure your health, treatment success, or quality of diabetes management.</p>
      </header>

      {recent.length ? (
        <section aria-labelledby="recent-milestones" className={styles.recent}>
          <p className="editorial-eyebrow">Recently recognized</p>
          <h2 id="recent-milestones">The steps you took most recently.</h2>
          <ul>{recent.map((entry) => <MilestoneItem definition={entry.definition} earned={entry} key={entry.definition.id} />)}</ul>
        </section>
      ) : null}

      <div className={styles.categories}>
        {categories.map((category) => {
          const entries = milestoneDefinitions.filter((definition) => definition.category === category);
          return (
            <section aria-labelledby={`milestone-category-${category}`} key={category}>
              <h2 id={`milestone-category-${category}`}>{milestoneCategoryLabels[category]}</h2>
              <ul>{entries.map((definition) => <MilestoneItem definition={definition} earned={earnedById.get(definition.id)} key={definition.id} />)}</ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
