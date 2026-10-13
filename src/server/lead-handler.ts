// Framework-free lead processing on the standard Request/Response types. Two thin adapters call it:
// the Next.js route (src/app/api/lead/route.ts) and the Cloudflare Worker (workers/lead) used when the
// site is exported to static hosting such as GitHub Pages. Keep this file free of Next/Node-only imports.
import { isDirection, MAX_FILE_BYTES, validateLead, type LeadFields, type LeadResponse } from "../lib/lead-schema";
import { configuredChannels, deliverLead, type Env } from "./lead-delivery";
import { isRateLimited } from "./rate-limit";

export interface HandlerOptions {
  env: Env;
  ip: string;
  /**
   * undefined → same-origin only (Next.js route). A list → exactly these origins (Worker, cross-origin by design);
   * an empty list therefore rejects every browser request, which is the safe default for a misconfigured Worker.
   */
  allowedOrigins?: readonly string[];
}

export interface HandlerResult {
  status: number;
  body: LeadResponse;
}

function text(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
}

function originAllowed(req: Request, allowed: readonly string[] | undefined): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; validation and the rate limit still apply
  if (allowed) return allowed.includes(origin);
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function processLead(req: Request, { env, ip, allowedOrigins }: HandlerOptions): Promise<HandlerResult> {
  if (!originAllowed(req, allowedOrigins)) return { status: 403, body: { ok: false, code: "bad_request", message: "Запрос отклонён." } };
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_FILE_BYTES + 256 * 1024) return { status: 413, body: { ok: false, code: "validation", fieldErrors: { file: "Файл больше 10 МБ" } } };
  if (isRateLimited(ip)) return { status: 429, body: { ok: false, code: "rate_limited", message: "Слишком много обращений. Попробуйте позже." } };

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return { status: 400, body: { ok: false, code: "bad_request", message: "Не удалось прочитать форму." } };
  }

  // Honeypot: real visitors never see this field. Bots get a success they cannot act on; nothing is sent.
  if (text(form, "website").trim() !== "") return { status: 200, body: { ok: true, warnings: [] } };

  const rawDirection = text(form, "direction");
  const fields: LeadFields = {
    name: text(form, "name"),
    company: text(form, "company"),
    contact: text(form, "contact"),
    direction: isDirection(rawDirection) ? rawDirection : "",
    message: text(form, "message"),
    consent: text(form, "consent") === "on",
  };
  const fileEntry = form.get("file");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  const fieldErrors = validateLead(fields, file ? { name: file.name, size: file.size } : null);
  if (Object.keys(fieldErrors).length > 0 || fields.direction === "") {
    return { status: 422, body: { ok: false, code: "validation", fieldErrors } };
  }

  const outcome = await deliverLead(
    {
      name: fields.name.trim(),
      company: fields.company.trim(),
      contact: fields.contact.trim(),
      direction: fields.direction,
      message: fields.message.trim(),
      file,
      source: req.headers.get("referer") ?? req.headers.get("origin"),
    },
    configuredChannels(env),
  );

  switch (outcome.status) {
    case "delivered":
      return { status: 200, body: { ok: true, warnings: outcome.warnings } };
    case "not_configured":
      return { status: 503, body: { ok: false, code: "not_configured", message: "Приём заявок через форму ещё не подключён." } };
    case "failed":
      return { status: 502, body: { ok: false, code: "delivery_failed", message: "Не удалось передать заявку." } };
  }
}
