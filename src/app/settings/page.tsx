"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import { Trash2, Download, Upload, CloudSync, LogIn, LogOut, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useCloudSync } from "@/hooks/useCloudSync";

export default function SettingsPage() {
  const { problemStates, resetProgress, lastSyncedAt, isSyncing } = useTrackerStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const { performSync } = useCloudSync();

  const formattedSyncTime = lastSyncedAt 
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lastSyncedAt))
    : 'Never synced';

  const handleExport = () => {
    const dataStr = JSON.stringify(problemStates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dsa-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        // Using zustand persist direct write as a simple hack, or we can use a store method.
        // It's safer to reload page to let persist rehydrate
        localStorage.setItem('dsa-tracker-storage', JSON.stringify({ state: { problemStates: importedData }, version: 0 }));
        window.location.reload();
      } catch (err) {
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
    <div className="space-y-8 mt-12 lg:mt-0 pb-20 max-w-2xl">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage your data, sync, and preferences.</p>
      </div>

      <div className="space-y-6">
        <section className="glass rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><CloudSync className="w-5 h-5 text-primary" /> Cloud Sync</h2>
          
          {status === "loading" ? (
            <div className="flex items-center space-x-2 text-muted-foreground py-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading auth state...</span>
            </div>
          ) : status === "authenticated" && session.user ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-border/50">
                <div className="flex items-center space-x-4">
                  {session.user.image ? (
                    <img src={session.user.image} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-primary/20" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      {session.user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-lg">{session.user.name}</p>
                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-t border-border/50">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    Sync Status
                    {isSyncing ? (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Syncing</span>
                    ) : (
                      <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Synced</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Last synced: {formattedSyncTime}</p>
                </div>
                <button 
                  onClick={performSync}
                  disabled={isSyncing}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-premium text-white rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all text-sm font-medium disabled:opacity-70"
                >
                  <CloudSync className={`w-4 h-4 ${isSyncing ? 'animate-pulse' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-muted-foreground text-sm mb-6">
                Sign in with GitHub to automatically sync your progress across all your devices securely via Supabase.
              </p>
              <button 
                onClick={() => signIn("github")}
                className="flex items-center justify-center space-x-2 px-6 py-3 w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 rounded-xl transition-all shadow-md font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in with GitHub</span>
              </button>
            </div>
          )}
        </section>
        <section className="glass rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Local Data Management</h2>
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-border">
              <div>
                <p className="font-medium">Export Progress</p>
                <p className="text-sm text-muted-foreground">Download your progress as a JSON file.</p>
              </div>
              <button 
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-border">
              <div>
                <p className="font-medium">Import Progress</p>
                <p className="text-sm text-muted-foreground">Restore your progress from a backup.</p>
              </div>
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImport}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                <span>Import JSON</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium text-danger">Danger Zone</p>
                <p className="text-sm text-muted-foreground">Permanently delete all your progress.</p>
              </div>
              
              {showConfirm ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReset}
                    className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Confirm Reset
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-danger text-danger hover:bg-danger/10 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset All Data</span>
                </button>
              )}
            </div>

          </div>
        </section>

        <section className="glass rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              This tracker is built around the open-source Data Structures and Algorithms curriculum by Kunal Kushwaha.
            </p>
            <p>
              This tracker is built around the open-source Data Structures and Algorithms curriculum by Kunal Kushwaha.
            </p>
            <p>
              Your data is saved locally by default. You can sign in with GitHub to enable secure cloud sync across multiple devices, powered by Supabase.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
