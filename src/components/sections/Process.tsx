import { Check } from "../icons";
import { Illustration } from "../Illustration";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";

const STEPS = [
  { title: "Разбираем задачу", text: "Уточняем цель, нагрузку и ограничения." },
  { title: "Подбираем решение", text: "Аренда, поставка или их сочетание." },
  { title: "Согласуем конфигурацию и условия", text: "Фиксируем состав, единицу расчёта и условия." },
  { title: "Готовим и запускаем", text: "Настраиваем среду, тестируем, подключаем." },
  { title: "Сопровождаем эксплуатацию", text: "Остаёмся на связи после запуска." },
] as const;

const WORKS = ["Мониторинг", "Диагностика", "Обновление среды", "Устранение неисправностей", "Изменение конфигурации", "Расширение ресурсов"] as const;

export function Process({ tone }: { tone: Tone }) {
  return (
    <Section id="process" tone={tone} labelledBy="process-title">
      <SectionHeading id="process-title" eyebrow="Этапы работы" title="Одна команда — от задачи до эксплуатации" />
      <ol className="reveal relative mt-10 grid grid-cols-1 gap-0 md:grid-cols-5 md:gap-6">
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0 md:flex-col md:gap-4 md:pb-0">
            {/* connector: vertical on a phone, horizontal from md */}
            {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute top-12 bottom-0 left-6 w-px -translate-x-1/2 bg-fog-300 md:top-6 md:right-[-1.5rem] md:bottom-auto md:left-12 md:h-px md:w-auto md:translate-x-0" />}
            <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-600 text-lg font-bold text-white">{i + 1}</span>
            <div>
              <h3 className="font-bold leading-snug">{step.title}</h3>
              <p className="mt-1 text-[15px] text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="reveal card mt-12 grid grid-cols-1 items-center gap-6 p-3 sm:p-4 lg:grid-cols-2 lg:gap-10">
        <Illustration id="img-16" badge="Иллюстрация" className="rounded-2xl" />
        <div className="flex flex-col gap-5 p-3 lg:py-6 lg:pr-8">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">После запуска остаёмся на связи</h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WORKS.map((work) => (
              <li key={work} className="flex gap-2.5">
                <Check className="mt-1.5 size-4 shrink-0 text-accent-600" />
                {work}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">Режим поддержки и время реакции фиксируем в согласованных условиях проекта.</p>
        </div>
      </div>
    </Section>
  );
}
