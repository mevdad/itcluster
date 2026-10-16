import type { ComponentType, SVGProps } from "react";
import { clientIndustries, companyFacts, confirmed, factsAsOf, nouns, sites } from "@/content/site";
import { countRu, formatDateRu, listRu } from "@/lib/ru";
import { Building, Cpu, Pin, Server, Truck, Wrench } from "../icons";
import { Section } from "../Section";
import type { Tone } from "../Section";

interface FactItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
}

/**
 * Confirmed facts only, built from content/site.ts. A fact set to null there simply drops out, and the wording follows
 * the number (1 компания / 2 компании / 5 компаний), so changing the data never needs a change here.
 */
function confirmedFacts(): FactItem[] {
  const items: FactItem[] = [];
  if (confirmed.geography && sites.length > 0) {
    items.push({ icon: Pin, title: countRu(sites.length, nouns.site), text: listRu(sites.map((s) => s.city)) });
  }
  if (companyFacts.serverSystems !== null) {
    items.push({ icon: Server, title: countRu(companyFacts.serverSystems, nouns.serverSystem), text: "Инфраструктура для задач ИИ" });
  }
  if (companyFacts.gpuModel !== null) {
    items.push({ icon: Cpu, title: companyFacts.gpuModel, text: "GPU для обучения и запуска моделей" });
  }
  if (companyFacts.corporateClients !== null) {
    items.push({ icon: Building, title: countRu(companyFacts.corporateClients, nouns.company), text: "Опыт работы с корпоративными клиентами" });
  }
  return items;
}

/** Used only if every fact above is switched off: the four directions from the brief, no numbers. */
const DIRECTIONS: readonly FactItem[] = [
  { icon: Server, title: "Инфраструктура в России", text: "Вычислительные ресурсы для задач бизнеса" },
  { icon: Cpu, title: "GPU-серверы для задач ИИ", text: "Обучение и запуск моделей, обработка данных" },
  { icon: Truck, title: "Поставка оборудования", text: "GPU, серверы, сеть и энергетическое оборудование" },
  { icon: Wrench, title: "Инженерное сопровождение", text: "Настройка, запуск и эксплуатация" },
];

export function Facts({ tone }: { tone: Tone }) {
  const facts = confirmedFacts();
  const hasFacts = facts.length > 0;
  return (
    <Section tone={tone} labelledBy="facts-title">
      <h2 id="facts-title" className="sr-only">
        Коротко о компании
      </h2>
      <ul className="reveal grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {(hasFacts ? facts : DIRECTIONS).map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
              <Icon className="size-6" />
            </span>
            <div>
              <p className="font-bold leading-snug">{title}</p>
              <p className="mt-1 text-[15px] leading-snug text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="reveal mt-8 flex flex-col gap-3 border-t border-fog-200 pt-6 lg:flex-row lg:items-center lg:gap-6">
        <p className="text-sm font-semibold text-muted">Отрасли клиентов</p>
        <ul className="flex flex-wrap gap-2">
          {clientIndustries.map((industry) => (
            <li key={industry} className="rounded-full border border-fog-300 px-4 py-1.5 text-sm font-medium text-ink-soft">
              {industry}
            </li>
          ))}
        </ul>
        {hasFacts && (
          <p className="text-sm text-muted lg:ml-auto lg:shrink-0">
            Данные на <time dateTime={factsAsOf}>{formatDateRu(factsAsOf)}</time>
          </p>
        )}
      </div>
    </Section>
  );
}
