import { demo } from "@/lib/config";

/**
 * Everything on this page that is a *fact about the company* lives in this file and is off by default.
 * Source materials gave preliminary numbers only; per the brief nothing unconfirmed is published.
 * To publish a fact: confirm it with the company, fill the value here, and (if it is a flag) set it to true.
 * The full checklist is in docs/CONTENT-TODO.md.
 *
 * Demo build (NEXT_PUBLIC_DEMO=1) switches the hidden blocks on with clearly marked placeholders, so the whole page
 * can be reviewed. That never changes the real values below.
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

/** What the page renders: real requisites, or placeholders in the demo build. */
export const requisitesView: null | { lines: readonly string[] } = company.requisites ?? (demo ? DEMO_REQUISITES : null);

export const contacts = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || null,
};

/** Shown as plain text (not links) in the demo build while the real contacts are not set. */
export const demoContactPlaceholders: null | { email: string; phone: string } =
  demo && !contacts.email && !contacts.phone ? { email: "[email компании]", phone: "[+7 ··· ··· ··· ··]" } : null;

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const CONFIRMED = {
  /** Москва и Санкт-Петербург подтверждены → показываем схему и карточки площадок. */
  geography: false,
  /** Ищем инвестиционных партнёров → добавляем строку «Информацию о проектах расширения…». */
  investmentSearch: false,
} as const;

export const confirmed = {
  geography: CONFIRMED.geography || demo,
  investmentSearch: CONFIRMED.investmentSearch || demo,
};

export const sites: readonly { city: string; note: string }[] = [
  { city: "Москва", note: "Площадка размещения оборудования" },
  { city: "Санкт-Петербург", note: "Площадка размещения оборудования" },
];

export const clientIndustries = ["Финансовый сектор", "Логистика", "Ретейл", "Фармацевтика"] as const;

export interface NavItem {
  id: string;
  label: string;
}

export const navItems: readonly NavItem[] = [
  { id: "infrastructure", label: "Инфраструктура" },
  { id: "services", label: "Услуги" },
  { id: "projects", label: "Проекты" },
  { id: "supply", label: "Поставка оборудования" },
  { id: "about", label: "О компании" },
];

export interface Spec {
  label: string;
  /** Confirmed value. null → not published yet, the hint is shown instead. */
  value: string | null;
  hint: string;
}

export const specs: readonly Spec[] = [
  { label: "GPU и их количество", value: null, hint: "Модель и число ускорителей указываем в предложении" },
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

/** Only fill this with facts the client has approved for publication. Empty → the section is hidden. */
export const projects: readonly Project[] = [];

/** Layout/wording of the three project cards (IMG-09..11). Placeholders only — never real claims. */
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

/** Real projects when they exist; otherwise the templates in the demo build; otherwise nothing (section hidden). */
export const projectsView: { items: readonly Project[]; draft: boolean } = projects.length > 0 ? { items: projects, draft: false } : demo ? { items: projectTemplates, draft: true } : { items: [], draft: false };

export interface Specialist {
  name: string;
  role: string;
  /** Path under public/. null → draft placeholder without a photo (demo build only). */
  portrait: string | null;
}

/** Real people with real portraits only. */
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
