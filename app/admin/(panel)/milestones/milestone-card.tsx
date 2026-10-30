"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ActionForm } from "@/components/ui/action-form";
import { Badge, Button, Field, FormMessage, Input, Textarea } from "@/components/ui/form";
import { deleteMilestone, saveMilestone, setMilestoneVisible } from "@/lib/actions/company";
import { useCloseOnSave } from "@/components/admin/list-editor";

type Milestone = { id: string; year: number; title: string; description: string; sortOrder: number; isPublic: boolean };

export function MilestoneCard({ milestone: m }: { milestone: Milestone | null }) {
  const [state, action, pending] = useActionState(saveMilestone, null);
  useCloseOnSave(state);
  const err = (k: string) => state?.errors?.[k];
  // Clear the "new" card after each successful save.
  const [formKey, setFormKey] = useState(0);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (!m && state?.ok) setFormKey((k) => k + 1);
  }
  return (
    <div className="rounded-3xl border border-line bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-3">
        <p className="font-semibold text-fg">{m ? m.year : "Шинэ үйл явдал нэмэх"}</p>
        {m && (m.isPublic ? <Badge tone="accent">Сайтад харагдана</Badge> : <Badge>Нуусан</Badge>)}
        <span className="flex-1" />
        {m && (
          <ConfirmButton action={setMilestoneVisible.bind(null, m.id, !m.isPublic)} size="sm" variant="secondary">
            {m.isPublic ? "Нуух" : "Харуулах"}
          </ConfirmButton>
        )}
      </div>
      <ActionForm action={action} className="grid gap-3 sm:grid-cols-[7rem_1fr]" key={formKey}>
        {m && <input name="id" type="hidden" value={m.id} />}
        <Field error={err("year")} label="Он *">
          <Input className="h-10" defaultValue={m?.year} inputMode="numeric" invalid={!!err("year")} maxLength={4} name="year" placeholder="2024" required />
        </Field>
        <Field error={err("title")} label="Гарчиг *">
          <Input className="h-10" defaultValue={m?.title} invalid={!!err("title")} name="title" placeholder="MACS ERP шинэ хувилбар" required />
        </Field>
        <Field className="sm:col-span-2" error={err("description")} label="Тайлбар">
          <Textarea defaultValue={m?.description} maxLength={1000} name="description" rows={2} />
        </Field>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          {!m && (
            <label className="flex items-center gap-1.5 text-sm text-fg-muted">
              <input defaultChecked name="isPublic" type="checkbox" /> Сайтад харуулах
            </label>
          )}
          <label className="flex items-center gap-1.5 text-sm text-fg-muted" title="Нэг онд хэд хэдэн үйл явдал байвал дарааллыг тогтооно">
            Дараалал
            <input className="h-9 w-16 rounded-xl border border-line bg-card px-2 text-sm text-fg" defaultValue={m?.sortOrder ?? 0} min={0} name="sortOrder" type="number" />
          </label>
          <span className="flex-1" />
          {m && (
            <ConfirmButton action={deleteMilestone.bind(null, m.id)} confirm={`${m.year} — «${m.title}»-г устгах уу?`} size="sm" variant="ghost">
              Устгах
            </ConfirmButton>
          )}
          <Button disabled={pending} size="sm" variant={m ? "secondary" : "primary"}>
            {pending ? "Хадгалж байна…" : m ? "Хадгалах" : "Нэмэх"}
          </Button>
        </div>
        {state?.message && (
          <div className="sm:col-span-2">
            <FormMessage state={state} />
          </div>
        )}
      </ActionForm>
    </div>
  );
}
