/** The two kinds of posts on /news; `slug` is the ?category= filter value. */
export const POST_CATEGORIES = [
  { slug: "news", name: "Мэдээ мэдээлэл" },
  { slug: "advice", name: "Зөвлөгөө" },
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number]["name"];

/**
 * Old Strapi categories → one of the two: advice and guides («Зөвлөгөө», «Гарын авлага…»,
 * «Заавар») are advice, everything else (incl. none) is news.
 */
export const normalizePostCategory = (raw: string | null | undefined): PostCategory =>
  /зөвлөгөө|гарын авлага|заавар/i.test(raw ?? "") ? "Зөвлөгөө" : "Мэдээ мэдээлэл";
