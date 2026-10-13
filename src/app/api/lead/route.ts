import { NextResponse } from "next/server";
import { isDirection, MAX_FILE_BYTES, validateLead, type LeadFields, type LeadResponse } from "@/lib/lead-schema";
import { deliverLead } from "@/server/lead-delivery";
import { isRateLimited } from "@/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function reply(body: LeadResponse, status: number): NextResponse<LeadResponse> {
  return NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
}

function text(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
}

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; the rate limit and validation still apply
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(req: Request): Promise<NextResponse<LeadResponse>> {
  if (!sameOrigin(req)) return reply({ ok: false, code: "bad_request", message: "Запрос отклонён." }, 403);
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_FILE_BYTES + 256 * 1024) return reply({ ok: false, code: "validation", fieldErrors: { file: "Файл больше 10 МБ" } }, 413);
  if (isRateLimited(clientIp(req))) return reply({ ok: false, code: "rate_limited", message: "Слишком много обращений. Попробуйте позже." }, 429);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return reply({ ok: false, code: "bad_request", message: "Не удалось прочитать форму." }, 400);
  }

  // Honeypot: real visitors never see this field. Bots get a success they cannot act on; nothing is sent.
  if (text(form, "website").trim() !== "") return reply({ ok: true, warnings: [] }, 200);

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
    return reply({ ok: false, code: "validation", fieldErrors }, 422);
  }

  const outcome = await deliverLead({
    name: fields.name.trim(),
    company: fields.company.trim(),
    contact: fields.contact.trim(),
    direction: fields.direction,
    message: fields.message.trim(),
    file,
    source: req.headers.get("referer"),
  });

  switch (outcome.status) {
    case "delivered":
      return reply({ ok: true, warnings: outcome.warnings }, 200);
    case "not_configured":
      return reply({ ok: false, code: "not_configured", message: "Приём заявок через форму ещё не подключён." }, 503);
    case "failed":
      return reply({ ok: false, code: "delivery_failed", message: "Не удалось передать заявку." }, 502);
  }
}
