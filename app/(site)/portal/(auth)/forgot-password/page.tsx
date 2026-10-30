"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Card, Field, FormMessage, Input } from "@/components/ui/form";
import { requestPasswordReset } from "@/lib/actions/auth";
import { ActionForm } from "@/components/ui/action-form";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  return (
    <>
      <title>Нууц үг сэргээх | InfoSystems Mongolia</title>
      <h1 className="text-3xl font-extrabold text-fg">Нууц үг сэргээх</h1>
      <p className="mt-3 text-fg-muted">Бүртгэлтэй и-мэйл хаягаа оруулбал нууц үг шинэчлэх холбоос илгээнэ.</p>
      <Card className="mt-8">
        {state?.ok ? (
          <FormMessage state={state} />
        ) : (
          <ActionForm action={action} className="space-y-5">
            <Field label="И-мэйл">
              <Input autoComplete="email" name="email" required type="email" />
            </Field>
            <FormMessage state={state} />
            <Button className="w-full" disabled={pending}>
              Холбоос илгээх
            </Button>
          </ActionForm>
        )}
      </Card>
      <p className="mt-6 text-center text-sm">
        <Link className="font-semibold text-brand hover:underline" href="/portal/login">
          Нэвтрэх хуудас руу буцах
        </Link>
      </p>
    </>
  );
}
