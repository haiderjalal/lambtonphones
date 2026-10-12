/** A static photo in `public/images`. Dimensions let next/image reserve space and avoid layout shift. */
export interface SiteImage {
  src: string;
  /** Empty for decorative photos, which screen readers should skip. */
  alt: string;
  width: number;
  height: number;
}
