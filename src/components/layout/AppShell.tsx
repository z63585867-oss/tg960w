'use client';

import { useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { QuickSearch } from './QuickSearch';
import { useUIStore } from '@/stores/ui';
import { useFavoritesStore } from '@/stores/favorites';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, quickSearchOpen, closeQuickSearch, sidebarOpen } = useUIStore();
  const fetchFavorites = useFavoritesStore((s) => s.fetchFavorites);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); useUIStore.getState().openQuickSearch(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); useUIStore.getState().toggleSidebar(); }
    if (e.key === 'Escape' && quickSearchOpen) { closeQuickSearch(); }
  }, [quickSearchOpen, closeQuickSearch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-0'} overflow-hidden shrink-0`}>
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
      {quickSearchOpen && <QuickSearch />}
    </div>
  );
}
