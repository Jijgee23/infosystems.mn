"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/form";
import { deleteVersion, saveVersion } from "@/lib/actions/admin";
import { ActionForm } from "@/components/ui/action-form";
import { useCloseOnSave } from "@/components/admin/list-editor";

const INPUT = "h-10 rounded-xl border border-line bg-card px-3 text-sm text-fg focus:border-brand focus:outline-none";

type Row = { id: string; changedDate: string; productname: string; description: string };

export function VersionRow({ row }: { row: Row | null }) {
  const [state, action, pending] = useActionState(saveVersion, null);
  useCloseOnSave(state);
  // Clear the "new" row after each successful save.
  const [formKey, setFormKey] = useState(0);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (!row && state?.ok) setFormKey((k) => k + 1);
  }
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="rounded-2xl border border-line bg-card p-3">
      <ActionForm
        action={action}
        className="grid gap-2 sm:grid-cols-[9.5rem_8rem_1fr_auto]"
        key={formKey}
      >
        {row && <input name="id" type="hidden" value={row.id} />}
        <input aria-label="Огноо" className={INPUT} defaultValue={row?.changedDate ?? today} name="changedDate" required type="date" />
        <select aria-label="Програм" className={INPUT} defaultValue={row?.productname ?? "MACS"} name="productname">
          <option value="MACS">MACS</option>
          <option value="POS">POS</option>
          <option value="MACSPOS">MACSPOS</option>
        </select>
        <textarea aria-label="Тайлбар" className={`${INPUT} h-auto min-h-10 py-2`} defaultValue={row?.description} name="description" placeholder={row ? "" : "Шинэ өөрчлөлтийн тайлбар"} required rows={1} />
        <div className="flex items-start gap-1">
          <Button disabled={pending} size="sm" variant={row ? "secondary" : "primary"}>
            {row ? "Хадгалах" : "Нэмэх"}
          </Button>
          {row && (
            <ConfirmButton action={deleteVersion.bind(null, row.id)} confirm="Устгах уу?" size="sm" variant="ghost">
              ✕
            </ConfirmButton>
          )}
        </div>
      </ActionForm>
      {state && !state.ok && <p className="mt-1 text-xs text-red-600">{state.message}</p>}
    </div>
  );
}
