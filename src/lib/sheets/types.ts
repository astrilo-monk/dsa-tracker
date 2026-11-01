export type SheetId = "kunal" | "pratyush" | "gate" | string;

export type Difficulty = "Easy" | "Medium" | "Hard" | "Uncategorized";

export type LinkKind = "question" | "resource";

export interface SheetLink {
  label: string;
  url: string;
  platform: string;
  kind: LinkKind;
}

export interface SheetQuestion {
  id: string;
  legacyId?: string;
  title: string;
  difficulty: Difficulty;
  links: SheetLink[];
  platform: string;
  /** Optional sub-heading, e.g. "Linear Algebra" under Engineering Mathematics. */
  subcategory?: string;
  note?: string;
  resourceLinks?: SheetLink[];
  isCustom?: boolean;
  patternId?: string;
  sheetId?: string;
}

export interface SheetResource {
  id: string;
  title: string;
  links: SheetLink[];
}

export interface SheetDifficultyGroup {
  difficulty: Difficulty;
  questions: SheetQuestion[];
}

export interface SheetPattern {
  id: string;
  title: string;
  slug: string;
  groups: SheetDifficultyGroup[];
  resources: SheetResource[];
  /** Short label shown next to the title, e.g. "~8-10 marks". */
  weightage?: string;
}

export interface SheetDataset {
  id: SheetId;
  title: string;
  slug: string;
  description: string;
  patterns: SheetPattern[];
}

export interface SheetSummary {
  totalQuestions: number;
  solvedQuestions: number;
  bookmarkedQuestions: number;
  revisingQuestions: number;
}