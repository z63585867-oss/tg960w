'use client';

import { Search, Sun, Moon, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useUIStore } from '@/stores/ui';

export function TopBar() {
  const { toggleSidebar, sidebarOpen, openQuickSearch, theme, setTheme } = useUIStore();

  return (
    <header className="h-12 flex items-center gap-3 px-4 border-b shrink-0"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <button onClick={toggleSidebar}
        className="p-1.5 rounded-md text-[var(--color-text2)] hover:bg-[var(--color-surface2)] hover:text-[var(--color-text)] transition-colors"
        title={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}>
        {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
      </button>

      <button onClick={openQuickSearch}
        className="flex items-center gap-2 flex-1 max-w-sm px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text2)' }}>
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="flex-1 text-left">搜索技能…</span>
        <kbd className="px-1.5 py-0.5 text-[10px] rounded font-mono"
          style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-1.5 rounded-md text-[var(--color-text2)] hover:bg-[var(--color-surface2)] hover:text-[var(--color-text)] transition-colors"
        title="切换主题">
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  );
}
