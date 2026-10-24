"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, RotateCcw, Settings, Menu, X, Code2, CloudOff, CheckCircle2, Loader2, BookOpen, BookCopy } from "lucide-react";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Kunal DSA", href: "/kunal", icon: BookOpen },
  { name: "Pratyush DSA", href: "/pratyush", icon: BookCopy },
  { name: "Important", href: "/bookmarks", icon: Flame },
  { name: "Revision", href: "/revision", icon: RotateCcw },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const { isSyncing, lastSyncedAt } = useTrackerStore();

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-card border border-border rounded-md shadow-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1017]/95 backdrop-blur-xl border-r border-border flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_24px_rgba(138,180,248,0.2)]">
            <Code2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="block font-semibold tracking-tight">Tracker</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">DSA workspace</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "text-primary font-medium bg-primary/10 shadow-[inset_3px_0_0_var(--primary)]"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto bg-black/10">
          {status === "authenticated" && session.user ? (
            <div className="bg-transparent rounded-lg p-2 flex items-center justify-between group hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border" onClick={() => window.location.href = '/settings'}>
              <div className="flex items-center space-x-3 overflow-hidden">
                {session.user.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border border-border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs border border-primary/20">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{session.user.name}</p>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {isSyncing ? (
                      <><Loader2 className="w-3 h-3 animate-spin text-primary" /> <span>Syncing...</span></>
                    ) : lastSyncedAt ? (
                      <><CheckCircle2 className="w-3 h-3 text-sky-400" /> <span>Synced</span></>
                    ) : (
                      <><CloudOff className="w-3 h-3 text-muted-foreground" /> <span>Not synced</span></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => signIn("github")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg p-2.5 flex items-center justify-center space-x-2 font-medium text-sm shadow-[0_0_20px_rgba(138,180,248,0.12)]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>Sign in</span>
            </button>
          )}
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
