import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useTrackerStore } from "@/store/useTrackerStore";

export function useCloudSync() {
  const { status } = useSession();
  const hasHydrated = useTrackerStore((s) => s.hasHydrated);
  const problemStates = useTrackerStore((s) => s.problemStates);
  const setCloudState = useTrackerStore((s) => s.setCloudState);
  const setSyncStatus = useTrackerStore((s) => s.setSyncStatus);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedCloudRef = useRef(false);
  const isCloudUpdateRef = useRef(false);
  const prevProblemStatesRef = useRef<Record<string, unknown> | null>(null);

  const performSync = useCallback(async () => {
    if (status !== "authenticated") return;

    // Read current state directly from the store to avoid stale closures
    const currentStates = useTrackerStore.getState().problemStates;

    try {
      setSyncStatus(true);
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemStates: currentStates }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.mergedStates) {
          // Mark that the next state change is from cloud, not user action
          isCloudUpdateRef.current = true;
          setCloudState(data.mergedStates, data.syncTime);
          prevProblemStatesRef.current = data.mergedStates;
        }
      } else {
        console.error("Sync failed:", await res.text());
      }
    } catch (err) {
      console.error("Network error during sync", err);
    } finally {
      setSyncStatus(false);
    }
  }, [status, setSyncStatus, setCloudState]);

  // Sync on login — wait for both auth and Zustand hydration
  useEffect(() => {
    if (status === "authenticated" && hasHydrated && !hasFetchedCloudRef.current) {
      hasFetchedCloudRef.current = true;
      // Initialize the ref with the hydrated state so the debounced
      // effect doesn't treat hydration as a user change
      prevProblemStatesRef.current = useTrackerStore.getState().problemStates;
      performSync();
    }
  }, [status, hasHydrated, performSync]);

  // Debounced sync on user-initiated state changes
  useEffect(() => {
    if (status !== "authenticated" || !hasHydrated) return;

    // Skip if this change was from a cloud sync update
    if (isCloudUpdateRef.current) {
      isCloudUpdateRef.current = false;
      return;
    }

    // Only sync if actual content changed (not just hydration)
    if (prevProblemStatesRef.current !== null && prevProblemStatesRef.current !== problemStates) {
      prevProblemStatesRef.current = problemStates;

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        performSync();
      }, 3000); // Debounce sync by 3 seconds
    }

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [problemStates, status, hasHydrated, performSync]);

  // Reset fetch flag on logout so re-login triggers a fresh cloud fetch
  useEffect(() => {
    if (status === "unauthenticated") {
      hasFetchedCloudRef.current = false;
    }
  }, [status]);

  return { performSync };
}
