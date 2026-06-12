'use client';

import { Moon, Sun, RefreshCw, Keyboard } from 'lucide-react';
import { useUIStore } from '@/stores/ui';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore();

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 600 }}>
      <div className="section-head">
        <div className="section-head-bar" />
        <h1 className="section-head-title">设置</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Theme */}
        <div className="card card-padded" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>外观</div>
              <div className="small">{theme === 'dark' ? '深色模式' : '浅色模式'}</div>
            </div>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn btn-line btn-sm">
            {theme === 'dark' ? '切换浅色' : '切换深色'}
          </button>
        </div>

        {/* Reindex */}
        <div className="card card-padded" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <RefreshCw size={18} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>重建索引</div>
              <div className="small">重新扫描智能体目录</div>
            </div>
          </div>
          <button onClick={() => {
            fetch('/api/skills', { method: 'POST' }).then(() => toast.success('索引刷新已触发'));
          }} className="btn btn-line btn-sm">执行</button>
        </div>

        {/* Shortcuts */}
        <div className="card card-padded">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <Keyboard size={18} />
            <div style={{ fontWeight: 600, fontSize: 15 }}>快捷键</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { key: "⌘K", desc: "全局搜索" },
              { key: "⌘B", desc: "切换侧边栏" },
              { key: "Esc", desc: "关闭弹窗" },
            ].map(s => (
              <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="small">{s.desc}</span>
                <kbd style={{ padding: "2px 8px", borderRadius: 4, background: "var(--paper)", border: "1px solid var(--line)", fontSize: 12, fontFamily: "monospace", color: "var(--text2)" }}>{s.key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
