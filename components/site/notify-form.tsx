"use client";

import { useActionState, useId } from "react";
import { submitNotify, type FormState } from "@/lib/actions/contact";
import { ActionForm } from "@/components/ui/action-form";

/** "Notify me at launch" e-mail sign-up for upcoming products. */
export function NotifyForm({ product }: { product: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitNotify, null);
  const id = useId();
  return (
    <ActionForm action={action} className="mt-5" noValidate>
      <input name="product" type="hidden" value={product} />
      <label className="sr-only" htmlFor={id}>
        И-мэйл хаяг
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input aria-describedby={`${id}-msg`} aria-invalid={state?.ok === false} autoComplete="email" className="h-12 min-w-0 flex-1 rounded-full border border-line bg-card px-5 text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none" disabled={state?.ok} id={id} inputMode="email" name="email" placeholder="name@company.mn" required type="email" />
        <input aria-hidden="true" autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-70 dark:text-ink" disabled={pending || state?.ok} type="submit">
          Мэдэгдэл авах
        </button>
      </div>
      <p className={`mt-2 min-h-5 px-2 text-sm ${state?.ok ? "text-accent-ink" : "text-red-600 dark:text-red-400"}`} id={`${id}-msg`} role="alert">
        {state?.message}
      </p>
    </ActionForm>
  );
}
