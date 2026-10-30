import Link from "next/link";
import { Badge, Card } from "@/components/ui/form";
import type { getIssue } from "@/lib/data/issues";
import { formatDate } from "@/lib/data/posts";
import { sanitizeHtml } from "@/lib/sanitize";
import { ReplyForm } from "./reply-form";

type Issue = NonNullable<Awaited<ReturnType<typeof getIssue>>>;

const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat("mn-MN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ulaanbaatar" }).format(d);

export function IssueThread({
  issue,
  viewerId,
  realm,
  actions,
  answerActions,
}: {
  issue: Issue;
  viewerId: string;
  realm: "customer" | "staff";
  actions?: React.ReactNode;
  /** Extra controls per reply (staff: delete). */
  answerActions?: (answerId: string) => React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-fg">{issue.title}</h1>
            <p className="mt-1 text-sm text-fg-subtle">
              {[issue.user?.companyName ?? issue.user?.username, issue.product?.title, formatDate(issue.createdAt)].filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {issue.resolved ? <Badge tone="accent">Шийдэгдсэн</Badge> : <Badge>Нээлттэй</Badge>}
            {actions}
          </div>
        </div>
        <div className="md-content md-compact mt-5 max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(issue.content) }} />
        {issue.attachments.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-3">
            {issue.attachments.map(({ file }) =>
              file.mime.startsWith("image/") ? (
                <li key={file.id}>
                  <button className="block overflow-hidden rounded-xl border border-line" data-zoom-alt={file.name} data-zoom-src={file.url} type="button">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={file.name} className="h-24 w-32 object-cover" loading="lazy" src={file.url} />
                  </button>
                </li>
              ) : (
                <li key={file.id}>
                  <a className="inline-flex h-24 items-center rounded-xl border border-line px-4 text-sm font-semibold text-brand hover:bg-surface" href={file.url} rel="noopener" target="_blank">
                    {file.name}
                  </a>
                </li>
              ),
            )}
          </ul>
        )}
      </Card>

      {issue.answers.length > 0 && (
        <ol className="space-y-4">
          {issue.answers.map((a) => {
            const staff = a.user?.role === "admin" || a.user?.role === "employee";
            return (
              <li className={`rounded-3xl border p-5 sm:p-6 ${staff ? "border-brand/25 bg-brand-soft/40" : "border-line bg-card"} ${a.userId === viewerId ? "sm:ml-12" : "sm:mr-12"}`} key={a.id}>
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  {answerActions && <span className="order-last ml-auto">{answerActions(a.id)}</span>}
                  <span className="font-semibold text-fg">{staff ? `InfoSystems · ${a.user?.username}` : (a.user?.companyName ?? a.user?.username ?? "Хэрэглэгч")}</span>
                  <time className="text-fg-subtle" dateTime={a.createdAt.toISOString()}>
                    {fmtTime(a.createdAt)}
                  </time>
                </p>
                <div className="md-content md-compact mt-2 max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(a.content) }} />
              </li>
            );
          })}
        </ol>
      )}

      {issue.shared ? (
        <p className="rounded-3xl border border-dashed border-line p-5 text-sm text-fg-muted">
          Энэ асуудлыг ижил бүтээгдэхүүн ашигладаг харилцагчдад харуулахаар манай ажилтан нийтэлсэн. Танд ижил асуудал байгаа бол{" "}
          <Link className="font-semibold text-brand" href="/portal/issues/new">
            шинэ асуудал илгээнэ үү
          </Link>
          .
        </p>
      ) : (
        <Card className="p-5 sm:p-6">
          <ReplyForm issueId={issue.id} realm={realm} />
        </Card>
      )}
    </div>
  );
}
