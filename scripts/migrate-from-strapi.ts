/**
 * Imports the old Strapi v3 MySQL dump into the new Postgres schema.
 *
 *   npx tsx scripts/migrate-from-strapi.ts ../infosystems-back/exported.sql [--reset]
 *
 * Reads the dump directly (no MySQL server needed). Every row gets a new cuid id; the old
 * Strapi id is kept in `legacy_id` (and in `seq` for the tables the desktop apps read), and
 * foreign keys are rewired through old-id → new-id maps. File URLs (/uploads/...) are unchanged.
 * --dry only parses the dump and prints row counts.
 * --reset truncates the target tables first; run it again on cut-over day with a fresh dump.
 * Products come in as plain Strapi rows (CASCADE also clears their page blocks): run
 * `npm run db:products` afterwards to load the structured product pages.
 */
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { normalizePostCategory } from "../lib/post-categories";
import { PrismaPg } from "@prisma/adapter-pg";
import { createId } from "@paralleldrive/cuid2";
import { Prisma, PrismaClient } from "../lib/generated/prisma/client";

process.loadEnvFile?.(".env");

export type Row = Record<string, string | number | null>;

// ---------- MySQL dump parsing ----------

export function parseDump(text: string) {
  const columns = new Map<string, string[]>();
  for (const m of text.matchAll(
    /CREATE TABLE `([^`]+)` \(([\s\S]*?)\n\) ENGINE/g,
  )) {
    const cols = [...m[2].matchAll(/^\s*`([^`]+)`/gm)].map((c) => c[1]);
    columns.set(m[1], cols);
  }
  const tables = new Map<string, Row[]>();
  const re = /INSERT INTO `([^`]+)` VALUES /g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const name = m[1];
    const cols = columns.get(name);
    if (!cols) throw new Error(`No CREATE TABLE for ${name}`);
    const { rows, end } = parseValues(text, re.lastIndex);
    re.lastIndex = end;
    const list = tables.get(name) ?? [];
    for (const r of rows)
      list.push(Object.fromEntries(cols.map((c, i) => [c, r[i]])));
    tables.set(name, list);
  }
  return tables;
}

const ESC: Record<string, string> = {
  n: "\n",
  r: "\r",
  t: "\t",
  "0": "\0",
  Z: "\x1a",
  b: "\b",
};

function parseValues(s: string, i: number) {
  const rows: (string | number | null)[][] = [];
  let row: (string | number | null)[] = [];
  for (;;) {
    const ch = s[i];
    if (ch === "(") {
      row = [];
      i++;
    } else if (ch === ")") {
      rows.push(row);
      i++;
    } else if (ch === ",") {
      i++;
    } else if (ch === ";") {
      return { rows, end: i + 1 };
    } else if (ch === "'") {
      let out = "";
      i++;
      while (s[i] !== "'" || s[i + 1] === "'") {
        if (s[i] === "\\") {
          const n = s[i + 1];
          out += ESC[n] ?? n;
          i += 2;
        } else if (s[i] === "'") {
          out += "'";
          i += 2;
        } else {
          out += s[i++];
        }
      }
      i++;
      row.push(out);
    } else if (s.startsWith("NULL", i)) {
      row.push(null);
      i += 4;
    } else {
      const m = /^-?[\d.eE+-]+/.exec(s.slice(i, i + 40));
      if (!m)
        throw new Error(`Unexpected token at ${i}: ${s.slice(i, i + 40)}`);
      row.push(Number(m[0]));
      i += m[0].length;
    }
  }
}

// ---------- value helpers ----------

const str = (v: Row[string]) =>
  v === null || v === undefined ? null : String(v);
const num = (v: Row[string]) =>
  v === null || v === undefined || v === "" ? null : Number(v);
const bool = (v: Row[string]) => v === 1 || v === "1";
/** Strapi stored DATETIME/TIMESTAMP in UTC. */
const ts = (v: Row[string]) =>
  v ? new Date(String(v).replace(" ", "T") + "Z") : null;
const tsOr = (v: Row[string]) => ts(v) ?? new Date();
/** MySQL DATE ('YYYY-MM-DD') -> Date at midnight UTC, as Prisma stores @db.Date. */
const day = (v: Row[string]) =>
  v ? new Date(`${String(v).slice(0, 10)}T00:00:00Z`) : null;

/** Old Strapi id → new cuid, per table. */
class IdMap {
  private m = new Map<number, string>();
  add(legacy: Row[string]) {
    const id = createId();
    this.m.set(Number(legacy), id);
    return id;
  }
  get(legacy: Row[string]) {
    return legacy === null || legacy === undefined
      ? null
      : (this.m.get(Number(legacy)) ?? null);
  }
  has(legacy: Row[string]) {
    return this.get(legacy) !== null;
  }
}

// ---------- main ----------

async function main() {
  const [file, ...flags] = process.argv.slice(2);
  if (!file)
    throw new Error(
      "Usage: tsx scripts/migrate-from-strapi.ts <dump.sql> [--reset]",
    );
  const dump = parseDump(fs.readFileSync(file, "utf8"));
  const get = (name: string) => dump.get(name) ?? [];
  if (flags.includes("--dry")) {
    console.table(Object.fromEntries([...dump].map(([k, v]) => [k, v.length])));
    return;
  }
  const url = process.env.DATA_BASE_URL;
  if (!url) throw new Error("DATA_BASE_URL is not set");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: url,
      options: "-c TimeZone=UTC",
    }),
  });

  // Strapi media links: related_type + field -> related_id -> [file ids]
  const morph = new Map<string, Map<number, number[]>>();
  for (const r of get("upload_file_morph").sort(
    (a, b) => Number(a.order) - Number(b.order),
  )) {
    const key = `${r.related_type}.${r.field}`;
    const byId = morph.get(key) ?? new Map<number, number[]>();
    const list = byId.get(Number(r.related_id)) ?? [];
    list.push(Number(r.upload_file_id));
    byId.set(Number(r.related_id), list);
    morph.set(key, byId);
  }
  const mediaOf = (type: string, field: string, id: Row[string]) =>
    morph.get(`${type}.${field}`)?.get(Number(id)) ?? [];

  const ids = {
    file: new IdMap(),
    user: new IdMap(),
    product: new IdMap(),
    issue: new IdMap(),
    category: new IdMap(),
    core: new IdMap(),
  };

  const counts = await prisma.$transaction(
    async (tx) => {
      if (flags.includes("--reset")) {
        await tx.$executeRawUnsafe(`TRUNCATE users, files, posts, products, user_products, product_issues, issue_answers,
          issue_attachments, project_categories, core_issues, core_issue_files, contact_requests,
          insert_notifications, version_infos, awards RESTART IDENTITY CASCADE`);
      }

      const fileRows = get("upload_file").map((r) => ({
        id: ids.file.add(r.id),
        legacyId: Number(r.id),
        name: str(r.name) ?? "",
        alternativeText: str(r.alternativeText) || null,
        hash: str(r.hash) ?? "",
        ext: str(r.ext),
        mime: str(r.mime) ?? "application/octet-stream",
        sizeKb: r.size === null ? null : Math.round(Number(r.size)),
        width: num(r.width),
        height: num(r.height),
        url: str(r.url) ?? "",
        formats: r.formats
          ? (JSON.parse(String(r.formats)) as Prisma.InputJsonValue)
          : Prisma.DbNull,
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.file.createMany({ data: fileRows });
      const firstFile = (type: string, field: string, id: Row[string]) =>
        ids.file.get(
          mediaOf(type, field, id).find((f) => ids.file.has(f)) ?? null,
        );

      // Awards: the old about page had one "Шагнал урамшуулал" component with several images.
      const awardRows = get("components_components_awards").flatMap((a) =>
        mediaOf("components_components_awards", "image", a.id)
          .filter((f) => ids.file.has(f))
          .map((fileId, i, all) => ({
            title:
              all.length > 1
                ? `${str(a.title) ?? "Шагнал"} ${i + 1}`
                : (str(a.title) ?? "Шагнал"),
            imageId: ids.file.get(fileId)!,
            sortOrder: i + 1,
          })),
      );
      await tx.award.createMany({ data: awardRows });

      // Users
      const roles = new Map(
        get("users-permissions_role").map((r) => [
          Number(r.id),
          String(r.type),
        ]),
      );
      const seenEmails = new Set<string>();
      const seenRegisters = new Set<string>();
      const userRows: Prisma.UserCreateManyInput[] = [];
      for (const r of get("users-permissions_user")) {
        const email = (str(r.email) ?? "").trim().toLowerCase();
        if (!email || seenEmails.has(email)) {
          console.warn(
            `Skipping user ${r.id}: empty or duplicate email "${email}"`,
          );
          continue;
        }
        seenEmails.add(email);
        let register =
          r.company_register === null ? null : String(r.company_register);
        if (register !== null && seenRegisters.has(register)) {
          console.warn(
            `User ${r.id}: duplicate company_register ${register}, cleared`,
          );
          register = null;
        }
        if (register !== null) seenRegisters.add(register);
        const roleType = roles.get(Number(r.role));
        const staff =
          roleType === "infosystem-admin" || roleType === "employee";
        userRows.push({
          id: ids.user.add(r.id),
          legacyId: Number(r.id),
          username: str(r.username) ?? email,
          email,
          passwordHash: str(r.password),
          companyName: str(r.company_name),
          companyRegister: register === null ? null : BigInt(register),
          role:
            roleType === "infosystem-admin"
              ? "admin"
              : roleType === "employee"
                ? "employee"
                : "customer",
          adminConfirmed: bool(r.admin_confirmed) || staff,
          blocked: bool(r.blocked),
          seen: bool(r.seen),
          createdAt: tsOr(r.created_at),
          updatedAt: tsOr(r.updated_at),
        });
      }
      await tx.user.createMany({ data: userRows });

      const postRows = get("posts").map((r) => ({
        legacyId: Number(r.id),
        title: str(r.title) ?? "",
        slug: str(r.slug) ?? `post-${r.id}`,
        category: normalizePostCategory(str(r.catigory)),
        body: str(r.description) ?? "",
        imageId: firstFile("posts", "image", r.id),
        viewCount: num(r.count) ?? 0,
        publishedAt: ts(r.published_at),
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.post.createMany({ data: postRows });

      // Products (legacy catalogue used by the customer portal)
      const productRows = get("products").map((r) => ({
        id: ids.product.add(r.id),
        legacyId: Number(r.id),
        title: str(r.title) ?? "",
        // Short display name; `npm run db:products` sets the real one for known products.
        name: (str(r.title) ?? "").slice(0, 120),
        slug: str(r.slug) ?? `product-${r.id}`,
        category: str(r.catigory),
        description: str(r.description),
        imageId: firstFile("products", "image", r.id),
        viewCount: num(r.count) ?? 0,
        publishedAt: ts(r.published_at),
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.product.createMany({ data: productRows });

      // Many-to-many links, plus the older one-to-one `products.user` column, which some
      // products still use instead of the join table.
      const upRows = [
        ...get("products_users__users_products").map((r) => ({
          userId: ids.user.get(r.user_id),
          productId: ids.product.get(r.product_id),
        })),
        ...get("products")
          .filter((r) => r.user != null)
          .map((r) => ({
            userId: ids.user.get(r.user),
            productId: ids.product.get(r.id),
          })),
      ].filter(
        (r): r is { userId: string; productId: string } =>
          !!r.userId && !!r.productId,
      );
      await tx.userProduct.createMany({ data: upRows, skipDuplicates: true });

      // Product issues + answers
      const issueRows = get("product_feedbacks").map((r) => ({
        id: ids.issue.add(r.id),
        legacyId: Number(r.id),
        title: str(r.name) ?? "",
        content: str(r.content) ?? "",
        productId: ids.product.get(r.product),
        userId: ids.user.get(r.user),
        adminConfirmed: bool(r.admin_confirmed),
        resolved: bool(r.resolved),
        seen: bool(r.seen),
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.productIssue.createMany({ data: issueRows });

      const answerRows = get("issue_answers")
        .filter((r) => ids.issue.has(r.product_issue))
        .map((r) => ({
          legacyId: Number(r.id),
          issueId: ids.issue.get(r.product_issue)!,
          userId: ids.user.get(r.user),
          content: str(r.content) ?? "",
          seen: bool(r.seen),
          createdAt: tsOr(r.created_at),
          updatedAt: tsOr(r.updated_at),
        }));
      await tx.issueAnswer.createMany({ data: answerRows });

      // Core issues
      const catRows = get("projectcategories").map((r) => ({
        id: ids.category.add(r.id),
        legacyId: Number(r.id),
        name: str(r.name) ?? "",
        slug: str(r.slug) ?? `category-${r.id}`,
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.projectCategory.createMany({ data: catRows });

      // Old many-to-many "checked by" list; the new model keeps one staff member per issue.
      const checkedBy = new Map<string, string>();
      for (const r of get("coreissues_checked_users__users_coreissues")) {
        const userId = ids.user.get(r.user_id);
        if (userId && !checkedBy.has(String(r.coreissue_id))) checkedBy.set(String(r.coreissue_id), userId);
      }
      const coreRows = get("coreissues").map((r) => ({
        id: ids.core.add(r.id),
        legacyId: Number(r.id),
        name: str(r.name),
        email: str(r.email),
        title: str(r.title),
        description: str(r.description),
        status: bool(r.status),
        categoryId: ids.category.get(r.projectcategory),
        checkedById: checkedBy.get(String(r.id)) ?? null,
        checkedAt: checkedBy.has(String(r.id)) ? tsOr(r.updated_at) : null,
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.coreIssue.createMany({ data: coreRows });
      await tx.coreIssueFile.createMany({
        data: get("coreissues").flatMap((r) =>
          [...new Set(mediaOf("coreissues", "image", r.id))]
            .filter((f) => ids.file.has(f))
            .map((f) => ({
              coreIssueId: ids.core.get(r.id)!,
              fileId: ids.file.get(f)!,
            })),
        ),
      });

      // Website feedback form
      const reportRows = get("infosystem_reports").map((r) => ({
        legacyId: Number(r.id),
        kind: "feedback" as const,
        name: str(r.name),
        email: str(r.email),
        message: str(r.description),
        seen: bool(r.seen),
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.contactRequest.createMany({ data: reportRows });

      // Desktop app data: `seq` keeps the numeric id the apps were given by Strapi.
      const notifRows = get("insert_notifications").map((r) => ({
        seq: Number(r.id),
        description: str(r.description),
        macsversion: num(r.macsversion) ?? 0,
        apptype: num(r.apptype) ?? 0,
        toCustomer: num(r.to_customer) ?? 0,
        filetype: num(r.filetype) ?? 0,
        isActive: num(r.is_active) ?? 0,
        expireDate: day(r.expire_date),
        acount: num(r.acount),
        newsText: str(r.news_text),
        pdfFile: str(r.pdf_file),
        fileUrl: str(r.file_url),
        customerId: str(r.customer_id),
        publishedAt: ts(r.published_at),
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.insertNotification.createMany({ data: notifRows });

      const versionRows = get("version_infos").map((r) => ({
        seq: Number(r.id),
        changedDate: day(r.changed_date) ?? new Date(0),
        description: str(r.description),
        productname: str(r.productname),
        publishedAt: ts(r.published_at),
        createdAt: tsOr(r.created_at),
        updatedAt: tsOr(r.updated_at),
      }));
      await tx.versionInfo.createMany({ data: versionRows });

      // New desktop-app rows continue numbering after the imported ones.
      for (const table of ["insert_notifications", "version_infos"]) {
        await tx.$executeRawUnsafe(
          `SELECT setval(pg_get_serial_sequence('${table}', 'seq'), COALESCE((SELECT MAX(seq) FROM ${table}), 0) + 1, false)`,
        );
      }

      return {
        users: userRows.length,
        files: fileRows.length,
        posts: postRows.length,
        products: productRows.length,
        user_products: upRows.length,
        product_issues: issueRows.length,
        issue_answers: answerRows.length,
        core_issues: coreRows.length,
        contact_requests: reportRows.length,
        insert_notifications: notifRows.length,
        version_infos: versionRows.length,
        awards: awardRows.length,
      };
    },
    { timeout: 120_000 },
  );

  console.table(counts);
  await prisma.$disconnect();
}

// Run only when executed directly (the parser is also imported by comparison scripts).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
