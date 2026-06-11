'use client';

import { Moon, Sun, RefreshCw, Keyboard, Info, Check } from 'lucide-react';
import { useUIStore } from '@/stores/ui';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore();

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">设置</h1>

      <div className="space-y-5">
        {/* Theme */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            主题设置
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'dark' as const, label: '暗色模式', desc: '护眼舒适', icon: Moon },
              { id: 'light' as const, label: '亮色模式', desc: '明亮清晰', icon: Sun },
            ].map((opt) => (
              <button key={opt.id} onClick={() => setTheme(opt.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${theme === opt.id ? 'border-[var(--color-accent)] bg-[var(--color-accent-bg)]' : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text2)]'}`}>
                <opt.icon className={`w-5 h-5 ${theme === opt.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text2)]'}`} />
                <div>
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs text-[var(--color-text2)]">{opt.desc}</div>
                </div>
                {theme === opt.id && <Check className="w-4 h-4 ml-auto text-[var(--color-accent)]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><RefreshCw className="w-5 h-5" />数据维护</h2>
          <p className="text-sm text-[var(--color-text2)] mb-3">安装新技能后运行重新索引，更新数据库。</p>
          <button onClick={() => toast.info('请运行: npm run index-skills')} className="btn btn-secondary">
            <RefreshCw className="w-3.5 h-3.5" /> 重新索引技能
          </button>
        </div>

        {/* Shortcuts */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><Keyboard className="w-5 h-5" />快捷键</h2>
          <div className="space-y-1.5">
            {[['⌘ / Ctrl + K', '打开全局搜索'], ['⌘ / Ctrl + B', '切换侧边栏'], ['Esc', '关闭弹窗 / 清除搜索'], ['Ctrl + D', '切换主题']].map(([k, d]) => (
              <div key={k} className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-[var(--color-bg)]">
                <span className="text-sm text-[var(--color-text2)]">{d}</span>
                <kbd className="px-2 py-0.5 text-[11px] rounded font-mono bg-[var(--color-bg)] border border-[var(--color-border)]">{k}</kbd>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="card p-5">
          <h2 className="font-semibold mb-2 flex items-center gap-2"><Info className="w-5 h-5" />关于</h2>
          <p className="text-sm text-[var(--color-text2)] leading-relaxed">
            SkillOS v0.1.0 — AI 技能桌面工作台<br />
            管理 1,100+ Claude Code 技能<br />
            Next.js 16 · Prisma 7 · SQLite · Tailwind v4
          </p>
        </div>
      </div>
    </div>
  );
}
