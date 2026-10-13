// One source of truth for the lead form: the client validates for speed, the route handler validates
// again because the client is never trusted.

export const DIRECTIONS = [
  { value: "rent", label: "Аренда" },
  { value: "supply", label: "Поставка" },
  { value: "setup", label: "Настройка и сопровождение" },
  { value: "complex", label: "Комплексный проект" },
  { value: "partners", label: "Партнёрство" },
] as const;

export type Direction = (typeof DIRECTIONS)[number]["value"];

export function isDirection(value: string): value is Direction {
  return DIRECTIONS.some((d) => d.value === value);
}

export function directionLabel(value: Direction): string {
  return DIRECTIONS.find((d) => d.value === value)?.label ?? value;
}

export interface LeadFields {
  name: string;
  company: string;
  contact: string;
  direction: Direction | "";
  message: string;
  consent: boolean;
}

export type FieldKey = keyof LeadFields | "file";
export type FieldErrors = Partial<Record<FieldKey, string>>;

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_FILE_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "txt", "csv", "zip", "png", "jpg", "jpeg"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

export function isValidContact(value: string): boolean {
  const v = value.trim();
  if (EMAIL_RE.test(v)) return true;
  const digits = v.replace(/\D/g, "");
  return PHONE_RE.test(v) && digits.length >= 10 && digits.length <= 15;
}

export interface FileMeta {
  name: string;
  size: number;
}

export function validateLead(input: LeadFields, file: FileMeta | null): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name.trim();
  if (name.length < 2) errors.name = "Укажите имя";
  else if (name.length > 100) errors.name = "Слишком длинное имя";
  if (input.company.trim().length > 150) errors.company = "Слишком длинное название";
  if (!input.contact.trim()) errors.contact = "Укажите телефон или email";
  else if (!isValidContact(input.contact)) errors.contact = "Проверьте телефон или email";
  if (!input.direction) errors.direction = "Выберите направление";
  const message = input.message.trim();
  if (message.length < 10) errors.message = "Опишите задачу хотя бы в нескольких словах";
  else if (message.length > 3000) errors.message = "Не более 3000 символов";
  if (!input.consent) errors.consent = "Нужно согласие на обработку данных";
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (file.size > MAX_FILE_BYTES) errors.file = "Файл больше 10 МБ";
    else if (!(ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(ext)) errors.file = "Допустимы PDF, DOC(X), XLS(X), TXT, CSV, ZIP, PNG, JPG";
  }
  return errors;
}

export type LeadResponse =
  | { ok: true; warnings: string[] }
  | { ok: false; code: "validation"; fieldErrors: FieldErrors }
  | { ok: false; code: "not_configured" | "delivery_failed" | "rate_limited" | "bad_request"; message: string };
