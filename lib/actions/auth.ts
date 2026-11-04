"use server";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { createSession, destroySession, isStaffRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { NOTIFY_TO, sendMail } from "@/lib/mail";
import { attemptLimiter, isRateLimited } from "@/lib/rate-limit";
import { COMPANY_REGISTER, normalizePersonalRegister, PERSONAL_REGISTER } from "@/lib/register-number";
import type { FormState } from "./contact";

const SITE_URL = process.env.SITE_URL ?? "https://infosystems.mn";
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/**
 * Only allow redirects back into this site, under `area` (/portal or /admin).
 * Browsers read `/\evil.com` as `//evil.com` and drop tabs/newlines, so plain prefix checks are not
 * enough: reject backslashes and control characters, then parse and require our own origin.
 */
function safeNext(next: unknown, area: "/portal" | "/admin") {
  if (typeof next !== "string" || !next.startsWith("/") || /[\\\u0000-\u001f\u007f]/.test(next)) return area;
  try {
    const u = new URL(next, "http://local.invalid");
    if (u.origin !== "http://local.invalid") return area;
    if (u.pathname !== area && !u.pathname.startsWith(`${area}/`)) return area;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return area;
  }
}

const lockedMessage = (minutes: number) => `Хэт олон удаа буруу оролдлоо. ${minutes} минутын дараа дахин оролдоно уу.`;

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
      message: lockedMessage(attempts.retryAfterMinutes()),
    };

  const password = String(formData.get("password") ?? "");
  const errors: Record<string, string> = {};
  if (!email) errors.email = "И-мэйл хаягаа оруулна уу";
  else if (!z.email().safeParse(email).success) errors.email = "И-мэйл хаяг буруу байна";
  if (!password) errors.password = "Нууц үгээ оруулна уу";
  if (Object.keys(errors).length) return { ok: false, message: "", errors, values };
  // Counted before the password check; reset() below clears it on success.
  if (!attempts.take()) return { ok: false, code: "locked", values, message: lockedMessage(attempts.retryAfterMinutes()) };

  const user = await db.user.findUnique({ where: { email } });

  const valid = await checkPassword(password, user?.passwordHash);
  // Same message for staff accounts, so this page doesn't reveal who is staff.
  if (!user || !valid || isStaffRole(user.role)) {
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
      message: lockedMessage(attempts.retryAfterMinutes()),
    };

  const password = String(formData.get("password") ?? "");
  const errors: Record<string, string> = {};
  if (!email) errors.email = "И-мэйл хаягаа оруулна уу";
  else if (!z.email().safeParse(email).success) errors.email = "И-мэйл хаяг буруу байна";
  if (!password) errors.password = "Нууц үгээ оруулна уу";
  if (Object.keys(errors).length) return { ok: false, message: "", errors, values };
  // Counted before the password check; reset() below clears it on success.
  if (!attempts.take()) return { ok: false, code: "locked", values, message: lockedMessage(attempts.retryAfterMinutes()) };

  const user = await db.user.findUnique({ where: { email } });
  const valid = await checkPassword(password, user?.passwordHash);
  // One message for every failure, so the form never reveals which emails are staff accounts.
  if (!user || !valid || !isStaffRole(user.role) || user.blocked || !user.adminConfirmed) {
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
  redirect(safeNext(formData.get("next"), "/admin"));
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
  const isCompany = d.customerType === "company";
  // After the response, so a slow SMTP server doesn't hold up the form.
  after(() => sendMail({
    to: NOTIFY_TO,
    replyTo: email,
    subject: `Шинэ бүртгэл — ${isCompany ? d.companyName : d.username} · InfoSystems`,
    content: {
      kicker: "Шинэ бүртгэл",
      title: "Шинэ харилцагч баталгаажуулалт хүлээж байна",
      intro: "Харилцагчийн буланд шинэ бүртгэл ирлээ. Шалгаад баталгаажуулна уу.",
      sectionTitle: "Бүртгэлийн мэдээлэл",
      fields: [
        { label: "Төрөл", value: isCompany ? "Байгууллага" : "Хувь хүн" },
        { label: "Байгууллага", value: isCompany ? d.companyName : null },
        { label: "Регистр", value: isCompany ? String(d.companyRegister) : d.personalRegister },
        { label: "Нэр", value: d.username },
        { label: "И-мэйл", value: email },
      ],
      button: { label: "Админ хэсэгт харах", url: `${SITE_URL}/admin/users` },
      footnote: "Энэ мэйлийг infosystems.mn сайт автоматаар илгээв.",
    },
  }));
  return { ok: true, message: "Бүртгэл хүлээн авлаа. Манай ажилтан баталгаажуулсны дараа и-мэйлээр мэдэгдэнэ." };
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const done: FormState = { ok: true, message: "Хэрэв энэ и-мэйл бүртгэлтэй бол нууц үг сэргээх холбоос илгээгдлээ." };
  if (await isRateLimited("reset", 5, 60 * 60_000)) return done;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return done;

  // Everything that only happens for a real account runs after the response,
  // so response time doesn't reveal which emails are registered.
  after(async () => {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.blocked) return;

    const token = randomBytes(32).toString("base64url");
    await db.user.update({
      where: { id: user.id },
      data: { resetToken: hashToken(token), resetTokenExpires: new Date(Date.now() + 60 * 60_000) },
    });
    const link = `${SITE_URL}/portal/reset-password?token=${token}`;
    await sendMail({
      to: user.email,
    subject: "Нууц үг сэргээх · InfoSystems",
    content: {
      kicker: "Харилцагчийн булан",
      title: "Нууц үгээ шинэчлэх",
      intro: "Сайн байна уу. Таны бүртгэлийн нууц үгийг сэргээх хүсэлт ирлээ. Доорх товчоор орж шинэ нууц үг тохируулна уу.",
      button: { label: "Нууц үг шинэчлэх", url: link },
      note: "Холбоос 1 цагийн хугацаанд хүчинтэй. Хэрэв та хүсэлт илгээгээгүй бол энэ захидлыг үл тоомсорлоно уу.",
      },
    });
  });
  return done;
}

const ResetSchema = z
  .object({ token: z.string().min(10), password: z.string().min(8, "Нууц үг хамгийн багадаа 8 тэмдэгт байна").max(200), confirm: z.string() })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Нууц үг таарахгүй байна" });

export async function resetPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = ResetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  // One conditional write: the token is checked and consumed together, so it can only be used once
  // even when two requests race. Blocked accounts can't finish a reset that was sent earlier.
  const { count } = await db.user.updateMany({
    where: { resetToken: hashToken(parsed.data.token), resetTokenExpires: { gt: new Date() }, blocked: false },
    data: { passwordHash, resetToken: null, resetTokenExpires: null, passwordChangedAt: new Date() },
  });
  if (!count) return { ok: false, message: "Холбоос хүчингүй эсвэл хугацаа нь дууссан байна. Дахин хүсэлт илгээнэ үү." };
  return { ok: true, message: "Нууц үг шинэчлэгдлээ. Одоо нэвтэрч болно." };
}
