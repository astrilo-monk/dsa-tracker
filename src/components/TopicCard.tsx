"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemRow } from "./ProblemRow";
import { ProgressBar } from "./ui";
import { cn } from "@/lib/cn";
import { formatPatternTitle } from "@/lib/sheets/utils";
import type { SheetDifficultyGroup, SheetPattern, SheetQuestion } from "@/lib/sheets/types";

interface TopicCardProps {
  /** Pattern with groups/resources already filtered for display. */
  pattern: SheetPattern;
  /** Position in the full sheet (stays stable while filtering). */
  index: number;
  /** Progress for the whole pattern, independent of any active filter. */
  solved: number;
  total: number;
  defaultOpen?: boolean;
  /** Keeps the section open while a search/filter is active. */
  forceOpen?: boolean;
}

const dotColor: Record<string, string> = {
  Easy: "bg-easy",
  Medium: "bg-medium",
  Hard: "bg-hard",
  Uncategorized: "bg-faint",
};

export function TopicCard({ pattern, index, solved, total, defaultOpen = false, forceOpen = false }: TopicCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = open || forceOpen;
  const done = total > 0 && solved === total;

  return (
    <section id={pattern.slug} className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        className="group flex w-full items-center gap-4 py-3.5 text-left"
      >
        <span className="w-5 font-mono text-xs tabular-nums text-faint">{String(index).padStart(2, "0")}</span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-[15px] font-medium transition-colors",
            done ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {formatPatternTitle(pattern.title)}
        </span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {solved}/{total}
        </span>
        <span className="hidden w-20 sm:block">
          <ProgressBar value={solved} total={total} />
        </span>
        <ChevronRight
          className={cn(
            "size-4 text-faint transition-transform group-hover:text-muted-foreground",
            isOpen && "rotate-90"
          )}
        />
      </button>

      {isOpen && (
        <div className="pb-5 sm:pl-9">
          {pattern.resources.length > 0 && (
            <div className="mb-4">
              <GroupLabel dot="bg-faint" label="Watch" />
              <ul>
                {pattern.resources.map((resource) => {
                  const pseudo: SheetQuestion = {
                    id: resource.id,
                    title: resource.title,
                    difficulty: "Uncategorized",
                    links: resource.links,
                    platform: resource.links[0]?.platform || "Other",
                  };
                  return <ProblemRow key={pseudo.id} problem={pseudo} isResourceOnly />;
                })}
              </ul>
            </div>
          )}

          {pattern.groups.map((group) => (
            <Group key={group.difficulty} group={group} />
          ))}
        </div>
      )}
    </section>
  );
}

function Group({ group }: { group: SheetDifficultyGroup }) {
  const problemStates = useTrackerStore((s) => s.problemStates);
  const solved = group.questions.filter((q) => problemStates[q.id]?.status === "solved").length;
  const label = group.difficulty === "Uncategorized" ? "Other" : group.difficulty;

  return (
    <div className="mb-4 last:mb-0">
      <GroupLabel dot={dotColor[group.difficulty]} label={label} count={`${solved}/${group.questions.length}`} />
      <ul>
        {group.questions.map((q) => (
          <ProblemRow key={q.id} problem={q} />
        ))}
      </ul>
    </div>
  );
}

function GroupLabel({ dot, label, count }: { dot: string; label: string; count?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-2 pt-1 font-mono text-[11px] uppercase tracking-wider text-faint">
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
      {count && <span className="tabular-nums text-muted-foreground">{count}</span>}
    </div>
  );
}
