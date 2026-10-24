import type { Difficulty, SheetLink } from "./types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function toDifficulty(value: string): Difficulty {
  const normalized = value.trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "med") return "Medium";
  if (normalized === "hard") return "Hard";
  return "Uncategorized";
}

export function platformFromUrl(url: string) {
  if (url.includes("leetcode.com")) return "LeetCode";
  if (url.includes("geeksforgeeks.org")) return "GeeksForGeeks";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("hackerrank.com")) return "HackerRank";
  if (url.includes("spoj.com")) return "SPOJ";
  if (url.includes("codingninjas.com")) return "CodingNinjas";
  if (url.includes("ideserve.co.in")) return "iDeserve";
  return "Other";
}

export function resourceLabelFromUrl(url: string) {
  const platform = platformFromUrl(url);
  return platform === "Other" ? "Resource" : platform;
}

export function createLink(url: string, kind: "question" | "resource" = "question"): SheetLink {
  const platform = platformFromUrl(url);
  return {
    label: platform === "Other" ? resourceLabelFromUrl(url) : platform,
    url,
    platform,
    kind,
  };
}
