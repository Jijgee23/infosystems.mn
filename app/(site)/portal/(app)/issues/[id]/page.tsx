import { idParam } from "@/lib/ids";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IssueThread } from "@/components/portal/issue-thread";
import { requireUser } from "@/lib/auth/session";
import { getIssue, markIssueSeen } from "@/lib/data/issues";

export const metadata: Metadata = { title: "Асуудал | InfoSystems Mongolia", robots: { index: false } };

export default async function PortalIssuePage({ params }: PageProps<"/portal/issues/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/portal/issues/${id}`);
  const issue = await getIssue(idParam(id), user);
  if (!issue) notFound();
  // Shared issues are someone else's thread: reading them doesn't mark anything seen.
  if (!issue.shared) await markIssueSeen(issue.id, user);
  return (
    <div className="max-w-3xl">
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href="/portal">
        ← Миний асуудлууд
      </Link>
      <div className="mt-4">
        <IssueThread issue={issue} realm="customer" viewerId={user.id} />
      </div>
    </div>
  );
}
