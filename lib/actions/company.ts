"use server";

import { idParam } from "@/lib/ids";
import { refresh, revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/auth/session";
import { COMPANY_TAG } from "@/lib/data/company";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { IMAGE_TYPES, saveUpload, UploadError } from "@/lib/uploads";
import type { FormState } from "./contact";

const errorsOf = (e: z.ZodError) => Object.fromEntries(e.issues.map((i) => [String(i.path[0]), i.message]));
const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);
const coord = (min: number, max: number) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isFinite(v) && v >= min && v <= max), "Буруу координат");

function changed() {
  updateTag(COMPANY_TAG);
  // Admin pages read each other's data (positions appear on the employees page),
  // so drop the browser's cached copies of every admin page, not just this one.
  revalidatePath("/admin", "layout");
  refresh();
}

// ---------------- Company profile ----------------

const CompanySchema = z.object({
  name: z.string().trim().min(2, "Нэр оруулна уу").max(255),
  legalName: text(255),
  shortDescription: text(500),
  about: z.string().max(100_000).optional(),
  foundedYear: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v > 1900 && v < 2100), "Он буруу"),
  address: text(500),
  locationName: text(255),
  latitude: coord(-90, 90),
  longitude: coord(-180, 180),
  mapUrl: z
    .string()
    .trim()
    .max(1024)
    .optional()
    .transform((v) => v || null)
    .refine((v) => v === null || /^https?:\/\//.test(v), "https:// холбоос оруулна уу"),
  workingHours: text(255),
});

/**
 * Saves the fields the form sent. The admin page splits the profile over several tabs, each
 * with its own form, so a field that wasn't sent is left as it is.
 */
