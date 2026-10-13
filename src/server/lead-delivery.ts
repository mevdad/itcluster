import { directionLabel, type LeadFields } from "../lib/lead-schema";

export interface Lead extends Omit<LeadFields, "direction" | "consent"> {
  direction: Exclude<LeadFields["direction"], "">;
  file: File | null;
  /** Page the form was submitted from (Referer), helps to tell campaigns apart. */
  source: string | null;
}

interface Channel {
  name: string;
  send: (lead: Lead) => Promise<string[]>; // resolves with warnings, rejects on failure
}

const TIMEOUT_MS = 10_000;

function leadText(lead: Lead): string {
  return [
    "Новая заявка с сайта H200 Cloud",
    `Направление: ${directionLabel(lead.direction)}`,
    `Имя: ${lead.name}`,
    `Компания: ${lead.company || "—"}`,
    `Контакт: ${lead.contact}`,
    `Файл: ${lead.file && lead.file.size > 0 ? `${lead.file.name} (${Math.ceil(lead.file.size / 1024)} КБ)` : "нет"}`,
    lead.source ? `Страница: ${lead.source}` : "",
    "",
    "Задача:",
    lead.message,
  ]
    .filter((line, i, arr) => line !== "" || arr[i - 1] !== "")
    .join("\n");
}

function telegramChannel(token: string, chatId: string): Channel {
  const api = (method: string) => `https://api.telegram.org/bot${token}/${method}`;
  return {
    name: "telegram",
    async send(lead) {
      const res = await fetch(api("sendMessage"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: leadText(lead), disable_web_page_preview: true }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`telegram sendMessage ${res.status}`);
      const warnings: string[] = [];
      if (lead.file && lead.file.size > 0) {
        const form = new FormData();
        form.set("chat_id", chatId);
        form.set("document", lead.file, lead.file.name);
        const doc = await fetch(api("sendDocument"), { method: "POST", body: form, signal: AbortSignal.timeout(TIMEOUT_MS) }).catch(() => null);
        if (!doc?.ok) warnings.push("file_not_delivered");
      }
      return warnings;
    },
  };
}

function webhookChannel(url: string, bearer: string | undefined): Channel {
  return {
    name: "webhook",
    async send(lead) {
      const form = new FormData();
      form.set("name", lead.name);
      form.set("company", lead.company);
      form.set("contact", lead.contact);
      form.set("direction", lead.direction);
      form.set("message", lead.message);
      if (lead.source) form.set("source", lead.source);
      if (lead.file && lead.file.size > 0) form.set("file", lead.file, lead.file.name);
      const res = await fetch(url, {
        method: "POST",
        body: form,
        headers: bearer ? { authorization: `Bearer ${bearer}` } : undefined,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
      return [];
    },
  };
}

export type Env = Readonly<Record<string, string | undefined>>;

export function configuredChannels(env: Env): Channel[] {
  const channels: Channel[] = [];
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) channels.push(telegramChannel(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID));
  if (env.LEAD_WEBHOOK_URL) channels.push(webhookChannel(env.LEAD_WEBHOOK_URL, env.LEAD_WEBHOOK_TOKEN));
  return channels;
}

export type DeliveryOutcome =
  | { status: "not_configured" }
  | { status: "failed" }
  | { status: "delivered"; warnings: string[] };

/** Delivered = at least one channel accepted the lead. Failures are logged without personal data. */
export async function deliverLead(lead: Lead, channels: Channel[]): Promise<DeliveryOutcome> {
  if (channels.length === 0) return { status: "not_configured" };
  const results = await Promise.allSettled(channels.map((c) => c.send(lead)));
  const warnings: string[] = [];
  let delivered = false;
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      delivered = true;
      warnings.push(...r.value);
    } else {
      console.error(`[lead] channel ${channels[i]?.name} failed:`, r.reason instanceof Error ? r.reason.message : "unknown");
    }
  });
  return delivered ? { status: "delivered", warnings } : { status: "failed" };
}
