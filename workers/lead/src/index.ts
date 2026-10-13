// Cloudflare Worker: receives the landing's lead form when the site is hosted statically (GitHub Pages).
// It reuses the exact validation + delivery code of the Next.js route, so both paths behave the same.
import type { LeadResponse } from "../../../src/lib/lead-schema";
import { processLead } from "../../../src/server/lead-handler";

interface WorkerEnv {
  /** Comma-separated origins allowed to post, e.g. "https://mevdad.github.io". */
  ALLOWED_ORIGINS?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  LEAD_WEBHOOK_URL?: string;
  LEAD_WEBHOOK_TOKEN?: string;
  [key: string]: string | undefined;
}

function json(body: LeadResponse, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...cors },
  });
}

const worker = {
  async fetch(req: Request, env: WorkerEnv): Promise<Response> {
    const allowed = (env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    const origin = req.headers.get("origin");
    const cors: Record<string, string> = origin && allowed.includes(origin) ? { "access-control-allow-origin": origin, vary: "origin" } : { vary: "origin" };

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: { ...cors, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "86400" } });
    }
    if (req.method !== "POST") return json({ ok: false, code: "bad_request", message: "Метод не поддерживается." }, 405, cors);

    // Per-isolate limiter only; add a Cloudflare rate-limiting rule for real protection (see docs/DEPLOY-PAGES.md).
    const ip = req.headers.get("cf-connecting-ip") ?? "unknown";
    const { status, body } = await processLead(req, { env, ip, allowedOrigins: allowed });
    return json(body, status, cors);
  },
};

export default worker;
