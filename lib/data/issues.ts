import "server-only";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { SessionUser } from "@/lib/auth/session";
import { db, toNum } from "@/lib/db";

export async function getUserProducts(userId: string) {
  const rows = await db.userProduct.findMany({
    where: { userId },
    select: { product: { select: { id: true, title: true, slug: true } } },
    orderBy: { product: { title: "asc" } },
  });
  return rows.map((r) => r.product);
}

/** Title / text search (case-insensitive) for issue lists. */
function matching(q: string | undefined): Prisma.ProductIssueWhereInput {
  const needle = q?.trim().slice(0, 100);
  return needle ? { OR: [{ title: { contains: needle, mode: "insensitive" } }, { content: { contains: needle, mode: "insensitive" } }] } : {};
}

/** Issues with product name and the number of answers the viewer hasn't seen. */
export async function listIssues(opts: { userId?: string; viewerId: string; resolved?: boolean; q?: string; limit?: number }) {
  const issues = await db.productIssue.findMany({
    where: { userId: opts.userId, resolved: opts.resolved, ...matching(opts.q) },
    orderBy: { updatedAt: "desc" },
    take: opts.limit ?? 200,
    select: {
      id: true,
      title: true,
      resolved: true,
      seen: true,
      adminConfirmed: true,
      createdAt: true,
      updatedAt: true,
      product: { select: { title: true } },
      user: { select: { companyName: true } },
      _count: { select: { answers: { where: { seen: false, NOT: { userId: opts.viewerId } } } } },
    },
  });
  return issues.map(({ product, user, _count, ...i }) => ({ ...i, product: product?.title ?? null, companyName: user?.companyName ?? null, unread: _count.answers }));
}

/**
 * Issues staff marked to share (adminConfirmed) on the products a customer uses, filed by
 * other customers: answers to common questions. Who filed them is never included.
 */
export async function listSharedIssues(opts: { userId: string; q?: string; limit?: number }) {
  const issues = await db.productIssue.findMany({
    where: {
      adminConfirmed: true,
      NOT: { userId: opts.userId },
      product: { users: { some: { userId: opts.userId } } },
      ...matching(opts.q),
    },
    orderBy: { updatedAt: "desc" },
    take: opts.limit ?? 20,
    select: { id: true, title: true, resolved: true, seen: true, updatedAt: true, product: { select: { title: true } } },
  });
  return issues.map(({ product, ...i }) => ({ ...i, product: product?.title ?? null, unread: 0 }));
}

/**
 * One issue with its thread, or null when the viewer may not see it. A customer sees their
 * own issues in full, and shared issues of their products read-only and anonymised
 * (`shared: true`: no author, no attachments, other customers' replies unnamed).
 */
export async function getIssue(id: string | null, viewer: SessionUser) {
  if (!id) return null;
  const issue = await db.productIssue.findUnique({
    where: { id },
    include: {
      product: { select: { id: true, title: true } },
      user: { select: { id: true, username: true, companyName: true, companyRegister: true, personalRegister: true, email: true } },
      attachments: { include: { file: true } },
      answers: { orderBy: { createdAt: "asc" }, include: { user: { select: { id: true, username: true, role: true, companyName: true } } } },
    },
  });
  if (!issue) return null;
  const staff = viewer.role === "admin" || viewer.role === "employee";
  const full = { ...issue, shared: false, user: issue.user && { ...issue.user, companyRegister: toNum(issue.user.companyRegister) } };
  if (staff || issue.userId === viewer.id) return full;

  const canSee =
    issue.adminConfirmed &&
    !!issue.productId &&
    !!(await db.userProduct.findUnique({ where: { userId_productId: { userId: viewer.id, productId: issue.productId } }, select: { userId: true } }));
  if (!canSee) return null;
  return {
    ...full,
    shared: true,
    user: null,
    attachments: [],
    answers: issue.answers.map((a) =>
      a.user && a.user.role !== "customer" ? a : { ...a, userId: null, user: a.user && { ...a.user, id: "", username: "Харилцагч", companyName: null } },
    ),
  };
}

/** Marks the other party's answers (and, for staff, the issue itself) as seen. */
export async function markIssueSeen(id: string, viewer: SessionUser) {
  await db.issueAnswer.updateMany({ where: { issueId: id, seen: false, NOT: { userId: viewer.id } }, data: { seen: true } });
  if (viewer.role !== "customer") await db.productIssue.updateMany({ where: { id, seen: false }, data: { seen: true } });
}
