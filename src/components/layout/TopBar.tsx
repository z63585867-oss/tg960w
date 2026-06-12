'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui';

const NAV = [
  { href: '/', label: '首页' },
  { href: '/skills', label: '智能体' },
  { href: '/blog', label: '指南' },
  { href: '/agents', label: '编排' },
  { href: '/workflows', label: '工作流' },
];

export function TopBar() {
  const pathname = usePathname();
  const openQuickSearch = useUIStore((s) => s.openQuickSearch);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="nav-bar">
      {/* Brand */}
      <Link href="/" className="nav-brand" style={{ color: "var(--text)" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, borderRadius: 7,
          background: "linear-gradient(135deg, var(--red), #8b1a1a)",
          fontSize: 14, fontWeight: 900, color: "#fff"
        }}>墨</span>
        <span>TG<span style={{ color: "var(--gold)" }}>960W</span></span>
      </Link>

      {/* Nav links */}
      <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {NAV.map(item => (
          <Link key={item.href} href={item.href}
            className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
            style={{ padding: "4px 14px" }}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Search + Favorites */}
      <button onClick={openQuickSearch} className="nav-search" style={{ cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
        <Search size={14} />
        <span>搜索智能体…</span>
      </button>

      <Link href="/favorites" className="nav-link">收藏</Link>
    </header>
  );
}
