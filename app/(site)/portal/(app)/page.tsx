import { registerLabel } from "@/lib/register-number";
import type { Metadata } from "next";
import Link from "next/link";
import { IssueList } from "@/components/portal/issue-list";
import { IssueSearch } from "@/components/portal/issue-search";
import { buttonClass, Card } from "@/components/ui/form";
import { requireUser } from "@/lib/auth/session";
import { getUserProducts, listIssues, listSharedIssues } from "@/lib/data/issues";
import { PrimaryPhone } from "@/components/site/company-links";

export const metadata: Metadata = { title: "Харилцагчийн булан | InfoSystems Mongolia", robots: { index: false } };

export default async function PortalHome({ searchParams }: PageProps<"/portal">) {
  const user = await requireUser();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const [products, issues, shared] = await Promise.all([
    getUserProducts(user.id),
    listIssues({ userId: user.id, viewerId: user.id, q }),
    listSharedIssues({ userId: user.id, q }),
  ]);
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-fg">Миний асуудлууд</h1>
          <Link className={buttonClass("primary", "sm")} href="/portal/issues/new">
            Асуудал илгээх
          </Link>
        </div>
        <IssueSearch action="/portal" q={q} />
        <IssueList base="/portal/issues" empty={q ? `«${q}» хайлтад тохирох асуудал алга.` : "Та одоогоор асуудал илгээгээгүй байна."} items={issues} />
        {shared.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-fg">Түгээмэл асуудал, шийдэл</h2>
            <p className="mt-1 mb-4 text-sm text-fg-muted">Таны ашигладаг бүтээгдэхүүн дээр бусад харилцагчдаас ирсэн, манай ажилтны хариулсан асуудлууд.</p>
            <IssueList base="/portal/issues" items={shared} />
          </div>
        )}
      </section>
      <aside className="space-y-4">
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold text-fg">Миний бүтээгдэхүүн</h2>
          {products.length ? (
            <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
              {products.map((p) => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-fg-muted">Бүтээгдэхүүн оноогдоогүй байна.</p>
          )}
        </Card>
        <Card className="p-6 text-sm text-fg-muted">
          <p>
            Яаралтай тусламж хэрэгтэй бол <PrimaryPhone className="font-semibold text-brand" /> дугаарт залгана уу.
          </p>
          <p className="mt-2">
            <Link className="font-semibold text-brand" href="/support/guides">
              Заавар, гарын авлага
            </Link>
          </p>
        </Card>
        <p className="px-1 text-xs text-fg-subtle">
          {user.email}
          {registerLabel(user) ? ` · РД ${registerLabel(user)}` : ""}
        </p>
      </aside>
    </div>
  );
}
