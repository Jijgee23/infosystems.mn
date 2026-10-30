import "server-only";
import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
  });
  return transporter;
}

export const FROM_EMAIL = process.env.FROM_EMAIL ?? "contact@infosystems.mn";
export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "contact@infosystems.mn";

/** Sends an email; logs instead when SMTP is not configured (local dev). Never throws. */
export async function sendMail(opts: { to: string; subject: string; html: string; text?: string; replyTo?: string }) {
  const tr = getTransporter();
  if (!tr) {
    console.info(`[mail] SMTP not configured; would send "${opts.subject}" to ${opts.to}`);
    return false;
  }
  try {
    await tr.sendMail({ from: FROM_EMAIL, ...opts });
    return true;
  } catch (e) {
    console.error("[mail] send failed", e);
    return false;
  }
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
