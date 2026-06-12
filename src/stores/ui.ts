import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  quickSearchOpen: boolean;
  viewMode: 'grid' | 'list';
  isIndexing: boolean;
  indexedCount: number;
  totalCount: number;
  lastIndexedAt: string | null;

  setTheme: (theme: 'dark' | 'light') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openQuickSearch: () => void;
  closeQuickSearch: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setIndexStatus: (status: { isIndexing: boolean; indexedCount: number; totalCount: number; lastIndexedAt?: string }) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      quickSearchOpen: false,
      viewMode: 'grid',
      isIndexing: false,
      indexedCount: 0,
      totalCount: 0,
      lastIndexedAt: null,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
      openQuickSearch: () => set({ quickSearchOpen: true }),
      closeQuickSearch: () => set({ quickSearchOpen: false }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setIndexStatus: (status) => set({
        isIndexing: status.isIndexing,
        indexedCount: status.indexedCount,
        totalCount: status.totalCount,
        lastIndexedAt: status.lastIndexedAt || new Date().toISOString(),
      }),
    }),
    {
      name: 'skillos-ui',
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen, viewMode: state.viewMode }),
    }
  )
);
