"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Flame, Maximize2, MessageSquare, Play, RotateCw, X } from "lucide-react";
import { useTrackerStore, type ProblemState } from "@/store/useTrackerStore";
import { cn } from "@/lib/cn";
import type { SheetQuestion, SheetLink } from "@/lib/sheets/types";

interface ProblemRowProps {
  problem: SheetQuestion;
  isResourceOnly?: boolean;
  /** Small context label, e.g. the pattern name when rows are listed outside their pattern. */
  context?: string;
}

const EMPTY_STATE: ProblemState = { status: "unsolved", notes: "", bookmarked: false, important: false };

const difficultyColor: Record<string, string> = {
  easy: "text-easy",
  medium: "text-medium",
  hard: "text-hard",
};

const statusLabel: Record<ProblemState["status"], string> = {
  unsolved: "Not solved",
  solved: "Solved",
  revising: "Needs revision",
};

const nextStatus: Record<ProblemState["status"], ProblemState["status"]> = {
  unsolved: "solved",
  solved: "revising",
  revising: "unsolved",
};

export function ProblemRow({ problem, isResourceOnly = false, context }: ProblemRowProps) {
  const state = useTrackerStore((s) => s.problemStates[problem.id]) ?? EMPTY_STATE;
  const markStatus = useTrackerStore((s) => s.markStatus);
  const toggleImportant = useTrackerStore((s) => s.toggleImportant);
  const updateNotes = useTrackerStore((s) => s.updateNotes);

  const links = problem.links ?? [];
  const [showNotes, setShowNotes] = useState(false);
  const [draft, setDraft] = useState("");
  const [expanded, setExpanded] = useState(false);

  const showDifficulty = !isResourceOnly && problem.difficulty !== "Uncategorized";
  const showPlatform = problem.platform && problem.platform !== "Other";
  const solved = state.status === "solved";

  const openNotes = () => {
    if (!showNotes) setDraft(state.notes);
    setShowNotes(!showNotes);
  };

  const saveNotes = () => {
    updateNotes(problem.id, draft);
    setShowNotes(false);
    setExpanded(false);
  };

  const cancelNotes = () => {
    setShowNotes(false);
    setExpanded(false);
  };

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const duplicateLabels = new Set(
    links
      .map((link) => link.label)
      .filter((label, index, labels) => labels.indexOf(label) !== index)
  );
  const labelCounts = new Map<string, number>();
  const platformLinks =
    links.length > 1 ? (
      <span className="relative inline-flex items-center">
        <select
          defaultValue={links[0].url}
          aria-label="Choose a link"
          onChange={(event) => window.open(event.currentTarget.value, "_blank", "noopener,noreferrer")}
          className="min-w-28 cursor-pointer appearance-none rounded border border-border-strong bg-surface px-2 py-1 pr-7 text-inherit outline-none"
        >
          {links.map((link: SheetLink) => {
            const count = (labelCounts.get(link.label) ?? 0) + 1;
            labelCounts.set(link.label, count);
            const label = duplicateLabels.has(link.label) ? `${link.label} ${count}` : link.label;
            return (
              <option key={`${problem.id}-${link.url}`} value={link.url}>
                {label}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 size-3.5 text-muted-foreground" />
      </span>
    ) : showPlatform ? (
      <span>{problem.platform}</span>
    ) : null;

  return (
    <li className="mb-2 rounded border border-border last:mb-0">
      <div className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-start gap-x-4 px-4 py-5 sm:grid-cols-[22px_minmax(0,1fr)_5rem_9rem_auto] sm:items-center">
        <button
          type="button"
          onClick={() => markStatus(problem.id, nextStatus[state.status])}
          aria-label={`${problem.title}: ${statusLabel[state.status]}. Click to change.`}
          title={`${statusLabel[state.status]} (click to change)`}
          className={cn(
            "relative mt-0.5 grid size-[18px] place-items-center rounded-[4px] border transition-colors before:absolute before:-inset-2.5 before:content-[''] sm:mt-0",
            state.status === "solved" && "border-accent bg-accent text-accent-foreground",
            state.status === "revising" && "border-warning text-warning",
            state.status === "unsolved" && "border-border-strong hover:border-muted-foreground"
          )}
        >
          {state.status === "solved" && <Check className="size-3" strokeWidth={3} />}
          {state.status === "revising" && <RotateCw className="size-2.5" strokeWidth={2.5} />}
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <a
              href={links[0]?.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm leading-snug transition-colors hover:text-foreground hover:underline hover:underline-offset-4",
                solved ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {isResourceOnly && <Play className="size-3 shrink-0 text-faint" />}
              {problem.title}
            </a>
            {problem.note && (
              <span className="rounded border border-border-strong px-1.5 font-mono text-[10px] text-muted-foreground">
                {problem.note}
              </span>
            )}
          </div>

          {/* meta line, small screens only */}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-faint sm:hidden">
            {context && <span>{context}</span>}
            {showDifficulty && (
              <span className={difficultyColor[problem.difficulty.toLowerCase()]}>{problem.difficulty}</span>
            )}
            {platformLinks}
          </div>

          {context && <p className="mt-0.5 hidden font-mono text-[11px] text-faint sm:block">{context}</p>}

          {state.notes && !showNotes && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              <span className="text-faint">note </span>
              {state.notes}
            </p>
          )}
        </div>

        <span
          className={cn(
            "hidden font-mono text-[11px] sm:block",
            difficultyColor[problem.difficulty.toLowerCase()]
          )}
        >
          {showDifficulty ? problem.difficulty : ""}
        </span>

        <div className="hidden items-center gap-x-2 font-mono text-[11px] text-faint sm:flex">{platformLinks}</div>

        <div className="flex items-center">
          <IconToggle
            label="Notes"
            active={!!state.notes || showNotes}
            onClick={openNotes}
            activeClass="text-foreground"
          >
            <MessageSquare className="size-4" />
          </IconToggle>
          <IconToggle
            label="Mark important"
            active={state.important}
            onClick={() => toggleImportant(problem.id)}
            activeClass="text-warning"
          >
            <Flame className={cn("size-4", state.important && "fill-current")} />
          </IconToggle>
        </div>
      </div>

      {showNotes && (
        <div className="pb-3 pl-[30px]">
          <div className="relative">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Approach, trick, complexity…"
              className="h-24 w-full resize-none rounded-md border border-border-strong bg-surface p-2.5 pr-9 text-sm focus:border-muted-foreground focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-label="Expand notes"
              title="Expand notes"
              className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded text-faint transition-colors hover:text-foreground"
            >
              <Maximize2 className="size-3.5" />
            </button>
          </div>
          <NoteActions onCancel={cancelNotes} onSave={saveNotes} />
        </div>
      )}

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setExpanded(false)}
        >
          <div
            role="dialog"
            aria-label="Notes"
            className="flex h-[min(28rem,calc(100vh-2rem))] w-[min(34rem,calc(100vw-2rem))] flex-col rounded-lg border border-border-strong bg-background p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="min-w-0 truncate text-sm font-medium">{problem.title}</p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close"
                className="grid size-7 shrink-0 place-items-center rounded text-faint transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Approach, trick, complexity…"
              className="min-h-0 flex-1 resize-none rounded-md border border-border-strong bg-surface p-3 text-sm focus:border-muted-foreground focus:outline-none"
            />
            <NoteActions onCancel={cancelNotes} onSave={saveNotes} />
          </div>
        </div>
      )}
    </li>
  );
}

function NoteActions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div className="mt-2 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="h-7 rounded-md px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="h-7 rounded-md bg-accent px-3 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Save
      </button>
    </div>
  );
}

function IconToggle({
  label,
  active,
  activeClass,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "grid size-8 place-items-center rounded-md transition-colors",
        active ? activeClass : "text-faint hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
