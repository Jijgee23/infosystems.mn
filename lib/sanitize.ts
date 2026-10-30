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
const SAFE_URL = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function render(node: Node): string {
  if (node.nodeType === NodeType.TEXT_NODE) return node.rawText; // already entity-encoded by the source
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
  const root = parse(html, { comment: false, blockTextElements: { script: false, style: false, noscript: false, pre: true } });
  return root.childNodes.map(render).join("");
}

/** Plain text (textarea input) to safe paragraph HTML. */
export function textToHtml(text: string) {
  return text
    .trim()
    .split(/\n{2,}/)
    .map((p) => `<p>${escape(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
