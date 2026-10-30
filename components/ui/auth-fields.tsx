"use client";

import { type ComponentProps, type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "@/components/site/icons";
import { Input } from "@/components/ui/form";

type State = { ok: boolean; message: string; errors?: Record<string, string> } | null;

/**
 * Field errors from the last submit of a useActionState form, each hidden again as
 * soon as the user edits that field. `attempt` changes on every new state, for use
 * as a key that replays the alert animation.
 */
export function useFieldErrors(state: State) {
  const [edited, setEdited] = useState<Record<string, boolean>>({});
  const [lastState, setLastState] = useState(state);
  const [attempt, setAttempt] = useState(0);
  if (state !== lastState) {
    setLastState(state);
    setEdited({});
    setAttempt((n) => n + 1);
  }
  const error = (name: string) => (edited[name] ? undefined : state?.errors?.[name]);
  const onEdit = (name: string) => () => {
    if (error(name)) setEdited((e) => ({ ...e, [name]: true }));
  };
  return { error, onEdit, attempt };
}

/** Error banner with an icon that shakes once when it appears. Give it `key={attempt}`. */
export function ErrorAlert({ children }: { children: ReactNode }) {
  return (
    <div
      className="animate-shake flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
      role="alert"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

const ICON = "pointer-events-none absolute top-1/2 left-4 mt-0.75 size-4.5 -translate-y-1/2 text-fg-subtle";

/** Input with a leading icon. */
export function IconInput({ icon: Icon, className, ...props }: ComponentProps<typeof Input> & { icon: (p: { className?: string }) => ReactNode }) {
  return (
    <span className="relative block">
      <Icon className={ICON} />
      <Input className={`pl-11 ${className ?? ""}`} {...props} />
    </span>
  );
}

/** Password input with a show/hide button and a Caps Lock warning. */
export function PasswordInput({
  icon: Icon,
  ref,
  ...props
}: Omit<ComponentProps<typeof Input>, "type"> & { icon?: (p: { className?: string }) => ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const inner = useRef<HTMLInputElement>(null);
  const checkCaps = (e: KeyboardEvent) => setCapsLock(e.getModifierState("CapsLock"));
  return (
    <>
      <span className="relative block">
        {Icon && <Icon className={ICON} />}
        <Input
          {...props}
          className={`pr-12 ${Icon ? "pl-11" : ""} ${props.className ?? ""}`}
          onBlur={() => setCapsLock(false)}
          onKeyDown={checkCaps}
          onKeyUp={checkCaps}
          ref={(el) => {
            inner.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? "Нууц үгийг нуух" : "Нууц үгийг харуулах"}
          aria-pressed={visible}
          className="absolute top-1/2 right-1.5 mt-0.75 grid size-9 -translate-y-1/2 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-surface hover:text-fg"
          onClick={(e) => {
            // Inside a <label>, a click would otherwise also be forwarded to the input.
            e.preventDefault();
            setVisible((v) => !v);
            inner.current?.focus();
          }}
          title={visible ? "Нуух" : "Харуулах"}
          type="button"
        >
          {visible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
        </button>
      </span>
      {capsLock && <span className="mt-1 block text-xs font-medium text-amber-600 dark:text-amber-400">Caps Lock асаалттай байна</span>}
    </>
  );
}
