export type SheetId = "kunal" | "pratyush" | string;

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