import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { Section, SectionHeading } from "@/components/Section";
import { navItems, type Project } from "@/content/site";

export const metadata: Metadata = { title: "Черновик: проекты", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Templates for the three case cards (IMG-09..11). The brief forbids publishing invented cases, so these
// placeholders live on a draft route that is closed in production unless SHOW_DRAFTS=1.
const TEMPLATES: readonly Project[] = [
  {
    industry: "[Отрасль или согласованное название клиента]",
    direction: "rent",
    task: "[Какую задачу решал клиент]",
    works: "[Что сделали: ресурсы, развёртывание модели, интеграции]",
    result: "[Подтверждённый результат — только с разрешения клиента]",
  },
  {
    industry: "[Отрасль или согласованное название клиента]",
    direction: "supply",
    task: "[Какое оборудование требовалось]",
    works: "[Подбор, закупка, доставка, приёмка]",
    result: "[Подтверждённый результат]",
  },
  {
    industry: "[Отрасль или согласованное название клиента]",
    direction: "setup",
    task: "[Что нужно было запустить или отладить]",
    works: "[Подготовка среды, тестирование, подключение]",
    result: "[Подтверждённый результат]",
  },
];

export default function DraftProjectsPage() {
  if (process.env.NODE_ENV === "production" && process.env.SHOW_DRAFTS !== "1") notFound();
  return (
    <>
      <Header items={navItems} />
      <main className="pt-(--header-h)">
        <Section tone="base" labelledBy="draft-title">
          <SectionHeading id="draft-title" eyebrow="Черновик · не публикуется" title="Как мы решаем задачи бизнеса" lead="Шаблоны карточек. Заполняются подтверждёнными данными в src/content/site.ts → projects." />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TEMPLATES.map((p) => (
              <ProjectCard key={p.direction} project={p} draft />
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
