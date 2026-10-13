import type { Project } from "@/content/site";
import { ArrowRight } from "./icons";
import { Illustration, type ImageId } from "./Illustration";

const IMAGE_BY_DIRECTION: Record<Project["direction"], ImageId> = {
  rent: "img-09",
  supply: "img-10",
  setup: "img-11",
};

export function ProjectCard({ project, draft = false }: { project: Project; draft?: boolean }) {
  const rows: readonly [string, string][] = [
    ["Задача", project.task],
    ["Выполненные работы", project.works],
    ["Подтверждённый результат", project.result],
  ];
  return (
    <article className="reveal card flex flex-col gap-5 p-3 pb-6">
      <Illustration id={IMAGE_BY_DIRECTION[project.direction]} />
      <div className="flex flex-1 flex-col gap-4 px-3">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">{project.client ?? project.industry}</p>
          {draft && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">Черновик</span>}
        </div>
        <dl className="flex flex-1 flex-col gap-3">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm font-semibold text-muted">{label}</dt>
              <dd className="mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>
        {project.href ? (
          <a href={project.href} className="link-arrow">
            Подробнее
            <ArrowRight className="size-5" />
          </a>
        ) : (
          draft && <span className="link-arrow opacity-50">Подробнее</span>
        )}
      </div>
    </article>
  );
}
