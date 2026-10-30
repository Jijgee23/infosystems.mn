"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { Lock, Mail } from "@/components/site/icons";
import { ActionForm } from "@/components/ui/action-form";
import { ErrorAlert, IconInput, PasswordInput, useFieldErrors } from "@/components/ui/auth-fields";
import { Button, Field } from "@/components/ui/form";
import { login } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  const { error, onEdit, attempt } = useFieldErrors(state);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLInputElement>(null);

  // Read in an effect rather than with useSearchParams, so the form is part of the
  // static shell and works before hydration.
  useEffect(() => {
    if (nextRef.current) nextRef.current.value = new URLSearchParams(location.search).get("next") ?? "";
  }, []);

  // After a failed attempt, put the cursor where the user needs to type next.
  useEffect(() => {
    if (!state || state.ok) return;
    if (state.errors?.email) emailRef.current?.focus();
    else if (state.errors?.password || state.code === "invalid") passwordRef.current?.select();
  }, [state]);

  return (
    <ActionForm action={action} className="space-y-5" noValidate>
      <input name="next" ref={nextRef} type="hidden" />

      {state?.message && <ErrorAlert key={attempt}>{state.message}</ErrorAlert>}

      <fieldset className="space-y-5" disabled={pending}>
        <Field error={error("email")} label="И-мэйл">
          <IconInput
            autoCapitalize="none"
            autoComplete="username"
            autoFocus
            defaultValue={state?.values?.email}
            icon={Mail}
            inputMode="email"
            invalid={!!error("email")}
            name="email"
            onChange={onEdit("email")}
            placeholder="name@company.mn"
            ref={emailRef}
            spellCheck={false}
            type="email"
          />
        </Field>
        <Field error={error("password")} label="Нууц үг">
          <PasswordInput
            autoComplete="current-password"
            icon={Lock}
            invalid={!!error("password")}
            name="password"
            onChange={onEdit("password")}
            placeholder="••••••••"
            ref={passwordRef}
          />
        </Field>
      </fieldset>

      <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-center text-sm font-medium text-fg-muted hover:text-brand" href="/portal/forgot-password">
          Нууц үгээ мартсан?
        </Link>
        <Button disabled={pending}>
          {pending ? (
            <>
              <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Нэвтэрч байна…
            </>
          ) : (
            "Нэвтрэх"
          )}
        </Button>
      </div>
    </ActionForm>
  );
}
