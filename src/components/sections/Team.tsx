import { specialists } from "@/content/site";
import { Cpu, Truck, Wrench } from "../icons";
import { Illustration } from "../Illustration";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";

const COMPETENCES = [
  { icon: Cpu, label: "Инфраструктура" },
  { icon: Truck, label: "Поставки" },
  { icon: Wrench, label: "Сопровождение" },
] as const;

export function Team({ tone }: { tone: Tone }) {
  // No real team photo (IMG-17 would be one): per the brief the heading switches to the competences variant.
  return (
    <Section id="about" tone={tone} labelledBy="about-title">
      <SectionHeading id="about-title" eyebrow="О компании" title="Компетенции, которые объединяют ваш проект" />
      <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="reveal lg:col-span-5">
          <Illustration id="img-17" badge="Иллюстрация" className="rounded-3xl" />
        </div>
        <div className="reveal flex flex-col gap-5 lg:col-span-6 lg:col-start-7">
          <p className="text-lg">
            Мы работаем в России и решаем три связанные задачи: предоставляем вычислительные мощности для ИИ, поставляем оборудование из Китая и берём на себя настройку и сопровождение.
          </p>
          <p className="text-muted">
            Проект начинается с технической задачи. Затем согласуем конфигурацию и условия, готовим и запускаем оборудование и остаёмся на связи при эксплуатации. Подключаемся на нужном этапе: проходить все не обязательно.
          </p>
          <p className="text-muted">За связь с клиентом отвечает ответственный менеджер проекта: он остаётся единой точкой контакта на всех этапах.</p>
          <ul className="flex flex-wrap gap-2">
            {COMPETENCES.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-700">
                <Icon className="size-4" />
                {label}
              </li>
            ))}
          </ul>
          <a href="#requisites" className="link-arrow w-fit">
            Реквизиты компании
          </a>
        </div>
      </div>

      {specialists.length > 0 && (
        <ul className="reveal mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {specialists.map((p) => (
            <li key={p.name} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.portrait} alt={`${p.name}, ${p.role}`} width={600} height={720} loading="lazy" className="aspect-[5/6] w-full object-cover" />
              <div className="p-4">
                <p className="font-bold">{p.name}</p>
                <p className="text-sm text-muted">{p.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
