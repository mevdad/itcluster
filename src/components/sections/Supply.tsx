import { ArrowRight, Check } from "../icons";
import { DirectionLink } from "../DirectionLink";
import { Illustration, type ImageId } from "../Illustration";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";

interface Category {
  image: ImageId;
  title: string;
  text: string;
  points: readonly string[];
  secondary?: boolean;
}

const CATEGORIES: readonly Category[] = [
  {
    image: "img-13",
    title: "GPU и ускорители",
    text: "Ускорители для задач ИИ и вычислений.",
    points: ["Подбор моделей и количества под задачу", "Совместимость с серверной платформой", "Проверка при приёмке"],
  },
  {
    image: "img-14",
    title: "Серверы и сетевое оборудование",
    text: "Серверные платформы, коммутаторы и комплектующие.",
    points: ["Комплектация по вашей спецификации", "Сеть и коммутация под проект", "Монтаж и настройка при необходимости"],
  },
  {
    image: "img-15",
    title: "Солнечные панели и энергетическое оборудование",
    text: "Панели и комплекты энергетического оборудования.",
    points: [],
    secondary: true,
  },
];

const STAGES = ["Техническое задание", "Подбор", "Согласование", "Закупка и доставка", "Приёмка", "Запуск"] as const;

export function Supply({ tone }: { tone: Tone }) {
  return (
    <Section id="supply" tone={tone} labelledBy="supply-title">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col items-start gap-6 lg:col-span-6">
          <SectionHeading
            id="supply-title"
            eyebrow="Поставка оборудования из Китая"
            title="Поставляем оборудование под ваше техническое задание"
            lead="Помогаем подобрать комплектацию, согласовать поставку и проверить оборудование. При необходимости выполняем монтаж, настройку и ввод в эксплуатацию."
          />
          <DirectionLink direction="supply" prefill="Отправляю спецификацию на поставку. Что нужно: " className="btn btn-dark reveal">
            Отправить спецификацию
            <ArrowRight className="size-5" />
          </DirectionLink>
        </div>
        <div className="reveal lg:col-span-6 lg:col-start-7">
          <Illustration id="img-12" badge className="rounded-3xl" />
        </div>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {CATEGORIES.map((c) => (
          <li key={c.title} className={`reveal card flex flex-col gap-4 p-3 pb-6 ${c.secondary ? "bg-fog-50" : ""}`}>
            <Illustration id={c.image} />
            <div className="flex flex-1 flex-col gap-3 px-3">
              {c.secondary && <span className="w-fit rounded-full border border-fog-300 px-3 py-0.5 text-xs font-semibold text-muted">Дополнительное направление</span>}
              <h3 className="h-card">{c.title}</h3>
              <p className="text-muted">{c.text}</p>
              {c.points.length > 0 && (
                <ul className="mt-1 flex flex-col gap-2 text-[15px]">
                  {c.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <Check className="mt-1 size-4 shrink-0 text-accent-600" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="reveal mt-12">
        <h3 className="h-card">Этапы поставки</h3>
        <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {STAGES.map((stage, i) => (
            <li key={stage} className="relative flex items-center gap-3 rounded-2xl border border-fog-200 bg-white p-4 lg:flex-col lg:items-start lg:gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">{i + 1}</span>
              <span className="font-semibold leading-snug">{stage}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
