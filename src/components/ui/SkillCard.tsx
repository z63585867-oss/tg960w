import Link from "next/link";
import type { Skill } from "@/types";

const ICONS: Record<string,string> = { security:"🔐", engineering:"💻","ai-ml":"🤖", marketing:"📈","c-suite":"👔", business:"🏢", lark:"🦜", product:"🏗️", design:"🎨", data:"📊", writing:"✍️", devops:"⚙️","qa-testing":"🛡️","finance-legal":"💰", other:"📦" };
const GRADS = ["#221a16","#16221a","#1a1622","#22161a","#162122","#201a16","#1e1a20","#201e1a"];

interface SkillCardProps { skill: Skill & { tags?: string[] }; }

export function SkillCard({ skill }: SkillCardProps) {
  const g = GRADS[skill.name.length % GRADS.length];
  return (
    <Link href={`/skills/${skill.slug}`} className="card" style={{ padding: 0 }}>
      <div className="skill-card-img" style={{ background: `linear-gradient(150deg, ${g}, var(--paper))`, fontSize: 36 }}>
        {ICONS[skill.category] || "📦"}
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{skill.name}</div>
        <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {skill.description}
        </div>
      </div>
    </Link>
  );
}
