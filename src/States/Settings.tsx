import create from "zustand";

export interface ISettingState {
    menuOpen: boolean;
    toggleMenu: () => void;
    setMenu: (status: boolean) => void;
}

export const useSettings = create<ISettingState>((set) => ({
    menuOpen: false,
    setMenu: (status: boolean) => set({ menuOpen: status }),
    toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
}));
