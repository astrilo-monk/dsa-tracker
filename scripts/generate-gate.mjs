// Builds src/data/sheets/gate.json from the syllabus below.
//
//   node scripts/generate-gate.mjs
//
// Source of truth: the official GATE CS syllabus (IIT Madras, GATE 2027) and the
// official GA syllabus. GATE 2028 has not published its own syllabus yet, so this
// is the checklist to follow until it does. Re-check once the 2028 notification is out.
//   https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf
//   https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/GA_GATE2027_Syllabus.pdf
//
// Progress is keyed by id (gate::<subject>::<topic>), so you can reorder topics freely.
// If you RENAME a topic its id changes and its progress resets, so prefer adding new
// topics over renaming old ones.
//
// `weightage` is shown next to the subject. Only GA (15) and Engineering Mathematics (13)
// are fixed numbers. The rest are community estimates (marked with ~), not official.

import fs from "fs";
import path from "path";

const OUTPUT_FILE = path.join(process.cwd(), "src/data/sheets/gate.json");
const RESOURCES_FILE = path.join(
  process.cwd(),
  "src/data/sheets/gate-engineering-math-resources.json"
);
const RESOURCE_DATASET_FILES = [
  "gate-engineering-dsa-resources.json",
  "gate-engineering-digitallogic-resources.json",
  "gate-engineering-coa-resources.json",
  "gate-engineering-os-resources.json",
  "gate-engineering-cd-resources.json",
  "gate-engineering-dbms-resources.json",
  "gate-engineering-algorithms-resources.json",
  "gate-engineering-toc-resources.json",
].map((file) => path.join(process.cwd(), "src/data/sheets", file));

