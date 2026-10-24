import type { ProblemState } from "@/store/useTrackerStore";
import type { SheetDataset, SheetQuestion } from "./types";

type States = Record<string, ProblemState>;
type Tier = "Easy" | "Medium" | "Hard";

export interface SheetStats {
  total: number;
  solved: number;
  revising: number;
  important: number;
  byDifficulty: Record<Tier, { solved: number; total: number }>;
  next: SheetQuestion | null;
}

export function allQuestions(dataset: SheetDataset): SheetQuestion[] {
  return dataset.patterns.flatMap((p) => p.groups.flatMap((g) => g.questions));
}

/** Counts only ids that exist in the sheet, so stray/legacy ids can't inflate totals. */
export function summarize(dataset: SheetDataset, states: States): SheetStats {
  const stats: SheetStats = {
    total: 0,
    solved: 0,
    revising: 0,
    important: 0,
    byDifficulty: {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 },
    },
    next: null,
  };

  for (const q of allQuestions(dataset)) {
    const s = states[q.id];
    const isSolved = s?.status === "solved";
    stats.total++;
    if (isSolved) stats.solved++;
    if (s?.status === "revising") stats.revising++;
    if (s?.important) stats.important++;
    if (q.difficulty in stats.byDifficulty) {
      const tier = stats.byDifficulty[q.difficulty as Tier];
      tier.total++;
      if (isSolved) tier.solved++;
    }
    if (!stats.next && !isSolved) stats.next = q;
  }
  return stats;
}
