"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ActionForm } from "@/components/ui/action-form";
import { Button, FormMessage, Input } from "@/components/ui/form";
import { deleteComparisonRow, saveComparisonRow } from "@/lib/actions/trust";
import { useCloseOnSave } from "@/components/admin/list-editor";

type Row = { id: string; label: string; sortOrder: number; values: Record<string, string> };

/** One row of the comparison matrix as its own form; `row = null` is the «add» row. */
export function ComparisonRowForm({ row: r, products }: { row: Row | null; products: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(saveComparisonRow, null);
  useCloseOnSave(state);
  const [formKey, setFormKey] = useState(0);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (!r && state?.ok) setFormKey((k) => k + 1);
  }
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <ActionForm action={action} className="grid items-end gap-3" key={formKey} style={{ gridTemplateColumns: `minmax(10rem,14rem) repeat(${products.length}, minmax(9rem,1fr)) 4.5rem auto` }}>
        {r && <input name="id" type="hidden" value={r.id} />}
        <label className="block">
          <span className="text-xs font-semibold text-fg-subtle">{r ? "Мөр" : "Шинэ мөр"}</span>
          <Input className="h-10" defaultValue={r?.label} name="label" placeholder="Жишээ нь «Олон салбартай»" required />
        </label>
        {products.map((p) => (
          <label className="block" key={p.id}>
            <span className="text-xs font-semibold text-fg-subtle">{p.name}</span>
            <Input className="h-10" defaultValue={r?.values[p.id] ?? ""} name={`cell_${p.id}`} placeholder="✓, — эсвэл текст" />
          </label>
        ))}
        <label className="block">
          <span className="text-xs font-semibold text-fg-subtle">Дараалал</span>
          <Input className="h-10" defaultValue={r?.sortOrder ?? 0} min={0} name="sortOrder" type="number" />
        </label>
        <div className="flex items-center gap-1">
          <Button disabled={pending} size="sm" variant={r ? "secondary" : "primary"}>
            {pending ? "…" : r ? "Хадгалах" : "Нэмэх"}
          </Button>
          {r && (
            <ConfirmButton action={deleteComparisonRow.bind(null, r.id)} confirm={`«${r.label}» мөрийг устгах уу?`} size="sm" variant="ghost">
              ✕
            </ConfirmButton>
          )}
        </div>
        {state?.message && !state.ok && (
          <div className="col-span-full">
            <FormMessage state={state} />
          </div>
        )}
      </ActionForm>
    </div>
  );
}
