/** Sections of /support/guides, in display order; `key` is the anchor (#general) and Guide.category. */
export const GUIDE_CATEGORIES = [
  { key: "general", name: "Гарын авлага — Ерөнхий цэс" },
  { key: "hr-payroll", name: "Цалин, хүний нөөц" },
  { key: "fixed-assets", name: "Үндсэн хөрөнгө" },
  { key: "remote-support", name: "Алсын тусламж" },
] as const;

export type GuideCategory = (typeof GUIDE_CATEGORIES)[number]["key"];

export const guideCategoryName = (key: string) => GUIDE_CATEGORIES.find((c) => c.key === key)?.name ?? key;
