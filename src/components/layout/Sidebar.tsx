'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Grid3X3, Workflow, Star, Clock, Settings, ChevronDown, ChevronRight, Sparkles, FolderTree, Globe, BookOpen } from 'lucide-react';
import { useUIStore } from '@/stores/ui';

interface CatItem { id: string; name: string; slug: string; icon: string; skillCount: number; }

const NAV = [
  { href: '/', label: '首页', icon: Globe },
  { href: '/skills', label: '全部智能体', icon: Grid3X3 },
  { href: '/blog', label: '使用指南', icon: BookOpen },
  { href: '/agents', label: '智能体编排', icon: Sparkles },
  { href: '/workflows', label: '工作流', icon: Workflow },
  { href: '/favorites', label: '我的收藏', icon: Star },
  { href: '/history', label: '使用记录', icon: Clock },
  { href: '/settings', label: '设置', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const [cats, setCats] = useState<CatItem[]>([]);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => { setCats(d.categories || []); setTotal(d.total || 0); })
      .catch(() => {});
  }, []);

  if (!sidebarOpen) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="h-full flex flex-col border-r border-white/5" style={{ background: '#0d0d12' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
          <Sparkles size={16} className="text-amber-950" />
        </div>
        <span className="font-black text-base tracking-tight">
          <span className="g-text">TG960W</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`sidebar-link ${isActive(href) ? 'active' : ''}`}>
            <Icon size={15} />
            <span>{label}</span>
          </Link>
        ))}

        {/* Categories */}
        <div className="pt-3 mt-3 border-t border-white/5">
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors">
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            <FolderTree size={12} />
            分类浏览 · {cats.length}
          </button>
          {expanded && (
            <div className="mt-1 space-y-0.5 ml-1">
              {cats.map((c) => (
                <Link key={c.slug} href={`/categories/${c.slug}`}
                  className={`sidebar-link text-xs !py-1.5 !px-2 ${isActive(`/categories/${c.slug}`) ? 'active' : ''}`}>
                  <span className="text-sm flex-shrink-0">{c.icon}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-[10px] text-zinc-600">{c.skillCount}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 text-xs text-zinc-500">
        <div className="flex items-center justify-between">
          <span>智能体总数</span>
          <span className="font-mono font-semibold text-zinc-300">{total.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}
