import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/form";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Бүртгүүлэх | InfoSystems Mongolia", robots: { index: false } };

export default function RegisterPage() {
  return (
    <>
      <p className="mb-3 text-sm font-semibold tracking-wide text-brand uppercase">Харилцагчийн булан</p>
      <h1 className="text-3xl font-extrabold text-fg">Бүртгүүлэх</h1>
      <p className="mt-2 text-fg-muted">MACS болон бусад програмын хэрэглэгч байгууллага, хувь хүн бүртгүүлж, асуудал, санал хүсэлтээ илгээх боломжтой.</p>
      <Card className="mt-6 sm:p-7" data-wide>
        <RegisterForm />
      </Card>
      <p className="mt-6 text-center text-sm text-fg-muted">
        Бүртгэлтэй юу?{" "}
        <Link className="font-semibold text-brand hover:underline" href="/portal/login">
          Нэвтрэх
        </Link>
      </p>
    </>
  );
}
