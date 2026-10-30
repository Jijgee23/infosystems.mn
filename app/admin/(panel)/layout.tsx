import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/admin-nav";
import { SiteEffects } from "@/components/site/site-effects";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";

// Every request checks the session, so navigations into this area are not instant by design.
export const instant = false;

export default function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <Suspense fallback={<ShellFallback />}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
      <SiteEffects />
    </>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  const [contacts, issues, users] = await Promise.all([
    db.contactRequest.count({ where: { seen: false } }),
    db.productIssue.count({ where: { seen: false } }),
    db.user.count({ where: { adminConfirmed: false, blocked: false } }),
  ]);
  return (
    <>
      <AdminSidebar counts={{ contacts, issues, users }} role={user.role === "admin" ? "admin" : "employee"} userName={user.username} />
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-9" id="main">
        {/* Capped so lists and forms stay readable on wide screens. */}
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </>
  );
}

function ShellFallback() {
  return (
    <div aria-busy="true">
      <div className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-bg lg:block" />
      <div className="h-14 border-b border-line bg-bg lg:hidden" />
    </div>
  );
}
