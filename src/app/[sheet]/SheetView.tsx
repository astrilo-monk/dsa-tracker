"use client";

import { useState } from "react";
import { useSheetData } from "@/hooks/useSheetData";
import { TopicCard } from "@/components/TopicCard";
import { Search, Loader2 } from "lucide-react";
import type { SheetId, SheetPattern } from "@/lib/sheets/types";

export function SheetView({ sheetId }: { sheetId: SheetId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useSheetData(sheetId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Loading {sheetId} sheet...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="p-8 text-center bg-card border border-border rounded-xl">
          <p className="text-danger font-medium">Failed to load sheet data</p>
          <p className="text-sm text-muted-foreground mt-2">{error || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  // Filter patterns based on search query
  const filteredPatterns = data.patterns.map(pattern => {
    // Filter questions inside each group
    const newGroups = pattern.groups.map(group => {
      const newQuestions = group.questions.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...group, questions: newQuestions };
    }).filter(group => group.questions.length > 0);

    // Filter resources
    const newResources = pattern.resources.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { ...pattern, groups: newGroups, resources: newResources };
  }).filter(pattern => pattern.groups.length > 0 || pattern.resources.length > 0);

  return (
    <div className="space-y-6 mt-12 lg:mt-0 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">{data.title}</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">{data.description || "Master Data Structures and Algorithms topic by topic."}</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm shadow-sm transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredPatterns.map((pattern, index) => (
          <TopicCard key={pattern.id} pattern={pattern} index={index + 1} />
        ))}
        {filteredPatterns.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No problems found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
