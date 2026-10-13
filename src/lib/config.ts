// Build-time switches. All are NEXT_PUBLIC_* so they are inlined into the bundle by Next.js.

/** Sub-path when hosted at https://<user>.github.io/<repo>/ ; empty on a root domain and in dev. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Static export (GitHub Pages): there is no Next.js server, so no /api/lead. */
export const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

/**
 * Demo build: shows every block that exists in code, including the ones hidden until the company confirms the
 * facts behind them. Placeholders are in [square brackets] and badged as drafts. Never use for the real launch.
 */
export const demo = process.env.NEXT_PUBLIC_DEMO === "1";

/**
 * Where the form posts. A static site has no server of its own, so it needs an external endpoint
 * (the Cloudflare Worker in workers/lead). null → the form tells the visitor that intake is not connected.
 */
export const leadEndpoint: string | null = process.env.NEXT_PUBLIC_LEAD_ENDPOINT?.trim() || (isStatic ? null : `${basePath}/api/lead`);

/** Prefix a public/ path with the base path (plain <img>, unlike next/link, does not add it). */
export function asset(path: string): string {
  return `${basePath}${path}`;
}
