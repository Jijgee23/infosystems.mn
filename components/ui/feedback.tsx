"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/*
 * App-wide toasts and confirm dialog. <Feedback /> is mounted once in the root layout;
 * `toast` and `confirmDialog` are plain functions, so any client code can call them
 * (event handlers, effects, after a server action) without a hook or provider.
 */

// ---------- store ----------

type Tone = "success" | "error" | "info";
type Toast = { id: number; tone: Tone; message: string; leaving?: boolean };
type ConfirmOptions = {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button; defaults to true when the title or label talks about deleting. */
  danger?: boolean;
};
type ConfirmRequest = ConfirmOptions & { resolve: (ok: boolean) => void };

let toasts: Toast[] = [];
let confirmRequest: ConfirmRequest | null = null;
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const TOAST_MS = 4000;
const LEAVE_MS = 200;

function dismiss(id: number) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t));
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, LEAVE_MS);
}

function push(tone: Tone, message: string) {
  if (!message) return;
  const id = nextId++;
  toasts = [...toasts.slice(-3), { id, tone, message }];
  emit();
  setTimeout(() => dismiss(id), tone === "error" ? TOAST_MS + 2000 : TOAST_MS);
}

export const toast = {
  success: (message: string) => push("success", message),
  error: (message: string) => push("error", message),
  info: (message: string) => push("info", message),
};

/** Opens the confirm dialog; resolves true on confirm, false on cancel / Esc / backdrop click. */
export function confirmDialog(options: ConfirmOptions | string): Promise<boolean> {
  const opts = typeof options === "string" ? { title: options } : options;
  confirmRequest?.resolve(false);
  return new Promise((resolve) => {
    confirmRequest = { ...opts, resolve };
    emit();
  });
}

function settleConfirm(ok: boolean) {
  confirmRequest?.resolve(ok);
  confirmRequest = null;
  emit();
}

const shown = new WeakSet<object>();

/**
 * Toasts a server action's `{ ok, message }` result once. Several components may call this
 * for the same state object (FormMessage + useCloseOnSave); only the first one shows it.
 */
export function useActionToast(state: { ok: boolean; message?: string } | null | undefined) {
  useEffect(() => {
    if (!state?.message || shown.has(state)) return;
    shown.add(state);
    push(state.ok ? "success" : "error", state.message);
  }, [state]);
}

/** Component form of useActionToast, for server-safe modules such as FormMessage. */
export function ActionToast({ state }: { state: { ok: boolean; message?: string } | null | undefined }) {
  useActionToast(state);
  return null;
}

// ---------- UI ----------

const DANGER_RE = /устга|delete|remove/i;

export function Feedback() {
  const list = useSyncExternalStore(subscribe, () => toasts, () => toasts);
  const request = useSyncExternalStore(subscribe, () => confirmRequest, () => confirmRequest);
  return (
    <>
      <ConfirmHost request={request} />
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
      >
        {list.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </>
  );
}

const TONE: Record<Tone, { icon: ReactNode; ring: string }> = {
  success: {
    ring: "bg-accent-soft text-accent-ink",
    icon: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  },
  error: {
    ring: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: <path d="M12 7.5v5.5m0 3.5v.01" />,
  },
  info: {
    ring: "bg-brand-soft text-brand",
    icon: <path d="M12 16.5V11m0-3.5v.01" />,
  },
};

function ToastItem({ toast: t }: { toast: Toast }) {
  const tone = TONE[t.tone];
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-card/95 p-3.5 pr-2.5 text-sm text-fg shadow-[0_16px_40px_-16px_rgb(16_24_40/0.35)] backdrop-blur-md",
        t.leaving ? "animate-[toast-out_200ms_ease-in_forwards]" : "animate-[toast-in_260ms_cubic-bezier(0.2,0.9,0.3,1.2)]",
      )}
      role={t.tone === "error" ? "alert" : "status"}
    >
      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", tone.ring)}>
        <svg aria-hidden className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} viewBox="0 0 24 24">
          {tone.icon}
        </svg>
      </span>
      <p className="min-w-0 flex-1 self-center leading-snug">{t.message}</p>
      <button
        aria-label="Хаах"
        className="grid size-7 shrink-0 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-surface hover:text-fg"
        onClick={() => dismiss(t.id)}
        type="button"
      >
        <svg aria-hidden className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M7 7l10 10M17 7 7 17" />
        </svg>
      </button>
    </div>
  );
}

function ConfirmHost({ request }: { request: ConfirmRequest | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  // Keep the last request while the closing animation plays.
  const [shownReq, setShownReq] = useState(request);
  const [closing, setClosing] = useState(false);
  if (request && request !== shownReq) {
    setShownReq(request);
    setClosing(false);
  }
  if (!request && shownReq && !closing) setClosing(true);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (request && !d.open) d.showModal();
    if (!request && d.open) {
      const t = setTimeout(() => {
        d.close();
        setShownReq(null);
        setClosing(false);
      }, 160);
      return () => clearTimeout(t);
    }
  }, [request]);

  const r = shownReq;
  const danger = r ? (r.danger ?? DANGER_RE.test(`${r.title} ${r.confirmLabel ?? ""}`)) : false;

  return (
    <dialog
      aria-describedby={r?.description ? "confirm-desc" : undefined}
      aria-labelledby="confirm-title"
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-line bg-card p-0 text-fg shadow-[0_30px_80px_-20px_rgb(11_27_43/0.5)]",
        "backdrop:bg-[rgb(11_27_43/0.35)] backdrop:backdrop-blur-[6px]",
        closing ? "animate-[dialog-out_160ms_ease-in_forwards] backdrop:animate-[fade-out_160ms_ease-in_forwards]" : "animate-[dialog-in_220ms_cubic-bezier(0.2,0.9,0.3,1.15)] backdrop:animate-[fade-in_220ms_ease-out]",
      )}
      onCancel={(e) => {
        e.preventDefault();
        settleConfirm(false);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) settleConfirm(false);
      }}
      ref={ref}
      role="alertdialog"
    >
      {r && (
        <div className="p-6">
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-2xl",
                danger ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-brand-soft text-brand",
              )}
            >
              <svg aria-hidden className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                {danger ? (
                  <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
                ) : (
                  <path d="M12 8v5m0 3.5v.01M10.3 3.9 2.5 17.5A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                )}
              </svg>
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <h2 className="text-base font-semibold leading-snug text-fg" id="confirm-title">
                {r.title}
              </h2>
              {r.description && (
                <div className="mt-1.5 text-sm leading-relaxed text-fg-muted" id="confirm-desc">
                  {r.description}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              autoFocus
              className="h-10 rounded-xl border border-line bg-card px-4 text-sm font-medium text-fg transition-colors hover:bg-surface"
              onClick={() => settleConfirm(false)}
              type="button"
            >
              {r.cancelLabel ?? "Болих"}
            </button>
            <button
              className={cn(
                "h-10 rounded-xl px-4 text-sm font-semibold text-white transition-colors",
                danger ? "bg-red-600 hover:bg-red-700" : "bg-brand hover:bg-brand-strong",
              )}
              onClick={() => settleConfirm(true)}
              type="button"
            >
              {r.confirmLabel ?? (danger ? "Устгах" : "Тийм")}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
