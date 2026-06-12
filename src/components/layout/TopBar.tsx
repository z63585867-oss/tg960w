'use client';

import { Search, Sun, Moon, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useUIStore } from '@/stores/ui';

export function TopBar() {
  const { toggleSidebar, sidebarOpen, openQuickSearch, theme, setTheme } = useUIStore();

  return (
    <header className="h-12 flex items-center gap-4 px-5 border-b border-[var(--line)]"
      style={{ background: '#060609' }}>
      <button onClick={toggleSidebar}
        className="p-1 text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors"
        title={sidebarOpen ? '收起' : '展开'}>
        {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
      </button>

      <button onClick={openQuickSearch}
        className="flex items-center gap-2 flex-1 max-w-sm px-3 py-1.5 text-sm border border-[var(--line)] text-[var(--fg-faint)] hover:border-[var(--fg-faint)] transition-colors">
        <Search size={14} />
        <span className="flex-1 text-left">搜索智能体…</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#0d0d12] text-[var(--fg-faint)]">⌘K</kbd>
      </button>

      <div className="flex-1" />
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-1 text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors">
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </header>
  );
}
