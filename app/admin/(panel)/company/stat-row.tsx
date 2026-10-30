"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ActionForm } from "@/components/ui/action-form";
import { Button, buttonClass } from "@/components/ui/form";
import { deleteStat, saveStat } from "@/lib/actions/trust";

/** A saved figure; `shown` is how it reads on the site (placeholders filled in). */
type Stat = { id: string; value: string; label: string; note: string; isPublic: boolean; sortOrder: number; shown: { value: string; note: string | null } };

const INPUT = "h-9 w-full rounded-xl border border-line bg-bg px-3 text-sm text-fg focus:border-brand focus:outline-none";
const FIELD_LABEL = "mb-1 block text-[11px] font-semibold tracking-wide text-fg-subtle uppercase";

/** Inline form for adding or editing one figure. */
function StatForm({ stat, onDone }: { stat: Stat | null; onDone: () => void }) {
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof saveStat>>, fd: FormData) => {
    const res = await saveStat(prev, fd);
    if (res?.ok) onDone();
    return res;
  }, null);
  return (
    <ActionForm action={action} className="grid gap-3 p-4 sm:grid-cols-[7rem_1fr_1fr_5rem] sm:items-end">
      {stat && <input name="id" type="hidden" value={stat.id} />}
      <label>
        <span className={FIELD_LABEL}>Тоо</span>
        <input autoFocus className={`${INPUT} font-semibold`} defaultValue={stat?.value} maxLength={40} name="value" placeholder="500+" required />
      </label>
      <label>
        <span className={FIELD_LABEL}>Юуг тоолсон</span>
        <input className={INPUT} defaultValue={stat?.label} maxLength={120} name="label" placeholder="хэрэглэгч байгууллага" required />
      </label>
      <label>
        <span className={FIELD_LABEL}>Тайлбар (заавал биш)</span>
        <input className={INPUT} defaultValue={stat?.note} maxLength={80} name="note" placeholder="2025 оны байдлаар" />
      </label>
      <label>
        <span className={FIELD_LABEL}>Дараалал</span>
        <input className={INPUT} defaultValue={stat?.sortOrder ?? 0} min={0} name="sortOrder" type="number" />
      </label>
      <details className="text-xs text-fg-subtle sm:col-span-4">
        <summary className="cursor-pointer select-none">Автоматаар шинэчлэгдэх утга ашиглах</summary>
        <p className="mt-1.5 leading-relaxed">
          <code>{"{years}"}</code> үйл ажиллагаа явуулсан жил · <code>{"{founded}"}</code> үүсгэн байгуулагдсан он · <code>{"{products}"}</code> бүтээгдэхүүний тоо ·{" "}
          <code>{"{modules}"}</code> модулийн тоо. Жишээ нь тоо «{"{years}"}+», тайлбар «{"{founded}"} оноос».
        </p>
      </details>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-4">
        <label className="flex items-center gap-1.5 text-sm text-fg-muted">
          <input defaultChecked={stat?.isPublic ?? true} name="isPublic" type="checkbox" /> Сайт дээр харуулах
        </label>
        {state && !state.ok && <span className="text-xs text-red-600 dark:text-red-400">{state.errors?.value ?? state.errors?.label ?? state.message}</span>}
        <span className="ml-auto flex gap-2">
          <button className={buttonClass("ghost", "sm")} onClick={onDone} type="button">
            Болих
          </button>
          <Button disabled={pending} size="sm">
            {pending ? "…" : stat ? "Хадгалах" : "Нэмэх"}
          </Button>
        </span>
      </div>
    </ActionForm>
  );
}

function StatItem({ stat }: { stat: Stat }) {
  const [editing, setEditing] = useState(false);
  if (editing)
    return (
      <li className="bg-surface/60">
        <StatForm onDone={() => setEditing(false)} stat={stat} />
      </li>
    );
  return (
    <li className={`group flex items-center gap-3 px-4 py-2.5 ${stat.isPublic ? "" : "opacity-60"}`}>
      <span className="w-16 shrink-0 font-display text-base font-extrabold text-brand tabular-nums">{stat.shown.value}</span>
      <span className="min-w-0 text-sm">
        <span className="font-medium text-fg">{stat.label}</span>
        {stat.shown.note && <span className="text-fg-subtle"> · {stat.shown.note}</span>}
      </span>
      {!stat.isPublic && <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">Нуусан</span>}
      <span className="ml-auto flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
        <button className={buttonClass("ghost", "sm")} onClick={() => setEditing(true)} type="button">
          Засах
        </button>
        <ConfirmButton action={deleteStat.bind(null, stat.id)} confirm={`«${stat.shown.value} ${stat.label}»-г устгах уу?`} size="sm" variant="ghost">
          Устгах
        </ConfirmButton>
      </span>
    </li>
  );
}

/** The admin-entered figures as a compact list, editing one row at a time. */
export function StatList({ items }: { items: Stat[] }) {
  const [adding, setAdding] = useState(false);
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-card">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold text-fg">
          Таны оруулсан үзүүлэлт <span className="font-normal text-fg-subtle">· {items.length}</span>
        </h3>
        {!adding && (
          <button className={`${buttonClass("secondary", "sm")} ml-auto`} onClick={() => setAdding(true)} type="button">
            + Нэмэх
          </button>
        )}
      </header>
      <ul className="divide-y divide-line">
        {items.map((s) => (
          <StatItem key={s.id} stat={s} />
        ))}
        {!items.length && !adding && <li className="px-4 py-3 text-sm text-fg-subtle">Одоогоор алга. Сайт дээр автомат тоонууд харагдаж байна.</li>}
        {adding && (
          <li className="bg-surface/60">
            <StatForm onDone={() => setAdding(false)} stat={null} />
          </li>
        )}
      </ul>
    </section>
  );
}
