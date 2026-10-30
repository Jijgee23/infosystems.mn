import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export const COMPANY_TAG = "company";

/** Company profile + contacts for the public site. Cached until an admin edit calls updateTag(COMPANY_TAG). */
export async function getCompany() {
  "use cache";
  cacheLife("days");
  cacheTag(COMPANY_TAG);
  const [settings, contacts] = await Promise.all([
    db.companySettings.findFirst(),
    db.companyContact.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
  ]);
  const s = settings ?? { name: "InfoSystems Mongolia", legalName: null, shortDescription: null, about: null, foundedYear: null, address: null, locationName: null, latitude: null, longitude: null, mapUrl: null, workingHours: null };
  return {
    name: s.name,
    legalName: s.legalName,
    shortDescription: s.shortDescription,
    about: s.about,
    foundedYear: s.foundedYear,
    address: s.address,
    locationName: s.locationName,
    // Decimal isn't serialisable across the cache / client boundary.
    latitude: s.latitude === null ? null : Number(s.latitude),
    longitude: s.longitude === null ? null : Number(s.longitude),
    mapUrl: s.mapUrl,
    workingHours: s.workingHours,
    phones: contacts.filter((c) => c.type === "phone"),
    emails: contacts.filter((c) => c.type === "email"),
    socials: contacts.filter((c) => c.type === "social"),
  };
}

export type Company = Awaited<ReturnType<typeof getCompany>>;

export async function getPublicEmployees() {
  "use cache";
  cacheLife("days");
  cacheTag(COMPANY_TAG);
  const rows = await db.employee.findMany({
    where: { isPublic: true },
    orderBy: [{ position: { department: { sortOrder: "asc" } } }, { position: { sortOrder: "asc" } }, { sortOrder: "asc" }, { createdAt: "asc" }],
    include: { photo: { select: { url: true } }, position: { select: { name: true, department: { select: { name: true } } } } },
  });
  return rows.map(({ photo, position, ...e }) => ({ ...e, department: position.department.name, position: position.name, photoUrl: photo?.url ?? null }));
}

/** 70116399 -> 7011-6399; other formats are returned unchanged. */
export const formatPhone = (p: string) => (/^\d{8}$/.test(p) ? `${p.slice(0, 4)}-${p.slice(4)}` : p);
/** tel: href; Mongolian 8-digit numbers get +976. */
export const telHref = (p: string) => `tel:${/^\d{8}$/.test(p) ? `+976${p}` : p.replace(/[^\d+]/g, "")}`;

/** Embed URL for the map iframe: exact coordinates if set, otherwise an address search. */
export function mapEmbedUrl(c: Pick<Company, "latitude" | "longitude" | "address" | "locationName">) {
  const q = c.latitude !== null && c.longitude !== null ? `${c.latitude},${c.longitude}` : [c.locationName, c.address].filter(Boolean).join(", ");
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}

export async function getPublicAwards() {
  "use cache";
  cacheLife("days");
  cacheTag(COMPANY_TAG);
  const rows = await db.award.findMany({
    where: { isPublic: true },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }, { createdAt: "asc" }],
    include: { image: { select: { url: true, width: true, height: true } } },
  });
  return rows.map(({ image, ...a }) => ({ ...a, imageUrl: image.url, width: image.width, height: image.height }));
}

/** Visible milestones for the About page timeline, oldest first. */
export async function getPublicMilestones() {
  "use cache";
  cacheLife("days");
  cacheTag(COMPANY_TAG);
  return db.milestone.findMany({
    where: { isPublic: true },
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, year: true, title: true, description: true },
  });
}
