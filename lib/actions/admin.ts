"use server";

import { idParam, idList } from "@/lib/ids";
import { refresh, revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isStaffRole, requireStaff } from "@/lib/auth/session";
import { POSTS_TAG } from "@/lib/data/posts";
import { db } from "@/lib/db";
import { Prisma, UserRole } from "@/lib/generated/prisma/client";
import { escapeHtml, sendMail } from "@/lib/mail";
import { sanitizeHtml } from "@/lib/sanitize";
import { SOLUTIONS } from "@/lib/site";
import { POST_CATEGORIES, type PostCategory } from "@/lib/post-categories";
import { slugify } from "@/lib/slug";
import { videoEmbedUrl } from "@/lib/video";
import { PRODUCTS_TAG } from "@/lib/data/products";
import { TRUST_TAG } from "@/lib/data/trust";
import { UPDATES_TAG } from "@/lib/data/updates";
import { normalizePersonalRegister, PERSONAL_REGISTER } from "@/lib/register-number";
import { fromDateInput, fromLocalInput } from "@/lib/time";
import { IMAGE_TYPES, saveUpload, UploadError } from "@/lib/uploads";
import type { FormState } from "./contact";

const SITE_URL = process.env.SITE_URL ?? "https://infosystems.mn";
const errorsOf = (e: z.ZodError) => Object.fromEntries(e.issues.map((i) => [String(i.path[0]), i.message]));
const optional = (v: FormDataEntryValue | null) => (typeof v === "string" && v.trim() ? v.trim() : null);
const isUniqueViolation = (e: unknown) => e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

// ---------------- Posts ----------------

const PostSchema = z.object({
  title: z.string().trim().min(3, "Гарчиг оруулна уу").max(255),
  slug: z.string().trim().max(120).optional(),
  category: z.enum(POST_CATEGORIES.map((c) => c.name) as [PostCategory, ...PostCategory[]]).default("Мэдээ мэдээлэл"),
  excerpt: z.string().trim().max(500).optional(),
  body: z.string().max(500_000),
  publishedAt: z.string().optional(),
});

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const parsed = PostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  const d = parsed.data;

  const slug = slugify(d.slug || d.title) || `post-${Date.now()}`;
  const clash = await db.post.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } });
  if (clash) return { ok: false, message: "Ийм slug-тай мэдээ байна.", errors: { slug: "Давхардсан байна" } };

  let imageId: string | null | undefined = undefined;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    try {
      imageId = (await saveUpload(image, { types: IMAGE_TYPES, maxBytes: 8 * 1024 * 1024 })).id;
    } catch (e) {
      if (e instanceof UploadError) return { ok: false, message: e.message };
      throw e;
    }
  } else if (formData.get("removeImage") === "on") imageId = null;

  const publish = formData.get("published") === "on";
  const data = {
    title: d.title,
    slug,
    category: d.category,
    excerpt: d.excerpt || null,
    body: sanitizeHtml(d.body),
    publishedAt: publish ? (d.publishedAt ? fromLocalInput(d.publishedAt) : new Date()) : null,
    ...(imageId !== undefined ? { imageId } : {}),
  };

  const saved = id ? await db.post.update({ where: { id }, data, select: { id: true } }) : await db.post.create({ data, select: { id: true } });
  updateTag(POSTS_TAG);
  if (!id) redirect(`/admin/posts/${saved.id}?saved=1`);
  refresh();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deletePost(id: string) {
  await requireStaff();
  await db.post.delete({ where: { id } });
  updateTag(POSTS_TAG);
  redirect("/admin/posts");
}

/** Image upload from the rich-text editor. Returns the public URL. */
export async function uploadEditorImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireStaff();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Файл алга" };
  try {
    return { url: (await saveUpload(file, { types: IMAGE_TYPES, maxBytes: 8 * 1024 * 1024 })).url };
  } catch (e) {
    if (e instanceof UploadError) return { error: e.message };
    throw e;
  }
}

// ---------------- Users ----------------

