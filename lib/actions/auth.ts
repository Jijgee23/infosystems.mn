"use server";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, isStaffRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { escapeHtml, NOTIFY_EMAIL, sendMail } from "@/lib/mail";
import { attemptLimiter, isRateLimited } from "@/lib/rate-limit";
import { COMPANY_REGISTER, normalizePersonalRegister, PERSONAL_REGISTER } from "@/lib/register-number";
import type { FormState } from "./contact";

const SITE_URL = process.env.SITE_URL ?? "https://infosystems.mn";
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Only allow redirects back into this site. */
const safeNext = (next: unknown, fallback: string) =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;

// Compared against when the email is unknown, so a miss takes as long as a wrong password
// and response timing doesn't reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString("hex"), 10);
const checkPassword = (password: string, hash: string | null | undefined) => bcrypt.compare(password, hash || DUMMY_HASH).then((ok) => ok && !!hash);

const BAD_CREDENTIALS = "Нэвтрэх нэр эсвэл нууц үг буруу байна.";
// Sign-in limiters count only failed attempts, so staff signing in several times a day are never locked out.

/** Customer sign-in (/portal/login): email + password. Staff accounts are rejected here. */
export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  // Sent back so the field stays filled even when the form was posted before hydration.
  // The password is never echoed back.
  const values = { email };
  const attempts = await attemptLimiter("login", 10, 15 * 60_000);
  if (attempts.blocked())
    return {
      ok: false,
      code: "locked",
      values,
      message: `Хэт олон удаа буруу оролдлоо. ${attempts.retryAfterMinutes()} минутын дараа дахин оролдоно уу.`,
    };

  const password = String(formData.get("password") ?? "");
  const errors: Record<string, string> = {};
  if (!email) errors.email = "И-мэйл хаягаа оруулна уу";
  else if (!z.email().safeParse(email).success) errors.email = "И-мэйл хаяг буруу байна";
  if (!password) errors.password = "Нууц үгээ оруулна уу";
  if (Object.keys(errors).length) return { ok: false, message: "", errors, values };

  const user = await db.user.findUnique({ where: { email } });

  const valid = await checkPassword(password, user?.passwordHash);
  // Same message for staff accounts, so this page doesn't reveal who is staff.
  if (!user || !valid || isStaffRole(user.role)) {
    attempts.fail();
    const left = attempts.remaining();
    return {
      ok: false,
      code: left === 0 ? "locked" : "invalid",
      values,
      message:
        left === 0
          ? `${BAD_CREDENTIALS} Хэт олон удаа буруу оролдсон тул ${attempts.retryAfterMinutes()} минут түгжигдлээ.`
          : `${BAD_CREDENTIALS}${left <= 3 ? ` ${left} оролдлого үлдлээ.` : ""}`,
    };
  }
  attempts.reset();
  if (user.blocked) return { ok: false, code: "blocked", values, message: "Таны эрх хаагдсан байна. Бидэнтэй холбогдоно уу." };
  if (!user.adminConfirmed)
    return {
      ok: false,
      code: "pending",
      values,
      message: "Таны бүртгэлийг манай ажилтан хараахан баталгаажуулаагүй байна. Баталгаажмагц и-мэйлээр мэдэгдэнэ.",
    };

  await createSession(user.id, "customer");
  redirect(safeNext(formData.get("next"), "/portal"));
}

