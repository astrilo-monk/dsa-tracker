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

function RevisionContent() {
  const searchParams = useSearchParams();
  const activeSheetId = resolveSheetSlug("/revision", searchParams);
  const problemStates = useTrackerStore((s) => s.problemStates);
  const { data, isLoading } = useSheetData(activeSheetId);

  const queue =
    data?.patterns.flatMap((p) =>
      p.groups.flatMap((g) =>
        g.questions
          .filter((q) => problemStates[q.id]?.status === "revising")
          .map((q) => ({ q, context: formatPatternTitle(p.title) }))
      )
    ) ?? [];

  return (
    <div>
      <SheetTabs activeSheetId={activeSheetId} hrefBase="/revision" />
      {isLoading || !data ? (
        <div className="mt-6">
          <ListSkeleton rows={4} />
        </div>
      ) : (
        <div className="mt-6">
          <p className="mb-4 font-mono text-[11px] tabular-nums text-faint">
            {queue.length} in queue · solve without peeking, then tick it off
          </p>
          {queue.length === 0 ? (
            <EmptyState>Revision queue is empty for this sheet.</EmptyState>
          ) : (
            <ul className="border-t border-border">
              {queue.map(({ q, context }) => (
                <ProblemRow key={q.id} problem={q} context={context} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function RevisionPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Revision" description="Problems you marked to come back to." />
      <Suspense fallback={<ListSkeleton rows={4} />}>
        <RevisionContent />
      </Suspense>
    </div>
  );
}
