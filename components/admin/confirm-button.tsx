"use client";

import { useTransition, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/form";

/** Runs a bound server action, optionally after a confirm() prompt. */
export function ConfirmButton({
  action,
  confirm,
  children,
  variant = "secondary",
  size = "md",
}: {
  action: () => Promise<unknown>;
  confirm?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}) {
  const [pending, start] = useTransition();
  return (
    <button
      className={buttonClass(variant, size)}
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        start(async () => {
          await action();
        });
      }}
      type="button"
    >
      {children}
    </button>
  );
}
