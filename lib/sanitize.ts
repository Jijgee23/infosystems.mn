import "server-only";
import { type HTMLElement, NodeType, parse, type Node } from "node-html-parser";

const ALLOWED: Record<string, string[]> = {
  p: [], br: [], strong: [], b: [], em: [], i: [], u: [], s: [], span: [], div: [],
  h2: [], h3: [], h4: [], blockquote: [], code: [], pre: [], hr: [],
  ul: [], ol: ["start"], li: [],
  a: ["href", "title"],
  img: ["src", "alt", "width", "height"],
  figure: [], figcaption: [],
  table: [], thead: [], tbody: [], tr: [], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"],
};
const DROP_WITH_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "form", "input", "button", "textarea", "select", "noscript", "svg", "math"]);
// Browsers read `/\host` like `//host`, so a backslash after the leading slash is off-site too.
const SAFE_URL = /^(https?:|mailto:|tel:|\/(?![/\\])|#)/i;

/** Parser options shared with lib/rich-body: only script/style/noscript keep raw text, and those are dropped. */
export const PARSE_OPTIONS = { comment: false, blockTextElements: { script: false, style: false, noscript: false } } as const;

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function render(node: Node): string {
  // Decode, then re-encode. Never pass rawText through: the parser leaves markup it can't match
  // (e.g. `<img/src=x onerror=…>`) as text, and browsers would still read it as a tag.
  if (node.nodeType === NodeType.TEXT_NODE) return escape(node.text);
  if (node.nodeType !== NodeType.ELEMENT_NODE) return "";
  const el = node as HTMLElement;
  const tag = el.rawTagName?.toLowerCase() ?? "";
  if (DROP_WITH_CONTENT.has(tag)) return "";
  const inner = el.childNodes.map(render).join("");
  const allowed = ALLOWED[tag];
  if (!allowed) return inner; // unwrap unknown tags, keep their text

  const attrs = allowed
    .map((name) => {
      const v = el.getAttribute(name);
      if (v == null) return "";
      if ((name === "href" || name === "src") && !SAFE_URL.test(v.trim())) return "";
      return ` ${name}="${escape(v)}"`;
    })
    .join("");
  const extra = tag === "a" ? ' rel="noopener nofollow" target="_blank"' : tag === "img" ? ' loading="lazy"' : "";
  if (tag === "br" || tag === "hr" || tag === "img") return `<${tag}${attrs}${extra}>`;
  return `<${tag}${attrs}${extra}>${inner}</${tag}>`;
}

/** Allowlist HTML sanitizer for rich text from the old CMS and from users. */
export function sanitizeHtml(html: string | null | undefined) {
  if (!html) return "";
  const root = parse(html, PARSE_OPTIONS);
  return root.childNodes.map(render).join("");
}

/** Plain text (textarea input) to safe paragraph HTML. */
export function textToHtml(text: string) {
  return text
    .replace(/\r\n?/g, "\n") // browsers submit textarea line breaks as CRLF
    .trim()
    .split(/\n{2,}/)
    .map((p) => `<p>${escape(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
