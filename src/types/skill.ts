export interface SkillFrontmatter {
  name: string;
  description: string;
  version?: string;
  author?: string;
  license?: string;
  tags?: string[];
  tier?: string;
  category?: string;
  domain?: string;
  subdomain?: string;
  dependencies?: string;
  agents?: string[];
  metadata?: {
    version?: string;
    author?: string;
    category?: string;
    updated?: string;
  };
}

export interface Skill {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullContent: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  tier: string | null;
  author: string | null;
  version: string | null;
  sourcePath: string;
  sourceType: 'direct' | 'nested' | 'symlink';
  parentGroup: string | null;
  isIndexed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillWithMeta extends Skill {
  isFavorite: boolean;
  lastUsedAt: string | null;
  usageCount: number;
  relatedSkills: Skill[];
}
