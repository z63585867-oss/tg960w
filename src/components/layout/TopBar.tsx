'use client';

import { Search, Sun, Moon, PanelLeftOpen, PanelLeftClose, Zap } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/stores/ui';

export function TopBar() {
  const { toggleSidebar, sidebarOpen, openQuickSearch, theme, setTheme } = useUIStore();

  return (
    <header className="h-12 flex items-center gap-3 px-4 border-b shrink-0"
      style={{ background: '#0d0d12', borderColor: 'rgba(255,255,255,0.05)' }}>
      <button onClick={toggleSidebar}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
        title={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}>
        {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
      </button>

      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 mr-4 flex-shrink-0">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
          <Zap size={12} className="text-amber-950" />
        </div>
        <span className="font-black text-sm tracking-tight hidden sm:block">
          <span className="g-text">TG960W</span>
        </span>
      </Link>

      <button onClick={openQuickSearch}
        className="flex items-center gap-2 flex-1 max-w-md px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 hover:border-amber-500/30"
        style={{ background: '#111118', borderColor: '#252532', color: '#8b8a92' }}>
        <Search size={14} />
        <span className="flex-1 text-left">搜索智能体…</span>
        <kbd className="px-1.5 py-0.5 text-[10px] rounded font-mono bg-[#1c1c27] border border-[#252532] text-zinc-600">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
        title="切换主题">
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </header>
  );
}
