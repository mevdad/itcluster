import type { Period, StackModel, Tariff } from "@/lib/economics";
import type { IsoDate } from "@/lib/ru";

/**
 * EXAMPLE DATA for the «Экономика» page layout. Every price and tariff below is a placeholder taken from the
 * owner's worked example and is meant to be replaced with real, approved figures before the page is published.
 *
 * - Prices of the stack components were reconstructed from a screenshot whose right-hand column was cut off
 *   (only the leading digits were visible); they add up to the visible total of 9 871 800 ₽.
 * - The tariff structure follows the reference site NODE.CLOUD (gnode.cloud): per-GPU hourly rate, billing
 *   periods hour / day / week (−5 %) / month (−10 %), and an enterprise cluster with a minimum term and a
 *   custom configuration. Only the structure is taken; its prices and its VM specs (vCPU, RAM) are NOT used.
 *   Our prices are the example's (300 ₽/h per H200); the periods' discounts come from the reference's page code
 *   (its live prices come from an API that could not be reached), so they are placeholders as well.
 *
 * pricesAreExample = true prints a visible «примерные цены» note on the page. Set it to false only when all
 * numbers are real and approved for publication.
 */
export const pricesAreExample = true;

/** Date the figures are valid for (printed on the page). A literal on purpose, like factsAsOf. */
export const economicsAsOf: IsoDate = "2026-10-23";

export const gpuModel = "NVIDIA H200";

export const stackModel: StackModel = {
  gpus: 8,
  ratePerGpuHour: 300,
  billedHoursPerDay: 18,
  loadShare: 0.75,
  daysPerYear: 365,
  energyAndCooling: 380_000,
  depreciationShare: 0.1,
  maintenance: 210_000,
  components: [
    { name: "Видеокарта NVIDIA H200", qty: 8, unitPrice: 1_095_100 },
    { name: "Материнская плата с процессором Xeon", qty: 1, unitPrice: 535_250 },
    { name: "Система жидкостного охлаждения", qty: 1, unitPrice: 272_850 },
    { name: "Корпус + блок питания 3 кВт", qty: 1, unitPrice: 183_550 },
    { name: "Коммутация (свитчи, InfiniBand)", qty: 1, unitPrice: 119_350 },
  ],
};

export const periods: readonly Period[] = [
  { id: "hour", label: "Час", days: 1 / 24, discount: 0 },
  { id: "day", label: "Сутки", days: 1, discount: 0 },
  { id: "week", label: "Неделя", days: 7, discount: 0.05 },
  { id: "month", label: "Месяц", days: 30, discount: 0.1 },
];

/** Illustrative tariff ladder (see the note above). Prices are derived from stackModel.ratePerGpuHour. */
export const tariffs: readonly Tariff[] = [
  { id: "gpu-1", name: "GPU", gpus: 1, unit: "gpu", fit: "Запуск и отладка моделей, небольшие нагрузки" },
  { id: "gpu-4", name: "GPU × 4", gpus: 4, unit: "gpu", fit: "Дообучение и инференс моделей средней величины" },
  { id: "stack-8", name: "Стек целиком", gpus: 8, unit: "server", fit: "Крупные модели на одном узле, изолированный стек" },
  {
    id: "cluster-16",
    name: "Кластер",
    gpus: 16,
    unit: "cluster",
    fit: "Распределённое обучение на нескольких стеках",
    terms: [
      { label: "Мин. срок", value: "3 месяца" },
      { label: "Сеть", value: "InfiniBand" },
      { label: "Конфигурация", value: "индивидуальная" },
    ],
  },
];
