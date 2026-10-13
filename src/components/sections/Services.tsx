import type { Direction } from "@/lib/lead-schema";
import { ArrowRight } from "../icons";
import { DirectionLink } from "../DirectionLink";
import { Illustration, type ImageId } from "../Illustration";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";

interface Service {
  image: ImageId;
  title: string;
  text: string;
  cta: string;
  direction: Direction;
}

const SERVICES: readonly Service[] = [
  {
    image: "img-02",
    title: "Аренда GPU-серверов",
    text: "Вычислительные ресурсы для запуска и обучения моделей, обработки данных и других задач.",
    cta: "Обсудить аренду",
    direction: "rent",
  },
  {
    image: "img-03",
    title: "Поставка оборудования",
    text: "Подбор комплектации, закупка в Китае, организация доставки и приёмки.",
    cta: "Запросить поставку",
    direction: "supply",
  },
  {
    image: "img-04",
    title: "Настройка и сопровождение",
    text: "Подготовка среды, тестирование, подключение и обслуживание оборудования.",
    cta: "Обсудить сопровождение",
    direction: "setup",
  },
];

export function Services({ tone }: { tone: Tone }) {
  return (
    <Section id="services" tone={tone} labelledBy="services-title">
      <SectionHeading
        id="services-title"
        eyebrow="Услуги"
        title="От вычислительных мощностей до запуска оборудования"
        lead="Подключаемся на нужном этапе: предоставляем серверы, организуем поставку или берём на себя настройку и сопровождение."
      />
      <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.title} className="reveal card flex flex-col gap-5 p-3 pb-6">
            <Illustration id={s.image} />
            <div className="flex flex-1 flex-col gap-3 px-3">
              <h3 className="h-card">{s.title}</h3>
              <p className="flex-1 text-muted">{s.text}</p>
              <DirectionLink direction={s.direction} className="link-arrow">
                {s.cta}
                <ArrowRight className="size-5" />
              </DirectionLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
