"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { BookOpen, BookCopy, Flame, House, RotateCcw, Settings } from "lucide-react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { cn } from "@/lib/cn";
import { CreatorHeader } from "./CreatorLinks";

const navItems = [
  { name: "Home", href: "/", icon: House, mobileOnly: true },
  { name: "Kunal", href: "/kunal", icon: BookOpen },
  { name: "Pratyush", href: "/pratyush", icon: BookCopy },
  { name: "Important", href: "/bookmarks", icon: Flame },
  { name: "Revision", href: "/revision", icon: RotateCcw },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function SyncStatus() {
  const { status } = useSession();
  const isSyncing = useTrackerStore((s) => s.isSyncing);
  const lastSyncedAt = useTrackerStore((s) => s.lastSyncedAt);

  let label = "local";
  let dot = "bg-faint";
  if (status === "authenticated") {
    if (isSyncing) {
      label = "syncing";
      dot = "bg-warning animate-pulse";
    } else if (lastSyncedAt) {
      label = "synced";
      dot = "bg-success";
    } else {
      label = "not synced";
    }
  }

  return (
    <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground" title="Cloud sync status">
      <span className={cn("size-1.5 rounded-full", dot)} />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex h-12 max-w-4xl items-center gap-7 px-4 md:px-6">
          <Link href="/" className="font-mono text-[13px] tracking-tight">
            <span className="text-faint">dsa/</span>tracker
          </Link>

          <nav className="hidden h-full items-center gap-6 md:flex" aria-label="Main">
            {navItems
              .filter((item) => !item.mobileOnly)
              .map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-full items-center text-[13px] transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.name}
                    {active && <span className="absolute inset-x-0 -bottom-px h-px bg-accent" />}
                  </Link>
                );
              })}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <CreatorHeader />
            <SyncStatus />
            {status === "authenticated" && session.user ? (
              <Link href="/settings" aria-label="Settings" title={session.user.name ?? "Settings"}>
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="size-6 rounded-full border border-border-strong"
                  />
                ) : (
                  <span className="grid size-6 place-items-center rounded-full border border-border-strong font-mono text-[11px] text-muted-foreground">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                )}
              </Link>
            ) : (
              <>
                <Link
                  href="/settings"
                  aria-label="Settings"
                  className={cn(
                    "transition-colors hover:text-foreground",
                    pathname === "/settings" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Settings className="size-4" />
                </Link>
                <button
                  onClick={() => signIn("github")}
                  className="h-7 rounded-md bg-accent px-3 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile: bottom tab bar */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 text-[10px] transition-colors",
                active ? "text-foreground" : "text-faint"
              )}
            >
              <item.icon className="size-[18px]" strokeWidth={active ? 2 : 1.5} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
