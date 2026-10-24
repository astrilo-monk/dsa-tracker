"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemRow } from "@/components/ProblemRow";
import { RotateCcw, Loader2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SheetTabs } from "@/components/sheets/SheetTabs";
import { resolveSheetSlug, loadSheetDataset } from "@/lib/sheets/catalog";
import type { SheetDataset } from "@/lib/sheets/types";

function RevisionContent() {
  const searchParams = useSearchParams();
  const activeSheetId = resolveSheetSlug("/revision", searchParams);
  
  const { problemStates } = useTrackerStore();
  const [dataset, setDataset] = useState<SheetDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    
    loadSheetDataset(activeSheetId)
      .then((data) => {
        if (active) {
          setDataset(data);
          setIsLoading(false);
        }
      })
      .catch(console.error);

    return () => { active = false; };
  }, [activeSheetId]);

  if (isLoading || !dataset) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
         <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const allProblems = dataset.patterns.flatMap(p => p.groups.flatMap(g => g.questions));
  
  const revisionProblems = allProblems.filter(p => problemStates[p.id]?.status === 'revising');

  return (
    <div className="space-y-6">
      <SheetTabs activeSheetId={activeSheetId} hrefBase="/revision" />
      
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-amber-600 dark:text-amber-400 text-sm flex items-start space-x-3 mt-6">
        <RotateCcw className="w-5 h-5 flex-shrink-0" />
        <p>Spaced repetition is key to mastering DSA. Make sure to solve these problems entirely on your own without looking at the solution before marking them as solved.</p>
      </div>

      <div>
        {revisionProblems.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">Your revision queue for this sheet is empty. Great job!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {revisionProblems.map(p => <ProblemRow key={p.id} problem={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RevisionPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 mt-12 lg:mt-0 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Revision Queue</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">Problems you've marked for revision.</p>
      </div>

      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}>
        <RevisionContent />
      </Suspense>
    </div>
  );
}

