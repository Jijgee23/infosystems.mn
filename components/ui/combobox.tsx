"use client";

import { Children, isValidElement, useEffect, useId, useMemo, useRef, useState, type ComponentProps, type ReactNode } from "react";

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Show the search field only once a dropdown has at least this many options. */
const SEARCH_THRESHOLD = 7;

type Option = { value: string; label: string; disabled: boolean };

function nodeText(node: ReactNode): string {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) return nodeText((node.props as { children?: ReactNode }).children);
  return "";
}

/** Read the <option> elements the caller passes as children into plain data. */
function collectOptions(children: ReactNode, out: Option[] = []): Option[] {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as { value?: unknown; children?: ReactNode; disabled?: boolean };
    if (child.type !== "option") {
      if (props.children) collectOptions(props.children, out); // fragments / optgroup
      return;
    }
    const value = String(props.value ?? "");
    out.push({ value, label: nodeText(props.children).trim() || value, disabled: !!props.disabled });
  });
  return out;
}

const CONTROL =
  "flex w-full items-center justify-between gap-2 rounded-2xl border border-line bg-card px-4 text-left text-fg focus:border-brand focus:outline-none aria-[invalid=true]:border-red-500 disabled:cursor-not-allowed disabled:opacity-60";

export type SelectProps = ComponentProps<"select"> & { placeholder?: string };

/**
 * Drop-in replacement for a native <select>: a styled button that opens a
 * searchable list. A hidden native <select> stays mounted as the real form
 * control, so name/value/defaultValue/required/onChange and FormData all keep
 * working; selecting an item drives it and dispatches its change event.
 */
export function Combobox({ className, children, value, defaultValue, onChange, disabled, required, name, id, placeholder, "aria-invalid": ariaInvalid, ...rest }: SelectProps) {
  const options = useMemo(() => collectOptions(children), [children]);
  const isControlled = value !== undefined;

  const nativeRef = useRef<HTMLSelectElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const initial = (isControlled ? value : defaultValue) ?? options[0]?.value ?? "";
  const [internal, setInternal] = useState(String(initial));
  const current = isControlled ? String(value ?? "") : internal;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();

  const showSearch = options.length >= SEARCH_THRESHOLD;
  const needle = query.trim().toLowerCase();
  const filtered = useMemo(() => (needle ? options.filter((o) => o.label.toLowerCase().includes(needle)) : options), [options, needle]);
  const selectedLabel = options.find((o) => o.value === current)?.label ?? "";

  const openMenu = () => {
    const idx = options.findIndex((o) => o.value === current);
    setActive(idx >= 0 ? idx : 0);
    setQuery("");
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setQuery("");
    buttonRef.current?.focus();
  };

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  // Focus the search box when the menu opens (no state writes here).
  useEffect(() => {
    if (!open || !showSearch) return;
    const t = setTimeout(() => searchRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open, showSearch]);

  const choose = (opt: Option) => {
    if (opt.disabled) return;
    const el = nativeRef.current;
    if (el) {
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
      setter?.call(el, opt.value);
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
    close();
  };

  const moveActive = (dir: 1 | -1) => {
    if (!filtered.length) return;
    let i = active;
    for (let step = 0; step < filtered.length; step++) {
      i = (i + dir + filtered.length) % filtered.length;
      if (!filtered[i].disabled) break;
    }
    setActive(i);
  };

  const onPanelKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) choose(filtered[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  };

  return (
    <div className="relative mt-1.5" ref={rootRef}>
      {/* Real form control — hidden but still submitted/validated. */}
      <select
        aria-hidden
        aria-invalid={ariaInvalid}
        className="sr-only"
        defaultValue={isControlled ? undefined : String(defaultValue ?? initial)}
        disabled={disabled}
        id={id}
        name={name}
        onChange={(e) => {
          if (!isControlled) setInternal(e.target.value);
          onChange?.(e);
        }}
        ref={nativeRef}
        required={required}
        tabIndex={-1}
        value={isControlled ? String(value ?? "") : undefined}
        {...rest}
      >
        {children}
      </select>

      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(CONTROL, "h-12", className)}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={onButtonKey}
        ref={buttonRef}
        type="button"
      >
        <span className={cn("truncate", !selectedLabel && "text-fg-subtle")}>{selectedLabel || placeholder || "Сонгох…"}</span>
        <svg aria-hidden className={cn("size-4 shrink-0 text-fg-subtle transition-transform", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-line bg-card p-1.5 shadow-xl shadow-black/5" onKeyDown={onPanelKey}>
          {showSearch && (
            <input
              className="mb-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none"
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="Хайх…"
              ref={searchRef}
              type="text"
              value={query}
            />
          )}
          <ul className="max-h-60 overflow-auto" role="listbox" id={listId}>
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-fg-subtle">Илэрц алга</li>
            ) : (
              filtered.map((opt, i) => (
                <li key={opt.value + i} role="option" aria-selected={opt.value === current}>
                  <button
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm",
                      opt.disabled ? "cursor-not-allowed text-fg-subtle" : "text-fg hover:bg-surface",
                      i === active && !opt.disabled && "bg-surface",
                      opt.value === current && "font-semibold text-brand",
                    )}
                    disabled={opt.disabled}
                    onClick={() => choose(opt)}
                    onMouseEnter={() => !opt.disabled && setActive(i)}
                    tabIndex={-1}
                    type="button"
                  >
                    <span className="truncate">{opt.label}</span>
                    {opt.value === current && (
                      <svg aria-hidden className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
