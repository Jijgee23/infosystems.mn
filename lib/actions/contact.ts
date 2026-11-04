"use server";

import { after } from "next/server";
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

const SAVE_FAILED = "Хүсэлтийг хадгалж чадсангүй. Түр хүлээгээд дахин оролдоно уу, эсвэл утсаар холбогдоно уу.";

/**
 * Two emails per request: the full details to the team inbox (Reply-To the visitor), and a
 * fixed-text confirmation to the visitor. The visitor's address is unverified, so the
 * confirmation carries nothing they typed — otherwise anyone could use the form to send
 * their own text from our domain to any inbox.
 * Sent after the response, so a slow SMTP server never holds up the form.
 */
function notifyRequest(kind: keyof typeof KIND_LABEL, d: { name?: string; company?: string; phone?: string; email: string; product?: string; message?: string }) {
  after(async () => {
    const who = d.company || d.name || d.email;
    await sendMail({
      to: NOTIFY_TO,
      replyTo: d.email,
      subject: `${KIND_LABEL[kind]} — ${who} · InfoSystems`,
      content: {
        kicker: KIND_LABEL[kind],
        title: `Сайтаас шинэ хүсэлт ирлээ: ${KIND_LABEL[kind]}`,
        intro: "Доорх мэдээллийг шалгаад харилцагчтай холбогдоно уу. Энэ мэйлд хариулахад харилцагч руу очно.",
        sectionTitle: "Илгээсэн мэдээлэл",
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

    const hours = await workingHours();
    const when = hours ? `ажлын цагаар (${hours})` : "ажлын 1 өдөрт багтаан";
    await sendMail({
      to: d.email,
      subject: `${TITLE[kind]} · InfoSystems`,
      content: {
        kicker: KIND_LABEL[kind],
        title: TITLE[kind],
        intro:
          kind === "notify"
            ? "Сайн байна уу. Бүтээгдэхүүний нээлтийн мэдээг авахаар бүртгүүлсэнд баярлалаа. Нээгдмэгц энэ хаягаар мэдэгдэнэ."
            : `Сайн байна уу. InfoSystems Mongolia-д хандсанд баярлалаа. Манай мэргэжилтэн ${when} тантай холбогдоно.`,
        note: "Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ захидлыг үл тоомсорлоно уу.",
      },
    });
  });
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: bots fill every field.
  if (formData.get("website")) return { ok: true, message: "Хүсэлтийг хүлээн авлаа. Бид тантай удахгүй холбогдоно." };

  // Validate first, so a mistyped phone number doesn't use up the rate limit.
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: fieldErrors(parsed.error) };
  if (await isRateLimited("contact", 5, 10 * 60_000))
    return { ok: false, message: "Хэт олон хүсэлт илгээлээ. Түр хүлээгээд дахин оролдоно уу." };
  const d = parsed.data;

  try {
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
  } catch (e) {
    console.error("[contact] failed to save request", e);
    return { ok: false, message: SAVE_FAILED };
  }
  notifyRequest(d.kind, d);
  return { ok: true, message: "Хүсэлтийг хүлээн авлаа. Бид ажлын 1 өдөрт багтаан тантай холбогдоно." };
}

const NotifySchema = z.object({ email: z.email("И-мэйл хаяг буруу байна").max(200), product: z.string().trim().max(120) });

/** "Notify me at launch" sign-up (MACS Micro). */
export async function submitNotify(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true, message: "Бүртгэгдлээ." };
  const parsed = NotifySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message, errors: fieldErrors(parsed.error) };
  if (await isRateLimited("notify", 5, 10 * 60_000)) return { ok: false, message: "Түр хүлээгээд дахин оролдоно уу." };
  try {
    await db.contactRequest.create({ data: { kind: "notify", email: parsed.data.email, product: parsed.data.product } });
  } catch (e) {
    console.error("[contact] failed to save notify sign-up", e);
    return { ok: false, message: SAVE_FAILED };
  }
  notifyRequest("notify", parsed.data);
  return { ok: true, message: "Бүртгэгдлээ. Нээлтийн мэдээг тань руу илгээнэ." };
}
