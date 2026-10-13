import type { ReactNode } from "react";
import { ArrowRight, Cpu } from "./icons";

// IMG-05. Built from live text (not a picture) so the labels stay selectable, translatable and readable at any
// width: three steps in a row on desktop, stacked on a phone — no horizontal scrolling either way.

function PeopleSystems() {
  return (
    <svg viewBox="0 0 64 64" className="size-16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="12" width="30" height="21" rx="3" />
      <path d="M23 33v6M15 40h16" />
      <circle cx="49" cy="20" r="5" />
      <path d="M41 40c0-5 3.6-8 8-8s8 3 8 8" />
      <ellipse cx="46" cy="50" rx="10" ry="3.5" />
      <path d="M36 50v6c0 2 4.5 3.5 10 3.5S56 58 56 56v-6" />
    </svg>
  );
}

function ModelCube() {
  return (
    <svg viewBox="0 0 64 64" className="size-16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m32 8 22 11-22 11L10 19 32 8Z" />
      <path d="m10 31 22 11 22-11M10 43l22 11 22-11" />
      <circle cx="32" cy="19" r="3" fill="currentColor" />
    </svg>
  );
}

function GpuServer() {
  return (
    <svg viewBox="0 0 64 64" className="size-16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="10" width="48" height="14" rx="3" />
      <rect x="8" y="28" width="48" height="14" rx="3" />
      <rect x="8" y="46" width="48" height="10" rx="3" />
      <path d="M15 17h.01M15 35h.01M15 51h.01M30 17h20M30 35h20" />
    </svg>
  );
}

const STEPS: readonly { icon: ReactNode; title: string; caption: string }[] = [
  { icon: <PeopleSystems />, title: "Сотрудники и системы компании", caption: "Интерфейс и интеграции" },
  { icon: <ModelCube />, title: "ИИ-модель", caption: "Развёртывание модели" },
  { icon: <GpuServer />, title: "GPU-сервер", caption: "Вычислительные ресурсы" },
];

export function AiSchema() {
  return (
    <figure className="card flex flex-col gap-2 bg-linear-to-b from-white to-accent-50/60 p-6 sm:p-8" aria-label="Схема: сотрудники и системы компании, ИИ-модель, GPU-сервер">
      <ol className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-start xl:gap-2">
        {STEPS.map((step, i) => (
          <li key={step.title} className="contents">
            <div className="flex flex-1 items-center gap-4 rounded-2xl border border-fog-200 bg-white p-4 xl:flex-col xl:gap-3 xl:text-center">
              <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">{step.icon}</span>
              <div>
                <p className="font-bold leading-snug">{step.title}</p>
                <p className="mt-1 text-sm text-muted">{step.caption}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className="flex shrink-0 items-center justify-center self-center text-accent-600 xl:h-20 xl:self-start">
                <ArrowRight className="size-6 rotate-90 xl:rotate-0" />
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 flex items-center gap-2 text-sm text-muted">
        <Cpu className="size-4 shrink-0 text-accent-600" />
        Схема показывает состав решения, а не конкретную конфигурацию.
      </figcaption>
    </figure>
  );
}
