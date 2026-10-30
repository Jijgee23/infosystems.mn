import { registerLabel } from "@/lib/register-number";
import { idParam } from "@/lib/ids";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { IssueThread } from "@/components/portal/issue-thread";
import { deleteAnswer, deleteIssue, setIssueResolved, setIssueShared } from "@/lib/actions/issues";
import { requireStaff } from "@/lib/auth/session";
import { getIssue, markIssueSeen } from "@/lib/data/issues";

export const metadata = { title: "Асуудал" };

export default async function AdminIssuePage({ params }: PageProps<"/admin/issues/[id]">) {
  const me = await requireStaff();
  const issue = await getIssue(idParam((await params).id), me);
  if (!issue) notFound();
  await markIssueSeen(issue.id, me);
  return (
    <div>
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href="/admin/issues">
        ← Асуудлууд
      </Link>
      {issue.user && (
        <p className="mt-3 text-sm text-fg-muted">
          <Link className="font-semibold text-brand hover:underline" href={`/admin/users/${issue.user.id}`}>
            {issue.user.companyName ?? issue.user.username}
          </Link>
          {registerLabel(issue.user) ? ` · РД ${registerLabel(issue.user)}` : ""} · {issue.user.email}
        </p>
      )}
      <div className="mt-4">
        <IssueThread
          actions={
            <ConfirmButton action={setIssueResolved.bind(null, issue.id, !issue.resolved)} size="sm" variant={issue.resolved ? "secondary" : "primary"}>
              {issue.resolved ? "Дахин нээх" : "Шийдэгдсэн болгох"}
            </ConfirmButton>
          }
          answerActions={(answerId) => (
            <ConfirmButton action={deleteAnswer.bind(null, answerId)} confirm="Энэ хариултыг устгах уу?" size="sm" variant="ghost">
              Устгах
            </ConfirmButton>
          )}
          issue={issue}
          realm="staff"
          viewerId={me.id}
        />
      </div>
      <div className="mt-8 flex flex-wrap items-start gap-6 border-t border-line pt-6">
        {issue.productId && (
          <div className="max-w-md">
            <ConfirmButton
              action={setIssueShared.bind(null, issue.id, !issue.adminConfirmed)}
              confirm={
                issue.adminConfirmed
                  ? undefined
                  : "Энэ асуудал, хариултуудыг тус бүтээгдэхүүний бусад харилцагчдад харуулах уу? Илгээгчийн нэр, хавсралт харагдахгүй ч агуулгад хувийн мэдээлэл байгаа эсэхийг шалгана уу."
              }
              size="sm"
              variant="secondary"
            >
              {issue.adminConfirmed ? "Бусдад харуулахаа болих" : "Бусад харилцагчдад харуулах"}
            </ConfirmButton>
            <p className="mt-2 text-xs text-fg-subtle">
              {issue.adminConfirmed
                ? `«${issue.product?.title}»-г ашигладаг бусад харилцагчид харилцагчийн булангаас нэргүйгээр уншиж байна.`
                : "Түгээмэл асуултын хариултыг ижил бүтээгдэхүүний бусад харилцагчидтай хуваалцана."}
            </p>
          </div>
        )}
        <div className="ml-auto">
          <ConfirmButton action={deleteIssue.bind(null, issue.id)} confirm="Энэ асуудлыг хариулт, хавсралттай нь устгах уу? Буцаах боломжгүй." size="sm" variant="danger">
            Асуудал устгах
          </ConfirmButton>
        </div>
      </div>
    </div>
  );
}