export async function updateUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireStaff();
  const id = idParam(formData.get("id"));
  const user = id ? await db.user.findUnique({ where: { id } }) : null;
  if (!id || !user) return { ok: false, message: "Хэрэглэгч олдсонгүй." };
  // Staff accounts (their email, block flag, ...) are managed by admins only. Otherwise an
  // employee could point an admin's email at their own inbox and take it over via password reset.
  if (isStaffRole(user.role) && me.role !== "admin" && user.id !== me.id) return { ok: false, message: "Ажилтны бүртгэлийг зөвхөн админ засна." };

  const register = optional(formData.get("companyRegister"));
  if (register && !/^\d{1,18}$/.test(register)) return { ok: false, message: "Регистрийн дугаар тоо байна.", errors: { companyRegister: "Тоо оруулна уу" } };
  const personalRaw = optional(formData.get("personalRegister"));
  const personalRegister = personalRaw ? normalizePersonalRegister(personalRaw) : null;
  if (personalRegister && !PERSONAL_REGISTER.test(personalRegister))
    return { ok: false, message: "Хувь хүний регистр буруу байна.", errors: { personalRegister: "2 кирилл үсэг, 8 тоо (УБ12345678)" } };
  const email = optional(formData.get("email"))?.toLowerCase();
  if (!email || !z.email().safeParse(email).success) return { ok: false, message: "И-мэйл буруу байна.", errors: { email: "Буруу" } };

  const role = String(formData.get("role") ?? user.role) as UserRole;
  if (!(Object.values(UserRole) as string[]).includes(role)) return { ok: false, message: "Эрх буруу байна." };
  // Only admins may grant or change staff roles, and nobody can demote themselves.
  if (role !== user.role && (me.role !== "admin" || user.id === me.id)) return { ok: false, message: "Эрх өөрчлөх боломжгүй." };

  const confirmed = formData.get("adminConfirmed") === "on";
  const productIds = idList(formData.getAll("products"));

  try {
    await db.$transaction([
      db.user.update({
        where: { id },
        data: {
          username: optional(formData.get("username")) ?? user.username,
          email,
          companyName: optional(formData.get("companyName")),
          companyRegister: register ? BigInt(register) : null,
          customerType: formData.get("customerType") === "individual" ? "individual" : "company",
          personalRegister,
          adminConfirmed: confirmed,
          blocked: user.id === me.id ? false : formData.get("blocked") === "on",
          role,
          seen: true,
        },
      }),
      db.userProduct.deleteMany({ where: { userId: id } }),
      db.userProduct.createMany({ data: productIds.map((productId) => ({ userId: id, productId })) }),
    ]);
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, message: "И-мэйл эсвэл регистрийн дугаар өөр хэрэглэгчид бүртгэлтэй байна." };
    throw e;
  }

  if (confirmed && !user.adminConfirmed) {
    // Same message the old /emails endpoint sent on approval.
    await sendMail({
      to: email,
      subject: "infosystems.mn — бүртгэл баталгаажлаа",
      html: `<p>Сайн байна уу,</p><p>Таны <b>infosystems.mn</b> дээрх бүртгэл баталгаажлаа. Та одоо <a href="${SITE_URL}/portal/login">харилцагчийн булан</a>-д нэвтэрч асуудал, санал хүсэлтээ илгээх боломжтой.</p><p>Инфосистемс Монголиа ХХК</p>`,
    });
  }
  refresh();
  return { ok: true, message: "Хадгалагдлаа." };
}

/**
 * Admin: deletes an account. Their issues and replies stay for staff with no author
 * (onDelete SetNull); product links go with the account.
 */
export async function deleteUser(id: string) {
  const me = await requireStaff({ admin: true });
  if (id === me.id) throw new Error("Өөрийгөө устгах боломжгүй.");
  await db.user.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/users");
}

// ---------------- Simple toggles ----------------

const CONTACTS_PAGE = 20;

