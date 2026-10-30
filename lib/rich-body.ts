import "server-only";
import { type HTMLElement, parse } from "node-html-parser";
import { sanitizeHtml } from "@/lib/sanitize";

/** YouTube video id from a watch / youtu.be / shorts / embed link, or null. */
export function youtubeId(url: string | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www\.|m\.)/, "");
    const id =
      host === "youtu.be" ? u.pathname.slice(1) : host === "youtube.com" ? (u.pathname === "/watch" ? u.searchParams.get("v") : u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1]) : null;
    return id && /^[\w-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

const attr = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** The paragraph's single child element when it has no text of its own. */
function only(p: HTMLElement, tag: string) {
  const kids = p.childNodes.filter((n) => n.nodeType !== 3 || n.rawText.trim());
  const el = kids.length === 1 ? (kids[0] as HTMLElement) : null;
  return el?.rawTagName?.toLowerCase() === tag ? el : null;
}

const videoCard = (id: string, href: string) =>
  `<div class="not-prose my-6 overflow-hidden rounded-2xl border border-line bg-ink shadow-sm"><div class="relative aspect-video">` +
  `<a class="group yt-out absolute inset-0 h-full w-full" href="${attr(href)}" rel="noopener" target="_blank">` +
  `<img alt="" class="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" loading="lazy" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg">` +
  `<span class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"></span>` +
  `<span class="absolute top-1/2 left-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-xl transition-transform group-hover:scale-110 dark:text-ink">` +
  `<svg aria-hidden="true" class="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg></span>` +
  `<span class="yt-out-label">YouTube дээр үзэх ↗</span></a></div></div>`;

/**
 * Admin-written rich text for public pages: sanitized, then
 * - a YouTube link alone in a paragraph becomes a video card,
 * - an image alone in a paragraph becomes a zoomable figure,
 * - tables get a scrolling wrapper, so wide ones don't push the page sideways.
 */
export function renderRichBody(html: string | null | undefined, zoomGroup = "content") {
  const root = parse(sanitizeHtml(html));
  for (const p of root.querySelectorAll("p")) {
    const a = only(p, "a");
    const id = a && youtubeId(a.getAttribute("href"));
    if (a && id) {
      p.replaceWith(videoCard(id, a.getAttribute("href")!));
      continue;
    }
    const img = only(p, "img");
    const src = img?.getAttribute("src");
    if (img && src) {
      const alt = img.getAttribute("alt") ?? "";
      p.replaceWith(
        `<figure class="md-figure"><button aria-label="Зургийг томруулах" class="md-zoom" data-zoom-alt="${attr(alt)}" data-zoom-group="${attr(zoomGroup)}" data-zoom-src="${attr(src)}" type="button">${img.toString()}</button></figure>`,
      );
    }
  }
  for (const t of root.querySelectorAll("table")) t.replaceWith(`<div class="md-table">${t.toString()}</div>`);
  return root.toString();
}

/** Whether the body has a video card (lists mark such guides «Видео»). */
export const hasVideo = (html: string) => parse(html).querySelectorAll("a").some((a) => youtubeId(a.getAttribute("href")));
