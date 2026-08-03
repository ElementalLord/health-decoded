import type {
  MythCheckCard,
  MythCheckCategory,
  MythCheckMode,
} from "@/features/mythbusters/types/myth-check";

export function publishedMythCheckCards(cards: readonly MythCheckCard[]) {
  return cards.filter((card) => card.status === "source-backed");
}

function shuffle<T>(items: readonly T[], random: () => number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    const current = shuffled[index];
    const replacement = shuffled[target];
    if (current !== undefined && replacement !== undefined) {
      shuffled[index] = replacement;
      shuffled[target] = current;
    }
  }
  return shuffled;
}

export function createMythCheckRound(
  cards: readonly MythCheckCard[],
  mode: Exclude<MythCheckMode, "replay">,
  random: () => number = Math.random,
) {
  const published = publishedMythCheckCards(cards);
  if (mode === "all") return [...published];
  const eligible = mode === "quick" ? published : published.filter((card) => card.category === mode);
  return mode === "quick" ? shuffle(eligible, random).slice(0, 8) : [...eligible];
}

export const mythCheckModeDetails: ReadonlyArray<{
  id: Exclude<MythCheckMode, "replay">;
  title: string;
  description: string;
  category?: MythCheckCategory;
}> = [
  { id: "quick", title: "Quick Mix", description: "8 claims selected from every topic." },
  { id: "basics", title: "Diabetes Basics", description: "Causes, risk, symptoms, and remission." },
  { id: "food", title: "Food and Carbohydrates", description: "Carbs, fruit, labels, and eating patterns." },
  { id: "monitoring", title: "Tests and Monitoring", description: "A1C, glucose readings, and diagnosis." },
  { id: "treatment", title: "Treatment and Safety", description: "Medicines, care, complications, and scams." },
  { id: "all", title: "Review All", description: "All 32 first-release claims in stable order." },
];
