import { Skill } from '@/types';

/**
 * Simple fuzzy search that scores skills against a query.
 * Matches against name, description, tags, and category.
 */
export function searchSkills(skills: Skill[], query: string): Skill[] {
  if (!query.trim()) return skills;

  const terms = query.toLowerCase().trim().split(/\s+/);

  const scored = skills.map((skill) => {
    let score = 0;
    const name = skill.name.toLowerCase();
    const desc = skill.description.toLowerCase();
    const tags = skill.tags.join(' ').toLowerCase();
    const cat = skill.category.toLowerCase();

    for (const term of terms) {
      // Name exact match
      if (name === term) score += 100;
      // Name starts with
      else if (name.startsWith(term)) score += 50;
      // Name contains
      else if (name.includes(term)) score += 30;

      // Description match
      if (desc.includes(term)) score += 10;

      // Tag match
      if (tags.includes(term)) score += 15;

      // Category match
      if (cat.includes(term)) score += 5;

      // Slug match
      if (skill.slug.includes(term)) score += 20;
    }

    return { skill, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.skill);
}
