import { ConfirmButton } from "@/components/admin/confirm-button";
import { FilterTabs, fmtDateTime, PageHeader } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { setCoreIssueStatus } from "@/lib/actions/admin";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize";

export const metadata = { title: "Төслийн асуудал" };

export default async function AdminCoreIssues({ searchParams }: PageProps<"/admin/core-issues">) {
  await requireStaff();
  const filter = (await searchParams).filter;
  const issues = await db.coreIssue.findMany({
    where: filter === "open" ? { status: false } : filter === "done" ? { status: true } : undefined,
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { category: { select: { name: true } }, checkedBy: { select: { username: true } }, files: { include: { file: { select: { url: true, name: true, mime: true } } } } },
  });
  const rows = issues.map(({ category, files, ...issue }) => ({ issue, category: category?.name ?? null, files }));
  const files = rows.flatMap((r) => r.files.map(({ coreIssueId, file }) => ({ coreIssueId, ...file })));

  return (
    <>
      <PageHeader description="Захиалгат төслүүдийн хэрэглэгчдээс ирсэн асуудлууд (хуучин coreissue)" title="Төслийн асуудал" />
      <FilterTabs
        base="/admin/core-issues"
        current={typeof filter === "string" ? filter : ""}
        tabs={[
          { value: "", label: "Бүгд" },
          { value: "open", label: "Шийдээгүй" },
          { value: "done", label: "Шийдсэн" },
        ]}
      />
      {rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line bg-card p-8 text-center text-fg-muted">Асуудал алга.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ issue, category }) => (
            <li className="rounded-3xl border border-line bg-card p-5" key={issue.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-fg">{issue.title || "(гарчиггүй)"}</span>
                    {category && <Badge>{category}</Badge>}
                    {issue.status ? <Badge tone="accent">Шийдсэн</Badge> : <Badge tone="warn">Шийдээгүй</Badge>}
                  </p>
                  {issue.status && issue.checkedBy && (
                    <p className="mt-1 text-xs text-fg-subtle">
                      Шалгасан: {issue.checkedBy.username}
                      {issue.checkedAt && ` · ${fmtDateTime(issue.checkedAt)}`}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-fg-muted">
                    {issue.name}
                    {issue.email && (
                      <>
                        {" · "}
                        <a className="text-brand" href={`mailto:${issue.email}`}>
                          {issue.email}
                        </a>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-fg-subtle">{fmtDateTime(issue.createdAt)}</span>
                  <ConfirmButton action={setCoreIssueStatus.bind(null, issue.id, !issue.status)} size="sm" variant="ghost">
                    {issue.status ? "Дахин нээх" : "Шийдсэн"}
                  </ConfirmButton>
                </div>
              </div>
              {issue.description && <div className="md-content md-compact mt-3 max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(issue.description) }} />}
              {files.some((f) => f.coreIssueId === issue.id) && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {files
                    .filter((f) => f.coreIssueId === issue.id)
                    .map((f) =>
                      f.mime.startsWith("image/") ? (
                        <li key={f.url}>
                          <button className="block overflow-hidden rounded-xl border border-line" data-zoom-src={f.url} type="button">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt={f.name} className="h-20 w-28 object-cover" loading="lazy" src={f.url} />
                          </button>
                        </li>
                      ) : (
                        <li key={f.url}>
                          <a className="text-sm font-semibold text-brand" href={f.url} rel="noopener" target="_blank">
                            {f.name}
                          </a>
                        </li>
                      ),
                    )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
