'use client';

import { useCallback, useEffect } from 'react';
import { TopBar } from './TopBar';
import { QuickSearch } from './QuickSearch';
import { useUIStore } from '@/stores/ui';
import { useFavoritesStore } from '@/stores/favorites';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { quickSearchOpen, closeQuickSearch } = useUIStore();
  const fetchFavorites = useFavoritesStore((s) => s.fetchFavorites);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); useUIStore.getState().openQuickSearch(); }
    if (e.key === 'Escape' && quickSearchOpen) { closeQuickSearch(); }
  }, [quickSearchOpen, closeQuickSearch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
      <TopBar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {quickSearchOpen && <QuickSearch />}
    </div>
  );
}
