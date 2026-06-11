import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  isLoading: boolean;

  toggleFavorite: (skillId: string) => Promise<void>;
  isFavorite: (skillId: string) => boolean;
  fetchFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      isLoading: false,

      toggleFavorite: async (skillId: string) => {
        const { favoriteIds } = get();
        const isFav = favoriteIds.includes(skillId);

        if (isFav) {
          await fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skillId }),
          });
          set({ favoriteIds: favoriteIds.filter((id) => id !== skillId) });
        } else {
          await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skillId }),
          });
          set({ favoriteIds: [...favoriteIds, skillId] });
        }
      },

      isFavorite: (skillId: string) => {
        return get().favoriteIds.includes(skillId);
      },

      fetchFavorites: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/favorites');
          if (res.ok) {
            const data = await res.json();
            set({ favoriteIds: data.favorites.map((f: { skillId: string }) => f.skillId), isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'skillos-favorites',
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    }
  )
);
