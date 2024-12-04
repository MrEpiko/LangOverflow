import { create } from "zustand";
export const useTagSearchStore = create((set) => ({
    title: [],
    addTag: (newTag) => set((state) => ({
        title: [...state.title, newTag]
    })),
    removeTag: (tagToRemove) => set((state) => ({
        title: state.title.filter(tag => tag !== tagToRemove)
    }))
}));