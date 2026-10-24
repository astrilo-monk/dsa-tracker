"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemRow } from "./ProblemRow";
import type { SheetPattern, SheetQuestion } from "@/lib/sheets/types";

interface TopicCardProps {
  pattern: SheetPattern;
  index: number;
}

export function TopicCard({ pattern, index }: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { problemStates } = useTrackerStore();

  const allQuestions = pattern.groups.flatMap(g => g.questions);
  const totalProblems = allQuestions.length;
  const solvedCount = allQuestions.filter(p => problemStates[p.id]?.status === 'solved').length;
  const progressPercent = totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);

  const renderGroup = (title: string, questions: SheetQuestion[], colorClass: string) => {
    if (questions.length === 0) return null;
    return <ProblemGroup key={title} title={title} problems={questions} colorClass={colorClass} />;
  };

  return (
    <div className="bg-card/90 border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] group/card">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm border border-primary/20">
            {index}
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold tracking-tight">{pattern.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{solvedCount} / {totalProblems} Solved</p>
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
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
                       return <ProblemRow key={pseudoQuestion.id} problem={pseudoQuestion} isResourceOnly={true} />;
                    })}
                  </div>
                </div>
              )}
              
              {pattern.groups.find(g => g.difficulty === "Easy") && renderGroup("Easy", pattern.groups.find(g => g.difficulty === "Easy")!.questions, "text-sky-500")}
              {pattern.groups.find(g => g.difficulty === "Medium") && renderGroup("Medium", pattern.groups.find(g => g.difficulty === "Medium")!.questions, "text-amber-500")}
              {pattern.groups.find(g => g.difficulty === "Hard") && renderGroup("Hard", pattern.groups.find(g => g.difficulty === "Hard")!.questions, "text-rose-500")}
              {pattern.groups.find(g => g.difficulty === "Uncategorized") && renderGroup("Other Practices", pattern.groups.find(g => g.difficulty === "Uncategorized")!.questions, "text-muted-foreground")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProblemGroup({ title, problems, colorClass }: { title: string, problems: SheetQuestion[], colorClass: string }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-background/70 rounded-xl border border-border/80 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className={`text-xs font-semibold tracking-wider uppercase ${colorClass}`}>{title}</h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
            {problems.length} items
          </span>
        </div>
        <div className="text-muted-foreground">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-background/50"
          >
            <div className="p-2 space-y-1.5">
              {problems.map((problem) => (
                <ProblemRow key={problem.id} problem={problem} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
