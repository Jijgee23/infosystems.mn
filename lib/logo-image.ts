import sharp from "sharp";

/** Every client logo is stored as a LOGO_WIDTH × LOGO_HEIGHT (2:1) transparent PNG. */
export const LOGO_WIDTH = 600;
export const LOGO_HEIGHT = 300;
/** Empty space kept around the logo inside the canvas. */
const PADDING = 24;

/**
 * Turns any uploaded logo into the standard rectangle: applies EXIF rotation, trims the
 * plain margin around it (white or transparent, taken from the corner pixel), then fits it
 * — never cropping the mark itself — centered on a transparent 600×300 canvas.
 *
 * No `server-only` import: scripts/normalize-client-logos.ts uses it too.
 */
export async function normalizeLogo(input: Buffer): Promise<Buffer> {
  const rotated = await sharp(input).rotate().png().toBuffer();
  let trimmed = rotated;
  try {
    trimmed = await sharp(rotated).trim({ threshold: 12 }).png().toBuffer();
  } catch {
    // A single-colour image has nothing to trim; keep it whole.
  }
  return sharp(trimmed)
    .resize(LOGO_WIDTH - 2 * PADDING, LOGO_HEIGHT - 2 * PADDING, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: PADDING, bottom: PADDING, left: PADDING, right: PADDING, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** True for a file that already went through normalizeLogo (lets the script skip it). */
export const isNormalizedLogo = (f: { mime: string | null; width: number | null; height: number | null }) =>
  f.mime === "image/png" && f.width === LOGO_WIDTH && f.height === LOGO_HEIGHT;
