import Link from "next/link";
import type { Skill } from "@/types";

interface SkillCardProps { skill: Skill & { tags?: string[] }; }

export function SkillCard({ skill }: SkillCardProps) {
  const tags = Array.isArray(skill.tags) ? skill.tags : [];

  return (
    <Link href={`/skills/${skill.slug}`}
      className="card p-5 bg-[var(--bg)] hover:bg-[#0d0d12] transition block group">
      <div className="overline mb-3">{skill.category || "未分类"}</div>
      <h3 className="text-[15px] font-bold text-[var(--fg)] group-hover:text-[var(--gold)] transition-colors leading-snug mb-2">
        {skill.name}
      </h3>
      <p className="body-text text-sm line-clamp-2">{skill.description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.slice(0, 3).map((t: string) => (
            <span key={t} className="text-[10px] text-[var(--fg-faint)] border border-[var(--line)] px-2 py-0.5">{t}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
