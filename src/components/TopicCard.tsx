"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemRow } from "./ProblemRow";
import type { Difficulty, SheetId, SheetPattern, SheetQuestion } from "@/lib/sheets/types";

interface TopicCardProps {
  pattern: SheetPattern;
  index: number;
  /** Word for completed items, e.g. "Solved" (DSA) or "Done" (GATE). */
  doneLabel?: string;
  sheetId: SheetId;
  hideDifficulty?: boolean;
  onQuestionAdded: (question: SheetQuestion) => void;
  allowQuestionCreation: boolean;
}

export function TopicCard({
  pattern,
  index,
  doneLabel = "Solved",
  sheetId,
  hideDifficulty = false,
  onQuestionAdded,
  allowQuestionCreation,
}: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { problemStates } = useTrackerStore();

  const allQuestions = pattern.groups.flatMap(g => g.questions);
  const totalProblems = allQuestions.length;
  const solvedCount = allQuestions.filter(p => problemStates[p.id]?.status === 'solved').length;
  const progressPercent = totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);

  const renderGroup = (
    title: string,
    questions: SheetQuestion[],
    colorClass: string,
    difficulty: Difficulty = title as Difficulty,
  ) => {
    if (questions.length === 0) return null;
    return (
      <ProblemGroup
        key={title}
        title={title}
        problems={questions}
        colorClass={colorClass}
        difficulty={difficulty}
        sheetId={sheetId}
        patternId={pattern.id}
        hideDifficulty={hideDifficulty}
        onQuestionAdded={onQuestionAdded}
        allowQuestionCreation={allowQuestionCreation}
      />
    );
  };

  // Uncategorized questions are normally one "Other Practices" block. When every one of them
  // carries a subcategory (GATE topics), show one block per subcategory instead.
  const uncategorized = pattern.groups.find(g => g.difficulty === "Uncategorized");
  const uncategorizedSections: { title: string; questions: SheetQuestion[]; colorClass: string }[] = [];
  if (uncategorized && uncategorized.questions.length > 0) {
    if (uncategorized.questions.every(q => q.subcategory)) {
      for (const q of uncategorized.questions) {
        const existing = uncategorizedSections.find(s => s.title === q.subcategory);
        if (existing) existing.questions.push(q);
        else uncategorizedSections.push({ title: q.subcategory!, questions: [q], colorClass: "text-primary" });
      }
    } else {
      uncategorizedSections.push({ title: "Other Practices", questions: uncategorized.questions, colorClass: "text-muted-foreground" });
    }
  }

  return (
    <div className="bg-card/90 border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] group/card">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`pattern-content-${pattern.id}`}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full min-h-16 px-5 py-4 flex items-center justify-between hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm border border-primary/20">
            {index}
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold tracking-tight text-balance">{pattern.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
              {solvedCount} / {totalProblems} {doneLabel}
              {pattern.weightage && <span className="text-muted-foreground/70"> · {pattern.weightage}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end w-32">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{progressPercent}% Completed</span>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary shadow-[0_0_12px_rgba(138,180,248,0.7)] transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="text-muted-foreground">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`pattern-content-${pattern.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ transformOrigin: "top center" }}
            className="border-t border-border bg-[#0c0f16]/60"
          >
            <div className="p-4 sm:p-5 space-y-4">
              {pattern.resources && pattern.resources.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold tracking-wide uppercase text-primary mb-2">Videos & Resources</h3>
                  <div className="space-y-2">
                    {pattern.resources.map(resource => {
                       const pseudoQuestion: SheetQuestion = {
                         id: resource.id,
                         title: resource.title,
                         difficulty: "Uncategorized",
                         links: resource.links,
                         platform: resource.links[0]?.platform || "Other"
                       };
                       return <ProblemRow key={pseudoQuestion.id} problem={pseudoQuestion} isResourceOnly={true} sheetId={sheetId} />;
                    })}
                  </div>
                </div>
              )}
              
              {hideDifficulty
                ? (
                  <div className="space-y-1.5">
                    {allQuestions.map((problem) => (
                      <ProblemRow key={problem.id} problem={problem} hideDifficulty sheetId={sheetId} />
                    ))}
                  </div>
                )
                : (
                  <>
                    {pattern.groups.find(g => g.difficulty === "Easy") && renderGroup("Easy", pattern.groups.find(g => g.difficulty === "Easy")!.questions, "text-sky-500")}
                    {pattern.groups.find(g => g.difficulty === "Medium") && renderGroup("Medium", pattern.groups.find(g => g.difficulty === "Medium")!.questions, "text-amber-500")}
                    {pattern.groups.find(g => g.difficulty === "Hard") && renderGroup("Hard", pattern.groups.find(g => g.difficulty === "Hard")!.questions, "text-rose-500")}
                    {uncategorized && uncategorizedSections.map(section => renderGroup(section.title, section.questions, section.colorClass, "Uncategorized"))}
                  </>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProblemGroup({
  title,
  problems,
  colorClass,
  difficulty,
  hideDifficulty,
  sheetId,
  patternId,
  onQuestionAdded,
  allowQuestionCreation,
}: {
  title: string;
  problems: SheetQuestion[];
  colorClass: string;
  difficulty: Difficulty;
  hideDifficulty: boolean;
  sheetId: SheetId;
  patternId: string;
  onQuestionAdded: (question: SheetQuestion) => void;
  allowQuestionCreation: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status } = useSession();
  const playlistLinks = Array.from(
    new Map(
      problems
        .flatMap((problem) => problem.resourceLinks ?? [])
        .filter((link) => link.platform === "YouTube")
        .map((link) => [link.url, link])
    ).values()
  );

  return (
    <div className="bg-background/70 rounded-xl border border-border/80 overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className={`text-xs font-semibold tracking-wider uppercase ${colorClass}`}>{title}</h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
            {problems.length} items
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status === "authenticated" || allowQuestionCreation ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsAdding((current) => !current);
                setError(null);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              title={`Add a ${title.toLowerCase()} question`}
            >
              {isAdding ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {isAdding ? "Cancel" : "Add"}
            </button>
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                signIn("github");
              }}
              className="text-[10px] font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in to add
            </button>
          )}
          {playlistLinks.length > 0 && (
            <div className="flex items-center gap-1.5">
              {playlistLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center rounded-md border border-border bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  YouTube
                </a>
              ))}
            </div>
          )}
          <div className="text-muted-foreground">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-background/50"
          >
            <div className="p-2 space-y-1.5">
              {isAdding && (
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setIsSaving(true);
                    setError(null);
                    try {
                      const response = await fetch("/api/questions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          sheetId,
                          patternId,
                          title: titleInput,
                          difficulty,
                          url: urlInput,
                        }),
                      });
                      const result = await response.json();
                      if (!response.ok) throw new Error(result.error || "Failed to add question.");
                      onQuestionAdded(result.question);
                      setTitleInput("");
                      setUrlInput("");
                      setIsAdding(false);
                    } catch (saveError) {
                      setError(saveError instanceof Error ? saveError.message : "Failed to add question.");
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2"
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    value={titleInput}
                    onChange={(event) => setTitleInput(event.target.value)}
                    placeholder={`Question title (${title})`}
                    maxLength={200}
                    required
                    className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    value={urlInput}
                    onChange={(event) => setUrlInput(event.target.value)}
                    placeholder="Question URL (optional)"
                    type="url"
                    className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {error && <p className="text-xs text-danger">{error}</p>}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
                  >
                    {isSaving ? "Adding..." : "Add question"}
                  </button>
                </form>
              )}
              {problems.map((problem) => (
                <ProblemRow key={problem.id} problem={problem} hideDifficulty={hideDifficulty} sheetId={sheetId} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
