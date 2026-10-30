export const MAIN_NAV = [
  { href: "/solutions", label: "Шийдэл" },
  { href: "/pricing", label: "Үнэ" },
  { href: "/support", label: "Тусламж" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/contact", label: "Холбоо барих" },
] as const;

/** The /solutions pages (hand-written); products link to them via Product.solutions. */
export const SOLUTIONS = [
  { slug: "retail", name: "Худалдаа" },
  { slug: "manufacturing", name: "Үйлдвэрлэл" },
  { slug: "services", name: "Үйлчилгээ" },
  { slug: "pharmacy", name: "Эмийн сан" },
  { slug: "auto-service", name: "Авто засвар" },
] as const;

/**
 * Link preview from app/opengraph-image.tsx. Pages that set their own `openGraph` replace the
 * inherited one, so they fall back to this when they have no picture of their own.
 */
export const DEFAULT_OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "InfoSystems Mongolia — MACS ERP, MACS POS" };
