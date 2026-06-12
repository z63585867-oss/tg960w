'use client';

import { Search, Sun, Moon, PanelLeftOpen, PanelLeftClose, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/stores/ui';

export function TopBar() {
  const { toggleSidebar, sidebarOpen, openQuickSearch, theme, setTheme } = useUIStore();

  return (
    <header className="h-12 flex items-center gap-3 px-4 border-b border-white/[0.04]"
      style={{ background: '#0b0b0f' }}>
      <button onClick={toggleSidebar}
        className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03] transition"
        title={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}>
        {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
      </button>

      <button onClick={openQuickSearch}
        className="flex items-center gap-2 flex-1 max-w-md px-3 py-1.5 rounded-lg text-sm border transition-all"
        style={{ background: '#0d0d12', borderColor: '#1f1f26', color: '#51515e' }}>
        <Search size={14} />
        <span className="flex-1 text-left">搜索智能体…</span>
        <kbd className="px-1.5 py-0.5 text-[10px] rounded font-mono bg-[#16161c] border border-[#1f1f26] text-zinc-700">⌘K</kbd>
      </button>

      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <Link href="/" className="hidden sm:flex items-center gap-1.5 px-2 py-1">
          <span className="font-black text-sm tracking-tight gradient-text">TG960W</span>
        </Link>
      </div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03] transition">
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </header>
  );
}
