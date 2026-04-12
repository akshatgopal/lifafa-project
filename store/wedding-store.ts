import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Wedding } from "@/types/wedding";

interface WeddingState {
  wedding: Wedding | null;
  hasHydrated: boolean;
  setWedding: (wedding: Wedding) => void;
  clearWedding: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useWeddingStore = create<WeddingState>()(
  persist(
    (set) => ({
      wedding: null,
      hasHydrated: false,
      setWedding: (wedding) => set({ wedding }),
      clearWedding: () => set({ wedding: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "lifafa-wedding",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ wedding: state.wedding }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
