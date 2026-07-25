import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const LEGACY_KUNAL_FILE = path.join(ROOT, "src/data/dsa-data.json");
const PRATYUSH_SOURCE_FILE = path.join(ROOT, "src/data/sources/pratyush.txt");
const OUTPUT_DIR = path.join(ROOT, "src/data/sheets");

const difficultyOrder = ["Easy", "Medium", "Hard", "Uncategorized"];
const patternHints = [
  "Two Pointers",
  "Fast & Slow pointers",
  "Sliding Window",
  "Kadane pattern",
  "PREFIX SUM",
  "Merge Intervals",
  "In-place Reversal of a LinkedList",
  "Stack",
  "Hash Maps",
  "Binary Search",
  "HEAP PATTERN",
  "GREEDY+heap",
  "Recursion and Backtracking Pattern",
  "Tree Pattern",
  "GRAPHS",
  "DP (Dynamic Programming)",
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function toDifficulty(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "med") return "Medium";
  if (normalized === "hard") return "Hard";
  return "Uncategorized";
}

function platformFromUrl(url) {
  if (url.includes("leetcode.com")) return "LeetCode";
  if (url.includes("geeksforgeeks.org")) return "GeeksForGeeks";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("hackerrank.com")) return "HackerRank";
  if (url.includes("spoj.com")) return "SPOJ";
  if (url.includes("codingninjas.com")) return "CodingNinjas";
  if (url.includes("ideserve.co.in")) return "iDeserve";
  return "Other";
}

function createLink(url, kind = "question") {
  const platform = platformFromUrl(url);
  return {
    label: platform === "Other" ? "Resource" : platform,
    url,
    platform,
    kind,
  };
}

function cleanTitle(value) {
  return value
    .replace(/\(\s*(easy|medium|hard|med)\s*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s:,-]+|[\s:,-]+$/g, "")
    .trim();
}

function isResourceTitle(title, urls) {
  const combined = `${title} ${urls.join(" ")}`.toLowerCase();
  return /\b(video|videos|resource|resources|youtube|lecture|notes|guide|learning material|tutorial)\b/.test(combined);
}

function normalizeTextBlock(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/Page\s+\d+/gi, "")
    .replace(/\u2019/g, "'")
    .replace(/(https?:\/\/[^\s]+?)(?=(?:https?:\/\/)|(?:\n)|(?:[A-Z][a-z])|(?:[A-Z]{2,})|$)/g, "\n$1\n")
    .replace(/\n{3,}/g, "\n\n");
}

function extractPatternHeader(line) {
  const cleaned = line.replace(/^\d+\.\s*/g, "").replace(/^Pattern:\s*/i, "").trim();
  const lowerCleaned = cleaned.toLowerCase();

  for (const hint of patternHints.sort((a, b) => b.length - a.length)) {
    const lowerHint = hint.toLowerCase();
    if (lowerCleaned.startsWith(lowerHint)) {
      const remainder = cleaned.slice(hint.length).trim();
      return { patternTitle: hint, remainder };
    }
  }

  const difficultyMatch = cleaned.match(/\((?:easy|medium|hard|med)\)/i);
  if (difficultyMatch) {
    const boundary = cleaned.slice(0, difficultyMatch.index).trim();
    const words = boundary.split(/\s+/);
    if (words.length > 1) {
      const splitIndex = Math.max(1, Math.floor(words.length / 2));
      return {
        patternTitle: words.slice(0, splitIndex).join(" "),
        remainder: words.slice(splitIndex).join(" ") + cleaned.slice(difficultyMatch.index),
      };
    }
  }

  return { patternTitle: cleaned, remainder: "" };
}

function makeGroupMap() {
  return new Map(difficultyOrder.map((difficulty) => [difficulty, []]));
}

function flushQuestion(targetPattern, questionBuffer, urls, sourceId) {
  const rawTitle = questionBuffer.join(" ").trim();
  if (!rawTitle && urls.length === 0) return;

  const difficulty = toDifficulty(rawTitle.match(/\((easy|medium|hard|med)\)/i)?.[1] || "Uncategorized");
  const title = cleanTitle(rawTitle) || rawTitle || "Untitled";

  const linkEntries = urls.map((url) => createLink(url));
  const platform = linkEntries.length > 1
    ? Array.from(new Set(linkEntries.map((link) => link.platform))).join(" / ")
    : linkEntries[0]?.platform || "Other";

  const question = {
    id: sourceId,
    title,
    legacyId: undefined,
    difficulty,
    links: linkEntries,
    platform,
  };

  if (isResourceTitle(title, urls)) {
    targetPattern.resources.push({
      id: `${sourceId}::resource`,
      title,
      links: urls.map((url) => createLink(url, "resource")),
    });
    return;
  }

  targetPattern.groups.get(difficulty)?.push(question);
}

