import type { ImageOverride } from "./image-types";
import type { ImageId } from "./images";

/**
 * Real photos that replace generated illustrations. Hand-edited (unlike images.generated.ts).
 * How to replace a picture: docs/IMAGES.md → «Как заменить картинку».
 *
 * Example:
 *   "img-06": {
 *     desktop: { src: "/images/real/rack-msk.jpg", width: 2400, height: 1600 },
 *     mobile: { src: "/images/real/rack-msk-m.jpg", width: 1200, height: 900 },
 *     alt: "Стойки с GPU-серверами на площадке в Москве",
 *     status: "реальная фотография",
 *     objectPosition: "50% 40%",
 *   },
 *
 * The key type is ImageId, so a typo in the id or a missing field is a type error, not a broken page.
 */
export const imageOverrides: Partial<Record<ImageId, ImageOverride>> = {};
