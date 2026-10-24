"use client";

import { useState, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Download, Upload, Loader2 } from "lucide-react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useCloudSync } from "@/hooks/useCloudSync";
import { PageHeader, SectionLabel, btn } from "@/components/ui";
import { cn } from "@/lib/cn";

export default function SettingsPage() {
  const { problemStates, resetProgress, lastSyncedAt, isSyncing } = useTrackerStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const { performSync } = useCloudSync();

  const formattedSyncTime = lastSyncedAt
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lastSyncedAt))
    : "never";

  const handleExport = () => {
    const dataStr = JSON.stringify(problemStates, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `dsa-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        // Write straight to persist storage and reload so zustand rehydrates cleanly.
        localStorage.setItem("dsa-tracker-storage", JSON.stringify({ state: { problemStates: importedData }, version: 0 }));
        window.location.reload();
      } catch {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetProgress();
    setShowConfirm(false);
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" />

      <div className="mt-10 space-y-12">
        <section>
          <SectionLabel>Account</SectionLabel>
          <div className="mt-3 border-t border-border">
            {status === "loading" ? (
              <Row title="Checking session" description="">
                <Loader2 className="size-4 animate-spin text-faint" />
              </Row>
            ) : status === "authenticated" && session.user ? (
              <>
                <Row
                  title={session.user.name ?? "Signed in"}
                  description={session.user.email ?? ""}
                  leading={
                    session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session.user.image} alt="" className="size-9 rounded-full border border-border-strong" />
                    ) : (
                      <span className="grid size-9 place-items-center rounded-full border border-border-strong font-mono text-sm text-muted-foreground">
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    )
                  }
                >
                  <button onClick={() => signOut()} className={cn(btn.base, btn.outline)}>
                    Sign out
                  </button>
                </Row>
                <Row title="Cloud sync" description={`Last synced: ${formattedSyncTime}`}>
                  <button onClick={performSync} disabled={isSyncing} className={cn(btn.base, btn.primary)}>
                    {isSyncing && <Loader2 className="size-3.5 animate-spin" />}
                    {isSyncing ? "Syncing" : "Sync now"}
                  </button>
                </Row>
              </>
            ) : (
              <Row
                title="Not signed in"
                description="Progress is stored in this browser. Sign in with GitHub to sync it across devices."
              >
                <button onClick={() => signIn("github")} className={cn(btn.base, btn.primary)}>
                  Sign in with GitHub
                </button>
              </Row>
            )}
          </div>
        </section>

        <section>
          <SectionLabel>Data</SectionLabel>
          <div className="mt-3 border-t border-border">
            <Row title="Export" description="Download your progress as a JSON file.">
              <button onClick={handleExport} className={cn(btn.base, btn.outline)}>
                <Download className="size-3.5" /> Export
              </button>
            </Row>
            <Row title="Import" description="Restore progress from a backup. Replaces what's here.">
              <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
              <button onClick={() => fileInputRef.current?.click()} className={cn(btn.base, btn.outline)}>
                <Upload className="size-3.5" /> Import
              </button>
            </Row>
            <Row title="Reset" description="Delete all progress, notes and bookmarks on this device.">
              {showConfirm ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowConfirm(false)} className={cn(btn.base, btn.outline)}>
                    Cancel
                  </button>
                  <button onClick={handleReset} className={cn(btn.base, "bg-danger text-background hover:opacity-90")}>
                    Confirm reset
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowConfirm(true)} className={cn(btn.base, btn.danger)}>
                  Reset all data
                </button>
              )}
            </Row>
          </div>
        </section>

        <section>
          <SectionLabel>About</SectionLabel>
          <div className="mt-3 space-y-3 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              A checklist for the DSA sheets from Kunal Kushwaha and Pratyush. Tick problems off, flag the
              ones to revisit, and keep notes as you go.
            </p>
            <p>
              Everything is saved locally by default. Signing in with GitHub syncs it across devices through Supabase.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({
  title,
  description,
  leading,
  children,
}: {
  title: string;
  description: string;
  leading?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
