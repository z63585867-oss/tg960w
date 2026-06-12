'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Star, Copy, Check } from 'lucide-react';
import type { Skill } from '@/types';
import { toast } from 'sonner';

export default function SkillDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/${slug}`).then(r => r.json()).then(d => { setSkill(d); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  const copyCommand = () => {
    if (!skill) return;
    navigator.clipboard.writeText(`/skills add ${skill.slug}`);
    setCopied(true); toast.success('已复制安装命令'); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="page" style={{ paddingTop: 32 }}><div style={{height:400,background:"var(--paper)",borderRadius:"var(--radius)"}} /></div>;
  if (!skill) return <div className="page" style={{ paddingTop: 32, textAlign: "center", padding: 80 }}><div className="body">智能体未找到</div></div>;

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 800 }}>
      <Link href="/skills" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text3)", textDecoration: "none", fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> 返回列表
      </Link>

      <div className="card" style={{ padding: 0 }}>
        <div className="skill-card-img" style={{ height: 200, fontSize: 64, background: "linear-gradient(160deg, #241a18, var(--paper))" }}>
          {["🔐","💻","🤖","📈"][skill.name.length % 4]}
        </div>
        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div>
              <span className="tag tag-gray" style={{ marginBottom: 8, display: "inline-flex" }}>{skill.category}</span>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: "8px 0 8px", letterSpacing: "-0.02em" }}>{skill.name}</h1>
              <p className="body">{skill.description}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={copyCommand} className={`btn ${copied ? "btn-gold" : "btn-red"} btn-sm`}>
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "已复制" : "复制安装"}
              </button>
            </div>
          </div>

          {skill.fullContent && (
            <div style={{ marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 24 }}>
              <div className="md-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {skill.fullContent}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
