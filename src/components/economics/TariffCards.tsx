import { hoursPerMonth, gpuModel, stackModel, tariffs } from "@/content/economics";
import { formatHours, formatRub, tariffPrices, type RentalUnit } from "@/lib/economics";
import { ArrowRight, Check } from "../icons";
import { DirectionLink } from "../DirectionLink";

const UNIT_LABEL: Record<RentalUnit, string> = {
  gpu: "Единица аренды: отдельный GPU",
  server: "Единица аренды: сервер (стек) целиком",
  cluster: "Единица аренды: кластер",
};

export function TariffCards() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {tariffs.map((t) => {
        const price = tariffPrices(stackModel.ratePerGpuHour, t.gpus, hoursPerMonth);
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
              <span className="text-4xl font-bold tracking-tight">{formatRub(price.hour)}</span>
              <span className="ml-1 text-muted">/ час</span>
            </p>
            <dl className="flex flex-col gap-2 text-[15px]">
              <div className="flex justify-between gap-3 border-t border-fog-200 pt-3">
                <dt className="text-muted">В сутки</dt>
                <dd className="font-semibold">{formatRub(price.day)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-fog-200 pt-3">
                <dt className="text-muted">В месяц ({formatHours(hoursPerMonth / 24)} суток)</dt>
                <dd className="font-semibold">{formatRub(price.month)}</dd>
              </div>
            </dl>
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
  );
}
