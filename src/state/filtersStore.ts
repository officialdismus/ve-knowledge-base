import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RoleFilter = "All" | "Program" | "Finance" | "HR" | "Operations" | string;
export type ContentTypeFilter = "Guide" | "Quick Fix" | "Policy" | "Checklist" | "FAQ" | string;

export interface FiltersState {
  role: RoleFilter | null;
  contentTypes: ContentTypeFilter[];
  tags: string[];
  setRole: (role: RoleFilter | null) => void;
  toggleContentType: (type: ContentTypeFilter) => void;
  setTags: (tags: string[]) => void;
  reset: () => void;
}

const initialState = {
  role: null,
  contentTypes: [] as ContentTypeFilter[],
  tags: [] as string[],
};

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      ...initialState,
      setRole: (role) => set({ role }),
      toggleContentType: (type) =>
        set((state) => {
          const exists = state.contentTypes.includes(type);
          return {
            contentTypes: exists
              ? state.contentTypes.filter((item) => item !== type)
              : [...state.contentTypes, type],
          } as Partial<FiltersState>;
        }),
      setTags: (tags) => set({ tags }),
      reset: () => set(initialState),
    }),
    {
      name: "kb-filters",
      version: 1,
      partialize: (state) => ({
        role: state.role,
        contentTypes: state.contentTypes,
        tags: state.tags,
      }),
    },
  ),
);
