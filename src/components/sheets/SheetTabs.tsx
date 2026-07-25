"use client";

import Link from "next/link";
import { cn } from "@/components/Sidebar";
import { sheetCatalog } from "@/lib/sheets/catalog";
import type { SheetId } from "@/lib/sheets/types";
import { motion } from "framer-motion";

type SheetTabsProps = {
  activeSheetId: SheetId;
  hrefBase: string;
};

export function SheetTabs({ activeSheetId, hrefBase }: SheetTabsProps) {
  return (
    <div className="inline-flex items-center p-1 bg-muted/50 rounded-lg border border-border">
      {sheetCatalog.map((sheet) => {
        const isActive = sheet.id === activeSheetId;

        return (
          <Link
            key={sheet.id}
            href={`${hrefBase}?sheet=${sheet.slug}`}
            className={cn(
              "relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-background rounded-md shadow-sm border border-border/50"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span aria-hidden="true" className="text-[13px]">{sheet.emoji}</span>
              <span>{sheet.shortTitle}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

