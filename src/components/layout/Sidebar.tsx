'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui';
import { Grid3X3, BookOpen, Sparkles, Star, Home, Layers } from 'lucide-react';

interface CatItem { id: string; name: string; slug: string; icon: string; skillCount: number; }

const NAV = [
  { href: '/', label: '首页', icon: Home },
  { href: '/skills', label: '全部智能体', icon: Grid3X3 },
  { href: '/blog', label: '使用指南', icon: BookOpen },
  { href: '/agents', label: '智能体编排', icon: Sparkles },
  { href: '/workflows', label: '工作流', icon: Layers },
  { href: '/favorites', label: '收藏', icon: Star },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const [cats, setCats] = useState<CatItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json()).then(d => { setCats(d.categories || []); setTotal(d.total || 0); }).catch(() => {});
  }, []);

  if (!sidebarOpen) return null;

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <aside style={{ height: "100%", display: "flex", flexDirection: "column", background: "#050505", borderRight: "0.5px solid rgba(255,255,255,0.06)" }}>
      {/* Logo */}
      <Link href="/" style={{ padding: "22px 20px 18px", textDecoration: "none", display: "block", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.02em" }}>
          TG<span style={{ color: "#0071e3" }}>960W</span>
        </div>
        <div style={{ fontSize: 12, color: "#6e6e73", marginTop: 2 }}>AI 智能体</div>
      </Link>

      <nav style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
        {NAV.map(i => (
          <Link key={i.href} href={i.href} className={`a-nav ${active(i.href) ? 'active' : ''}`}>
            <i.icon size={17} /> {i.label}
          </Link>
        ))}

        <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "12px 12px" }} />
        <div style={{ padding: "8px 14px 6px", fontSize: 11, color: "#6e6e73", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          分类
        </div>
        {cats.slice(0, 10).map(c => (
          <Link key={c.slug} href={`/categories/${c.slug}`} className={`a-nav ${active(`/categories/${c.slug}`) ? 'active' : ''}`}
            style={{ fontSize: 13 }}>
            <span style={{ fontSize: 16 }}>{c.icon}</span>
            <span style={{ flex: 1 }}>{c.name}</span>
            <span style={{ fontSize: 11, color: "#6e6e73" }}>{c.skillCount}</span>
          </Link>
        ))}
      </nav>

      <div style={{ padding: "14px 20px", borderTop: "0.5px solid rgba(255,255,255,0.04)", fontSize: 12, color: "#6e6e73" }}>
        {total.toLocaleString()} 个智能体
      </div>
    </aside>
  );
}
