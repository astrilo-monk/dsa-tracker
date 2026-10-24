"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemRow } from "@/components/ProblemRow";
import { SheetTabs } from "@/components/sheets/SheetTabs";
import { EmptyState, ListSkeleton, PageHeader } from "@/components/ui";
import { useSheetData } from "@/hooks/useSheetData";
import { resolveSheetSlug } from "@/lib/sheets/catalog";
import { formatPatternTitle } from "@/lib/sheets/utils";

function ImportantContent() {
  const searchParams = useSearchParams();
  const activeSheetId = resolveSheetSlug("/bookmarks", searchParams);
  const problemStates = useTrackerStore((s) => s.problemStates);
  const { data, isLoading } = useSheetData(activeSheetId);

  const important =
    data?.patterns.flatMap((p) =>
      p.groups.flatMap((g) =>
        g.questions
          .filter((q) => problemStates[q.id]?.important)
          .map((q) => ({ q, context: formatPatternTitle(p.title) }))
      )
    ) ?? [];

  return (
    <div>
      <SheetTabs activeSheetId={activeSheetId} hrefBase="/bookmarks" />
      {isLoading || !data ? (
        <div className="mt-6">
          <ListSkeleton rows={4} />
        </div>
      ) : (
        <div className="mt-6">
          <p className="mb-4 font-mono text-[11px] tabular-nums text-faint">{important.length} flagged</p>
          {important.length === 0 ? (
            <EmptyState>No important problems in this sheet yet. Tap the flame on a problem.</EmptyState>
          ) : (
            <ul className="border-t border-border">
              {important.map(({ q, context }) => (
                <ProblemRow key={q.id} problem={q} context={context} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function ImportantPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Important" description="Keep the problems that deserve another look close at hand." />
      <Suspense fallback={<ListSkeleton rows={4} />}>
        <ImportantContent />
      </Suspense>
    </div>
  );
}
