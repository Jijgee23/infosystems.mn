"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitContact, type FormState } from "@/lib/actions/contact";
import { ActionForm } from "@/components/ui/action-form";

const INPUT =
  "mt-1.5 block w-full rounded-2xl border bg-card px-4 text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none";

const PRODUCTS = ["MACS ERP", "MACS POS", "PACS", "COST", "Macs Freight", "Macs Attendance", "Contractus", "Бусад, захиалгат хөгжүүлэлт"];

function Required() {
  return <span className="ml-1 text-xs font-normal text-fg-subtle">(заавал)</span>;
}

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, null);
  const err = (name: string) => state?.errors?.[name];
  const cls = (name: string, extra = "h-12") => `${INPUT} ${extra} ${err(name) ? "border-red-500" : "border-line"}`;

  if (state?.ok) {
    return (
      <div className="rounded-3xl border border-line bg-card p-6 sm:p-8" role="status">
        <p className="font-display text-2xl font-bold text-fg">Баярлалаа!</p>
        <p className="mt-2 text-fg-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <ActionForm action={action} className="rounded-3xl border border-line bg-card p-6 sm:p-8" noValidate>
      <input name="kind" type="hidden" value="demo" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field error={err("name")} label={<>Нэр<Required /></>}>
          <input aria-invalid={!!err("name")} autoComplete="name" className={cls("name")} name="name" required />
        </Field>
        <Field label="Байгууллага">
          <input autoComplete="organization" className={cls("company")} name="company" />
        </Field>
        <Field error={err("phone")} label={<>Утас<Required /></>}>
          <input aria-invalid={!!err("phone")} autoComplete="tel" className={cls("phone")} inputMode="tel" name="phone" required type="tel" />
        </Field>
        <Field error={err("email")} label={<>И-мэйл<Required /></>}>
          <input aria-invalid={!!err("email")} autoComplete="email" className={cls("email")} inputMode="email" name="email" required type="email" />
        </Field>
        <Field className="sm:col-span-2" label="Сонирхож буй бүтээгдэхүүн">
          <select className={cls("product")} defaultValue="" name="product">
            <option value="">Сонгоогүй / Зөвлөгөө авах</option>
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field className="sm:col-span-2" error={err("message")} label="Мессеж">
          <textarea className={cls("message", "resize-y py-3")} maxLength={3000} name="message" placeholder="Танай байгууллагын үйл ажиллагаа, хэрэгцээ, асуух зүйлээ товч бичнэ үү." rows={5} />
        </Field>
      </div>
      <input aria-hidden="true" autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-fg-subtle">
          Илгээснээр та манай{" "}
          <Link className="font-medium text-brand underline underline-offset-2" href="/privacy">
            нууцлалын бодлого
          </Link>
          -той танилцсанд тооцно.
        </p>
        <button className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-7 font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-70 dark:text-ink" disabled={pending} type="submit">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
            <path d="m21.854 2.147-10.94 10.939" />
          </svg>
          {pending ? "Илгээж байна…" : "Хүсэлт илгээх"}
        </button>
      </div>
      <p className="mt-3 min-h-5 text-sm text-red-600 dark:text-red-400" role="alert">
        {state && !state.ok ? state.message : null}
      </p>
    </ActionForm>
  );
}

function Field({ label, error, className = "", children }: { label: React.ReactNode; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold text-fg">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
