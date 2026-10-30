"use server";

import { idParam } from "@/lib/ids";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionUser, isStaff, LOGIN_PATH, type Realm } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { escapeHtml, NOTIFY_EMAIL, sendMail } from "@/lib/mail";
import { textToHtml } from "@/lib/sanitize";
import fs from "node:fs/promises";
import { filesFrom, filePath, IMAGE_TYPES, DOC_TYPES, saveUpload, UploadError } from "@/lib/uploads";
import type { FormState } from "./contact";

const SITE_URL = process.env.SITE_URL ?? "https://infosystems.mn";

const IssueSchema = z.object({
  productId: z.string().transform((v) => idParam(v) ?? undefined).optional(),
  title: z.string().trim().min(3, "Гарчиг оруулна уу").max(200),
  content: z.string().trim().min(5, "Асуудлаа дэлгэрэнгүй бичнэ үү").max(10_000),
});

export async function createIssue(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getSessionUser("customer");
  if (!user) redirect(LOGIN_PATH.customer);

  const parsed = IssueSchema.safeParse({ productId: formData.get("productId") ?? "", title: formData.get("title"), content: formData.get("content") });
  if (!parsed.success)
    return { ok: false, message: "Талбаруудаа шалгана уу.", errors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  const { productId, title, content } = parsed.data;

  // Customers may only file issues for products assigned to them.
  if (productId) {
    const owns = await db.userProduct.findUnique({ where: { userId_productId: { userId: user.id, productId } } });
    if (!owns) return { ok: false, message: "Бүтээгдэхүүн сонголт буруу байна." };
  }

  const uploads = filesFrom(formData, "attachments");
  if (uploads.length > 5) return { ok: false, message: "Хамгийн ихдээ 5 файл хавсаргана." };
  let saved;
  try {
    saved = await Promise.all(uploads.map((f) => saveUpload(f, { types: [...IMAGE_TYPES, ...DOC_TYPES], private: true })));
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, message: e.message };
    throw e;
  }

  const issue = await db.productIssue.create({
    data: {
      title,
      content: textToHtml(content),
      productId: productId ?? null,
      userId: user.id,
      attachments: { create: saved.map((f) => ({ fileId: f.id })) },
    },
    select: { id: true },
  });

  await sendMail({
    to: NOTIFY_EMAIL,
    subject: `[infosystems.mn] Шинэ асуудал — ${user.companyName ?? user.username}`,
    html: `<p><b>${escapeHtml(title)}</b></p>${textToHtml(content)}<p><a href="${SITE_URL}/admin/issues/${issue.id}">Админ хэсэгт харах</a></p>`,
  });
  redirect(`/portal/issues/${issue.id}`);
}

/** Reply from the portal (realm "customer") or the admin (realm "staff"); bound by the page. */
export async function replyToIssue(realm: Realm, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getSessionUser(realm === "staff" ? "staff" : "customer");
  if (!user) redirect(LOGIN_PATH[realm === "staff" ? "staff" : "customer"]);
  const issueId = idParam(formData.get("issueId"));
  const content = String(formData.get("content") ?? "").trim();
  if (content.length < 2) return { ok: false, message: "Хариултаа бичнэ үү." };
  if (content.length > 10_000) return { ok: false, message: "Хэт урт байна." };

  const issue = issueId ? await db.productIssue.findUnique({ where: { id: issueId }, include: { user: true } }) : null;
  const staff = isStaff(user);
  if (!issueId || !issue || (!staff && issue.userId !== user.id)) return { ok: false, message: "Асуудал олдсонгүй." };

  await db.issueAnswer.create({ data: { issueId, userId: user.id, content: textToHtml(content) } });
  // A customer reply reopens the thread for staff.
  await db.productIssue.update({
    where: { id: issueId },
    data: staff ? { updatedAt: new Date() } : { seen: false, resolved: false, updatedAt: new Date() },
  });

  if (staff && issue.user?.email) {
    await sendMail({
      to: issue.user.email,
      subject: `infosystems.mn — "${issue.title}" асуудалд хариулт ирлээ`,
      html: `${textToHtml(content)}<p><a href="${SITE_URL}/portal/issues/${issueId}">Харилцагчийн булан дээр харах</a></p>`,
    });
  } else if (!staff) {
    await sendMail({
      to: NOTIFY_EMAIL,
      subject: `[infosystems.mn] Асуудалд нэмэлт — ${issue.title}`,
      html: `${textToHtml(content)}<p><a href="${SITE_URL}/admin/issues/${issueId}">Админ хэсэгт харах</a></p>`,
    });
  }
  refresh();
  return { ok: true, message: "" };
}

/** Staff: toggle resolved. */
export async function setIssueResolved(issueId: string, resolved: boolean) {
  const user = await getSessionUser("staff");
  if (!isStaff(user)) throw new Error("Forbidden");
  await db.productIssue.update({ where: { id: issueId }, data: { resolved, seen: true } });
  refresh();
}

/** Staff: show (or stop showing) an issue to the other customers of its product, without its author. */
export async function setIssueShared(issueId: string, shared: boolean) {
  const user = await getSessionUser("staff");
  if (!isStaff(user)) throw new Error("Forbidden");
  await db.productIssue.update({ where: { id: issueId }, data: { adminConfirmed: shared } });
  refresh();
}

/** Staff: deletes an issue with its answers and its private attachment files. */
export async function deleteIssue(issueId: string) {
  const user = await getSessionUser("staff");
  if (!isStaff(user)) throw new Error("Forbidden");
  const files = await db.file.findMany({ where: { isPrivate: true, issueAttachments: { some: { issueId } } } });
  await db.$transaction([db.productIssue.delete({ where: { id: issueId } }), db.file.deleteMany({ where: { id: { in: files.map((f) => f.id) } } })]);
  await Promise.all(files.map((f) => fs.rm(filePath(f), { force: true })));
  redirect("/admin/issues");
}

/** Staff: deletes one reply in a thread. */
export async function deleteAnswer(answerId: string) {
  const user = await getSessionUser("staff");
  if (!isStaff(user)) throw new Error("Forbidden");
  await db.issueAnswer.delete({ where: { id: answerId } });
  refresh();
}
