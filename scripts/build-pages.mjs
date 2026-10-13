// Static export for GitHub Pages.
//
// Next.js refuses `output: "export"` while server-only routes exist (POST /api/lead, the draft route that is
// closed at runtime). They are moved out of the way for the duration of the build and always put back.
//
//   npm run build:pages
//   BASE_PATH=/itcluster DEMO=1 LEAD_ENDPOINT=https://h200-lead.<you>.workers.dev npm run build:pages
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, renameSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const serverOnly = ["src/app/api", "src/app/drafts"];
const stash = mkdtempSync(join(tmpdir(), "pages-build-"));
const moved = [];

// "/" or "none" means "site root" (custom domain or <user>.github.io): Next.js has no such basePath value, it must be empty.
const rawBase = (process.env.BASE_PATH ?? process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
const basePath = rawBase === "/" || rawBase === "none" ? "" : rawBase.replace(/\/+$/, "");

const env = {
  ...process.env,
  STATIC_EXPORT: "1",
  NEXT_PUBLIC_STATIC: "1",
  NEXT_PUBLIC_DEMO: process.env.DEMO ?? process.env.NEXT_PUBLIC_DEMO ?? "1",
  NEXT_PUBLIC_BASE_PATH: basePath,
  NEXT_PUBLIC_LEAD_ENDPOINT: process.env.LEAD_ENDPOINT ?? process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "",
};

let status = 1;
try {
  for (const dir of serverOnly) {
    if (!existsSync(dir)) continue;
    const target = join(stash, dir.replaceAll("/", "__"));
    renameSync(dir, target);
    moved.push([dir, target]);
  }
  rmSync(".next", { recursive: true, force: true });
  status = spawnSync("npx", ["next", "build"], { stdio: "inherit", env }).status ?? 1;
} finally {
  for (const [dir, target] of moved) renameSync(target, dir);
  rmSync(stash, { recursive: true, force: true });
  rmSync(".next", { recursive: true, force: true }); // a static build must not leak into `npm start`
}
if (status === 0) {
  console.log(`\nStatic site is in ./out  (base path: "${env.NEXT_PUBLIC_BASE_PATH}", demo: ${env.NEXT_PUBLIC_DEMO}, intake: ${env.NEXT_PUBLIC_LEAD_ENDPOINT || "not connected"})`);
}
process.exit(status);
