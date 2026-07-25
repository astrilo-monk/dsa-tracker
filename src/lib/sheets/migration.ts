import legacyKunalMap from "@/data/sheets/kunal-legacy-map.json";
import type { ProblemState } from "@/store/useTrackerStore";

type ProblemStateMap = Record<string, ProblemState>;

const legacyIdMap = legacyKunalMap as Record<string, string>;

export function remapLegacyProblemStates(states: ProblemStateMap): ProblemStateMap {
  const remapped: ProblemStateMap = {};

  for (const [id, state] of Object.entries(states || {})) {
    const nextId = legacyIdMap[id] ?? id;
    remapped[nextId] = state;
  }

  return remapped;
}
