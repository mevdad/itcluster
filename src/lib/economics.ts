// Pure arithmetic for the «Экономика» page. Every total shown on the page is derived from the inputs in
// src/content/economics.ts, so a changed price can never leave a stale sum next to it.

export interface StackComponent {
  name: string;
  qty: number;
  /** Rubles, per piece. */
  unitPrice: number;
}

export interface StackModel {
  components: readonly StackComponent[];
  gpus: number;
  /** Rubles per GPU-hour (the «GPU» tariff). */
  ratePerGpuHour: number;
  /** Hours per day the rental is billed … */
  billedHoursPerDay: number;
  /** … times the share of that time the GPU is actually rented. */
  loadShare: number;
  daysPerYear: number;
  /** Rubles per year. */
  energyAndCooling: number;
  /** Share of the stack price written off per year. */
  depreciationShare: number;
  /** Rubles per year. */
  maintenance: number;
}

export interface StackResults {
  capex: number;
  effectiveHoursPerDay: number;
  revenuePerGpu: number;
  revenue: number;
  depreciation: number;
  expenses: number;
  profit: number;
  /** profit / capex as a fraction (1.038 → 103,8 %). */
  roi: number;
}

export function stackResults(m: StackModel): StackResults {
  const capex = m.components.reduce((sum, c) => sum + c.qty * c.unitPrice, 0);
  const effectiveHoursPerDay = m.billedHoursPerDay * m.loadShare;
  // Rounded to whole rubles at each step the page prints, so the printed lines always add up.
  const revenuePerGpu = Math.round(m.ratePerGpuHour * effectiveHoursPerDay * m.daysPerYear);
  const revenue = revenuePerGpu * m.gpus;
  const depreciation = Math.round(capex * m.depreciationShare);
  const expenses = m.energyAndCooling + depreciation + m.maintenance;
  const profit = revenue - expenses;
  return { capex, effectiveHoursPerDay, revenuePerGpu, revenue, depreciation, expenses, profit, roi: profit / capex };
}

export type RentalUnit = "gpu" | "server" | "cluster";

export interface TariffTerm {
  label: string;
  value: string;
}

export interface Tariff {
  id: string;
  name: string;
  gpus: number;
  unit: RentalUnit;
  /** One neutral line about the use case. */
  fit: string;
  /** Extra conditions shown on the card (minimum term, network, configuration). */
  terms?: readonly TariffTerm[];
}

export type PeriodId = "hour" | "day" | "week" | "month";

/** A billing period: pay for the whole period up front, longer periods are cheaper per hour. */
export interface Period {
  id: PeriodId;
  label: string;
  days: number;
  /** Share taken off the full price (0.05 = −5 %). */
  discount: number;
}

/** Price of one billing period, whole rubles. The hour has no discount and is the base rate. */
export function periodPrice(ratePerGpuHour: number, gpus: number, period: Period): number {
  if (period.id === "hour") return ratePerGpuHour * gpus;
  return Math.round(ratePerGpuHour * gpus * 24 * period.days * (1 - period.discount));
}

const NBSP = " ";

export function formatNumber(value: number): string {
  const rounded = Math.round(value);
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return rounded < 0 ? `−${digits}` : digits;
}

export function formatRub(value: number): string {
  return `${formatNumber(value)}${NBSP}₽`;
}

/** 1.0382 → «103,8 %». */
export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(1).replace(".", ",")}${NBSP}%`;
}

export function formatHours(hours: number): string {
  return Number.isInteger(hours) ? String(hours) : String(hours).replace(".", ",");
}
