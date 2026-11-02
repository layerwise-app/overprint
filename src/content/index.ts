import type { ProjectWithSlug, Project } from './types';

// Every file in ./work is a case study. Its file name is its URL.
const modules = import.meta.glob<{ default: Project }>(
  ['./work/*.ts', '!./work/*.images.ts'],
  { eager: true }
);

export const projects: ProjectWithSlug[] = Object.entries(modules)
  .map(([file, module]) => ({
    ...module.default,
    slug: file.replace('./work/', '').replace('.ts', '')
  }))
  .sort((a, b) => a.order - b.order);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function nextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

/** Every discipline in use, in order of first appearance. */
export const disciplines = [...new Set(projects.flatMap((p) => p.disciplines))];

export function disciplineSlug(discipline: string) {
  return discipline.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
