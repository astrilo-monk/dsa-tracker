"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { useSheetData } from "@/hooks/useSheetData";
import { useTrackerStore } from "@/store/useTrackerStore";
import { TopicCard } from "@/components/TopicCard";
import { EmptyState, ListSkeleton, PageHeader, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";
import { getSheetMeta } from "@/lib/sheets/catalog";
import { summarize } from "@/lib/sheets/stats";
import type { SheetId, SheetQuestion } from "@/lib/sheets/types";

type Filter = "all" | "todo" | "revising" | "done";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "todo", label: "To do" },
  { id: "revising", label: "Revising" },
  { id: "done", label: "Done" },
];

export function SheetView({ sheetId }: { sheetId: SheetId }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, error } = useSheetData(sheetId);
  const problemStates = useTrackerStore((s) => s.problemStates);
  const sheetMeta = getSheetMeta(sheetId);

  // "/" focuses search, like most dev tools
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.key !== "/" || el?.matches("input, textarea, [contenteditable]")) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stats = useMemo(() => (data ? summarize(data, problemStates) : null), [data, problemStates]);

  if (isLoading) {
    return (
      <div>
        <div className="mb-8 h-14" />
        <ListSkeleton rows={8} />
      </div>
    );
  }

  if (error || !data || !stats) {
    return (
      <EmptyState>
        <p className="font-medium text-danger">Failed to load sheet data</p>
        <p className="mt-1">{error || "Unknown error"}</p>
      </EmptyState>
    );
  }

  const q = query.trim().toLowerCase();
  const isFiltering = q !== "" || filter !== "all";

  const matches = (question: SheetQuestion) => {
    const status = problemStates[question.id]?.status ?? "unsolved";
    const statusOk =
      filter === "all" ||
      (filter === "todo" && status === "unsolved") ||
      (filter === "revising" && status === "revising") ||
      (filter === "done" && status === "solved");
    const textOk =
      !q ||
      question.title.toLowerCase().includes(q) ||
      question.difficulty.toLowerCase().includes(q) ||
      question.platform.toLowerCase().includes(q);
    return statusOk && textOk;
  };

  const rows = data.patterns.map((pattern, i) => {
    const all = pattern.groups.flatMap((g) => g.questions);
    const solved = all.filter((x) => problemStates[x.id]?.status === "solved").length;
    return {
      index: i + 1,
      solved,
      total: all.length,
      pattern: {
        ...pattern,
        groups: pattern.groups
          .map((g) => ({ ...g, questions: g.questions.filter(matches) }))
          .filter((g) => g.questions.length > 0),
        resources:
          filter === "all" ? pattern.resources.filter((r) => !q || r.title.toLowerCase().includes(q)) : [],
      },
    };
  });

  const visible = rows.filter((r) => r.pattern.groups.length > 0 || r.pattern.resources.length > 0);
  const firstIncomplete = rows.find((r) => r.total > 0 && r.solved < r.total)?.index;
  const tiers = [
    { key: "Easy", color: "text-easy" },
    { key: "Medium", color: "text-medium" },
    { key: "Hard", color: "text-hard" },
  ] as const;

  return (
    <div>
      <PageHeader
        title={sheetMeta.title}
        description={data.description || undefined}
        action={
          sheetMeta.playlistUrl && (
            <a
              href={sheetMeta.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Playlist <ArrowUpRight className="size-3.5" />
            </a>
          )
        }
      />

      <div className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <p className="font-mono tabular-nums">
            <span className="text-3xl">{stats.solved}</span>
            <span className="text-lg text-faint">/{stats.total}</span>
            <span className="ml-3 text-xs text-muted-foreground">
              {stats.total === 0 ? 0 : Math.round((stats.solved / stats.total) * 100)}%
            </span>
          </p>
          <p className="flex gap-4 font-mono text-xs tabular-nums">
            {tiers.map((t) => (
              <span key={t.key} className="text-muted-foreground">
                <span className={t.color}>{t.key[0]}</span> {stats.byDifficulty[t.key].solved}/
                {stats.byDifficulty[t.key].total}
              </span>
            ))}
          </p>
        </div>
        <ProgressBar value={stats.solved} total={stats.total} className="mt-3" />
      </div>

      <div className="-mx-4 mt-8 flex flex-col gap-3 bg-background px-4 py-3 sm:sticky sm:top-12 sm:z-20 sm:flex-row sm:items-center md:-mx-6 md:px-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems"
            aria-label="Search problems"
            className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-9 text-sm focus:border-border-strong focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border-strong px-1.5 font-mono text-[10px] text-faint sm:block">
            /
          </kbd>
        </div>
        <div className="flex rounded-md border border-border p-0.5" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "h-8 flex-1 rounded px-3 text-xs transition-colors sm:flex-none",
                filter === f.id ? "bg-border-strong text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        {visible.map((r) => (
          <TopicCard
            key={r.pattern.id}
            pattern={r.pattern}
            index={r.index}
            solved={r.solved}
            total={r.total}
            defaultOpen={r.index === firstIncomplete}
            forceOpen={isFiltering}
          />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="mt-6">
          <EmptyState>Nothing matches.</EmptyState>
        </div>
      )}
    </div>
  );
}
