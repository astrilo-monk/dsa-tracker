"use client";

import { useMemo, useState } from "react";
import { useTrackerStore, ProblemState } from "@/store/useTrackerStore";
import { Check, Flame, Bookmark, ExternalLink, MessageSquare, Link2, BookOpen } from "lucide-react";
import { cn } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import type { SheetQuestion, SheetLink } from "@/lib/sheets/types";

interface ProblemRowProps {
  problem: SheetQuestion;
  isResourceOnly?: boolean;
}

export function ProblemRow({ problem, isResourceOnly = false }: ProblemRowProps) {
  const { problemStates, markStatus, toggleBookmark, toggleImportant, updateNotes } = useTrackerStore();
  const state = problemStates[problem.id] || { status: 'unsolved', notes: '', bookmarked: false, important: false };
  const links = problem.links || [];
  
  const [showNotes, setShowNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(state.notes);

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard': return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const handleStatusChange = () => {
    const nextStatus = state.status === 'unsolved' ? 'solved' : state.status === 'solved' ? 'revising' : 'unsolved';
    markStatus(problem.id, nextStatus as ProblemState['status']);
  };

  const saveNotes = () => {
    updateNotes(problem.id, tempNotes);
    setShowNotes(false);
  };

  return (
    <div className="group rounded-lg border border-transparent bg-transparent hover:bg-muted/30 transition-all duration-200 hover:border-border relative overflow-hidden">
      <div className="px-3 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        
        {/* Left Side: Status & Title */}
        <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
          <button 
            onClick={handleStatusChange}
            className={cn(
              "mt-0.5 sm:mt-0 flex-shrink-0 w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
              state.status === 'solved' ? "bg-primary border-primary text-primary-foreground shadow-sm" : 
              state.status === 'revising' ? "bg-amber-500 border-amber-500 text-white shadow-sm" : 
              "border-border/80 hover:border-primary/50 text-transparent bg-background"
            )}
            title={`Status: ${state.status}`}
          >
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
          
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <a 
              href={links[0]?.url ?? '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "font-medium text-sm leading-snug hover:text-primary transition-colors inline-flex items-center gap-1.5 w-fit",
                state.status === 'solved' && "text-muted-foreground line-through opacity-70"
              )}
            >
              {isResourceOnly && <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />}
              <span className="hover:underline line-clamp-1">{problem.title}</span>
            </a>
            
            <div className="flex flex-wrap items-center gap-1.5">
              {!isResourceOnly && problem.difficulty !== "Uncategorized" && (
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", getDifficultyColor(problem.difficulty))}>
                  {problem.difficulty}
                </span>
              )}
              {problem.platform && problem.platform !== 'Other' && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">
                  {problem.platform}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Links & Actions */}
        <div className="flex flex-wrap items-center gap-2 pl-8 sm:pl-0">
          {links.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mr-2">
              {links.map((link: SheetLink) => (
                <a
                  key={`${problem.id}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  {link.kind === 'resource' || link.label.toLowerCase().includes('video') || link.url.includes('youtu') ? (
                    <BookOpen className="w-3 h-3" />
                  ) : (
                    <ExternalLink className="w-3 h-3" />
                  )}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-0.5 flex-shrink-0">
            <button 
              onClick={() => setShowNotes(!showNotes)}
              className={cn("p-1.5 rounded-md transition-all duration-200", state.notes ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/80")}
              title="Notes"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button 
              onClick={() => toggleImportant(problem.id)}
              className={cn("p-1.5 rounded-md transition-all duration-200", state.important ? "text-orange-500 bg-orange-500/10" : "text-muted-foreground hover:bg-muted/80")}
              title="Mark Important"
            >
              <Flame className="w-4 h-4" />
            </button>
            <button 
              onClick={() => toggleBookmark(problem.id)}
              className={cn("p-1.5 rounded-md transition-all duration-200", state.bookmarked ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/80")}
              title="Bookmark"
            >
              <Bookmark className={cn("w-4 h-4", state.bookmarked && "fill-current")} />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <AnimatePresence>
        {showNotes && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-muted/20 px-3 py-2.5"
          >
            <textarea 
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="Add your personal notes, intuitions, or time complexities here..."
              className="w-full h-20 min-h-20 min-w-full p-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm resize shadow-sm"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button 
                onClick={() => { setTempNotes(state.notes); setShowNotes(false); }}
                className="px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveNotes}
                className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
              >
                Save Notes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
