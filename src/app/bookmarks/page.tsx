"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemRow } from "@/components/ProblemRow";
import { Bookmark, Flame, Loader2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SheetTabs } from "@/components/sheets/SheetTabs";
import { resolveSheetSlug, loadSheetDataset } from "@/lib/sheets/catalog";
import type { SheetDataset, SheetQuestion } from "@/lib/sheets/types";

function BookmarksContent() {
  const searchParams = useSearchParams();
  const activeSheetId = resolveSheetSlug("/bookmarks", searchParams);
  
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
  
  const bookmarkedProblems = allProblems.filter(p => problemStates[p.id]?.bookmarked);
  const importantProblems = allProblems.filter(p => problemStates[p.id]?.important);
  
  return (
    <div className="space-y-6">
      <SheetTabs activeSheetId={activeSheetId} hrefBase="/bookmarks" />
      
      <div className="space-y-8 mt-6">
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Important Problems</h2>
          </div>
          {importantProblems.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">No important problems marked in this sheet yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {importantProblems.map(p => <ProblemRow key={p.id} problem={p} />)}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Bookmark className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Bookmarks</h2>
          </div>
          {bookmarkedProblems.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">No bookmarks added in this sheet yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarkedProblems.map(p => <ProblemRow key={p.id} problem={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function BookmarksPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 mt-12 lg:mt-0 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Saved & Important</h1>
        <p className="text-muted-foreground mt-1">Quick access to problems you want to revisit.</p>
      </div>
      
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}>
        <BookmarksContent />
      </Suspense>
    </div>
  );
}

