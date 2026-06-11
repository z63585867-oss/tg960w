import { create } from 'zustand';
import type { Skill, SkillWithMeta } from '@/types';

interface SkillFilters {
  category?: string;
  subcategory?: string;
  search?: string;
  sort?: 'name' | 'category' | 'recent' | 'usage';
}

interface SkillsState {
  skills: Skill[];
  selectedSkill: SkillWithMeta | null;
  isLoading: boolean;
  error: string | null;
  total: number;

  // Filters
  filters: SkillFilters;

  // Actions
  setFilters: (filters: Partial<SkillFilters>) => void;
  clearFilters: () => void;
  fetchSkills: () => Promise<void>;
  fetchSkill: (slug: string) => Promise<void>;
}

export const useSkillsStore = create<SkillsState>()((set, get) => ({
  skills: [],
  selectedSkill: null,
  isLoading: false,
  error: null,
  total: 0,

  filters: {
    sort: 'name',
  },

  setFilters: (newFilters) => {
    set((s) => ({ filters: { ...s.filters, ...newFilters } }));
  },

  clearFilters: () => {
    set({ filters: { sort: 'name' } });
  },

  fetchSkills: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.search) params.set('q', filters.search);
      if (filters.sort) params.set('sort', filters.sort);

      const res = await fetch(`/api/skills?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch skills');
      const data = await res.json();
      set({ skills: data.skills, total: data.total, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchSkill: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/skills/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch skill');
      const data = await res.json();
      set({ selectedSkill: data.skill, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
