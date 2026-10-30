import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/icons";
import { Card } from "@/components/ui/form";
import { StaffLoginForm } from "./staff-login-form";

export const metadata: Metadata = { title: "Ажилтны нэвтрэлт", robots: { index: false, follow: false } };

/** Staff-only sign-in. Not linked from the public site. */
export default function StaffLoginPage() {
  return (
    <main className="bg-grid flex min-h-dvh items-center justify-center px-4 py-12" id="main">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo />
          <h1 className="text-2xl font-extrabold text-fg">Ажилтны нэвтрэлт</h1>
          <p className="text-sm text-fg-muted">Удирдлагын хэсэгт нэвтрэхийн тулд ажлын и-мэйл, нууц үгээ оруулна уу.</p>
        </div>
        <Card className="shadow-xl shadow-black/5">
          <StaffLoginForm />
        </Card>
        <p className="mt-6 text-center text-xs text-fg-subtle">Нууц үгээ мартсан бол системийн админд хандана уу.</p>
        <p className="mt-3 text-center text-sm">
          <Link className="text-fg-muted hover:text-brand" href="/">
            ← Нүүр хуудас руу буцах
          </Link>
        </p>
      </div>
    </main>
  );
}
