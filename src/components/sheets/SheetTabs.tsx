"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { sheetCatalog } from "@/lib/sheets/catalog";
import type { SheetId } from "@/lib/sheets/types";

type SheetTabsProps = {
  activeSheetId: SheetId;
  hrefBase: string;
};

export function SheetTabs({ activeSheetId, hrefBase }: SheetTabsProps) {
  return (
    <nav className="flex gap-6 border-b border-border" aria-label="Sheet">
      {sheetCatalog.map((sheet) => {
        const active = sheet.id === activeSheetId;
        return (
          <Link
            key={sheet.id}
            href={`${hrefBase}?sheet=${sheet.slug}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px border-b py-2 text-[13px] transition-colors",
              active
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {sheet.shortTitle}
          </Link>
        );
      })}
    </nav>
  );
}