const syllabus = [
  {
    title: "General Aptitude",
    weightage: "15 marks",
    sections: {
      "Verbal Aptitude": [
        "Basic English grammar (tenses, articles, adjectives, prepositions, conjunctions, verb-noun agreement)",
        "Basic vocabulary: words, idioms and phrases in context",
        "Reading and comprehension",
        "Narrative sequencing",
      ],
      "Quantitative Aptitude": [
        "Data interpretation: graphs, 2D and 3D plots, maps and tables",
        "Ratios and percentages",
        "Powers, exponents and logarithms",
        "Permutations and combinations",
        "Series",
        "Mensuration and geometry",
        "Elementary statistics and probability",
      ],
      "Analytical Aptitude": [
        "Logic: deduction and induction",
        "Analogy",
        "Numerical relations and reasoning",
      ],
      "Spatial Aptitude": [
        "Transformation of shapes: translation, rotation, scaling, mirroring, assembling, grouping",
        "Paper folding, cutting and patterns in 2D and 3D",
      ],
    },
  },
  {
    title: "Engineering Mathematics",
    weightage: "13 marks + ~8-10 discrete",
    sections: {
      "Discrete Mathematics": [
        "Propositional and first-order logic",
        "Sets, relations and functions",
        "Partial orders and lattices",
        "Monoids and groups",
        "Graphs: connectivity, matching and colouring",
        "Combinatorics: counting",
        "Recurrence relations",
        "Generating functions",
      ],
      "Linear Algebra": [
        "Matrices",
        "Determinants",
        "Systems of linear equations",
        "Eigenvalues and eigenvectors",
        "LU decomposition",
      ],
      Calculus: [
        "Limits",
        "Continuity and differentiability",
        "Maxima and minima",
        "Mean value theorem",
        "Integration",
      ],
      "Probability and Statistics": [
        "Random variables",
        "Uniform, normal, exponential, Poisson and binomial distributions",
        "Mean, median, mode and standard deviation",
        "Conditional probability",
        "Bayes' theorem",
      ],
    },
  },
  {
    title: "Digital Logic",
    weightage: "~4-6 marks",
    sections: {
      "Boolean Algebra and Minimisation": [
        "Boolean algebra",
        "Algebraic technique",
        "Karnaugh map",
        "Tabular method",
      ],
      "Circuit Design": [
        "Design of combinational circuits",
        "Design of sequential circuits",
      ],
      "Number Representation and Arithmetic": [
        "Number representation",
        "Fixed-point arithmetic",
        "Floating-point arithmetic",
      ],
    },
  },
  {
    title: "Computer Organization and Architecture",
    weightage: "~8-10 marks",
    sections: {
      "Instruction and Control": [
        "Instruction set",
        "Addressing modes",
        "Design of Arithmetic and Logic Unit (ALU)",
        "Hardwired control",
        "Microprogrammed control",
      ],
      "Memory and I/O": [
        "Memory interfacing",
        "Memory hierarchy",
        "Memory performance",
        "Cache memory mapping",
        "I/O interface",
        "Interrupt",
        "DMA",
      ],
      "Instruction Pipelining": [
        "Instruction pipelining",
        "Pipeline hazards",
      ],
    },
  },
  {
    title: "Programming and Data Structures",
    weightage: "counted with Algorithms",
    sections: {
      Programming: ["Programming in C", "Recursion"],
      "Data Structures": [
        "Arrays",
        "Stacks",
        "Queues",
        "Linked lists",
        "Trees",
        "Binary search trees",
        "Binary heaps",
        "Graphs",
      ],
    },
  },
  {
    title: "Algorithms",
    weightage: "~12-16 marks (with PDS)",
    sections: {
      "Basic Algorithms": [
        "Searching",
        "Sorting",
        "Hashing",
        "Asymptotic worst-case time and space complexity",
      ],
      "Algorithm Design Techniques": [
        "Greedy",
        "Dynamic programming",
        "Divide-and-conquer",
      ],
      "Graph Algorithms": [
        "Graph traversals",
        "Minimum spanning trees",
        "Shortest paths",
      ],
    },
  },
  {
    title: "Theory of Computation",
    weightage: "~7-9 marks",
    sections: {
      "Automata and Languages": [
        "Regular expressions",
        "Finite automata",
        "Context-free grammars",
        "Push-down automata",
        "Regular languages",
        "Context-free languages",
        "Pumping lemma",
      ],
      Computability: ["Turing machines", "Undecidability"],
    },
  },
  {
    title: "Compiler Design",
    weightage: "~4-6 marks",
    sections: {
      "Compiler Phases": [
        "Lexical analysis",
        "Parsing",
        "Syntax-directed translation",
        "Runtime environments",
        "Intermediate code generation",
      ],
      "Optimisation and Data Flow Analysis": [
        "Local optimisation",
        "Constant propagation",
        "Liveness analysis",
        "Common sub-expression elimination",
      ],
    },
  },
  {
    title: "Operating Systems",
    weightage: "~8-10 marks",
    sections: {
      "Processes and Concurrency": [
        "System calls",
        "Processes",
        "Threads",
        "Inter-process communication",
        "Concurrency and synchronisation",
        "Deadlock",
      ],
      "Scheduling and Memory": [
        "CPU scheduling",
        "I/O scheduling",
        "Memory management",
        "Virtual memory",
      ],
      "File Systems": ["File systems"],
    },
  },
  {
    title: "Databases",
    weightage: "~7-9 marks",
    sections: {
      "Database Models and SQL": [
        "ER model",
        "Relational model",
        "Relational algebra",
        "Tuple calculus",
        "SQL",
        "Integrity constraints",
        "Normal forms",
      ],
      "File Organisation and Transactions": [
        "File organisation",
        "Indexing",
        "B trees",
        "B+ trees",
        "Transactions",
        "Concurrency control",
      ],
    },
  },
  {
    title: "Computer Networks",
    weightage: "~6-8 marks",
    sections: {
      "Layering and Switching": [
        "Principles of layering",
        "Circuit switching",
        "Packet switching",
        "Virtual circuit switching",
        "Performance metrics",
      ],
      "Data Link Layer and Routing": [
        "Data link layer",
        "Error detection",
        "Medium Access Control",
        "Ethernet",
        "Distance vector routing",
        "Link state routing",
      ],
      "IPv4, Transport and Application Layer": [
        "IPv4",
        "Fragmentation",
        "CIDR notation",
        "Network Address Translation (NAT)",
        "TCP flow control",
        "TCP congestion control",
        "Socket API",
        "DNS",
        "HTTP",
      ],
    },
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\+/g, "plus") // keeps "B trees" and "B+ trees" distinct
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const seen = new Set();
const resources = JSON.parse(fs.readFileSync(RESOURCES_FILE, "utf8"));
const resourceGroups = new Map(resources.groups.map((group) => [group.group, group]));
const resourceDatasets = new Map(
  RESOURCE_DATASET_FILES.map((file) => {
    const dataset = JSON.parse(fs.readFileSync(file, "utf8"));
    return [dataset.title, dataset];
  })
);

function topicLinks(group, topicTitle) {
  const topic = group?.topics?.find((item) => item.topic === topicTitle);
  return (topic?.notes ?? []).map((note) => ({
    label: note.title,
    url: note.url,
    platform: "Notes",
    kind: "resource",
  }));
}

function groupLinks(group) {
  const links = [];
  for (const resource of group?.playlists ?? []) {
    links.push({
      label: resource.url.includes("youtube.com") ? "YouTube" : resource.type === "nptel_course" ? "NPTEL" : resource.title,
      url: resource.url,
      platform: resource.url.includes("youtube.com") ? "YouTube" : "Other",
      kind: "resource",
    });
  }

  for (const resource of group?.pyq ?? []) {
    links.push({
      label: resource.title,
      url: resource.url,
      platform: "PYQ",
      kind: "resource",
    });
  }

  return links;
}

function datasetTopicLinks(dataset, subcategory, title) {
  const question = dataset?.groups
    ?.flatMap((group) => group.questions ?? [])
    .find((item) => item.title === title && item.subcategory === subcategory);
  const links = question?.links ?? [];

  return {
    notes: links.filter((link) => link.platform !== "YouTube"),
    youtube: links
      .filter((link) => link.platform === "YouTube")
      .map((link) => ({ ...link, label: "YouTube" })),
  };
}

const patterns = syllabus.map((subject) => {
  const subjectSlug = slugify(subject.title);
  const resourceDataset = resourceDatasets.get(subject.title);

  const questions = Object.entries(subject.sections).flatMap(([subcategory, topics]) =>
    topics.map((title, topicIndex) => {
      const id = `gate::${subjectSlug}::${slugify(title)}`;
      if (seen.has(id)) throw new Error(`Duplicate topic id: ${id}`);
      seen.add(id);

      const datasetLinks = datasetTopicLinks(resourceDataset, subcategory, title);
      const mathNotes = topicLinks(resourceGroups.get(subcategory), title);
      const mathGroupLinks = topicIndex === 0 ? groupLinks(resourceGroups.get(subcategory)) : [];

      return {
        id,
        title,
        difficulty: "Uncategorized",
        platform: "Other",
        subcategory,
        links: resourceDataset ? datasetLinks.notes : mathNotes.slice(0, 1),
        resourceLinks: resourceDataset ? datasetLinks.youtube : mathGroupLinks,
      };
    })
  );

  return {
    id: `gate::${subjectSlug}`,
    title: subject.title,
    slug: subjectSlug,
    weightage: subject.weightage,
    groups: [{ difficulty: "Uncategorized", questions }],
    resources: [],
  };
});

const dataset = {
  id: "gate",
  title: "GATE CSE 2028",
  slug: "gate",
  description:
    "Checklist from the official GATE CS syllabus (2027). The 2028 syllabus isn't out yet.",
  patterns,
};

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dataset, null, 2) + "\n");

const topicCount = patterns.reduce((n, p) => n + p.groups[0].questions.length, 0);
console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_FILE)}: ${patterns.length} subjects, ${topicCount} topics`);
