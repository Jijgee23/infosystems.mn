import type { ComponentProps, ReactNode } from "react";

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const inputClass =
  "ui-input mt-1.5 block w-full rounded-2xl border border-line bg-card px-4 text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none aria-[invalid=true]:border-red-500";

export function Field({ label, error, hint, className, children }: { label: ReactNode; error?: string; hint?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-semibold text-fg">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-fg-subtle">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}

export function Input({ className, invalid, ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={cn(inputClass, "h-12", className)} {...props} />;
}

export function Textarea({ className, invalid, ...props }: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return <textarea aria-invalid={invalid || undefined} className={cn(inputClass, "resize-y py-3", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(inputClass, "h-12", className)} {...props} />;
}

const BUTTON = {
  primary: "bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink",
  secondary: "border border-line bg-card text-fg hover:border-brand/50 hover:text-brand",
  danger: "border border-red-500/40 bg-card text-red-600 hover:bg-red-500/10 dark:text-red-400",
  ghost: "text-fg-muted hover:bg-surface hover:text-fg",
} as const;

export function buttonClass(variant: keyof typeof BUTTON = "primary", size: "sm" | "md" = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 disabled:opacity-60",
    size === "sm" ? "h-9 px-3.5 text-sm" : "h-11 px-5 text-sm",
    BUTTON[variant],
  );
}

export function Button({ variant = "primary", size = "md", className, ...props }: ComponentProps<"button"> & { variant?: keyof typeof BUTTON; size?: "sm" | "md" }) {
  return <button className={cn(buttonClass(variant, size), className)} type="submit" {...props} />;
}

export function FormMessage({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state?.message) return null;
  return (
    <p
      className={cn("rounded-2xl px-4 py-3 text-sm", state.ok ? "bg-accent-soft text-accent-ink" : "bg-red-500/10 text-red-700 dark:text-red-300")}
      role={state.ok ? "status" : "alert"}
    >
      {state.message}
    </p>
  );
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-line/80 bg-card p-6 shadow-[0_1px_2px_rgb(16_24_40/0.04)] sm:p-7", className)} {...props} />;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "brand" | "accent" | "warn" | "danger"; children: ReactNode }) {
  const tones = {
    neutral: "bg-surface text-fg-muted",
    brand: "bg-brand-soft text-brand",
    accent: "bg-accent-soft text-accent-ink",
    warn: "bg-amber-400/15 text-amber-600 dark:text-amber-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}
