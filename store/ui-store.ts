import { create } from "zustand";

interface UIState {
  inFlight: number;
  start: () => void;
  end: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  inFlight: 0,
  start: () => set((s) => ({ inFlight: s.inFlight + 1 })),
  end: () => set((s) => ({ inFlight: Math.max(0, s.inFlight - 1) })),
}));