export async function saveCompany(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const sent = Object.keys(CompanySchema.shape).filter((k) => formData.has(k)) as (keyof typeof CompanySchema.shape)[];
  const schema = CompanySchema.pick(Object.fromEntries(sent.map((k) => [k, true])) as { [K in keyof typeof CompanySchema.shape]?: true });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  const data: Prisma.CompanySettingsUncheckedUpdateInput = { ...parsed.data };
  if ("about" in parsed.data) data.about = parsed.data.about ? sanitizeHtml(parsed.data.about) : null;
  // Single-row table.
  const current = await db.companySettings.findFirst({ select: { id: true } });
  if (current) await db.companySettings.update({ where: { id: current.id }, data });
  else await db.companySettings.create({ data: { ...(data as Prisma.CompanySettingsUncheckedCreateInput), name: (parsed.data as { name?: string }).name ?? "InfoSystems Mongolia" } });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

// ---------------- Phones / e-mails / social links ----------------

const ContactSchema = z
  .object({
    type: z.enum(["phone", "email", "social"]),
    label: text(120),
    value: z.string().trim().min(1, "Утга оруулна уу").max(512),
    sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  })
  .superRefine((d, ctx) => {
    const ok =
      d.type === "phone" ? /^[+\d][\d\s-]{5,19}$/.test(d.value) : d.type === "email" ? z.email().safeParse(d.value).success : /^https?:\/\//.test(d.value);
    if (!ok) ctx.addIssue({ code: "custom", path: ["value"], message: d.type === "phone" ? "Утасны дугаар буруу" : d.type === "email" ? "И-мэйл буруу" : "https:// холбоос оруулна уу" });
  });

export async function saveContact(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message, errors: errorsOf(parsed.error) };
  const data = { ...parsed.data, value: parsed.data.type === "phone" ? parsed.data.value.replace(/[\s-]/g, "") : parsed.data.value, showInFooter: formData.get("showInFooter") === "on" };
  if (id) await db.companyContact.update({ where: { id }, data });
  else await db.companyContact.create({ data });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteContact(id: string) {
  await requireStaff({ admin: true });
  await db.companyContact.delete({ where: { id } });
  changed();
}

// ---------------- Departments (хэлтэс, тасаг) and positions (албан тушаал) ----------------

const NameSchema = z.object({
  name: z.string().trim().min(2, "Нэр оруулна уу").max(255),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export async function saveDepartment(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parentId = idParam(formData.get("parentId"));
  const parsed = NameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if (id && parentId && (await isDescendant(parentId, id))) return { ok: false, message: "Хэлтсийг өөрийн доорх тасагт харьяалуулах боломжгүй." };
  // Enforced here as well as by the DB index, which Prisma's schema can't express for top-level names.
  const clash = await db.department.findFirst({ where: { name: parsed.data.name, parentId, ...(id ? { NOT: { id } } : {}) }, select: { id: true } });
  if (clash) return { ok: false, message: "Ийм нэртэй хэлтэс/тасаг байна." };
  const data = { ...parsed.data, parentId };
  if (id) await db.department.update({ where: { id }, data });
  else await db.department.create({ data });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

/** True when `nodeId` sits somewhere under `ancestorId` (or is it). */
async function isDescendant(nodeId: string, ancestorId: string) {
  for (let cur: string | null = nodeId, guard = 0; cur && guard < 50; guard++) {
    if (cur === ancestorId) return true;
    cur = (await db.department.findUnique({ where: { id: cur }, select: { parentId: true } }))?.parentId ?? null;
  }
  return false;
}

export async function deleteDepartment(id: string): Promise<FormState> {
  await requireStaff({ admin: true });
  const [positions, children] = await Promise.all([db.position.count({ where: { departmentId: id } }), db.department.count({ where: { parentId: id } })]);
  if (positions || children) {
    const what = [children && `${children} тасаг`, positions && `${positions} албан тушаал`].filter(Boolean).join(", ");
    return { ok: false, message: `Устгах боломжгүй: ${what} харьяалагдаж байна.` };
  }
  await db.department.delete({ where: { id } });
  changed();
  return { ok: true, message: "" };
}

/** A record id from a form field (cuid). */
const requiredId = (message: string) => z.string({ error: message }).refine((v) => idParam(v) !== null, message);

const PositionSchema = NameSchema.extend({ departmentId: requiredId("Хэлтэс, тасаг сонгоно уу") });

/** A position always belongs to one department / unit; moving it moves its employees with it. */
export async function savePosition(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parsed = PositionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if (!(await db.department.findUnique({ where: { id: parsed.data.departmentId }, select: { id: true } }))) return { ok: false, message: "Хэлтэс олдсонгүй." };
  try {
    if (id) await db.position.update({ where: { id }, data: parsed.data });
    else await db.position.create({ data: parsed.data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { ok: false, message: "Энэ хэлтэст ийм албан тушаал бүртгэлтэй байна." };
    throw e;
  }
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deletePosition(id: string): Promise<FormState> {
  await requireStaff({ admin: true });
  const employees = await db.employee.count({ where: { positionId: id } });
  if (employees) return { ok: false, message: `Устгах боломжгүй: ${employees} ажилтан энэ албан тушаалтай байна.` };
  await db.position.delete({ where: { id } });
  changed();
  return { ok: true, message: "" };
}

// ---------------- Employees ----------------


const EmployeeSchema = z.object({
  name: z.string().trim().min(2, "Нэр оруулна уу").max(255),
  positionId: requiredId("Албан тушаал сонгоно уу"),
  phone: z
    .string()
    .trim()
    .max(64)
    .optional()
    .transform((v) => (v ? v.replace(/[\s-]/g, "") : null))
    .refine((v) => v === null || /^\+?\d{6,15}$/.test(v), "Утасны дугаар буруу"),
  email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((v) => v?.toLowerCase() || null)
    .refine((v) => v === null || z.email().safeParse(v).success, "И-мэйл буруу"),
  bio: text(2000),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export async function saveEmployee(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };
  // The department is implied by the position.
  if (!(await db.position.findUnique({ where: { id: parsed.data.positionId }, select: { id: true } })))
    return { ok: false, message: "Талбаруудаа шалгана уу.", errors: { positionId: "Албан тушаал олдсонгүй" } };

  let photoId: string | null | undefined;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      photoId = (await saveUpload(photo, { types: IMAGE_TYPES, maxBytes: 5 * 1024 * 1024 })).id;
    } catch (e) {
      if (e instanceof UploadError) return { ok: false, message: e.message, errors: { photo: e.message } };
      throw e;
    }
  } else if (formData.get("removePhoto") === "on") photoId = null;

  const data = { ...parsed.data, isPublic: formData.get("isPublic") === "on", ...(photoId !== undefined ? { photoId } : {}) };
  if (id) await db.employee.update({ where: { id }, data });
  else await db.employee.create({ data });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteEmployee(id: string) {
  await requireStaff({ admin: true });
  await db.employee.delete({ where: { id } });
  changed();
}

// ---------------- Awards (шагнал урамшуулал) ----------------

const AwardSchema = z.object({
  title: z.string().trim().min(2, "Нэр оруулна уу").max(255),
  issuer: text(255),
  year: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 1990 && v <= 2100), "Он буруу"),
  description: text(1000),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export async function saveAward(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parsed = AwardSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };

  let imageId: string | undefined;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    try {
      const file = await saveUpload(image, { types: IMAGE_TYPES, maxBytes: 8 * 1024 * 1024 });
      // Pixel size measured in the browser when it resized the image (used for <img width/height>).
      const dim = (k: string) => {
        const n = Number(formData.get(k));
        return Number.isInteger(n) && n > 0 && n <= 10_000 ? n : null;
      };
      await db.file.update({ where: { id: file.id }, data: { width: dim("imageWidth"), height: dim("imageHeight") } });
      imageId = file.id;
    } catch (e) {
      if (e instanceof UploadError) return { ok: false, message: e.message, errors: { image: e.message } };
      throw e;
    }
  }
  if (!id && imageId === undefined) return { ok: false, message: "Шагналын зураг оруулна уу.", errors: { image: "Зураг заавал" } };

  const data = { ...parsed.data, isPublic: formData.get("isPublic") === "on", ...(imageId !== undefined ? { imageId } : {}) };
  if (id) await db.award.update({ where: { id }, data });
  else await db.award.create({ data: { ...data, imageId: imageId! } });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteAward(id: string) {
  await requireStaff({ admin: true });
  await db.award.delete({ where: { id } });
  changed();
}

// ---------------- Milestones (он цагийн хэлхээс) ----------------

const MilestoneSchema = z.object({
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "4 оронтой он оруулна уу")
    .transform(Number)
    .refine((v) => v >= 1900 && v <= 2100, "Он буруу"),
  title: z.string().trim().min(2, "Гарчиг оруулна уу").max(255),
  description: text(1000),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export async function saveMilestone(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff({ admin: true });
  const id = idParam(formData.get("id"));
  const parsed = MilestoneSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Талбаруудаа шалгана уу.", errors: errorsOf(parsed.error) };

  // Existing rows are shown/hidden with setMilestoneVisible, so only a new one sends isPublic.
  if (id) await db.milestone.update({ where: { id }, data: parsed.data });
  else await db.milestone.create({ data: { ...parsed.data, isPublic: formData.get("isPublic") === "on" } });
  changed();
  return { ok: true, message: "Хадгалагдлаа." };
}

export async function deleteMilestone(id: string) {
  await requireStaff({ admin: true });
  await db.milestone.delete({ where: { id } });
  changed();
}

/** Quick show/hide from the list, without opening the form. */
export async function setMilestoneVisible(id: string, isPublic: boolean) {
  await requireStaff({ admin: true });
  await db.milestone.update({ where: { id }, data: { isPublic } });
  changed();
}
