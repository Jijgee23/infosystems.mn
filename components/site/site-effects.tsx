"use client";

import { Lightbox } from "./lightbox";

/**
 * Page-wide behaviour for the server-rendered markup: `[data-zoom-src]` elements open
 * the image viewer. (The `.reveal` scroll-in effect is pure CSS, see globals.css.)
 */
export function SiteEffects() {
  return <Lightbox />;
}
