"use client";

import { useActionState, useState, type ReactNode } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ActionForm } from "@/components/ui/action-form";
import { Button, buttonClass } from "@/components/ui/form";
import { Mail, Phone } from "@/components/site/icons";
import { deleteContact, saveContact } from "@/lib/actions/company";

type Type = "phone" | "email" | "social";
type Contact = { id: string; type: Type; label: string; value: string; sortOrder: number; showInFooter: boolean };

const INPUT = "h-9 w-full rounded-xl border border-line bg-bg px-3 text-sm text-fg focus:border-brand focus:outline-none";
const FIELD_LABEL = "mb-1 block text-[11px] font-semibold tracking-wide text-fg-subtle uppercase";
const PLACEHOLDER: Record<Type, string> = { phone: "70116399", email: "contact@infosystems.mn", social: "https://www.facebook.com/…" };
const VALUE_LABEL: Record<Type, string> = { phone: "Дугаар", email: "И-мэйл", social: "Холбоос" };
const LABEL_HINT: Record<Type, string> = { phone: "Борлуулалт", email: "Техник дэмжлэг", social: "Facebook" };

const Link2 = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const ICON: Record<Type, (p: { className?: string }) => ReactNode> = { phone: Phone, email: Mail, social: Link2 };

/** 70116399 -> 7011-6399, as on the site. */
const display = (c: Pick<Contact, "type" | "value">) =>
  c.type === "phone" && /^\d{8}$/.test(c.value) ? `${c.value.slice(0, 4)}-${c.value.slice(4)}` : c.type === "social" ? c.value.replace(/^https?:\/\/(www\.)?/, "") : c.value;

/** Inline form for adding or editing one contact. */
function ContactForm({ contact, type, onDone }: { contact: Contact | null; type: Type; onDone: () => void }) {
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof saveContact>>, fd: FormData) => {
    const res = await saveContact(prev, fd);
    if (res?.ok) onDone();
    return res;
  }, null);
  return (
    <ActionForm action={action} className="grid gap-3 p-4 sm:grid-cols-[1fr_11rem_5rem] sm:items-end">
      {contact && <input name="id" type="hidden" value={contact.id} />}
      <input name="type" type="hidden" value={type} />
      <label>
        <span className={FIELD_LABEL}>{VALUE_LABEL[type]}</span>
        <input autoFocus className={INPUT} defaultValue={contact?.value} name="value" placeholder={PLACEHOLDER[type]} required />
      </label>
      <label>
        <span className={FIELD_LABEL}>Шошго (заавал биш)</span>
        <input className={INPUT} defaultValue={contact?.label} name="label" placeholder={LABEL_HINT[type]} />
      </label>
      <label>
        <span className={FIELD_LABEL}>Дараалал</span>
        <input className={INPUT} defaultValue={contact?.sortOrder ?? 0} min={0} name="sortOrder" type="number" />
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-3">
        <label className="flex items-center gap-1.5 text-sm text-fg-muted">
          <input defaultChecked={contact?.showInFooter ?? true} name="showInFooter" type="checkbox" /> Footer-т харуулах
        </label>
        {state && !state.ok && <span className="text-xs text-red-600 dark:text-red-400">{state.message}</span>}
        <span className="ml-auto flex gap-2">
          <button className={buttonClass("ghost", "sm")} onClick={onDone} type="button">
            Болих
          </button>
          <Button disabled={pending} size="sm">
            {pending ? "…" : contact ? "Хадгалах" : "Нэмэх"}
          </Button>
        </span>
      </div>
    </ActionForm>
  );
}

function ContactItem({ contact }: { contact: Contact }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <li className="bg-surface/60"><ContactForm contact={contact} onDone={() => setEditing(false)} type={contact.type} /></li>;
  const Icon = ICON[contact.type];
  return (
    <li className="group flex items-center gap-3 px-4 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-fg-subtle" />
      <span className="min-w-0 truncate text-sm font-medium text-fg">{display(contact)}</span>
      {contact.label && <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">{contact.label}</span>}
      {!contact.showInFooter && <span className="shrink-0 text-xs text-fg-subtle">· footer-т харагдахгүй</span>}
      <span className="ml-auto flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
        <button className={buttonClass("ghost", "sm")} onClick={() => setEditing(true)} type="button">
          Засах
        </button>
        <ConfirmButton action={deleteContact.bind(null, contact.id)} confirm={`«${display(contact)}»-г устгах уу?`} size="sm" variant="ghost">
          Устгах
        </ConfirmButton>
      </span>
    </li>
  );
}

/** One group (phones, e-mails or social links): a compact list, editing one row at a time. */
export function ContactList({ type, title, hint, items }: { type: Type; title: string; hint?: string; items: Contact[] }) {
  const [adding, setAdding] = useState(false);
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-card">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-fg">
            {title} <span className="font-normal text-fg-subtle">· {items.length}</span>
          </h3>
          {hint && <p className="text-xs text-fg-subtle">{hint}</p>}
        </div>
        {!adding && (
          <button className={`${buttonClass("secondary", "sm")} ml-auto`} onClick={() => setAdding(true)} type="button">
            + Нэмэх
          </button>
        )}
      </header>
      <ul className="divide-y divide-line">
        {items.map((c) => (
          <ContactItem contact={c} key={c.id} />
        ))}
        {!items.length && !adding && <li className="px-4 py-3 text-sm text-fg-subtle">Одоогоор алга.</li>}
        {adding && (
          <li className="bg-surface/60">
            <ContactForm contact={null} onDone={() => setAdding(false)} type={type} />
          </li>
        )}
      </ul>
    </section>
  );
}
