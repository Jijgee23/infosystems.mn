import "server-only";
import nodemailer from "nodemailer";
import { getCompany } from "@/lib/data/company";
import { renderHtml, renderText, type MailModel } from "@/lib/mail-template";

/*
 * Same setup as macs.mn: one SMTP account (no_reply@infosystems.mn on smtp.mail.mn:465),
 * every message rendered from one template (lib/mail-template) as HTML + plain text.
 * Requests from the site go to NOTIFY_TO with Reply-To the visitor. The visitor gets a separate
 * fixed-text confirmation: their address is unverified, so nothing they typed is ever sent to it
 * (otherwise the form relays arbitrary text from our domain to any inbox).
 *
 * Env: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, NOTIFY_TO.
 * The older names SMTP_PASSWORD / FROM_EMAIL / NOTIFY_EMAIL still work.
 */

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function transport() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD } : undefined,
    // nodemailer waits up to 2 min to connect and 10 min on a stalled socket by default;
    // fail fast instead, so a dead SMTP server can't hang requests.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

export const FROM = process.env.SMTP_FROM ?? process.env.FROM_EMAIL ?? "InfoSystems Mongolia <no_reply@infosystems.mn>";
/** The team inbox that receives every request from the site. */
export const NOTIFY_TO = process.env.NOTIFY_TO ?? process.env.NOTIFY_EMAIL ?? "contact@infosystems.mn";
export const SITE_URL = (process.env.SITE_URL ?? "https://infosystems.mn").replace(/\/$/, "");

/** The parts of the layout every message shares: company name, contacts, site link. */
async function frame() {
  const c = await getCompany();
  const phone = c.phones[0]?.value;
  const email = c.emails[0]?.value;
  return {
    company: c.legalName || c.name,
    contactLine: [phone && /^\d{8}$/.test(phone) ? `${phone.slice(0, 4)}-${phone.slice(4)}` : phone, email].filter((v): v is string => !!v),
    siteUrl: SITE_URL,
    hours: c.workingHours,
  };
}

export type MailContent = Omit<MailModel, "company" | "contactLine" | "siteUrl" | "footnote"> & { footnote?: string };

/**
 * Renders and sends one message. Logs instead when SMTP is not configured (local dev).
 * Never throws: the request it reports on is already saved.
 */
export async function sendMail(opts: { to: string | string[]; cc?: string | string[]; replyTo?: string | string[]; subject: string; content: MailContent }) {
  const f = await frame();
  const model: MailModel = {
    ...opts.content,
    company: f.company,
    contactLine: f.contactLine,
    siteUrl: f.siteUrl,
    footnote: opts.content.footnote ?? "Энэ мэйл автоматаар илгээгдсэн. Асуух зүйл байвал дээрх утас эсвэл имэйлээр холбогдоно уу.",
  };
  const tr = transport();
  if (!tr) {
    console.info(`[mail] SMTP not configured; would send "${opts.subject}" to ${[opts.to].flat().join(", ")}`);
    return false;
  }
  try {
    await tr.sendMail({ from: FROM, to: opts.to, cc: opts.cc, replyTo: opts.replyTo, subject: opts.subject, text: renderText(model), html: renderHtml(model) });
    return true;
  } catch (e) {
    console.error(`[mail] failed to send "${opts.subject}"`, e);
    return false;
  }
}

/** Working hours for «we'll contact you during business hours» copy. */
export async function workingHours() {
  return (await frame()).hours;
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
