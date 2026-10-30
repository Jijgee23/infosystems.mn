import { FilterTabs, PageHeader } from "@/components/admin/ui";
import { IssueList } from "@/components/portal/issue-list";
import { IssueSearch } from "@/components/portal/issue-search";
import { requireStaff } from "@/lib/auth/session";
import { listIssues } from "@/lib/data/issues";

export const metadata = { title: "Харилцагчийн асуудал" };

export default async function AdminIssues({ searchParams }: PageProps<"/admin/issues">) {
  const me = await requireStaff();
  const sp = await searchParams;
  const filter = typeof sp.filter === "string" ? sp.filter : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const issues = await listIssues({
    viewerId: me.id,
    resolved: filter === "open" ? false : filter === "resolved" ? true : undefined,
    q,
  });
  const items = filter === "new" ? issues.filter((i) => !i.seen || i.unread > 0) : filter === "shared" ? issues.filter((i) => i.adminConfirmed) : issues;
  return (
    <>
      <PageHeader description="Харилцагчийн булангаас илгээсэн асуудал, санал" title="Харилцагчийн асуудал" />
      <FilterTabs
        base="/admin/issues"
        current={filter}
        tabs={[
          { value: "", label: "Бүгд" },
          { value: "new", label: "Шинэ" },
          { value: "open", label: "Нээлттэй" },
          { value: "resolved", label: "Шийдэгдсэн" },
          { value: "shared", label: "Бусдад харагдах" },
        ]}
      />
      <IssueSearch action="/admin/issues" keep={{ filter }} q={q} />
      <IssueList base="/admin/issues" empty={q ? `«${q}» хайлтад тохирох асуудал алга.` : undefined} items={items} showCompany staffView />
    </>
  );
}
