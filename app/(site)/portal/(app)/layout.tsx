import { Suspense } from "react";
import { buttonClass } from "@/components/ui/form";
import { logout } from "@/lib/actions/auth";
import { requireUser } from "@/lib/auth/session";

// Every request checks the session, so navigations into this area are not instant by design.
export const instant = false;

export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return (
    <main className="min-h-[60vh] bg-surface" id="main">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-card" />}>
          <PortalGate>{children}</PortalGate>
        </Suspense>
      </div>
    </main>
  );
}

async function PortalGate({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">Харилцагчийн булан</p>
          <p className="mt-1 font-display text-xl font-bold text-fg">{user.companyName ?? user.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <form action={logout}>
            <button className={buttonClass("ghost", "sm")} type="submit">
              Гарах
            </button>
          </form>
        </div>
      </div>
      {children}
    </>
  );
}
