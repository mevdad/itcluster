import type { Project } from "@/content/site";
import { ProjectCard } from "../ProjectCard";
import { DemoNote } from "../DemoNote";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";

/** Public section: renders only confirmed projects (templates in the demo build). With none, nothing is shown. */
export function Projects({ tone, projects, draft = false }: { tone: Tone; projects: readonly Project[]; draft?: boolean }) {
  if (projects.length === 0) return null;
  return (
    <Section id="projects" tone={tone} labelledBy="projects-title">
      <SectionHeading id="projects-title" eyebrow="Проекты" title="Как мы решаем задачи бизнеса" />
      {draft && <DemoNote className="mt-4">шаблоны карточек, реальных кейсов пока нет</DemoNote>}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {projects.slice(0, 3).map((p) => (
          <ProjectCard key={`${p.direction}-${p.task}`} project={p} draft={draft} />
        ))}
      </div>
    </Section>
  );
}
