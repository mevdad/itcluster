export type ImageStatus = "реальная фотография" | "стоковое фото" | "иллюстрация" | "визуализация";

/** One image file under public/: its URL path and its own pixel size. */
export interface ImageFile {
  src: string;
  width: number;
  height: number;
}

export interface ImageVariant extends ImageFile {
  /** Crop of the same scene used for the mobile variant. */
  viewBox?: readonly number[];
}

export interface ImageEntry {
  code: string;
  id: string;
  title: string;
  placement: string;
  status: ImageStatus;
  alt: string;
  source: string;
  /** null for IMG-05: that scheme is built from live HTML text, not a file. */
  desktop: ImageVariant | null;
  mobile: ImageVariant | null;
  note?: string;
}

/**
 * Replaces a generated picture with another file (normally a real photo in public/images/real/).
 * The slot keeps its aspect ratio from the generated registry, so the page layout does not move;
 * the file is cropped into it with object-fit: cover.
 */
export interface ImageOverride {
  /** Path under public/, e.g. "/images/real/msk-hall.jpg", plus the file's own pixel size. */
  desktop: ImageFile;
  /** Separate crop for phones (≤767px). Omit → the desktop file is used and cropped into the phone slot. */
  mobile?: ImageFile;
  /** What is actually in the photo. Required: the generated alt describes the illustration, not your photo. */
  alt: string;
  status: ImageStatus;
  /** CSS object-position: which part of the photo stays visible when it is cropped, e.g. "50% 30%" or "left center". */
  objectPosition?: string;
}
