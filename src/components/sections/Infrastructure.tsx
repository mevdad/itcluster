import { confirmed, sites, specs } from "@/content/site";
import { ArrowRight, Check, Pin } from "../icons";
import { DirectionLink } from "../DirectionLink";
import { Illustration } from "../Illustration";
import { Section, SectionHeading } from "../Section";
import type { Tone } from "../Section";
import { SitesMap } from "../SitesMap";

export function Infrastructure({ tone }: { tone: Tone }) {
  const anySpecConfirmed = specs.some((s) => s.value !== null);
  return (
    <Section id="infrastructure" tone={tone} labelledBy="infra-title">
      <SectionHeading
        id="infra-title"
        eyebrow="Инфраструктура"
        title="Инфраструктура, на которой работает ваш проект"
        lead="Оборудование, площадки размещения и условия предоставления ресурсов."
      />
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="reveal grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7 lg:self-start">
          <figure className="card col-span-2 p-2.5">
            <Illustration id="img-06" badge="Визуализация" />
            <figcaption className="px-2 pt-2.5 pb-1 text-sm text-muted">Стойка с оборудованием целиком. Визуализация, не фотография площадки.</figcaption>
          </figure>
          <figure className="card p-2.5">
            <Illustration id="img-07" />
            <figcaption className="px-1 pt-2.5 pb-1 text-sm text-muted">Серверный узел изнутри. Визуализация.</figcaption>
          </figure>
          <figure className="card p-2.5">
            <Illustration id="img-08" />
            <figcaption className="px-1 pt-2.5 pb-1 text-sm text-muted">Сетевая коммутация. Визуализация.</figcaption>
          </figure>
        </div>

        <div className="reveal flex flex-col gap-6 lg:col-span-5">
          <div className="card p-6 sm:p-7">
            <h3 className="h-card">Характеристики</h3>
            {!anySpecConfirmed && <p className="mt-2 text-sm text-muted">Точную конфигурацию и актуальную доступность присылаем по запросу.</p>}
            <dl className="mt-4 divide-y divide-fog-200">
              {specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                  <dt className="font-semibold">{spec.label}</dt>
                  <dd className={spec.value ? "" : "text-[15px] text-muted"}>{spec.value ?? spec.hint}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-3xl bg-accent-50 p-6 sm:p-7">
            <h3 className="h-card">Единица аренды</h3>
            <p className="mt-2 text-[15px] text-ink-soft">
              Аренда может быть по отдельному GPU, физическому серверу или кластеру. В предложении мы указываем единицу аренды явно, а цену — за эту же единицу и период.
            </p>
          </div>
        </div>
      </div>

      <div className="reveal mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {confirmed.geography ? (
          <>
            <div className="lg:col-span-6">
              <SitesMap />
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6">
              {sites.map((site) => (
                <li key={site.city} className="card flex flex-col gap-2 p-6">
                  <Pin className="size-6 text-accent-600" />
                  <h3 className="h-card">{site.city}</h3>
                  <p className="text-[15px] text-muted">{site.note}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="card flex items-start gap-4 p-6 lg:col-span-12">
            <Pin className="mt-0.5 size-6 shrink-0 text-accent-600" />
            <div>
              <h3 className="h-card">Площадки размещения</h3>
              <p className="mt-1 text-[15px] text-muted">Инфраструктура находится в России. Конкретные площадки указываем в предложении под вашу задачу.</p>
            </div>
          </div>
        )}
      </div>

      <div className="reveal mt-8 flex flex-col items-start gap-3">
        <DirectionLink direction="rent" prefill="Прошу прислать конфигурацию и доступность. Задача и нагрузка: " className="btn btn-primary">
          Запросить конфигурацию и доступность
          <ArrowRight className="size-5" />
        </DirectionLink>
        <p className="flex items-center gap-2 text-sm text-muted">
          <Check className="size-4 text-accent-600" />
          Наличие мощностей зависит от текущей загрузки и уточняется при обращении.
        </p>
      </div>
    </Section>
  );
}
