import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/form";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Нэвтрэх | InfoSystems Mongolia", robots: { index: false } };

export default function LoginPage() {
  return (
    <>
      <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Харилцагчийн булан</p>
      <h1 className="text-3xl font-extrabold text-fg">Нэвтрэх</h1>
      <p className="mt-3 text-fg-muted">И-мэйл хаягаараа нэвтэрнэ үү.</p>
      <Card className="mt-8">
        <LoginForm />
      </Card>
      <p className="mt-6 text-center text-sm text-fg-muted">
        Бүртгэлгүй юу?{" "}
        <Link className="font-semibold text-brand hover:underline" href="/portal/register">
          Бүртгүүлэх
        </Link>
      </p>
    </>
  );
}
