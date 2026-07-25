import type { SheetDataset, SheetId } from "./types";

export type SheetMeta = {
  id: SheetId;
  title: string;
  shortTitle: string;
  slug: string;
  href: string;
  accent: string;
  emoji: string;
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
  },
  {
    id: "pratyush",
    title: "Pratyush DSA",
    shortTitle: "Pratyush",
    slug: "pratyush",
    href: "/pratyush",
    accent: "emerald",
    emoji: "📗",
  },
];

export const defaultSheetId: SheetId = "kunal";

const loaders: Record<string, () => Promise<{ default: SheetDataset }>> = {
  kunal: () => import("@/data/sheets/kunal.json") as unknown as Promise<{ default: SheetDataset }>,
  pratyush: () => import("@/data/sheets/pratyush.json") as unknown as Promise<{ default: SheetDataset }>,
};

export function getSheetMeta(sheetId: SheetId) {
  return sheetCatalog.find((sheet) => sheet.id === sheetId) ?? sheetCatalog[0];
}

export async function loadSheetDataset(sheetId: SheetId): Promise<SheetDataset> {
  const loader = loaders[String(sheetId)] ?? loaders[defaultSheetId];
  const dataset = await loader();
  return dataset.default;
}

export function resolveSheetSlug(pathname: string, searchParams?: URLSearchParams) {
  if (pathname === "/pratyush") return "pratyush";
  if (pathname === "/kunal") return "kunal";
  if (pathname === "/sheet") return "kunal";

  const sheet = searchParams?.get("sheet");
  if (sheet === "pratyush") return "pratyush";
  if (sheet === "kunal") return "kunal";

  return defaultSheetId;
}
