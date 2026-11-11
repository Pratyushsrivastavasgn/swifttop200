import type { OptionKey, Question } from "../types/quiz";

const DEFAULT_OPTION_ORDER: OptionKey[] = ["A", "B", "C", "D"];

export function shuffleArray<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Selects unique questions for a quiz session without replacement.
 * - For count >= bank.length (Complete Mastery 200): includes every question once.
 *   Preserves source order unless shuffleAll is true.
 * - For smaller counts (20, 50, 100): performs stratified topic sampling so all
 *   topics receive broad proportional coverage, then shuffles the final list.
 */
export function selectQuestionsForQuiz(
  bank: Question[],
  count: number,
  options?: {
    shuffleAll?: boolean;
    rng?: () => number;
  }
): Question[] {
  const rng = options?.rng ?? Math.random;

  if (count >= bank.length) {
    return options?.shuffleAll ? shuffleArray(bank, rng) : [...bank];
  }

  // Group by topic (preserving insertion order)
  const buckets = new Map<string, Question[]>();
  for (const q of bank) {
    const key = q.topic ?? "General";
    const list = buckets.get(key);
    if (list) {
      list.push(q);
    } else {
      buckets.set(key, [q]);
    }
  }

  // Shuffle within each bucket
  const shuffledBuckets = new Map<string, Question[]>();
  for (const [topic, list] of buckets.entries()) {
    shuffledBuckets.set(topic, shuffleArray(list, rng));
  }

  const topicKeys = shuffleArray(Array.from(shuffledBuckets.keys()), rng);

  // Proportional quota allocation using largest-remainder method
  const quotas = new Map<string, number>();
  let assigned = 0;

  for (const topic of topicKeys) {
    const size = shuffledBuckets.get(topic)!.length;
    const raw = (size / bank.length) * count;
    const floorVal = Math.min(size, Math.floor(raw));
    quotas.set(topic, floorVal);
    assigned += floorVal;
  }

  // Ensure every topic gets at least 1 question if count >= topic count
  if (count >= topicKeys.length) {
    for (const topic of topicKeys) {
      if (assigned >= count) break;
      const current = quotas.get(topic) ?? 0;
      const maxLen = shuffledBuckets.get(topic)!.length;
      if (current === 0 && maxLen > 0) {
        quotas.set(topic, 1);
        assigned++;
      }
    }
  }

  // Distribute remaining slots by largest fractional remainder (shuffled tie-break)
  if (assigned < count) {
    const remainders = topicKeys
      .map((topic) => {
        const size = shuffledBuckets.get(topic)!.length;
        const current = quotas.get(topic) ?? 0;
        const exact = (size / bank.length) * count;
        return { topic, rem: exact - current, cap: size - current };
      })
      .filter((item) => item.cap > 0)
      .sort((a, b) => b.rem - a.rem);

    let ptr = 0;
    while (assigned < count && remainders.length > 0) {
      const candidate = remainders[ptr % remainders.length];
      const current = quotas.get(candidate.topic) ?? 0;
      const maxLen = shuffledBuckets.get(candidate.topic)!.length;
      if (current < maxLen) {
        quotas.set(candidate.topic, current + 1);
        assigned++;
      }
      ptr++;
      if (ptr > count * 4) break;
    }
  }

  const selected: Question[] = [];
  const seenIds = new Set<string>();

  for (const topic of topicKeys) {
    const list = shuffledBuckets.get(topic)!;
    const take = quotas.get(topic) ?? 0;
    for (let i = 0; i < take && i < list.length; i++) {
      if (!seenIds.has(list[i].id)) {
        seenIds.add(list[i].id);
        selected.push(list[i]);
      }
    }
  }

  // Safety top-up if rounding left fewer than count
  if (selected.length < count) {
    const pool = shuffleArray(
      bank.filter((q) => !seenIds.has(q.id)),
      rng
    );
    for (const q of pool) {
      if (selected.length >= count) break;
      seenIds.add(q.id);
      selected.push(q);
    }
  }

  return shuffleArray(selected, rng);
}

export function buildOptionOrders(
  questions: Question[],
  shuffleOptions: boolean,
  rng: () => number = Math.random
): Record<string, OptionKey[]> {
  const orders: Record<string, OptionKey[]> = {};
  for (const q of questions) {
    orders[q.id] = shuffleOptions
      ? shuffleArray(DEFAULT_OPTION_ORDER, rng)
      : [...DEFAULT_OPTION_ORDER];
  }
  return orders;
}

export function getDisplayOptionLetter(
  optionOrder: OptionKey[] | undefined,
  originalKey: OptionKey
): OptionKey {
  const order = optionOrder ?? DEFAULT_OPTION_ORDER;
  const idx = order.indexOf(originalKey);
  return idx >= 0 ? DEFAULT_OPTION_ORDER[idx] : originalKey;
}

