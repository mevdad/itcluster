import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { Section, SectionHeading } from "@/components/Section";
import { navItems, projectTemplates } from "@/content/site";

export const metadata: Metadata = { title: "Черновик: проекты", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Same templates the demo build shows on the main page. Real cases are filled in src/content/site.ts → projects.

export default function DraftProjectsPage() {
  if (process.env.NODE_ENV === "production" && process.env.SHOW_DRAFTS !== "1") notFound();
  return (
    <>
      <Header items={navItems} />
      <main className="pt-(--header-h)">
        <Section tone="base" labelledBy="draft-title">
          <SectionHeading id="draft-title" eyebrow="Черновик · не публикуется" title="Как мы решаем задачи бизнеса" lead="Шаблоны карточек. Заполняются подтверждёнными данными в src/content/site.ts → projects." />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {projectTemplates.map((p) => (
              <ProjectCard key={p.direction} project={p} draft />
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
