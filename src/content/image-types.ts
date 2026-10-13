export type ImageStatus = "реальная фотография" | "иллюстрация" | "визуализация";

export interface ImageVariant {
  src: string;
  width: number;
  height: number;
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