function convertLegacyKunal() {
  const legacy = JSON.parse(fs.readFileSync(LEGACY_KUNAL_FILE, "utf8"));
  const legacyMap = {};

  const dataset = {
    id: "kunal",
    title: "Kunal DSA",
    slug: "kunal",
    description: "Kunal Kushwaha DSA sheet converted into pattern and difficulty groups.",
    patterns: legacy.topics.map((topic) => {
      const patternSlug = slugify(topic.title);
      const groups = makeGroupMap();
      const resources = [];

      topic.problems.forEach((problem) => {
        const difficulty = toDifficulty(problem.difficulty);
        const sourceId = `kunal::${patternSlug}::${slugify(problem.title)}::${problem.id}`;
        legacyMap[problem.id] = sourceId;
        const links = [createLink(problem.link)];
        const platform = links[0].platform;
        const question = {
          id: sourceId,
          legacyId: problem.id,
          title: problem.title,
          difficulty,
          links,
          platform,
        };

        if (/\b(video|youtube|lecture|resource)\b/i.test(problem.title) || links[0].platform === "YouTube") {
          resources.push({
            id: `${sourceId}::resource`,
            title: problem.title,
            links: [createLink(problem.link, "resource")],
          });
        } else {
          groups.get(difficulty).push(question);
        }
      });

      return {
        id: `kunal::${patternSlug}`,
        title: topic.title,
        slug: patternSlug,
        groups: difficultyOrder.map((difficulty) => ({
          difficulty,
          questions: groups.get(difficulty),
        })),
        resources,
      };
    }),
  };

  return { dataset, legacyMap };
}

function parsePratyushSheet() {
  const raw = fs.readFileSync(PRATYUSH_SOURCE_FILE, "utf8");
  const normalized = normalizeTextBlock(raw);
  const lines = normalized.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  const dataset = {
    id: "pratyush",
    title: "Pratyush DSA",
    slug: "pratyush",
    description: "Pratyush DSA sheet imported from a text outline and grouped by pattern and difficulty.",
    patterns: [],
  };

  let currentPattern = null;
  let titleBuffer = [];
  let openQuestion = null;

  const flushCurrentQuestion = () => {
    if (!currentPattern) return;
    if (!openQuestion && titleBuffer.length === 0) return;

    const rawTitle = (openQuestion?.title ?? titleBuffer.join(" ")).trim();
    const urls = [...(openQuestion?.urls ?? [])];
    titleBuffer = [];
    openQuestion = null;

    if (!rawTitle || urls.length === 0) return;

    const difficulty = toDifficulty(rawTitle.match(/\((easy|medium|hard|med)\)/i)?.[1] || "Uncategorized");
    const title = cleanTitle(rawTitle) || rawTitle || "Untitled";
    const sourceId = `pratyush::${currentPattern.slug}::${slugify(title)}`;
    const linkEntries = urls.map((url) => createLink(url));
    const platform = linkEntries.length > 1
      ? Array.from(new Set(linkEntries.map((link) => link.platform))).join(" / ")
      : linkEntries[0]?.platform || "Other";
    const resourceLike = isResourceTitle(title, urls);

    if (resourceLike) {
      currentPattern.resources.push({
        id: `${sourceId}::resource`,
        title,
        links: urls.map((url) => createLink(url, "resource")),
      });
      return;
    }

    const question = {
      id: sourceId,
      title,
      difficulty,
      links: linkEntries,
      platform,
    };

    const group = currentPattern.groupMap.get(difficulty) || currentPattern.groupMap.get("Uncategorized");
    group.push(question);
  };

  for (const line of lines) {
    if (/^(?:\d+\.\s*)?Pattern:/i.test(line)) {
      flushCurrentQuestion();

      const { patternTitle, remainder } = extractPatternHeader(line);
      const slug = slugify(patternTitle || "pattern");
      currentPattern = {
        id: `pratyush::${slug}`,
        title: patternTitle || "Pattern",
        slug,
        groupMap: makeGroupMap(),
        groups: [],
        resources: [],
      };
      dataset.patterns.push(currentPattern);

      if (remainder) {
        titleBuffer = [remainder];
      }
      continue;
    }

    if (/^https?:\/\//i.test(line)) {
      if (openQuestion) {
        openQuestion.urls.push(line);
      } else if (titleBuffer.length > 0) {
        openQuestion = {
          title: titleBuffer.join(" "),
          urls: [line],
        };
        titleBuffer = [];
      }
      continue;
    }

    if (!currentPattern) {
      continue;
    }

    if (openQuestion) {
      flushCurrentQuestion();
    }

    titleBuffer.push(line);
  }

  flushCurrentQuestion();

  dataset.patterns.forEach((pattern) => {
    pattern.groups = difficultyOrder.map((difficulty) => ({
      difficulty,
      questions: pattern.groupMap.get(difficulty),
    }));
    delete pattern.groupMap;
  });

  return dataset;
}

function writeDataset(fileName, dataset) {
  const outputPath = path.join(OUTPUT_DIR, fileName);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
}

const { dataset: kunal, legacyMap: kunalLegacyMap } = convertLegacyKunal();
const pratyush = parsePratyushSheet();

writeDataset("kunal.json", kunal);
writeDataset("pratyush.json", pratyush);
writeDataset("kunal-legacy-map.json", kunalLegacyMap);

console.log(`Generated ${kunal.patterns.length} Kunal patterns and ${pratyush.patterns.length} Pratyush patterns.`);
