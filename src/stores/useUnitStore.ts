import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UnitSystem = "metric" | "imperial";

interface UnitState {
  setUnits: (units: UnitSystem) => void;
  units: UnitSystem;
}

export const useUnitStore = create<UnitState>()(
  persist(
    (set) => ({
      units: "metric",
      setUnits: (units) => set({ units }),
    }),
    {
      name: "unit-preferences",
    },
  ),
);
