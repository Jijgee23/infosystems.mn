/**
 * Kinds of product links (model ProductLink): a product's own website, its apps in the stores,
 * a desktop download, or anything else. Shared by the admin editor and the product page.
 */
export const PRODUCT_LINK_KINDS = [
  { key: "website", name: "Вэб сайт", button: "Вэб сайтад зочлох", placeholder: "https://www.example.mn" },
  { key: "app_store", name: "App Store (iPhone, iPad)", button: "App Store-оос татах", placeholder: "https://apps.apple.com/…", hosts: ["apps.apple.com", "itunes.apple.com"] },
  { key: "google_play", name: "Google Play (Android)", button: "Google Play-ээс татах", placeholder: "https://play.google.com/store/apps/details?id=…", hosts: ["play.google.com"] },
  { key: "windows", name: "Windows програм татах", button: "Windows-д татах", placeholder: "https://…" },
  { key: "other", name: "Бусад холбоос", button: "Холбоос", placeholder: "https://…" },
] as const;

export type ProductLinkKind = (typeof PRODUCT_LINK_KINDS)[number]["key"];

export const linkKind = (key: string) => PRODUCT_LINK_KINDS.find((k) => k.key === key) ?? PRODUCT_LINK_KINDS[PRODUCT_LINK_KINDS.length - 1];

/** Text of the link's button: its own label, or the kind's default. */
export const linkText = (l: { kind: string; label: string | null }) => l.label?.trim() || linkKind(l.kind).button;

/**
 * Why `url` can't be used for a link of `kind`, or null when it is fine:
 * https only, and store links must point at their store.
 */
export function linkUrlError(kind: string, url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return "Бүтэн холбоос оруулна уу (https://…)";
  }
  if (u.protocol !== "https:") return "https://-ээр эхэлсэн холбоос оруулна уу";
  const k = linkKind(kind);
  if ("hosts" in k && !(k.hosts as readonly string[]).includes(u.hostname)) return `${k.name}-ийн холбоос биш байна (${k.hosts[0]})`;
  return null;
}
