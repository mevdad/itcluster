import { gpuModel, stackModel } from "@/content/economics";
import { formatHours, formatNumber, formatPercent, formatRub, stackResults } from "@/lib/economics";

function Kpi({ label, value, hint, accent = false }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ${accent ? "bg-accent-600 text-white" : "border border-fog-200 bg-white"}`}>
      <p className={`text-sm font-semibold ${accent ? "text-white/85" : "text-muted"}`}>{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
      {hint && <p className={`mt-1 text-xs ${accent ? "text-white/80" : "text-muted"}`}>{hint}</p>}
    </div>
  );
}

export function StackEconomics() {
  const m = stackModel;
  const r = stackResults(m);
  const expenseRows: readonly [string, string][] = [
    ["Электроэнергия и охлаждение", formatRub(m.energyAndCooling)],
    [`Амортизация (${Math.round(m.depreciationShare * 100)}% от стоимости)`, formatRub(r.depreciation)],
    ["Обслуживание, замена расходников, диагностика", formatRub(m.maintenance)],
  ];
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
      <div className="reveal card p-5 sm:p-7 lg:col-span-7">
        <h3 className="h-card">Состав и стоимость стека</h3>
        <table className="mt-4 w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">Состав и стоимость стека из {m.gpus} GPU {gpuModel}</caption>
          <thead>
            <tr className="border-b border-fog-300 text-sm text-muted">
              <th scope="col" className="py-2 pr-3 font-semibold">Компонент</th>
              <th scope="col" className="hidden px-3 py-2 text-right font-semibold sm:table-cell">Кол-во</th>
              <th scope="col" className="hidden px-3 py-2 text-right font-semibold sm:table-cell">Цена</th>
              <th scope="col" className="py-2 pl-3 text-right font-semibold">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {m.components.map((c) => (
              <tr key={c.name} className="border-b border-fog-200 align-top">
                <th scope="row" className="py-3 pr-3 font-medium">
                  {c.name}
                  <span className="mt-0.5 block text-xs font-normal text-muted sm:hidden">
                    {c.qty} × {formatRub(c.unitPrice)}
                  </span>
                </th>
                <td className="hidden px-3 py-3 text-right sm:table-cell">{c.qty}</td>
                <td className="hidden px-3 py-3 text-right whitespace-nowrap sm:table-cell">{formatRub(c.unitPrice)}</td>
                <td className="py-3 pl-3 text-right font-semibold whitespace-nowrap">{formatRub(c.qty * c.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={1} className="pt-4 pr-3 text-base font-bold sm:hidden">
                Итого стоимость стека
              </th>
              <th scope="row" colSpan={3} className="hidden pt-4 pr-3 text-base font-bold sm:table-cell">
                Итого стоимость стека
              </th>
              <td className="pt-4 pl-3 text-right text-base font-bold whitespace-nowrap">{formatRub(r.capex)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="reveal grid grid-cols-1 content-start gap-4 sm:grid-cols-2 lg:col-span-5">
        <Kpi label="Выручка стека за год" value={formatRub(r.revenue)} hint={`${formatRub(r.revenuePerGpu)} с одной карты`} />
        <Kpi label="Расходы за год" value={formatRub(r.expenses)} />
        <Kpi label="Чистая годовая прибыль" value={formatRub(r.profit)} />
        <Kpi label="Доходность на капитал" value={formatPercent(r.roi)} hint="Модельный расчёт, не гарантия" accent />
      </div>

      <div className="reveal card p-5 sm:p-7 lg:col-span-6">
        <h3 className="h-card">Годовая выручка с одного стека</h3>
        <ol className="mt-4 flex flex-col gap-3 text-[15px]">
          <li>
            Ставка аренды одной {gpuModel} — <strong>{formatRub(m.ratePerGpuHour)}/час</strong>.
          </li>
          <li>
            Средняя загрузка — <strong>{Math.round(m.loadShare * 100)}%</strong> от {m.billedHoursPerDay} часов в сутки, то есть {formatHours(r.effectiveHoursPerDay)} ч в сутки на карту.
          </li>
          <li>
            С одной карты за год: {formatNumber(m.ratePerGpuHour)} × {m.billedHoursPerDay} × {m.daysPerYear} × {String(m.loadShare).replace(".", ",")} = <strong>{formatRub(r.revenuePerGpu)}</strong>.
          </li>
          <li>
            С {m.gpus} карт: {formatNumber(r.revenuePerGpu)} × {m.gpus} = <strong>{formatRub(r.revenue)}</strong>.
          </li>
        </ol>
      </div>

      <div className="reveal card p-5 sm:p-7 lg:col-span-6">
        <h3 className="h-card">Годовые расходы на один стек</h3>
        <dl className="mt-4 divide-y divide-fog-200 text-[15px]">
          {expenseRows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3">
              <dt>{label}</dt>
              <dd className="font-semibold whitespace-nowrap">{value}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-bold">Итого расходов</dt>
            <dd className="font-bold whitespace-nowrap">{formatRub(r.expenses)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[15px]">
          Чистая годовая прибыль: {formatNumber(r.revenue)} − {formatNumber(r.expenses)} = <strong>{formatRub(r.profit)}</strong>. Доходность: {formatNumber(r.profit)} / {formatNumber(r.capex)} ≈ <strong>{formatPercent(r.roi)}</strong> годовых.
        </p>
      </div>
    </div>
  );
}