/** One page of contact requests, newest first; pass the last row's id as `cursor` for the next page. */
export async function loadContacts(filter: string, cursor?: string) {
  await requireStaff();
  const rows = await db.contactRequest.findMany({
    where: filter === "new" ? { seen: false } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: CONTACTS_PAGE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  const hasMore = rows.length > CONTACTS_PAGE;
  return { rows: hasMore ? rows.slice(0, CONTACTS_PAGE) : rows, hasMore };
}

export async function markContactSeen(id: string, seen: boolean) {
  await requireStaff();
  await db.contactRequest.update({ where: { id }, data: { seen } });
  refresh();
}

export async function setCoreIssueStatus(id: string, status: boolean) {
  const me = await requireStaff();
  await db.coreIssue.update({ where: { id }, data: status ? { status, checkedById: me.id, checkedAt: new Date() } : { status, checkedById: null, checkedAt: null } });
  refresh();
}

// ---------------- Products (site pages + portal catalogue) ----------------

const ProductSchema = z.object({
  name: z.string().trim().min(2, "Нэр оруулна уу").max(120),
  title: z.string().trim().max(255).optional(),
  slug: z.string().trim().max(120).optional(),
  tagline: z.string().trim().max(255).optional(),
  icon: z.string().trim().max(40).optional(),
  badge: z.string().trim().max(40).optional(),
  videoUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .refine((v) => !v || videoEmbedUrl(v), "YouTube эсвэл Vimeo холбоос оруулна уу"),
  versionNames: z.string().max(200).optional(),
  status: z.enum(["available", "coming_soon"]).default("available"),
  group: z.enum(["featured", "other"]).default("other"),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

/** Product pages changed: public pages, the menu and every admin page that lists products. */
function productsChanged() {
  updateTag(PRODUCTS_TAG);
  // Testimonials and case studies show product names and links.
  updateTag(TRUST_TAG);
  revalidatePath("/admin", "layout");
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  const d = parsed.data;
  const slug = slugify(d.slug || d.name) || `product-${Date.now()}`;
  const clash = await db.product.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } });
  if (clash) return { ok: false, message: "Ийм slug-тай бүтээгдэхүүн байна.", errors: { slug: "Давхардсан байна" } };

  // Modules hang off a top-level product; a product that has modules can't become one.
  const parentId = idParam(formData.get("parentId"));
  if (parentId) {
    const parent = await db.product.findUnique({ where: { id: parentId }, select: { parentId: true } });
    if (!parent || parent.parentId || parentId === id) return { ok: false, message: "Эх бүтээгдэхүүн буруу байна.", errors: { parentId: "Буруу" } };
    if (id && (await db.product.count({ where: { parentId: id } })))
      return { ok: false, message: "Модультай бүтээгдэхүүнийг өөр бүтээгдэхүүний модуль болгох боломжгүй.", errors: { parentId: "Модультай" } };
  }

  // Each picture: a new upload replaces it, the «remove» box clears it, otherwise unchanged.
  const pictures: { imageId?: string | null; logoId?: string | null; backgroundId?: string | null } = {};
  for (const [field, key] of [["image", "imageId"], ["logo", "logoId"], ["background", "backgroundId"]] as const) {
    const upload = formData.get(field);
    if (upload instanceof File && upload.size > 0) {
      try {
        const file = await saveUpload(upload, { types: IMAGE_TYPES, maxBytes: 8 * 1024 * 1024 });
        // Pixel size measured in the browser when it resized the image (used for <img width/height>).
        const dim = (k: string) => {
          const n = Number(formData.get(`${field}${k}`));
          return Number.isInteger(n) && n > 0 && n <= 10_000 ? n : null;
        };
        await db.file.update({ where: { id: file.id }, data: { width: dim("Width"), height: dim("Height") } });
        pictures[key] = file.id;
      } catch (e) {
        if (e instanceof UploadError) return { ok: false, message: e.message, errors: { [field]: e.message } };
        throw e;
      }
    } else if (formData.get(`remove_${field}`) === "on") pictures[key] = null;
  }

  const data = {
    name: d.name,
    title: d.title || d.name,
    slug,
    tagline: d.tagline || null,
    icon: d.icon || null,
    badge: d.badge || null,
    videoUrl: d.videoUrl || null,
    // "MACS, MACSPOS" → {MACS,MACSPOS}: version_infos.productname values.
    versionNames: [...new Set((d.versionNames ?? "").split(/[,\s]+/).map((v) => v.trim().toUpperCase()).filter(Boolean))],
    solutions: formData.getAll("solutions").map(String).filter((s) => SOLUTIONS.some((x) => x.slug === s)),
    inComparison: formData.get("inComparison") === "on",
    status: d.status,
    // «Үндсэн бүтээгдэхүүн» check: the big box with modules on /products and in the menu.
    group: formData.get("isMain") === "on" && !parentId ? ("main" as const) : d.group,
    sortOrder: d.sortOrder,
    parentId,
    listed: formData.get("listed") === "on",
    publishedAt: formData.get("published") === "on" ? new Date() : null,
    ...pictures,
  };
  // Keep the original publish date when a published product is edited.
  if (id && data.publishedAt) {
    const prev = await db.product.findUnique({ where: { id }, select: { publishedAt: true } });
    if (prev?.publishedAt) data.publishedAt = prev.publishedAt;
  }
  // Only one main product (also enforced by products_single_main_key): the previous one
  // becomes a featured card.
  const demoted = data.group === "main" ? await db.product.findFirst({ where: { group: "main", ...(id ? { NOT: { id } } : {}) }, select: { name: true } }) : null;
  const saved = await db.$transaction(async (tx) => {
    if (demoted) await tx.product.updateMany({ where: { group: "main", ...(id ? { NOT: { id } } : {}) }, data: { group: "featured" } });
    return id ? tx.product.update({ where: { id }, data, select: { id: true } }) : tx.product.create({ data, select: { id: true } });
  });
  productsChanged();
  if (!id) redirect(`/admin/products/${saved.id}?saved=1`);
  refresh();
  return { ok: true, message: demoted ? `Хадгалагдлаа. «${demoted.name}» онцлох карт боллоо.` : "Хадгалагдлаа." };
}

export async function deleteProduct(id: string) {
  await requireStaff();
  if (await db.product.count({ where: { parentId: id } })) throw new Error("Эхлээд модулиудыг устгана уу.");
  // Customer links and page blocks are removed with it; issues keep their history with no product.
  await db.product.delete({ where: { id } });
  productsChanged();
  redirect("/admin/products");
}

// ---------------- Product page blocks ----------------

const BlockSchema = z.object({
  kind: z.enum(["text", "features", "links"]),
  heading: z.string().trim().max(255).optional(),
  style: z.enum(["", "lead", "checklist"]).optional(),
  body: z.string().max(500_000).optional(),
  columns: z.coerce.number().int().min(1).max(2).default(1),
});

/**
 * Feature card text is plain in the form: blank lines separate paragraphs, single line
 * breaks stay as <br>. Stored as <p> HTML like the imported content.
 */
function textToParagraphs(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** Creates or updates one block; features / links send their rows as parallel itemTitle / itemBody / itemHref arrays. */
export async function saveProductBlock(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const productId = idParam(formData.get("productId"));
  if (!productId) return { ok: false, message: "Бүтээгдэхүүн олдсонгүй." };
  const parsed = BlockSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  const b = parsed.data;

  const titles = formData.getAll("itemTitle").map(String);
  const bodies = formData.getAll("itemBody").map(String);
  const hrefs = formData.getAll("itemHref").map(String);
  const items = titles
    .map((title, i) => ({ title: title.trim().slice(0, 255), body: bodies[i]?.trim() || null, href: hrefs[i]?.trim().slice(0, 500) || null }))
    .filter((it) => it.title);
  if (b.kind !== "text" && !items.length) return { ok: false, message: "Дор хаяж нэг мөр нэмнэ үү." };
  const badHref = items.find((it) => it.href && !/^(\/(?!\/)|https?:\/\/)/.test(it.href));
  if (badHref) return { ok: false, message: `«${badHref.title}»: холбоос / эсвэл https:// -ээр эхэлнэ.` };
  if (b.kind === "text" && !b.body?.replace(/<[^>]+>/g, "").trim()) return { ok: false, message: "Текст оруулна уу.", errors: { body: "Хоосон байна" } };

  const data = {
    kind: b.kind,
    heading: b.heading || null,
    style: b.kind === "text" ? b.style || null : null,
    body: b.kind === "text" ? sanitizeHtml(b.body ?? "") : null,
    columns: b.kind === "features" ? b.columns : 1,
  };
  const itemRows = items.map((it, i) => ({
    title: it.title,
    body: it.body && b.kind === "features" ? textToParagraphs(it.body) : it.body,
    href: b.kind === "links" ? it.href : null,
    sortOrder: i,
  }));

  if (id) {
    const block = await db.productBlock.findUnique({ where: { id }, select: { productId: true } });
    if (block?.productId !== productId) return { ok: false, message: "Блок олдсонгүй." };
    await db.$transaction([
      db.productBlockItem.deleteMany({ where: { blockId: id } }),
      db.productBlock.update({ where: { id }, data: { ...data, items: { create: itemRows } } }),
    ]);
  } else {
    const last = await db.productBlock.aggregate({ where: { productId }, _max: { sortOrder: true } });
    await db.productBlock.create({ data: { ...data, productId, sortOrder: (last._max.sortOrder ?? -1) + 1, items: { create: itemRows } } });
  }
  productsChanged();
  refresh();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteProductBlock(id: string) {
  await requireStaff();
  await db.productBlock.delete({ where: { id } });
  productsChanged();
  refresh();
}

/** Swaps a block with its neighbour above (-1) or below (1). */
export async function moveProductBlock(id: string, direction: -1 | 1) {
  await requireStaff();
  const block = await db.productBlock.findUnique({ where: { id } });
  if (!block) return;
  const all = await db.productBlock.findMany({ where: { productId: block.productId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { id: true } });
  const i = all.findIndex((x) => x.id === id);
  const j = i + direction;
  if (j < 0 || j >= all.length) return;
  [all[i], all[j]] = [all[j], all[i]];
  // Renumber everything, which also repairs duplicate sort orders.
  await db.$transaction(all.map((x, n) => db.productBlock.update({ where: { id: x.id }, data: { sortOrder: n } })));
  productsChanged();
  refresh();
}

/** Assign a customer to a product (by user id). */
export async function addProductUser(productId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const userId = idParam(formData.get("userId"));
  if (!userId) return { ok: false, message: "Харилцагч сонгоно уу." };
  const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "customer") return { ok: false, message: "Харилцагч олдсонгүй." };
  await db.userProduct.upsert({ where: { userId_productId: { userId, productId } }, update: {}, create: { userId, productId } });
  revalidatePath("/admin", "layout");
  refresh();
  return { ok: true, message: "Нэмэгдлээ." };
}

export async function removeProductUser(productId: string, userId: string) {
  await requireStaff();
  await db.userProduct.deleteMany({ where: { productId, userId } });
  revalidatePath("/admin", "layout");
  refresh();
}

// ---------------- Desktop app notifications ----------------

const NotificationSchema = z.object({
  description: z.string().trim().min(1, "Тайлбар оруулна уу").max(255),
  macsversion: z.coerce.number().int().min(0).max(2),
  apptype: z.coerce.number().int().min(0).max(2),
  toCustomer: z.coerce.number().int().min(0).max(1),
  filetype: z.coerce.number().int().min(0).max(1),
  expireDate: z.iso.date("Огноо оруулна уу"),
  newsText: z.string().max(200_000).optional(),
  pdfFile: z.string().trim().max(255).optional(),
  fileUrl: z.string().trim().max(255).optional(),
  customerId: z.string().trim().max(50_000).optional(),
});

export async function saveNotification(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const parsed = NotificationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  const d = parsed.data;
  // An uploaded PDF fills in the name and link, as the old /upload step did (relative /uploads/… URL).
  const pdf = formData.get("pdf");
  if (pdf instanceof File && pdf.size > 0) {
    try {
      const f = await saveUpload(pdf, { types: ["application/pdf"] });
      d.pdfFile = f.name;
      d.fileUrl = f.url;
    } catch (e) {
      if (e instanceof UploadError) return { ok: false, message: e.message, errors: { pdf: e.message } };
      throw e;
    }
  }
  const data = {
    ...d,
    expireDate: fromDateInput(d.expireDate),
    newsText: d.newsText || null,
    pdfFile: d.pdfFile || null,
    fileUrl: d.fileUrl || null,
    customerId: d.customerId?.replace(/\s+/g, "") || null,
    isActive: formData.get("isActive") === "on" ? 1 : 0,
    publishedAt: new Date(),
  };
  if (id) await db.insertNotification.update({ where: { id }, data });
  else {
    await db.insertNotification.create({ data });
    redirect("/admin/notifications");
  }
  refresh();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteNotification(id: string) {
  await requireStaff();
  await db.insertNotification.delete({ where: { id } });
  redirect("/admin/notifications");
}

// ---------------- Version history ----------------

const VersionSchema = z.object({
  changedDate: z.iso.date("Огноо оруулна уу"),
  productname: z.enum(["MACS", "POS", "MACSPOS"]),
  description: z.string().trim().min(1, "Тайлбар оруулна уу").max(20_000),
});

export async function saveVersion(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = idParam(formData.get("id"));
  const parsed = VersionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  const data = { ...parsed.data, changedDate: fromDateInput(parsed.data.changedDate) };
  if (id) await db.versionInfo.update({ where: { id }, data });
  else await db.versionInfo.create({ data: { ...data, publishedAt: new Date() } });
  updateTag(UPDATES_TAG);
  refresh();
  return { ok: true, message: id ? "Хадгалагдлаа." : "Нэмэгдлээ." };
}

export async function deleteVersion(id: string) {
  await requireStaff();
  await db.versionInfo.delete({ where: { id } });
  updateTag(UPDATES_TAG);
  refresh();
}
