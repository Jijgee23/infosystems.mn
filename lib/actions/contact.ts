"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { escapeHtml, NOTIFY_EMAIL, sendMail } from "@/lib/mail";
import { isRateLimited } from "@/lib/rate-limit";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string>; code?: string; values?: Record<string, string> } | null;

const phone = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s-]{6,19}$/, "Утасны дугаар буруу байна");

const ContactSchema = z.object({
  kind: z.enum(["demo", "quote", "feedback"]).default("demo"),
  name: z.string().trim().min(2, "Нэрээ оруулна уу").max(120),
  company: z.string().trim().max(200).optional(),
  phone,
  email: z.email("И-мэйл хаяг буруу байна").max(200),
  product: z.string().trim().max(120).optional(),
  message: z.string().trim().max(3000).optional(),
});

const KIND_LABEL = { demo: "Демо хүсэлт", quote: "Үнийн санал", feedback: "Санал хүсэлт", notify: "Мэдэгдэл авах" } as const;

function fieldErrors(error: z.ZodError) {
  return Object.fromEntries(error.issues.map((i) => [String(i.path[0]), i.message]));
}

async function notifyStaff(kind: keyof typeof KIND_LABEL, fields: Record<string, string | undefined>, replyTo?: string) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#66727f">${k}</td><td>${escapeHtml(v!).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  await sendMail({
    to: NOTIFY_EMAIL,
    replyTo,
    subject: `[infosystems.mn] ${KIND_LABEL[kind]}${fields["Нэр"] ? ` — ${fields["Нэр"]}` : ""}`,
    html: `<h2 style="font-family:sans-serif">${KIND_LABEL[kind]}</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
  });
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: bots fill every field.
  if (formData.get("website")) return { ok: true, message: "Хүсэлтийг хүлээн авлаа. Бид тантай удахгүй холбогдоно." };
  if (await isRateLimited("contact", 5, 10 * 60_000))
    return { ok: false, message: "Хэт олон хүсэлт илгээлээ. Түр хүлээгээд дахин оролдоно уу." };

  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  await db.contactRequest.create({
    data: {
      kind: d.kind,
      name: d.name,
      company: d.company || null,
      phone: d.phone,
      email: d.email,
      product: d.product || null,
      message: d.message || null,
    },
  });
  await notifyStaff(
    d.kind,
    { Нэр: d.name, Байгууллага: d.company, Утас: d.phone, "И-мэйл": d.email, Бүтээгдэхүүн: d.product, Мессеж: d.message },
    d.email,
  );
  return { ok: true, message: "Хүсэлтийг хүлээн авлаа. Бид ажлын 1 өдөрт багтаан тантай холбогдоно." };
}

const NotifySchema = z.object({ email: z.email("И-мэйл хаяг буруу байна").max(200), product: z.string().trim().max(120) });

/** "Notify me at launch" sign-up (MACS Micro). */
export async function submitNotify(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true, message: "Бүртгэгдлээ." };
  if (await isRateLimited("notify", 5, 10 * 60_000)) return { ok: false, message: "Түр хүлээгээд дахин оролдоно уу." };
  const parsed = NotifySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message, errors: fieldErrors(parsed.error) };
  await db.contactRequest.create({ data: { kind: "notify", email: parsed.data.email, product: parsed.data.product } });
  await notifyStaff("notify", { "И-мэйл": parsed.data.email, Бүтээгдэхүүн: parsed.data.product });
  return { ok: true, message: "Бүртгэгдлээ. Нээлтийн мэдээг тань руу илгээнэ." };
}
