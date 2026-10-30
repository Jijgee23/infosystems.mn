"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { Button, Card, Field, FormMessage, Input } from "@/components/ui/form";
import { resetPassword } from "@/lib/actions/auth";
import { ActionForm } from "@/components/ui/action-form";

export default function ResetPasswordPage() {
  return (
    <>
      <title>Шинэ нууц үг | InfoSystems Mongolia</title>
      <h1 className="text-3xl font-extrabold text-fg">Шинэ нууц үг</h1>
      <Card className="mt-8">
        <Suspense>
          <ResetForm />
        </Suspense>
      </Card>
    </>
  );
}

function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const [state, action, pending] = useActionState(resetPassword, null);
  if (state?.ok)
    return (
      <div className="space-y-5">
        <FormMessage state={state} />
        <Link className="font-semibold text-brand hover:underline" href="/portal/login">
          Нэвтрэх
        </Link>
      </div>
    );
  return (
    <ActionForm action={action} className="space-y-5">
      <input name="token" type="hidden" value={token} />
      <Field hint="Хамгийн багадаа 8 тэмдэгт" label="Шинэ нууц үг">
        <Input autoComplete="new-password" name="password" required type="password" />
      </Field>
      <Field label="Нууц үг давтах">
        <Input autoComplete="new-password" name="confirm" required type="password" />
      </Field>
      <FormMessage state={state} />
      <Button className="w-full" disabled={pending || !token}>
        Хадгалах
      </Button>
    </ActionForm>
  );
}
