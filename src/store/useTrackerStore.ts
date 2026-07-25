import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { remapLegacyProblemStates } from '@/lib/sheets/migration';

export interface ProblemState {
  status: 'unsolved' | 'solved' | 'revising';
  notes: string;
  bookmarked: boolean;
  important: boolean;
  updatedAt?: number;
}

interface TrackerStore {
  problemStates: Record<string, ProblemState>;
  lastSyncedAt: number | null;
  isSyncing: boolean;
  markStatus: (id: string, status: ProblemState['status']) => void;
  updateNotes: (id: string, notes: string) => void;
  toggleBookmark: (id: string) => void;
  toggleImportant: (id: string) => void;
  resetProgress: () => void;
  setSyncStatus: (isSyncing: boolean) => void;
  setCloudState: (states: Record<string, ProblemState>, syncTime: number) => void;
}

export const useTrackerStore = create<TrackerStore>()(
  persist(
    (set) => ({
      problemStates: {},
      lastSyncedAt: null,
      isSyncing: false,
      markStatus: (id, status) => set((state) => ({
        problemStates: {
          ...state.problemStates,
          [id]: { ...state.problemStates[id], status, notes: state.problemStates[id]?.notes || '', bookmarked: !!state.problemStates[id]?.bookmarked, important: !!state.problemStates[id]?.important, updatedAt: Date.now() }
        }
      })),
      updateNotes: (id, notes) => set((state) => ({
        problemStates: {
          ...state.problemStates,
          [id]: { ...state.problemStates[id], notes, status: state.problemStates[id]?.status || 'unsolved', bookmarked: !!state.problemStates[id]?.bookmarked, important: !!state.problemStates[id]?.important, updatedAt: Date.now() }
        }
      })),
      toggleBookmark: (id) => set((state) => ({
        problemStates: {
          ...state.problemStates,
          [id]: { ...state.problemStates[id], bookmarked: !state.problemStates[id]?.bookmarked, status: state.problemStates[id]?.status || 'unsolved', notes: state.problemStates[id]?.notes || '', important: !!state.problemStates[id]?.important, updatedAt: Date.now() }
        }
      })),
      toggleImportant: (id) => set((state) => ({
        problemStates: {
          ...state.problemStates,
          [id]: { ...state.problemStates[id], important: !state.problemStates[id]?.important, status: state.problemStates[id]?.status || 'unsolved', notes: state.problemStates[id]?.notes || '', bookmarked: !!state.problemStates[id]?.bookmarked, updatedAt: Date.now() }
        }
      })),
      resetProgress: () => set({ problemStates: {}, lastSyncedAt: null }),
      setSyncStatus: (isSyncing) => set({ isSyncing }),
      setCloudState: (states, syncTime) => set({ problemStates: states, lastSyncedAt: syncTime, isSyncing: false })
    }),
    {
      name: 'dsa-tracker-storage', // key in local storage
      version: 1,
      migrate: (persistedState) => {
        const nextState = persistedState as Partial<TrackerStore> & {
          problemStates?: Record<string, ProblemState>;
        };

        return {
          ...nextState,
          problemStates: remapLegacyProblemStates(nextState.problemStates || {}),
        };
      },
    }
  )
);
