import { imageOverrides } from "./image-overrides";
import type { ImageFile, ImageStatus } from "./image-types";
import { images } from "./images.generated";

type Generated = typeof images;

/** Ids that have a file (IMG-05 is live HTML, so it is excluded at the type level). */
export type ImageId = { [K in keyof Generated]: Generated[K]["desktop"] extends null ? never : K }[keyof Generated];

export interface ResolvedImage {
  /** Slot proportions on the page («W / H»). Always from the generated registry, never from a replacement file. */
  ratio: { desktop: string; mobile: string };
  desktop: ImageFile;
  /** Same as desktop when there is no separate phone crop. */
  mobile: ImageFile;
  alt: string;
  status: ImageStatus;
  objectPosition: string | undefined;
}

/** The generated picture with the hand-written override (content/image-overrides.ts) applied on top. */
export function resolveImage(id: ImageId): ResolvedImage {
  const base = images[id];
  const ratio = {
    desktop: `${base.desktop.width} / ${base.desktop.height}`,
    mobile: `${base.mobile.width} / ${base.mobile.height}`,
  };
  const override = imageOverrides[id];
  if (!override) {
    return { ratio, desktop: base.desktop, mobile: base.mobile, alt: base.alt, status: base.status, objectPosition: undefined };
  }
  return {
    ratio,
    desktop: override.desktop,
    mobile: override.mobile ?? override.desktop,
    alt: override.alt,
    status: override.status,
    objectPosition: override.objectPosition,
  };
}

/**
 * The honesty remark for a caption under a picture, chosen by what the picture really is:
 * a drawing → the given note («Визуализация…»), a stock photo → it is not the company's site, a real photo → nothing.
 */
export function captionNote(id: ImageId, drawnNote: string): string {
  const { status } = resolveImage(id);
  if (status === "реальная фотография") return "";
  return ` ${status === "стоковое фото" ? "Иллюстративное фото, не площадка компании." : drawnNote}`;
}

export function isRealPhoto(id: ImageId): boolean {
  return resolveImage(id).status === "реальная фотография";
}

const STATUS_LABEL: Record<Exclude<ImageStatus, "реальная фотография">, string> = {
  "стоковое фото": "Иллюстративное фото",
  иллюстрация: "Иллюстрация",
  визуализация: "Визуализация",
};

/** «Визуализация» / «Иллюстрация» for drawn pictures; null for a real photograph (it needs no disclaimer). */
export function statusLabel(status: ImageStatus): string | null {
  return status === "реальная фотография" ? null : STATUS_LABEL[status];
}
