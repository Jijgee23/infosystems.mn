"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/form";

/**
 * Admin lists show each record as a short summary row; its form opens only on «Засах», and
 * the «add» form only on its button. Forms inside call useCloseOnSave(state) so they close
 * again after a successful save.
 */
const CloseContext = createContext<(() => void) | null>(null);

/** Closes the surrounding NewItem / EditableItem once the form's action reports success. */
export function useCloseOnSave(state: { ok: boolean } | null | undefined) {
  const close = useContext(CloseContext);
  useEffect(() => {
    if (state?.ok) close?.();
  }, [state, close]);
}

/** «+ Нэмэх» button that opens the add form in place. */
export function NewItem({ label, children, variant = "primary" }: { label: string; children: ReactNode; /** "secondary" for add buttons nested inside a record. */ variant?: "primary" | "secondary" }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button className={buttonClass(variant, "sm")} onClick={() => setOpen(true)} type="button">
        + {label}
      </button>
    );
  return (
    <div className="w-full rounded-2xl border border-brand/30 bg-card p-3 shadow-[0_8px_30px_-12px_rgb(0_113_206/0.25)] sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <p className="text-sm font-semibold text-fg">{label}</p>
        <button className={buttonClass("ghost", "sm")} onClick={() => setOpen(false)} type="button">
          Болих
        </button>
      </div>
      <CloseContext.Provider value={() => setOpen(false)}>{children}</CloseContext.Provider>
    </div>
  );
}

/** Page toolbar: a short note on the left, the add button (or the open add form) after it. */
export function ListToolbar({ note, children }: { note?: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
      {note && <p className="mr-auto text-sm text-fg-muted">{note}</p>}
      {children}
    </div>
  );
}

/** One record: its summary with «Засах» (and optional extra buttons), or its form while editing. */
export function EditableItem({ summary, actions, children }: { summary: ReactNode; actions?: ReactNode; children: ReactNode }) {
  const [editing, setEditing] = useState(false);
  if (editing)
    return (
      <li className="bg-surface/60 p-3 sm:p-4">
        <div className="mb-2 flex justify-end">
          <button className={buttonClass("ghost", "sm")} onClick={() => setEditing(false)} type="button">
            Болих
          </button>
        </div>
        <CloseContext.Provider value={() => setEditing(false)}>{children}</CloseContext.Provider>
      </li>
    );
  return (
    <li className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface/50">
      <div className="min-w-0 flex-1">{summary}</div>
      <div className="flex shrink-0 items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
        {actions}
        <button className={buttonClass("ghost", "sm")} onClick={() => setEditing(true)} type="button">
          Засах
        </button>
      </div>
    </li>
  );
}

/** The bordered list the EditableItems go in. */
export function ItemList({ children, empty }: { children: ReactNode; empty?: string }) {
  const hasItems = Array.isArray(children) ? children.some(Boolean) : !!children;
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line/80 bg-card shadow-[0_1px_2px_rgb(16_24_40/0.04)]">
      {hasItems ? children : <li className="px-4 py-6 text-center text-sm text-fg-subtle">{empty ?? "Одоогоор бүртгэл алга."}</li>}
    </ul>
  );
}
