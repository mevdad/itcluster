import { demo, economicsEnabled } from "@/lib/config";
import { countRu, type IsoDate, type PluralForms } from "@/lib/ru";

/**
 * Every *fact about the company* shown on the page lives in this file.
 * Published only what the company confirmed (see docs/CONTENT-TODO.md for what is confirmed and what is still open).
 * To publish a new fact: confirm it with the company, fill the value here, and (if it is a flag) set it to true.
 *
 * NEXT_PUBLIC_DEMO=1 is an internal preview: it switches the still-hidden blocks on with [bracketed] placeholders.
 * It is off by default and never changes the real values below.
 */

export const company = {
  name: "H200 Cloud", // working name — replace when the final name is provided
  /** Short description for the footer and metadata. */
  description:
    "Предоставляем GPU-серверы в аренду, поставляем оборудование из Китая, выполняем настройку и сопровождаем эксплуатацию.",
  /** Legal details for «Реквизиты компании». null → the page says they are provided on request. */
  requisites: null as null | { lines: readonly string[] },
} as const;

const DEMO_REQUISITES = { lines: ["[Полное наименование организации]", "ИНН [—] · ОГРН [—]", "[Юридический адрес]"] } as const;

/** What the page renders: real requisites, or placeholders in the internal demo build. */
export const requisitesView: null | { lines: readonly string[] } = company.requisites ?? (demo ? DEMO_REQUISITES : null);

export const contacts = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || null,
};

/** Shown as plain text (not links) in the internal demo build while the real contacts are not set. */
export const demoContactPlaceholders: null | { email: string; phone: string } =
  demo && !contacts.email && !contacts.phone ? { email: "[email компании]", phone: "[+7 ··· ··· ··· ··]" } : null;

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const CONFIRMED = {
  /** Москва и Санкт-Петербург — подтверждено владельцем 16.10.2026: схема, карточки площадок, факт под первым экраном, FAQ. */
  geography: true,
} as const;

export const confirmed = {
  geography: CONFIRMED.geography || demo,
};

export interface Site {
  city: string;
  /** The city in a sentence: «в Москве». Used by the FAQ answer. */
  inCity: string;
  note: string;
}

/** Only what is confirmed: the cities. How many systems stand in each city is NOT confirmed — do not add it here. */
export const sites: readonly Site[] = [
  { city: "Москва", inCity: "в Москве", note: "Площадка размещения оборудования" },
  { city: "Санкт-Петербург", inCity: "в Санкт-Петербурге", note: "Площадка размещения оборудования" },
];

/* ---------------------------------------------------------------------------------------------------------------
 * Confirmed numbers (owner, 16.10.2026). They change over time, so the page prints the date they are valid for.
 * Change a number → the wording adapts (1 компания / 2 компании / 5 компаний). null → the item is not shown.
 * The number of sites is not stored separately: it is sites.length, so the count and the city list cannot disagree.
 * ------------------------------------------------------------------------------------------------------------- */

/**
 * The date the facts below are valid for. Update it whenever a number changes.
 * A literal on purpose: new Date() would silently move the date forward on every rebuild while the numbers stay old.
 */
export const factsAsOf: IsoDate = "2026-10-16";

export const companyFacts: {
  /** Server systems in operation. Distribution by city, GPUs per system and the rest of the configuration are NOT confirmed. */
  serverSystems: number | null;
  /** GPU model. The number of GPUs is NOT confirmed. */
  gpuModel: string | null;
  /** Corporate clients (companies) the company has worked with. Names and logos are NOT confirmed. */
  corporateClients: number | null;
} = {
  serverSystems: 10,
  gpuModel: "NVIDIA H200",
  corporateClients: 53,
};

export const nouns = {
  site: { one: "площадка размещения", few: "площадки размещения", many: "площадок размещения" },
  serverSystem: { one: "серверная система", few: "серверные системы", many: "серверных систем" },
  company: { one: "компания", few: "компании", many: "компаний" },
} as const satisfies Record<string, PluralForms>;

/**
 * Labels on pictures and the map: «Иллюстрация» / «Визуализация» / «Иллюстративное фото», the remarks under the
 * infrastructure gallery and «Схема, не карта». The owner turned them off on 2026-10-23.
 * Set to true to bring all of them back at once (the original brief asked for them wherever a picture is not a photo
 * of the company's own site, so that a stock photo or a drawing is not taken for the company's data centre).
 */
export const showImageLabels = false;

export const clientIndustries = ["Финансовый сектор", "Логистика", "Ретейл", "Фармацевтика"] as const;

