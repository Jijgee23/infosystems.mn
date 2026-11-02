"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { NOTIFY_TO, sendMail, workingHours } from "@/lib/mail";
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

const TITLE = {
  demo: "Таны демо хүсэлтийг хүлээн авлаа",
  quote: "Таны үнийн саналын хүсэлтийг хүлээн авлаа",
  feedback: "Таны санал хүсэлтийг хүлээн авлаа",
  notify: "Таныг бүртгэж авлаа",
} as const;

/**
 * One email per request, as on macs.mn: to the team inbox with the visitor in CC (their
 * confirmation, so the text addresses them) and Reply-To the visitor.
 */
async function notifyRequest(kind: keyof typeof KIND_LABEL, d: { name?: string; company?: string; phone?: string; email: string; product?: string; message?: string }) {
  const hours = await workingHours();
  const when = hours ? `ажлын цагаар (${hours})` : "ажлын 1 өдөрт багтаан";
  const intro =
    kind === "notify"
      ? `Сайн байна уу, ${d.product ?? "бүтээгдэхүүн"}-ий нээлтийн мэдээг авахаар бүртгүүлсэнд баярлалаа. Нээгдмэгц энэ хаягаар мэдэгдэнэ.`
      : `Сайн байна уу${d.name ? `, ${d.name}` : ""}. InfoSystems Mongolia-д хандсанд баярлалаа. Манай мэргэжилтэн ${when} тантай холбогдоно.`;
  const who = d.company || d.name || d.email;
  await sendMail({
    to: NOTIFY_TO,
    cc: d.email,
    replyTo: d.email,
    subject: `${KIND_LABEL[kind]} — ${who} · InfoSystems`,
    content: {
      kicker: KIND_LABEL[kind],
      title: TITLE[kind],
      intro,
      sectionTitle: "Таны илгээсэн мэдээлэл",
      fields: [
        { label: "Нэр", value: d.name },
        { label: "Байгууллага", value: d.company },
        { label: "Утас", value: d.phone },
        { label: "И-мэйл", value: d.email },
        { label: "Бүтээгдэхүүн", value: d.product },
      ],
      message: { label: "Мессеж", value: d.message },
    },
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
  await notifyRequest(d.kind, d);
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
  await notifyRequest("notify", parsed.data);
  return { ok: true, message: "Бүртгэгдлээ. Нээлтийн мэдээг тань руу илгээнэ." };
}
