import type { ReactElement } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { Tone } from "@/components/Section";
import { AiSection } from "@/components/sections/AiSection";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Facts } from "@/components/sections/Facts";
import { Hero } from "@/components/sections/Hero";
import { Infrastructure } from "@/components/sections/Infrastructure";
import { Partners } from "@/components/sections/Partners";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Supply } from "@/components/sections/Supply";
import { Team } from "@/components/sections/Team";
import { navItems, projects } from "@/content/site";

// The footer shows the current year. A statically rendered page would freeze the build year, so the page is
// regenerated once a day (ISR) instead of being forced fully dynamic.
export const revalidate = 86400;

export default function HomePage() {
  const hasProjects = projects.length > 0;
  const nav = navItems.filter((item) => item.id !== "projects" || hasProjects);

  // Light sections alternate white / light-grey in the order they are actually rendered, so hiding the
  // projects section never leaves two neighbours with the same background.
  const sections: (((tone: Tone) => ReactElement) | null)[] = [
    (t) => <Facts key="facts" tone={t} />,
    (t) => <Services key="services" tone={t} />,
    (t) => <AiSection key="ai" tone={t} />,
    (t) => <Infrastructure key="infra" tone={t} />,
    hasProjects ? (t) => <Projects key="projects" tone={t} projects={projects} /> : null,
    (t) => <Supply key="supply" tone={t} />,
    (t) => <Process key="process" tone={t} />,
    (t) => <Team key="team" tone={t} />,
    (t) => <Faq key="faq" tone={t} />,
    (t) => <Contact key="contact" tone={t} />,
    (t) => <Partners key="partners" tone={t} />,
  ];
  let light = 0;
  const rendered: ReactElement[] = [];
  for (const render of sections) {
    if (!render) continue;
    rendered.push(render(light % 2 === 0 ? "base" : "alt"));
    light += 1;
  }

  return (
    <>
      <Header items={nav} overHero />
      <main id="main">
        <Hero />
        {rendered}
      </main>
      <Footer />
    </>
  );
}