export interface NavItem {
  id: string;
  label: string;
  /** Separate page instead of an anchor on the landing. */
  href?: string;
}

export const navItems: readonly NavItem[] = [
  { id: "infrastructure", label: "Инфраструктура" },
  { id: "services", label: "Услуги" },
  { id: "economics", label: "Экономика" },
  { id: "projects", label: "Проекты" },
  { id: "supply", label: "Поставка оборудования" },
  { id: "about", label: "О компании" },
];

export interface Spec {
  label: string;
  /** Confirmed value. null → not published yet, the hint is shown instead. */
  value: string | null;
  /** Shown under a confirmed value: what is still specified individually. */
  note?: string;
  /** Shown instead of the value while it is not confirmed. */
  hint: string;
}

export const specs: readonly Spec[] = [
  {
    label: "GPU",
    value: companyFacts.gpuModel,
    note: "Количество указываем в предложении",
    hint: "Модель и число ускорителей указываем в предложении",
  },
  {
    label: "Парк оборудования",
    value: companyFacts.serverSystems === null ? null : countRu(companyFacts.serverSystems, nouns.serverSystem),
    note: "Конфигурацию под задачу фиксируем в предложении",
    hint: "Состав оборудования указываем в предложении",
  },
  { label: "Процессоры", value: null, hint: "Указываем для выбранной конфигурации" },
  { label: "Оперативная память", value: null, hint: "Указываем для выбранной конфигурации" },
  { label: "Накопители", value: null, hint: "Тип и объём — в предложении" },
  { label: "Сеть", value: null, hint: "Подключение согласуем под задачу" },
  { label: "Формат аренды", value: null, hint: "GPU, сервер или кластер — фиксируем в предложении" },
  { label: "Способ доступа", value: null, hint: "Согласуем до запуска" },
  { label: "Варианты сопровождения", value: null, hint: "Состав и режим — по согласованным условиям" },
];

export interface Project {
  industry: string;
  task: string;
  works: string;
  result: string;
  direction: "rent" | "supply" | "setup";
  /** Name the client only if it approved that; otherwise leave undefined and only the industry shows. */
  client?: string;
  href?: string;
}

/** Only fill this with facts the client has approved for publication. Empty → the section and its menu item are hidden. */
export const projects: readonly Project[] = [];

/** Layout/wording of the three project cards (IMG-09..11). Placeholders only — never real claims, never public. */
export const projectTemplates: readonly Project[] = [
  {
    industry: "[Отрасль или согласованное название клиента]",
    direction: "rent",
    task: "[Какую задачу решал клиент]",
    works: "[Что сделали: ресурсы, развёртывание модели, интеграции]",
    result: "[Подтверждённый результат — только с разрешения клиента]",
  },
  {
    industry: "[Отрасль или согласованное название клиента]",
    direction: "supply",
    task: "[Какое оборудование требовалось]",
    works: "[Подбор, закупка, доставка, приёмка]",
    result: "[Подтверждённый результат]",
  },
  {
    industry: "[Отрасль или согласованное название клиента]",
    direction: "setup",
    task: "[Что нужно было запустить или отладить]",
    works: "[Подготовка среды, тестирование, подключение]",
    result: "[Подтверждённый результат]",
  },
];

/** Real projects when they exist; otherwise the templates in the internal demo build; otherwise nothing (section hidden). */
export const projectsView: { items: readonly Project[]; draft: boolean } = projects.length > 0 ? { items: projects, draft: false } : demo ? { items: projectTemplates, draft: true } : { items: [], draft: false };

export interface Specialist {
  name: string;
  role: string;
  /** Path under public/. null → draft placeholder without a photo (internal demo build only). */
  portrait: string | null;
}

/** Real people with real portraits only. Empty → the block is hidden. */
export const specialists: readonly Specialist[] = [];

export const specialistsView: { items: readonly Specialist[]; draft: boolean } =
  specialists.length > 0
    ? { items: specialists, draft: false }
    : demo
      ? {
          items: [
            { name: "[Имя Фамилия]", role: "[Должность · зона ответственности]", portrait: null },
            { name: "[Имя Фамилия]", role: "[Должность · зона ответственности]", portrait: null },
            { name: "[Имя Фамилия]", role: "[Должность · зона ответственности]", portrait: null },
          ],
          draft: true,
        }
      : { items: [], draft: false };

/** Menu for every page: hides «Проекты» until there are real projects and «Экономика» until its numbers are real. */
export function getNav(): readonly NavItem[] {
  return navItems.filter((item) => (item.id !== "projects" || projectsView.items.length > 0) && (item.id !== "economics" || economicsEnabled));
}
