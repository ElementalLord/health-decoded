export interface OrderedChoice<T> {
  readonly originalIndex: number;
  readonly value: T;
}

function hashText(value: string) {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function correctPosition(scope: string, step: number, optionCount: number) {
  let previous = -1;
  let beforePrevious = -1;

  for (let current = 0; current <= step; current += 1) {
    let next = hashText(`${scope}:correct:${current}`) % optionCount;

    if (optionCount > 2 && next === previous) {
      next = (next + 1 + (hashText(`${scope}:shift:${current}`) % (optionCount - 1))) % optionCount;
    }

    if (optionCount === 2 && next === previous && next === beforePrevious) next = 1 - next;

    beforePrevious = previous;
    previous = next;
  }

  return previous;
}

/**
 * Produces a stable, varied display order without changing the stored answer index.
 * With three or more options, the preferred position never repeats on consecutive steps.
 * Binary choices avoid three-position streaks without falling into a predictable alternation.
 */
export function orderCaregiverChoices<T>(
  choices: readonly T[],
  scope: string,
  step: number,
  preferredIndex?: number,
): readonly OrderedChoice<T>[] {
  const ordered = choices.map((value, originalIndex) => ({ originalIndex, value }));

  for (let index = ordered.length - 1; index > 0; index -= 1) {
    const swapIndex = hashText(`${scope}:choice:${step}:${index}`) % (index + 1);
    [ordered[index], ordered[swapIndex]] = [ordered[swapIndex]!, ordered[index]!];
  }

  if (preferredIndex === undefined || ordered.length < 2) return ordered;

  const currentPreferredPosition = ordered.findIndex(
    (choice) => choice.originalIndex === preferredIndex,
  );
  const [preferred] = ordered.splice(currentPreferredPosition, 1);
  ordered.splice(correctPosition(scope, step, choices.length), 0, preferred!);

  return ordered;
}
