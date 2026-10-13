import type { Project } from "@/content/site";
import { ProjectCard } from "../ProjectCard";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";

/** Public section: renders only confirmed projects. With none, the page does not show it at all. */
export function Projects({ tone, projects }: { tone: Tone; projects: readonly Project[] }) {
  if (projects.length === 0) return null;
  return (
    <Section id="projects" tone={tone} labelledBy="projects-title">
      <SectionHeading id="projects-title" eyebrow="Проекты" title="Как мы решаем задачи бизнеса" />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {projects.slice(0, 3).map((p) => (
          <ProjectCard key={`${p.industry}-${p.task}`} project={p} />
        ))}
      </div>
    </Section>
  );
}
