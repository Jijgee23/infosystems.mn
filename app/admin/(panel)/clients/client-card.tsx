"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ImageUpload } from "@/components/admin/image-upload";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Field, FormMessage, Input } from "@/components/ui/form";
import { deleteClientLogo, saveClientLogo } from "@/lib/actions/trust";
import { useCloseOnSave } from "@/components/admin/list-editor";

type C = { id: string; name: string; url: string; isPublic: boolean; sortOrder: number; logoUrl: string };

export function ClientCard({ item: c }: { item: C | null }) {
  const [state, action, pending] = useActionState(saveClientLogo, null);
  useCloseOnSave(state);
  const err = (k: string) => state?.errors?.[k];
  const [formKey, setFormKey] = useState(0);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (!c && state?.ok) setFormKey((k) => k + 1);
  }
  return (
    <div className="rounded-3xl border border-line bg-card p-4 sm:p-5">
      <ActionForm action={action} className="flex flex-col gap-4" key={formKey}>
        {c && <input name="id" type="hidden" value={c.id} />}
        <div className="mx-auto w-full max-w-[12rem]">
          <ImageUpload aspect="aspect-[3/2]" currentUrl={c?.logoUrl ?? null} error={err("logo")} maxSide={600} name="logo" required={!c} />
        </div>
        <Field error={err("name")} label="Байгууллагын нэр *">
          <Input className="h-10" defaultValue={c?.name} invalid={!!err("name")} name="name" required />
        </Field>
        <Field error={err("url")} label="Вэбсайт">
          <Input className="h-10" defaultValue={c?.url} invalid={!!err("url")} name="url" placeholder="https://" type="url" />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-sm text-fg-muted">
            <input defaultChecked={c?.isPublic ?? true} name="isPublic" type="checkbox" /> Харуулах
          </label>
          <label className="flex items-center gap-1.5 text-sm text-fg-muted">
            Дараалал
            <input className="h-9 w-16 rounded-xl border border-line bg-card px-2 text-sm text-fg" defaultValue={c?.sortOrder ?? 0} min={0} name="sortOrder" type="number" />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex-1" />
          {c && (
            <ConfirmButton action={deleteClientLogo.bind(null, c.id)} confirm={`«${c.name}»-г устгах уу?`} size="sm" variant="ghost">
              Устгах
            </ConfirmButton>
          )}
          <Button disabled={pending} size="sm" variant={c ? "secondary" : "primary"}>
            {pending ? "Хадгалж байна…" : c ? "Хадгалах" : "Нэмэх"}
          </Button>
        </div>
        {state?.message && <FormMessage state={state} />}
      </ActionForm>
    </div>
  );
}
