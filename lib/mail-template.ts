/**
 * Email layout in the site's design (brand blue, Manrope/Inter-like system stack, rounded
 * card), rendered both as plain text and as email-client-safe HTML: tables + inline styles
 * and a PNG logo, since Gmail and Outlook ignore <style> blocks and SVG.
 * Pure: no server-only imports, so a script can render a preview.
 */

export type MailModel = {
  /** Small label above the title, e.g. «Демо хүсэлт». */
  kicker: string;
  title: string;
  intro: string;
  /** Heading over `fields`. */
  sectionTitle?: string;
  fields?: { label: string; value: string | null | undefined }[];
  /** Long free text (the visitor's message), shown in a quote box. */
  message?: { label: string; value: string | null | undefined };
  /** Already-sanitized HTML (issue content, replies). */
  bodyHtml?: string;
  button?: { label: string; url: string };
  /** Shown under the button, e.g. «1 цагийн хугацаанд хүчинтэй». */
  note?: string;
  company: string;
  contactLine: string[];
  siteUrl: string;
  footnote: string;
};

const BRAND = "#0071ce";
const BRAND_SOFT = "#e6f1fb";
const INK = "#0b1b2b";
const MUTED = "#4a5a6b";
const SUBTLE = "#66727f";
const LINE = "#e3e8ef";
const SURFACE = "#f6f8fb";
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const html = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

/** Only fields that have a value. */
const filled = (m: MailModel) => (m.fields ?? []).filter((f) => f.value?.trim());
const stripTags = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export function renderText(m: MailModel) {
  const fields = filled(m);
  return [
    m.title,
    "",
    m.intro,
    ...(m.bodyHtml ? ["", stripTags(m.bodyHtml)] : []),
    ...(fields.length ? ["", m.sectionTitle ?? "", ...fields.map((f) => `${f.label}: ${f.value!.trim()}`)] : []),
    ...(m.message?.value?.trim() ? ["", `${m.message.label}:`, m.message.value.trim()] : []),
    ...(m.button ? ["", `${m.button.label}: ${m.button.url}`] : []),
    ...(m.note ? [m.note] : []),
    "",
    "Хүндэтгэсэн,",
    m.company,
    m.contactLine.join(" · "),
    m.siteUrl,
    "",
    m.footnote,
  ].join("\n");
}

export function renderHtml(m: MailModel) {
  const rows = filled(m)
    .map(
      (f, i) => `
              <tr>
                <td style="padding:11px 16px;${i ? `border-top:1px solid ${LINE};` : ""}color:${SUBTLE};font-size:13px;width:38%;vertical-align:top;">${esc(f.label)}</td>
                <td style="padding:11px 16px;${i ? `border-top:1px solid ${LINE};` : ""}color:${INK};font-size:14px;font-weight:600;vertical-align:top;">${html(f.value!.trim())}</td>
              </tr>`,
    )
    .join("");

  const fieldsBlock = rows
    ? `
        <tr><td style="padding:24px 32px 0;">
          ${m.sectionTitle ? `<p style="margin:0 0 10px;color:${INK};font-size:14px;font-weight:700;">${esc(m.sectionTitle)}</p>` : ""}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${LINE};border-radius:14px;border-collapse:separate;overflow:hidden;">${rows}
          </table>
        </td></tr>`
    : "";

  const messageBlock = m.message?.value?.trim()
    ? `
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 8px;color:${SUBTLE};font-size:13px;">${esc(m.message.label)}</p>
          <div style="background:${SURFACE};border-left:3px solid ${BRAND};border-radius:10px;padding:14px 16px;color:${INK};font-size:14px;line-height:1.65;">${html(m.message.value.trim())}</div>
        </td></tr>`
    : "";

  const bodyBlock = m.bodyHtml
    ? `
        <tr><td style="padding:20px 32px 0;">
          <div style="background:${SURFACE};border-radius:12px;padding:16px 18px;color:${INK};font-size:14px;line-height:1.65;">${m.bodyHtml}</div>
        </td></tr>`
    : "";

  const buttonBlock = m.button
    ? `
        <tr><td style="padding:26px 32px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="border-radius:12px;background:${BRAND};">
              <a href="${esc(m.button.url)}" style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">${esc(m.button.label)} &rarr;</a>
            </td>
          </tr></table>
          ${m.note ? `<p style="margin:12px 0 0;color:${SUBTLE};font-size:12px;line-height:1.6;">${html(m.note)}</p>` : ""}
          <p style="margin:10px 0 0;color:${SUBTLE};font-size:12px;line-height:1.6;word-break:break-all;">Товч ажиллахгүй бол: <a href="${esc(m.button.url)}" style="color:${BRAND};">${esc(m.button.url)}</a></p>
        </td></tr>`
    : "";

  return `<!doctype html>
<html lang="mn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(m.title)}</title>
</head>
<body style="margin:0;padding:0;background:${SURFACE};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(m.intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SURFACE};font-family:${FONT};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td style="padding:0 4px 18px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle;"><img src="${m.siteUrl}/email-logo.png" width="36" height="36" alt="InfoSystems" style="display:block;border:0;border-radius:10px;"></td>
          <td style="vertical-align:middle;padding-left:10px;line-height:1;">
            <div style="font-size:17px;font-weight:800;color:${INK};letter-spacing:-.01em;">InfoSystems</div>
            <div style="margin-top:3px;font-size:10px;font-weight:600;color:${MUTED};letter-spacing:.22em;text-transform:uppercase;">Mongolia</div>
          </td>
        </tr></table>
      </td></tr>
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid ${LINE};border-radius:20px;border-collapse:separate;overflow:hidden;">
          <tr><td style="padding:30px 32px 0;">
            <span style="display:inline-block;padding:5px 11px;border-radius:999px;background:${BRAND_SOFT};color:${BRAND};font-size:12px;font-weight:700;">${esc(m.kicker)}</span>
            <h1 style="margin:14px 0 0;color:${INK};font-size:23px;line-height:1.3;font-weight:800;letter-spacing:-.02em;">${esc(m.title)}</h1>
            <p style="margin:12px 0 0;color:${MUTED};font-size:15px;line-height:1.65;">${html(m.intro)}</p>
          </td></tr>${bodyBlock}${fieldsBlock}${messageBlock}${buttonBlock}
          <tr><td style="padding:28px 32px 30px;">
            <p style="margin:0;color:${MUTED};font-size:14px;line-height:1.6;">Хүндэтгэсэн,<br><strong style="color:${INK};">${esc(m.company)}</strong></p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:18px 8px 0;color:${SUBTLE};font-size:12px;line-height:1.7;text-align:center;">
        ${m.contactLine.map(esc).join(" &nbsp;·&nbsp; ")}${m.contactLine.length ? "<br>" : ""}
        <a href="${m.siteUrl}" style="color:${BRAND};text-decoration:none;font-weight:600;">${esc(m.siteUrl.replace(/^https?:\/\//, ""))}</a>
        <p style="margin:10px 0 0;color:#8a96a3;font-size:11px;">${esc(m.footnote)}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
