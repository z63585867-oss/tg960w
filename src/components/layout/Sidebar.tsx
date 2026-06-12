'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui';

interface CatItem { id: string; name: string; slug: string; icon: string; skillCount: number; }

const NAV = [
  { href: '/', label: '首页' },
  { href: '/skills', label: '全部智能体' },
  { href: '/blog', label: '使用指南' },
  { href: '/agents', label: '智能体编排' },
  { href: '/workflows', label: '工作流' },
  { href: '/favorites', label: '收藏' },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const [cats, setCats] = useState<CatItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => { setCats(d.categories || []); setTotal(d.total || 0); })
      .catch(() => {});
  }, []);

  if (!sidebarOpen) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="h-full flex flex-col border-r border-[var(--line)]" style={{ background: '#060609' }}>
      {/* Masthead */}
      <Link href="/" className="block px-6 py-6 border-b border-[var(--line)]">
        <div className="overline" style={{ fontSize: '0.7rem' }}>TG960W</div>
        <div className="text-[11px] text-[var(--fg-faint)] mt-1">智能体宇宙</div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <div className="space-y-0.5">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} className={`sidebar-link ${isActive(href) ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--line)]">
          <div className="overline mb-3">分类</div>
          <div className="space-y-0.5">
            {cats.map(c => (
              <Link key={c.slug} href={`/categories/${c.slug}`}
                className={`sidebar-link text-xs ${isActive(`/categories/${c.slug}`) ? 'active' : ''}`}>
                <span className="mr-1">{c.icon}</span>
                {c.name}
                <span className="ml-auto text-[var(--fg-faint)]" style={{ fontSize: '0.65rem' }}>{c.skillCount}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[var(--line)] mono-stat">
        {total.toLocaleString()} agents
      </div>
    </aside>
  );
}
