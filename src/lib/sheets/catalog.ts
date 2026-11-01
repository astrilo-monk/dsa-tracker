import type { SheetDataset, SheetId } from "./types";

export type SheetMeta = {
  id: SheetId;
  title: string;
  shortTitle: string;
  slug: string;
  href: string;
  accent: string;
  emoji: string;
  playlistUrl?: string;
  playlistLabel?: string;
  /** Word used for completed items. Defaults to "Solved". */
  doneLabel?: string;
};

export const sheetCatalog: SheetMeta[] = [
  {
    id: "kunal",
    title: "Kunal DSA",
    shortTitle: "Kunal",
    slug: "kunal",
    href: "/kunal",
    accent: "sky",
    emoji: "📘",
    playlistUrl: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
    playlistLabel: "Playlist",
  },
  {
    id: "pratyush",
    title: "Pratyush DSA",
    shortTitle: "Pratyush",
    slug: "pratyush",
    href: "/pratyush",
    accent: "sky",
    emoji: "📗",
    playlistUrl: "https://www.youtube.com/playlist?list=PLbJhGqY-mq47k_WLUtzVjmarUm1EuXPj2",
    playlistLabel: "Playlist",
  },
  {
    id: "gate",
    title: "GATE CSE 2028",
    shortTitle: "GATE",
    slug: "gate",
    href: "/gate",
    accent: "sky",
    emoji: "🎓",
    playlistUrl: "https://drive.google.com/drive/folders/1PoUJaFlgRQnJzKNhkr5jTfh8tM60zq1I?usp=sharing",
    playlistLabel: "Drive Link",
    doneLabel: "Done",
  },
];

export const defaultSheetId: SheetId = "kunal";

const loaders: Record<string, () => Promise<{ default: SheetDataset }>> = {
  kunal: () => import("@/data/sheets/kunal.json") as unknown as Promise<{ default: SheetDataset }>,
  pratyush: () => import("@/data/sheets/pratyush.json") as unknown as Promise<{ default: SheetDataset }>,
  gate: () => import("@/data/sheets/gate.json") as unknown as Promise<{ default: SheetDataset }>,
};

export function getSheetMeta(sheetId: SheetId) {
  return sheetCatalog.find((sheet) => sheet.id === sheetId) ?? sheetCatalog[0];
}

export async function loadSheetDataset(sheetId: SheetId): Promise<SheetDataset> {
  const loader = loaders[String(sheetId)] ?? loaders[defaultSheetId];
  const dataset = await loader();
  return dataset.default;
}

export function resolveSheetSlug(pathname: string, searchParams?: URLSearchParams): SheetId {
  const byPath = sheetCatalog.find((sheet) => sheet.href === pathname);
  if (byPath) return byPath.id;
  if (pathname === "/sheet") return "kunal";

  const slug = searchParams?.get("sheet");
  const bySlug = sheetCatalog.find((sheet) => sheet.slug === slug);
  if (bySlug) return bySlug.id;

  return defaultSheetId;
}
