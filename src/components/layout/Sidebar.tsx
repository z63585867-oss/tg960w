'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Grid3X3, Workflow, Star, Clock, Settings, ChevronDown, ChevronRight, Zap, FolderTree } from 'lucide-react';
import { useUIStore } from '@/stores/ui';

interface CatItem { id: string; name: string; slug: string; icon: string; skillCount: number; }

import { Sparkles } from 'lucide-react';

const NAV = [
  { href: '/', label: '仪表盘', icon: LayoutDashboard },
  { href: '/skills', label: '技能浏览', icon: Grid3X3 },
  { href: '/agents', label: '智能体', icon: Sparkles },
  { href: '/workflows', label: '工作流', icon: Workflow },
  { href: '/favorites', label: '我的收藏', icon: Star },
  { href: '/history', label: '使用历史', icon: Clock },
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

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="h-full flex flex-col border-r" style={{ background: 'oklch(0.15 0.02 270)', borderColor: 'var(--color-border)' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.62 0.22 280 / 0.2)' }}>
          <Zap className="w-4 h-4" style={{ color: 'oklch(0.72 0.22 280)' }} />
        </div>
        <span className="font-bold text-base tracking-tight">SkillOS</span>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`sidebar-link ${isActive(href) ? 'active' : ''}`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
            {href === '/favorites' && (
              <span className="ml-auto text-[10px] opacity-50">⌘</span>
            )}
          </Link>
        ))}

        {/* Categories */}
        <div className="pt-3 mt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-[10px] font-semibold text-[var(--color-text2)] uppercase tracking-widest hover:text-[var(--color-text)] transition-colors">
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <FolderTree className="w-3 h-3" />
            分类 · {cats.length}
          </button>
          {expanded && (
            <div className="mt-1 space-y-0.5 ml-1">
              {cats.map((c) => (
                <Link key={c.slug} href={`/categories/${c.slug}`}
                  className={`sidebar-link text-xs !py-1 !px-2 ${isActive(`/categories/${c.slug}`) ? 'active' : ''}`}>
                  <span className="text-sm flex-shrink-0">{c.icon}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-[10px] opacity-40">{c.skillCount}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t text-xs" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text2)' }}>
        <div className="flex items-center justify-between">
          <span>技能总数</span>
          <span className="font-mono font-medium text-[var(--color-text)]">{total.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}
