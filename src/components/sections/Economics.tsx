import { economicsAsOf, gpuModel, periods, pricesAreExample, stackModel, tariffs } from "@/content/economics";
import { formatDateRu } from "@/lib/ru";
import { formatRub, periodPrice, type RentalUnit } from "@/lib/economics";
import { ArrowRight, Check } from "../icons";
import { DirectionLink } from "../DirectionLink";
import { Section, SectionHeading, type Tone } from "../Section";

const UNIT_LABEL: Record<RentalUnit, string> = {
  gpu: "Единица аренды: отдельный GPU",
  server: "Единица аренды: сервер (стек) целиком",
  cluster: "Единица аренды: кластер",
};

function discountLabel(discount: number): string | null {
  return discount > 0 ? `−${Math.round(discount * 100)}%` : null;
}

export function Economics({ tone }: { tone: Tone }) {
  const [hour, ...longer] = periods;
  return (
    <Section id="economics" tone={tone} labelledBy="economics-title">
      <SectionHeading
        id="economics-title"
        eyebrow="Экономика"
        title="Тарифы на аренду H200: от одной карты до кластера"
        lead="Цена указана за ту же единицу аренды, что и в предложении: отдельный GPU, сервер (стек) целиком или кластер. Чем длиннее оплаченный период, тем ниже цена."
      />
      <p className="reveal mt-4 text-sm text-muted">Данные на {formatDateRu(economicsAsOf)}</p>
      {pricesAreExample && <p className="reveal mt-3 w-fit max-w-3xl rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">Цены и тарифы примерные (макет): перед запуском они заменяются реальными.</p>}

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {tariffs.map((t) => {
          const featured = t.unit === "server";
          return (
            <li key={t.id} className={`reveal card flex flex-col gap-5 p-6 ${featured ? "border-accent-500 ring-1 ring-accent-500" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="h-card">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {t.gpus} × {gpuModel}
                  </p>
                </div>
                {featured && <span className="rounded-full bg-accent-600 px-3 py-1 text-xs font-bold text-white">Стек</span>}
              </div>
              <p>
                <span className="text-4xl font-bold tracking-tight">{formatRub(periodPrice(stackModel.ratePerGpuHour, t.gpus, hour!))}</span>
                <span className="ml-1 text-muted">/ {hour!.label.toLowerCase()}</span>
              </p>
              <dl className="flex flex-col gap-2 text-[15px]">
                {longer.map((p) => (
                  <div key={p.id} className="flex items-baseline justify-between gap-3 border-t border-fog-200 pt-3">
                    <dt className="text-muted">
                      {p.label}
                      {discountLabel(p.discount) && <span className="ml-2 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-bold text-accent-700">{discountLabel(p.discount)}</span>}
                    </dt>
                    <dd className="font-semibold whitespace-nowrap">{formatRub(periodPrice(stackModel.ratePerGpuHour, t.gpus, p))}</dd>
                  </div>
                ))}
              </dl>
              {t.terms && (
                <dl className="flex flex-col gap-1.5 rounded-2xl bg-fog-100 p-4 text-sm">
                  {t.terms.map((term) => (
                    <div key={term.label} className="flex flex-wrap justify-between gap-x-3">
                      <dt className="text-muted">{term.label}</dt>
                      <dd className="font-semibold">{term.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p className="flex gap-2.5 text-[15px] text-ink-soft">
                <Check className="mt-1 size-4 shrink-0 text-accent-600" />
                {t.fit}
              </p>
              <p className="text-xs font-medium text-muted">{UNIT_LABEL[t.unit]}</p>
              <DirectionLink direction="rent" prefill={`Интересует тариф «${t.name}» (${t.gpus} × ${gpuModel}). Задача и срок: `} className={`btn mt-auto ${featured ? "btn-primary" : "btn-secondary"}`}>
                Обсудить тариф
                <ArrowRight className="size-5" />
              </DirectionLink>
            </li>
          );
        })}
      </ul>
      <p className="reveal mt-6 max-w-3xl text-sm text-muted">Оплата вносится за выбранный период, месяц — это 30 суток. Скидки за неделю и месяц, как и сами цены, в этом макете примерные.</p>
    </Section>
  );
}
