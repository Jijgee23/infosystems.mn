"use client";

import { useTransition, type ReactNode } from "react";
import { confirmDialog, toast } from "@/components/ui/feedback";
import { buttonClass } from "@/components/ui/form";

/**
 * Runs a bound server action, optionally after the confirm dialog, and toasts the outcome:
 * the action's own `{ ok, message }` when it returns one, else `success` (if given).
 */
export function ConfirmButton({
  action,
  confirm,
  description,
  confirmLabel,
  success,
  children,
  variant = "secondary",
  size = "md",
}: {
  action: () => Promise<unknown>;
  confirm?: string;
  description?: ReactNode;
  confirmLabel?: string;
  success?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}) {
  const [pending, start] = useTransition();
  return (
    <button
      className={buttonClass(variant, size)}
      disabled={pending}
      onClick={async () => {
        if (confirm && !(await confirmDialog({ title: confirm, description, confirmLabel }))) return;
        start(async () => {
          try {
            const res = await action();
            const r = res && typeof res === "object" ? (res as { ok?: boolean; message?: string; error?: string }) : null;
            if (r?.error) toast.error(r.error);
            else if (r?.message) (r.ok === false ? toast.error : toast.success)(r.message);
            else if (success) toast.success(success);
            else if (confirm) toast.success("Амжилттай.");
          } catch (e) {
            // redirect() inside the action throws a navigation signal; let Next handle it.
            if (e && typeof e === "object" && "digest" in e && String((e as { digest: unknown }).digest).startsWith("NEXT_")) throw e;
            toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
          }
        });
      }}
      type="button"
    >
      {children}
    </button>
  );
}
