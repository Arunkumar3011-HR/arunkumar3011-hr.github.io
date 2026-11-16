import type { Project } from "@/content/site-data";

export const categories = [
  { id: "talent", label: "Talent acquisition" },
  { id: "operations", label: "HR operations" },
  { id: "people", label: "Employee experience" },
  { id: "research", label: "Research & data" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export function categoryOf(p: Project): CategoryId {
  return p.category;
}

export function categoryLabel(id: CategoryId): string {
  return categories.find((c) => c.id === id)?.label ?? "";
}
