import { ArrowRight, Cpu, Key, Layers, Wrench } from "../icons";
import { AiSchema } from "../AiSchema";
import { DirectionLink } from "../DirectionLink";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";

const ADVANTAGES = [
  { icon: Cpu, title: "Ресурсы под вашу нагрузку", text: "Подбор конфигурации под модель и ожидаемое использование." },
  { icon: Layers, title: "Настраиваемая среда", text: "Согласование программного окружения и интеграций." },
  { icon: Key, title: "Управление доступом", text: "Определение пользователей и способов подключения." },
  { icon: Wrench, title: "Инженерное сопровождение", text: "Помощь с запуском и эксплуатацией." },
] as const;

export function AiSection({ tone }: { tone: Tone }) {
  return (
    <Section id="ai" tone={tone} labelledBy="ai-title">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-8 lg:col-span-6">
          <SectionHeading
            id="ai-title"
            eyebrow="Собственный ИИ для компании"
            title="Разверните ИИ под задачи своей компании"
            lead="Предоставим вычислительные ресурсы и поможем подготовить среду для выбранной модели. Состав решения зависит от нагрузки, требований к данным и способа использования ИИ."
          />
          <ul className="reveal grid grid-cols-1 gap-5 sm:grid-cols-2">
            {ADVANTAGES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <Icon className="mt-0.5 size-6 shrink-0 text-accent-600" />
                <div>
                  <p className="font-bold leading-snug">{title}</p>
                  <p className="mt-1 text-[15px] leading-snug text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="reveal max-w-xl text-sm text-muted">Экономию мы считаем для конкретной нагрузки: готовых сравнений с платными ИИ-сервисами на сайте нет.</p>
          <div className="reveal">
            <DirectionLink
              direction="rent"
              prefill="Хотим развернуть ИИ-модель. Модель и ожидаемая нагрузка: "
              className="btn btn-dark"
            >
              Подобрать решение для ИИ
              <ArrowRight className="size-5" />
            </DirectionLink>
          </div>
        </div>
        <div className="reveal lg:col-span-6 lg:col-start-7">
          <AiSchema />
        </div>
      </div>
    </Section>
  );
}
