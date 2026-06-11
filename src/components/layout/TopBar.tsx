'use client';

import { Search, Sun, Moon, PanelLeftOpen, PanelLeftClose, Zap } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/stores/ui';

export function TopBar() {
  const { toggleSidebar, sidebarOpen, openQuickSearch, theme, setTheme } = useUIStore();

  return (
    <header className="h-12 flex items-center gap-3 px-4 border-b shrink-0"
      style={{ background: 'var(--color-surface)', borderColor: 'oklch(0.25 0.04 290 / 0.3)' }}>
      <button onClick={toggleSidebar}
        className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors"
        title={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}>
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>

      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 mr-2 group">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-black text-sm tracking-tight hidden sm:block">
          <span className="gradient-text">TG960W</span>
        </span>
      </Link>

      <button onClick={openQuickSearch}
        className="flex items-center gap-2 flex-1 max-w-sm px-3 py-1.5 rounded-lg text-sm border transition-all hover:border-purple-500/50"
        style={{ background: 'var(--color-bg)', borderColor: 'oklch(0.25 0.04 290 / 0.3)', color: 'var(--color-text2)' }}>
        <Search size={14} />
        <span className="flex-1 text-left">搜索智能体…</span>
        <kbd className="px-1.5 py-0.5 text-[10px] rounded font-mono bg-zinc-800 border border-zinc-700 text-zinc-500">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors"
        title="切换主题">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
