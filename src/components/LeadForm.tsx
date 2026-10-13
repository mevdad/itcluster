"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { contacts, phoneHref } from "@/content/site";
import { leadEndpoint } from "@/lib/config";
import { useDirectionRequest } from "@/lib/lead-direction";
import {
  ALLOWED_FILE_EXTENSIONS,
  DIRECTIONS,
  isDirection,
  validateLead,
  type Direction,
  type FieldErrors,
  type FieldKey,
  type LeadFields,
  type LeadResponse,
} from "@/lib/lead-schema";
import { ArrowRight, Check, Upload } from "./icons";

// The submit state is a discriminated union, not three booleans: "success" can only be reached after the
// server confirmed delivery, so the page can never show a success message for a lead that was not sent.
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; warnings: readonly string[] }
  | { kind: "error"; message: string; fallback: boolean };

const FIELD_ORDER: readonly FieldKey[] = ["name", "contact", "direction", "message", "file", "consent"];

function readFields(form: FormData, direction: Direction | "", message: string): LeadFields {
  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : "";
  };
  return { name: get("name"), company: get("company"), contact: get("contact"), direction, message, consent: get("consent") === "on" };
}

export function LeadForm() {
  const uid = useId();
  const request = useDirectionRequest();
  const formRef = useRef<HTMLFormElement>(null);
  const [direction, setDirection] = useState<Direction | "">("");
  const [message, setMessage] = useState("");
  const [seenNonce, setSeenNonce] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fileName, setFileName] = useState<string | null>(null);

  // A CTA elsewhere on the page asked for a direction. Adjusting state while rendering (instead of in an
  // effect) avoids a frame with the old value; the nonce makes repeated clicks on the same CTA work again.
  if (request.nonce !== seenNonce) {
    setSeenNonce(request.nonce);
    if (request.direction) setDirection(request.direction);
    if (request.prefill && message.trim() === "") setMessage(request.prefill);
  }

  const id = (k: string) => `${uid}-${k}`;
  const err = (k: FieldKey) => errors[k];
  const describe = (k: FieldKey) => (err(k) ? `${id(k)}-error` : undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const form = new FormData(e.currentTarget);
    const fileEntry = form.get("file");
    const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
    const found = validateLead(readFields(form, direction, message), file ? { name: file.name, size: file.size } : null);
    setErrors(found);
    const firstBad = FIELD_ORDER.find((k) => found[k]);
    if (firstBad) {
      setStatus({ kind: "idle" });
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstBad}"]`)?.focus();
      return;
    }
    if (leadEndpoint === null) {
      // Static hosting without an intake endpoint: say so instead of pretending the lead went anywhere.
      setStatus({ kind: "error", message: "Приём заявок через форму ещё не подключён.", fallback: true });
      return;
    }
    form.set("direction", direction);
    form.set("message", message);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(leadEndpoint, { method: "POST", body: form });
      const body: LeadResponse | null = await res.json().catch(() => null);
      if (res.ok && body?.ok) {
        setStatus({ kind: "success", warnings: body.warnings });
        formRef.current?.reset();
        setDirection("");
        setMessage("");
        setFileName(null);
        return;
      }
      if (body && !body.ok && body.code === "validation") {
        setErrors(body.fieldErrors);
        setStatus({ kind: "idle" });
        return;
      }
      const notSent = body && !body.ok ? body.message : "Не удалось отправить заявку.";
      setStatus({ kind: "error", message: notSent, fallback: !body || (!body.ok && body.code !== "rate_limited") });
    } catch {
      setStatus({ kind: "error", message: "Нет связи с сервером. Заявка не отправлена.", fallback: true });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="card flex flex-col gap-4 p-6 sm:p-8" role="status">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent-600 text-white">
          <Check className="size-6" />
        </span>
        <h3 className="h-card">Заявка отправлена</h3>
        <p className="text-muted">Мы получили ваше обращение и свяжемся по указанным контактам.</p>
        {status.warnings.includes("file_not_delivered") && (
          <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Текст заявки передан, но файл прикрепить не удалось. Пришлите его по контактам, когда мы свяжемся с вами.</p>
        )}
        <button type="button" className="btn btn-secondary w-fit" onClick={() => setStatus({ kind: "idle" })}>
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card flex flex-col gap-5 p-6 sm:p-8" aria-busy={sending}>
      {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Сайт
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Имя" htmlFor={id("name")} error={err("name")} errorId={`${id("name")}-error`}>
          <input data-field="name" id={id("name")} name="name" type="text" autoComplete="name" required className="field" aria-invalid={!!err("name")} aria-describedby={describe("name")} />
        </Field>
        <Field label="Компания" hint="необязательно" htmlFor={id("company")}>
          <input id={id("company")} name="company" type="text" autoComplete="organization" className="field" />
        </Field>
      </div>

      <Field label="Телефон или email" htmlFor={id("contact")} error={err("contact")} errorId={`${id("contact")}-error`}>
        <input data-field="contact" id={id("contact")} name="contact" type="text" inputMode="email" autoComplete="email" required className="field" aria-invalid={!!err("contact")} aria-describedby={describe("contact")} />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold">Направление обращения</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-describedby={describe("direction")}>
          {DIRECTIONS.map((d) => (
            <label key={d.value} className="cursor-pointer">
              <input
                type="radio"
                name="direction-choice"
                value={d.value}
                checked={direction === d.value}
                onChange={(e) => isDirection(e.target.value) && setDirection(e.target.value)}
                data-field={d.value === DIRECTIONS[0].value ? "direction" : undefined}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-12 items-center rounded-full border border-fog-300 bg-white px-5 text-[15px] font-semibold transition-colors peer-checked:border-accent-600 peer-checked:bg-accent-600 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-500 hover:border-ink">
                {d.label}
              </span>
            </label>
          ))}
        </div>
        {err("direction") && (
          <p id={`${id("direction")}-error`} className="text-sm font-medium text-danger">
            {err("direction")}
          </p>
        )}
      </fieldset>

      <Field label="Описание задачи" htmlFor={id("message")} error={err("message")} errorId={`${id("message")}-error`}>
        <textarea
          data-field="message"
          id={id("message")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          maxLength={3000}
          className="field resize-y"
          placeholder="Что нужно сделать, какая нагрузка или оборудование, желаемые сроки"
          aria-invalid={!!err("message")}
          aria-describedby={describe("message")}
        />
      </Field>

      <Field label="Файл технического задания" hint="необязательно" htmlFor={id("file")} error={err("file")} errorId={`${id("file")}-error`}>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[0.875rem] border border-dashed border-fog-300 bg-fog-50 px-4 py-2.5 text-[15px] hover:border-ink">
          <Upload className="size-5 shrink-0 text-accent-600" />
          <span className="truncate">{fileName ?? `PDF, DOC(X), XLS(X), ZIP и другие — до 10 МБ`}</span>
          <input
            data-field="file"
            id={id("file")}
            name="file"
            type="file"
            accept={ALLOWED_FILE_EXTENSIONS.map((x) => `.${x}`).join(",")}
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            aria-invalid={!!err("file")}
            aria-describedby={describe("file")}
          />
        </label>
      </Field>

      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-ink-soft">
          <input data-field="consent" type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-accent-600" aria-invalid={!!err("consent")} aria-describedby={describe("consent")} />
          <span>
            Я согласен(на) на обработку персональных данных и ознакомлен(а) с{" "}
            <Link href="/privacy" target="_blank" className="font-semibold text-accent-600 underline underline-offset-2">
              политикой обработки данных
            </Link>
            .
          </span>
        </label>
        {err("consent") && (
          <p id={`${id("consent")}-error`} className="text-sm font-medium text-danger">
            {err("consent")}
          </p>
        )}
      </div>

      {status.kind === "error" && (
        <div role="alert" className="rounded-2xl border border-danger/30 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">Заявка не отправлена. {status.message}</p>
          {status.fallback && (contacts.email || contacts.phone) && (
            <p className="mt-1">
              Свяжитесь с нами напрямую:{" "}
              {contacts.email && (
                <a className="font-semibold underline" href={`mailto:${contacts.email}`}>
                  {contacts.email}
                </a>
              )}
              {contacts.email && contacts.phone && ", "}
              {contacts.phone && (
                <a className="font-semibold underline" href={phoneHref(contacts.phone)}>
                  {contacts.phone}
                </a>
              )}
              .
            </p>
          )}
        </div>
      )}

      <button type="submit" className="btn btn-primary w-full sm:w-fit" disabled={sending}>
        {sending ? "Отправляем…" : "Отправить задачу"}
        {!sending && <ArrowRight className="size-5" />}
      </button>
    </form>
  );
}

function Field({ label, hint, htmlFor, error, errorId, children }: { label: string; hint?: string; htmlFor: string; error?: string; errorId?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
        {hint && <span className="ml-1.5 font-normal text-muted">· {hint}</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
