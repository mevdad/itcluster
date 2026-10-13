import type { CSSProperties } from "react";
import { images } from "@/content/images.generated";

type Illustrated = { [K in keyof typeof images]: (typeof images)[K]["desktop"] extends null ? never : K }[keyof typeof images];
export type ImageId = Illustrated;

type RatioVars = CSSProperties & Record<`--${string}`, string>;

interface Props {
  id: ImageId;
  /** First-screen image: loaded eagerly and fetched with high priority (protects LCP). */
  priority?: boolean;
  /** Caption badge for visuals that must not be mistaken for photos of the company's sites. */
  badge?: string;
  className?: string;
}

/**
 * Art-directed picture: a separate crop for phones, a fixed aspect ratio per breakpoint so the layout does not
 * shift while the file loads. SVGs are already vector, so the next/image optimiser has nothing to do for them
 * (it would just proxy the bytes) — a plain <img> is the right element here.
 */
export function Illustration({ id, priority = false, badge, className = "" }: Props) {
  const entry = images[id];
  const { desktop, mobile } = entry;
  const style: RatioVars = {
    "--ar-d": `${desktop.width} / ${desktop.height}`,
    "--ar-m": `${mobile.width} / ${mobile.height}`,
  };
  return (
    <div className={`illu ${className}`} style={style}>
      <picture>
        {mobile.src !== desktop.src && <source media="(max-width: 767px)" srcSet={mobile.src} />}
        <img
          src={desktop.src}
          alt={entry.alt}
          width={desktop.width}
          height={desktop.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      </picture>
      {badge && <span className="illu-badge">{badge}</span>}
    </div>
  );
}
