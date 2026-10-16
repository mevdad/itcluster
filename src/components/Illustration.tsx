import type { CSSProperties } from "react";
import { resolveImage, statusLabel, type ImageId } from "@/content/images";
import { asset } from "@/lib/config";

export type { ImageId };

type RatioVars = CSSProperties & Record<`--${string}`, string>;

interface Props {
  id: ImageId;
  /** First-screen image: loaded eagerly and fetched with high priority (protects LCP). */
  priority?: boolean;
  /**
   * Show the «Визуализация» / «Иллюстрация» label on the picture, so a drawing is not mistaken for a photo of the
   * company's sites. The text comes from the image status; for a real photograph nothing is shown automatically.
   */
  badge?: boolean;
  className?: string;
}

/**
 * Art-directed picture: a separate crop for phones, a fixed aspect ratio per breakpoint so the layout does not
 * shift while the file loads. The ratio belongs to the slot (generated registry), not to the file: a real photo
 * from content/image-overrides.ts of any size is cropped into the same box with object-fit: cover.
 * Plain <img>: the SVGs need no optimiser, and the static export (GitHub Pages) has no next/image server anyway.
 */
export function Illustration({ id, priority = false, badge = false, className = "" }: Props) {
  const image = resolveImage(id);
  const { desktop, mobile } = image;
  const style: RatioVars = { "--ar-d": image.ratio.desktop, "--ar-m": image.ratio.mobile };
  const label = badge ? statusLabel(image.status) : null;
  return (
    <div className={`illu ${className}`} style={style}>
      <picture>
        {mobile.src !== desktop.src && <source media="(max-width: 767px)" srcSet={asset(mobile.src)} width={mobile.width} height={mobile.height} />}
        <img
          src={asset(desktop.src)}
          alt={image.alt}
          width={desktop.width}
          height={desktop.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
        />
      </picture>
      {label && <span className="illu-badge">{label}</span>}
    </div>
  );
}
