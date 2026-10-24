"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { sheetCatalog, loadSheetDataset } from "@/lib/sheets/catalog";
import { summarize } from "@/lib/sheets/stats";
import type { SheetDataset } from "@/lib/sheets/types";
import { ListSkeleton, PageHeader, ProgressBar, SectionLabel } from "@/components/ui";

export default function Dashboard() {
  const problemStates = useTrackerStore((s) => s.problemStates);
  const [datasets, setDatasets] = useState<SheetDataset[] | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all(sheetCatalog.map((s) => loadSheetDataset(s.id)))
      .then((d) => active && setDatasets(d))
      .catch(console.error);
    return () => {
      active = false;
    };
  }, []);

  const sheets = useMemo(
    () => datasets?.map((dataset) => ({ dataset, stats: summarize(dataset, problemStates) })) ?? null,
    [datasets, problemStates]
  );

  const totals = (sheets ?? []).reduce(
    (acc, { stats }) => ({
      total: acc.total + stats.total,
      solved: acc.solved + stats.solved,
      revising: acc.revising + stats.revising,
      important: acc.important + stats.important,
    }),
    { total: 0, solved: 0, revising: 0, important: 0 }
  );
  const percent = totals.total === 0 ? 0 : Math.round((totals.solved / totals.total) * 100);

  return (
    <div>
      <PageHeader title="Overview" />

      {!sheets ? (
        <div className="mt-8">
          <ListSkeleton rows={4} />
        </div>
      ) : (
        <>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            <Stat label="Solved" value={totals.solved} suffix={`/${totals.total}`} />
            <Stat label="Progress" value={`${percent}%`} />
            <Stat label="Revising" value={totals.revising} href="/revision" />
            <Stat label="Important" value={totals.important} href="/bookmarks" />
          </dl>

          <div className="mt-12">
            <SectionLabel>Sheets</SectionLabel>
            <div className="mt-3 border-t border-border">
              {sheets.map(({ dataset, stats }) => {
                const meta = sheetCatalog.find((s) => s.id === dataset.id);
                const next = stats.next;
                return (
                  <div key={dataset.id} className="border-b border-border py-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <Link
                        href={meta?.href ?? "#"}
                        className="text-[15px] font-medium underline-offset-4 hover:underline"
                      >
                        {meta?.title ?? dataset.title}
                      </Link>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {stats.solved}/{stats.total}
                      </span>
                    </div>
                    <ProgressBar value={stats.solved} total={stats.total} className="mt-3" />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <p className="flex gap-4 font-mono text-[11px] tabular-nums text-muted-foreground">
                        <span><span className="text-easy">E</span> {stats.byDifficulty.Easy.solved}/{stats.byDifficulty.Easy.total}</span>
                        <span><span className="text-medium">M</span> {stats.byDifficulty.Medium.solved}/{stats.byDifficulty.Medium.total}</span>
                        <span><span className="text-hard">H</span> {stats.byDifficulty.Hard.solved}/{stats.byDifficulty.Hard.total}</span>
                      </p>
                      {next ? (
                        <a
                          href={next.links[0]?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <span className="font-mono text-faint">next</span>
                          <span className="truncate">{next.title}</span>
                          <ArrowUpRight className="size-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground">all done</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
  href,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  href?: string;
}) {
  const body = (
    <>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono tabular-nums">
        <span className="text-2xl">{value}</span>
        {suffix && <span className="text-sm text-faint">{suffix}</span>}
      </dd>
    </>
  );
  const cls = "block bg-background p-4";
  return href ? (
    <Link href={href} className={`${cls} transition-colors hover:bg-surface`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
