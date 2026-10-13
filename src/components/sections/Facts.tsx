import { clientIndustries } from "@/content/site";
import { Cpu, Server, Truck, Wrench } from "../icons";
import { Section } from "../Section";
import type { Tone } from "../Section";

const FACTS = [
  { icon: Server, title: "Инфраструктура в России", text: "Вычислительные ресурсы для задач бизнеса" },
  { icon: Cpu, title: "GPU-серверы для задач ИИ", text: "Обучение и запуск моделей, обработка данных" },
  { icon: Truck, title: "Поставка оборудования", text: "GPU, серверы, сеть и энергетическое оборудование" },
  { icon: Wrench, title: "Инженерное сопровождение", text: "Настройка, запуск и эксплуатация" },
] as const;

export function Facts({ tone }: { tone: Tone }) {
  return (
    <Section tone={tone} labelledBy="facts-title">
      <h2 id="facts-title" className="sr-only">
        О компании в четырёх пунктах
      </h2>
      <ul className="reveal grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map(({ icon: Icon, title, text }) => (
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
      <div className="reveal mt-8 flex flex-col gap-3 border-t border-fog-200 pt-6 sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm font-semibold text-muted">Работаем с корпоративными клиентами</p>
        <ul className="flex flex-wrap gap-2">
          {clientIndustries.map((industry) => (
            <li key={industry} className="rounded-full border border-fog-300 px-4 py-1.5 text-sm font-medium text-ink-soft">
              {industry}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
