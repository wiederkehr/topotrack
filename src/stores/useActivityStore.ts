import { create } from "zustand";

import type { ActivityType } from "@/types";

interface ActivityState {
  activity: ActivityType | undefined;
  addActivities: (activities: ActivityType[]) => void;
  allActivities: ActivityType[];
  handleActivityChange: (id: number) => void;
  handleLoadMore: () => void;
  handleSearchChange: (value: string) => void;
  pageNumber: number;
  resetActivities: () => void;
  searchTerm: string;
  setActivity: (activity: ActivityType | undefined) => void;
  setAllActivities: (activities: ActivityType[]) => void;
  setPageNumber: (pageNumber: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  setVisibleActivities: (activities: ActivityType[]) => void;
  visibleActivities: ActivityType[];
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  // Initial state
  activity: undefined,
  allActivities: [],
  visibleActivities: [],
  pageNumber: 1,
  searchTerm: "",

  // Actions
  setActivity: (activity) => set({ activity }),

  setAllActivities: (activities) => set({ allActivities: activities }),

  setVisibleActivities: (activities) => set({ visibleActivities: activities }),

  addActivities: (activities) =>
    set((state) => {
      // Prevent duplicate activities
      const existingIds = new Set(state.allActivities.map((a) => a.id));
      const newActivities = activities.filter((a) => !existingIds.has(a.id));

      if (newActivities.length === 0) return state; // No new activities, return same state

      return {
        allActivities: [...state.allActivities, ...newActivities],
        visibleActivities: [...state.visibleActivities, ...newActivities],
      };
    }),

  setPageNumber: (pageNumber) => set({ pageNumber }),

  setSearchTerm: (searchTerm) => set({ searchTerm }),

  handleActivityChange: (id) => {
    const { allActivities } = get();
    const activity = allActivities.find((activity) => activity.id === id);
    set({ activity: activity || undefined });
  },

  handleSearchChange: (value) => {
    const { allActivities } = get();
    set({ searchTerm: value });

    if (value.length >= 3) {
      const matchingActivities = allActivities.filter((activity) =>
        activity.name.toLowerCase().includes(value.toLowerCase()),
      );
      set({ visibleActivities: matchingActivities });
    } else {
      set({ visibleActivities: allActivities });
    }
  },

  handleLoadMore: () => {
    set((state) => ({ pageNumber: state.pageNumber + 1 }));
  },

  resetActivities: () =>
    set({
      activity: undefined,
      allActivities: [],
      visibleActivities: [],
      pageNumber: 1,
      searchTerm: "",
    }),
}));
