// Optimises real / stock photos into WebP, cropped to the exact slots of the page.
//
//   1. put the originals in photos/src/        (any size; jpg / png / webp)
//   2. describe them in photos/photos.json     (slot id → file, alt, status, focus point, credit)
//   3. npm run photos
//
// Output: public/images/photos/<id>-d.webp (desktop) and <id>-m.webp (phone), src/content/image-overrides.generated.ts
// and docs/PHOTO-CREDITS.md. The slots' proportions come from the generated registry, so a photo of any size lands in
// the box the layout already has (no layout shift).
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "photos", "src");
// Own folder, wiped on every run: it never touches hand-placed files in public/images/real/.
const outDir = join(root, "public", "images", "photos");
const { images } = await import(join(root, "src/content/images.generated.ts"));

/** Longest side in pixels for the desktop and phone files. A slot is shown at most ~700 px wide, so 2x is enough. */
const SIZE = { desktopLong: 1600, mobileLong: 900 };
const QUALITY = { desktop: 76, mobile: 72 };
const BUDGET_KB = { desktop: 220, mobile: 110 };
const STATUSES = ["реальная фотография", "стоковое фото"];

const specPath = join(root, "photos", "photos.json");
if (!existsSync(specPath)) throw new Error("photos/photos.json not found (see header of scripts/photos.mjs)");
const spec = JSON.parse(readFileSync(specPath, "utf8"));

/** "50% 30%" | "left center" → fractions (0..1) of the free space; 0.5 0.5 by default. */
function focus(position) {
  const words = { left: 0, center: 0.5, right: 1, top: 0, bottom: 1 };
  const parts = (position ?? "50% 50%").trim().split(/\s+/);
  const one = (p) => (p.endsWith("%") ? Number.parseFloat(p) / 100 : (words[p] ?? 0.5));
  const x = one(parts[0] ?? "50%");
  const y = one(parts[1] ?? parts[0] ?? "50%");
  return { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
}

function ratioOf(text) {
  const [w, h] = text.split("/").map((n) => Number(n));
  return w / h;
}

async function render(input, ratio, longSide, quality, position, file) {
  const meta = await sharp(input).rotate().metadata();
  const sw = meta.autoOrient?.width ?? meta.width;
  const sh = meta.autoOrient?.height ?? meta.height;
  const w = ratio >= 1 ? longSide : Math.round(longSide * ratio);
  const h = ratio >= 1 ? Math.round(longSide / ratio) : longSide;
  if (sw < w * 0.75 || sh < h * 0.75) console.warn(`  ! source ${sw}×${sh} is small for ${w}×${h}: the photo will look soft`);
  // cover-scale, then take the crop window at the focus point (not just the centre)
  const scale = Math.max(w / sw, h / sh);
  const cw = Math.round(sw * scale);
  const ch = Math.round(sh * scale);
  const f = focus(position);
  const left = Math.round((cw - w) * f.x);
  const top = Math.round((ch - h) * f.y);
  const buf = await sharp(input)
    .rotate()
    .resize(cw, ch, { kernel: "lanczos3" })
    .extract({ left, top, width: w, height: h })
    .webp({ quality, effort: 5 })
    .toBuffer();
  writeFileSync(file, buf);
  return { width: w, height: h, kb: Math.round(buf.length / 1024) };
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const overrides = {};
const credits = [];
let totalKb = 0;
for (const [id, item] of Object.entries(spec)) {
  const slot = images[id];
  if (!slot || !slot.desktop) throw new Error(`${id}: no such image slot (IMG-05 is a live scheme and cannot be replaced by a photo)`);
  if (!STATUSES.includes(item.status)) throw new Error(`${id}: status must be one of ${STATUSES.join(" | ")}`);
  if (!item.alt || item.alt.trim().length < 8) throw new Error(`${id}: describe what is in the photo (alt)`);
  const input = join(srcDir, item.file);
  if (!existsSync(input) || !statSync(input).isFile()) throw new Error(`${id}: ${item.file} not found in photos/src/`);

  console.log(`${id}  ${item.file}`);
  const dRatio = ratioOf(`${slot.desktop.width} / ${slot.desktop.height}`);
  const mRatio = ratioOf(`${slot.mobile.width} / ${slot.mobile.height}`);
  const d = await render(input, dRatio, SIZE.desktopLong, QUALITY.desktop, item.objectPosition, join(outDir, `${id}-d.webp`));
  const m = await render(input, mRatio, SIZE.mobileLong, QUALITY.mobile, item.mobilePosition ?? item.objectPosition, join(outDir, `${id}-m.webp`));
  totalKb += d.kb + m.kb;
  console.log(`  desktop ${d.width}×${d.height} ${d.kb} KB${d.kb > BUDGET_KB.desktop ? "  ! over budget" : ""}   phone ${m.width}×${m.height} ${m.kb} KB${m.kb > BUDGET_KB.mobile ? "  ! over budget" : ""}`);
  overrides[id] = {
    desktop: { src: `/images/photos/${id}-d.webp`, width: d.width, height: d.height },
    mobile: { src: `/images/photos/${id}-m.webp`, width: m.width, height: m.height },
    alt: item.alt,
    status: item.status,
    ...(item.objectPosition ? { objectPosition: item.objectPosition } : {}),
  };
  if (item.credit) credits.push({ id, ...item.credit });
}

const body = Object.entries(overrides)
  .map(([id, o]) => `  ${JSON.stringify(id)}: ${JSON.stringify(o)},`)
  .join("\n");
writeFileSync(
  join(root, "src/content/image-overrides.generated.ts"),
  `// Generated by scripts/photos.mjs from photos/photos.json — do not edit by hand.\nimport type { ImageOverride } from "./image-types";\nimport type { ImageId } from "./images";\n\nexport const photoOverrides: Partial<Record<ImageId, ImageOverride>> = {\n${body}\n};\n`,
);

const lines = [
  "# Источники фотографий",
  "",
  "Генерируется командой `npm run photos` из `photos/photos.json`. Не редактируйте вручную.",
  "",
  "Стоковые фото с Pexels распространяются по [лицензии Pexels](https://www.pexels.com/license/): их можно использовать бесплатно, в том числе в коммерческих целях, без обязательной ссылки на автора. Нельзя продавать фото в неизменном виде, представлять людей на них как причастных к компании или использовать так, чтобы это порочило изображённых. Стоковые фото на сайте подписаны как «Иллюстративное фото» и не выдаются за площадки или сотрудников компании.",
  "",
  "| Слот | Фото | Автор | Лицензия |",
  "|---|---|---|---|",
  ...credits.map((c) => `| ${c.id} | ${c.url ? `[${c.title ?? c.url}](${c.url})` : (c.title ?? "")} | ${c.author ?? ""} | ${c.license ?? ""} |`),
];
writeFileSync(join(root, "docs", "PHOTO-CREDITS.md"), `${lines.join("\n")}\n`);
console.log(`\n${Object.keys(overrides).length} photos → public/images/photos/, total ${totalKb} KB`);
