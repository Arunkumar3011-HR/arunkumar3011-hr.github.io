import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/content/site-data";
import { ProjectsGrid } from "@/components/projects-grid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Stories from my work: running HR and administration, leading talent acquisition teams, campus and volume hiring, payroll and audit readiness, and the employee lifecycle.",
};

export default function ProjectsPage() {
  return (
    <div className="container py-16 sm:py-20">
      <SectionHeading
        as="h1"
        title="Work"
        subtitle="Stories from my work in HR and talent acquisition. Each one covers the situation, what I did, how it ran and what came of it."
      />
      <ProjectsGrid projects={projects} />
    </div>
  );
}
