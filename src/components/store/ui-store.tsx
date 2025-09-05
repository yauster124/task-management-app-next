import { create } from "zustand";

type UIStore = {
  components: Record<string, boolean>; // modal or dropdown id → open/closed
  open: (id: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
  isOpen: (id: string) => boolean;
};

export const useUIStore = create<UIStore>((set, get) => ({
  components: {},

  open: (id) =>
    set((state) => ({
      components: { ...state.components, [id]: true },
    })),

  close: (id) =>
    set((state) => ({
      components: { ...state.components, [id]: false },
    })),

  toggle: (id) =>
    set((state) => ({
      components: { ...state.components, [id]: !state.components[id] },
    })),

  isOpen: (id) => !!get().components[id],
}));