/** Staff sign-in (/admin/login): email + password, admin and employee roles only. */
export async function staffLogin(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const values = { email };
  const attempts = await attemptLimiter("staff-login", 5, 15 * 60_000);
  if (attempts.blocked())
    return {
      ok: false,
      code: "locked",
      values,
      message: `Хэт олон удаа буруу оролдлоо. ${attempts.retryAfterMinutes()} минутын дараа дахин оролдоно уу.`,
    };

  const password = String(formData.get("password") ?? "");
  const errors: Record<string, string> = {};
  if (!email) errors.email = "И-мэйл хаягаа оруулна уу";
  else if (!z.email().safeParse(email).success) errors.email = "И-мэйл хаяг буруу байна";
  if (!password) errors.password = "Нууц үгээ оруулна уу";
  if (Object.keys(errors).length) return { ok: false, message: "", errors, values };

  const user = await db.user.findUnique({ where: { email } });
  const valid = await checkPassword(password, user?.passwordHash);
  // One message for every failure, so the form never reveals which emails are staff accounts.
  if (!user || !valid || !isStaffRole(user.role) || user.blocked || !user.adminConfirmed) {
    attempts.fail();
    const left = attempts.remaining();
    return {
      ok: false,
      code: left === 0 ? "locked" : "invalid",
      values,
      message:
        left === 0
          ? `И-мэйл эсвэл нууц үг буруу байна. Хэт олон удаа буруу оролдсон тул ${attempts.retryAfterMinutes()} минут түгжигдлээ.`
          : `И-мэйл эсвэл нууц үг буруу байна.${left <= 3 ? ` ${left} оролдлого үлдлээ.` : ""}`,
    };
  }
  attempts.reset();

  await createSession(user.id, "staff");
  const next = safeNext(formData.get("next"), "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await destroySession("customer");
  redirect("/portal/login");
}

export async function staffLogout() {
  await destroySession("staff");
  redirect("/admin/login");
}

const passwordFields = {
  email: z.email("И-мэйл хаяг буруу байна").max(200),
  password: z.string().min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байна").max(200),
  confirm: z.string(),
};
const RegisterSchema = z
  .discriminatedUnion("customerType", [
    z.object({
      customerType: z.literal("company"),
      companyRegister: z.string().trim().regex(COMPANY_REGISTER, "Регистрийн дугаар 7 оронтой тоо байна"),
      companyName: z.string().trim().min(2, "Байгууллагын нэрээ оруулна уу").max(200),
      username: z.string().trim().min(2, "Холбогдох хүний нэрээ оруулна уу").max(120),
      ...passwordFields,
    }),
    z.object({
      customerType: z.literal("individual"),
      personalRegister: z
        .string()
        .transform(normalizePersonalRegister)
        .pipe(z.string().regex(PERSONAL_REGISTER, "Регистрийн дугаар 2 кирилл үсэг, 8 тоо байна (жишээ нь УБ12345678)")),
      username: z.string().trim().min(2, "Овог нэрээ оруулна уу").max(120),
      ...passwordFields,
    }),
  ])
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Нууц үг таарахгүй байна" });

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true, message: "Бүртгэл хүлээн авлаа." };
  // Sent back so the fields stay filled after an error; passwords are never echoed back.
  const values = Object.fromEntries(
    (["customerType", "companyRegister", "personalRegister", "companyName", "username", "email"] as const).map((k) => [k, String(formData.get(k) ?? "")]),
  );
  const parsed = RegisterSchema.safeParse({ ...Object.fromEntries(formData), customerType: formData.get("customerType") === "individual" ? "individual" : "company" });
  if (!parsed.success)
    return {
      ok: false,
      message: "Талбаруудаа шалгана уу.",
      values,
      // First issue per field wins (zod lists them in schema order).
      errors: Object.fromEntries(parsed.error.issues.reverse().map((i) => [String(i.path[0]), i.message])),
    };
  const d = parsed.data;
  const email = d.email.toLowerCase();
  const registerWhere =
    d.customerType === "company" ? { companyRegister: BigInt(d.companyRegister) } : { personalRegister: d.personalRegister };

  // Counted only for valid submissions, so fixing typos never locks anyone out.
  if (await isRateLimited("register", 5, 60 * 60_000)) return { ok: false, values, message: "Түр хүлээгээд дахин оролдоно уу." };
  const existing = await db.user.findFirst({ where: { OR: [{ email }, registerWhere] }, select: { id: true } });
  if (existing) return { ok: false, code: "exists", values, message: "Энэ и-мэйл эсвэл регистрийн дугаараар бүртгэл үүссэн байна. Нэвтрэх эсвэл нууц үгээ сэргээнэ үү." };

  await db.user.create({
    data: {
      username: d.username,
      email,
      customerType: d.customerType,
      companyName: d.customerType === "company" ? d.companyName : null,
      ...registerWhere,
      passwordHash: await bcrypt.hash(d.password, 10),
      passwordChangedAt: new Date(),
    },
  });
  const who =
    d.customerType === "company"
      ? `<b>${escapeHtml(d.companyName)}</b> (байгууллага, РД ${d.companyRegister})<br>${escapeHtml(d.username)}`
      : `<b>${escapeHtml(d.username)}</b> (хувь хүн, РД ${escapeHtml(d.personalRegister)})`;
  await sendMail({
    to: NOTIFY_EMAIL,
    subject: `[infosystems.mn] Шинэ бүртгэл — ${d.customerType === "company" ? d.companyName : d.username}`,
    html: `<p>Шинэ харилцагч бүртгүүлж, баталгаажуулалт хүлээж байна.</p><p>${who} · ${escapeHtml(email)}</p><p><a href="${SITE_URL}/admin/users">Админ хэсэгт харах</a></p>`,
  });
  return { ok: true, message: "Бүртгэл хүлээн авлаа. Манай ажилтан баталгаажуулсны дараа и-мэйлээр мэдэгдэнэ." };
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const done: FormState = { ok: true, message: "Хэрэв энэ и-мэйл бүртгэлтэй бол нууц үг сэргээх холбоос илгээгдлээ." };
  if (await isRateLimited("reset", 5, 60 * 60_000)) return done;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = email ? await db.user.findUnique({ where: { email } }) : null;
  if (!user || user.blocked) return done;

  const token = randomBytes(32).toString("base64url");
  await db.user.update({
    where: { id: user.id },
    data: { resetToken: hashToken(token), resetTokenExpires: new Date(Date.now() + 60 * 60_000) },
  });
  const link = `${SITE_URL}/portal/reset-password?token=${token}`;
  await sendMail({
    to: user.email,
    subject: "infosystems.mn — нууц үг сэргээх",
    html: `<p>Сайн байна уу,</p><p>Нууц үгээ шинэчлэхийн тулд доорх холбоосоор орно уу (1 цагийн хугацаанд хүчинтэй):</p><p><a href="${link}">${link}</a></p><p>Хэрэв та хүсэлт илгээгээгүй бол энэ захидлыг үл тоомсорлоно уу.</p>`,
  });
  return done;
}

const ResetSchema = z
  .object({ token: z.string().min(10), password: z.string().min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байна").max(200), confirm: z.string() })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Нууц үг таарахгүй байна" });

export async function resetPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = ResetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const user = await db.user.findFirst({
    where: { resetToken: hashToken(parsed.data.token), resetTokenExpires: { gt: new Date() } },
    select: { id: true },
  });
  if (!user) return { ok: false, message: "Холбоос хүчингүй эсвэл хугацаа нь дууссан байна. Дахин хүсэлт илгээнэ үү." };
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.password, 10), resetToken: null, resetTokenExpires: null, passwordChangedAt: new Date() },
  });
  return { ok: true, message: "Нууц үг шинэчлэгдлээ. Одоо нэвтэрч болно." };
}
