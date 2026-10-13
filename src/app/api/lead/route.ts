import { NextResponse } from "next/server";
import type { LeadResponse } from "@/lib/lead-schema";
import { processLead } from "@/server/lead-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse<LeadResponse>> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { status, body } = await processLead(req, { env: process.env, ip });
  return NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
}
