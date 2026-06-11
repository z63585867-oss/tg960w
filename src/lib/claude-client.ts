/**
 * Claude Code CLI integration utilities.
 * Provides clipboard-based invocation since direct CLI calls
 * require the Claude Code process to be running.
 */

import type { Skill } from '@/types';

export function buildSkillCommand(skill: Skill): string {
  if (skill.slug.includes(':')) {
    // Nested skill like cybersecurity-skills:analyzing-memory
    return `/${skill.slug.split(':')[1]}`;
  }
  return `/${skill.slug}`;
}

export function buildWorkflowCommands(stepSlugs: string[]): string[] {
  return stepSlugs.map((slug) => {
    if (slug.includes(':')) {
      return `/${slug.split(':')[1]}`;
    }
    return `/${slug}`;
  });
}

export async function invokeSkill(skill: Skill): Promise<{ success: boolean; command: string }> {
  const cmd = buildSkillCommand(skill);

  try {
    // In browser context, use clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(cmd);
      return { success: true, command: cmd };
    }
    return { success: false, command: cmd };
  } catch {
    return { success: false, command: cmd };
  }
}
