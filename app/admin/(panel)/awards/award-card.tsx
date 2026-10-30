"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ImageUpload } from "@/components/admin/image-upload";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Field, FormMessage, Input, Textarea } from "@/components/ui/form";
import { deleteAward, saveAward } from "@/lib/actions/company";
import { useCloseOnSave } from "@/components/admin/list-editor";

type Award = { id: string; title: string; issuer: string; year: string; description: string; sortOrder: number; isPublic: boolean; imageUrl: string };

export function AwardCard({ award: a }: { award: Award | null }) {
  const [state, action, pending] = useActionState(saveAward, null);
  useCloseOnSave(state);
  const err = (k: string) => state?.errors?.[k];
  // Clear the "new" card after each successful save.
  const [formKey, setFormKey] = useState(0);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (!a && state?.ok) setFormKey((k) => k + 1);
  }
  return (
    <div className="rounded-3xl border border-line bg-card p-4 sm:p-5">
      <ActionForm action={action} className="flex flex-col gap-5 sm:flex-row" key={formKey}>
        {a && <input name="id" type="hidden" value={a.id} />}
        <div className="mx-auto w-44 shrink-0 sm:mx-0">
          <ImageUpload currentUrl={a?.imageUrl ?? null} error={err("image")} name="image" required={!a} />
        </div>
        <div className="grid min-w-0 flex-1 content-start gap-3 sm:grid-cols-2">
          <Field className="sm:col-span-2" error={err("title")} label="Нэр *">
            <Input className="h-10" defaultValue={a?.title} invalid={!!err("title")} name="title" placeholder="Шилдэг програм хангамж" required />
          </Field>
          <Field label="Олгосон байгууллага">
            <Input className="h-10" defaultValue={a?.issuer} name="issuer" placeholder="Сангийн яам" />
          </Field>
          <Field error={err("year")} label="Он">
            <Input className="h-10" defaultValue={a?.year} inputMode="numeric" invalid={!!err("year")} maxLength={4} name="year" placeholder="2024" />
          </Field>
          <Field className="sm:col-span-2" label="Тайлбар">
            <Textarea defaultValue={a?.description} maxLength={1000} name="description" rows={2} />
          </Field>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <label className="flex items-center gap-1.5 text-sm text-fg-muted">
              <input defaultChecked={a?.isPublic ?? true} name="isPublic" type="checkbox" /> Сайтад харуулах
            </label>
            <label className="flex items-center gap-1.5 text-sm text-fg-muted">
              Дараалал
              <input className="h-9 w-16 rounded-xl border border-line bg-card px-2 text-sm text-fg" defaultValue={a?.sortOrder ?? 0} min={0} name="sortOrder" type="number" />
            </label>
            <span className="flex-1" />
            {a && (
              <ConfirmButton action={deleteAward.bind(null, a.id)} confirm={`«${a.title}»-г устгах уу?`} size="sm" variant="ghost">
                Устгах
              </ConfirmButton>
            )}
            <Button disabled={pending} size="sm" variant={a ? "secondary" : "primary"}>
              {pending ? "Хадгалж байна…" : a ? "Хадгалах" : "Нэмэх"}
            </Button>
          </div>
          {state?.message && (
            <div className="sm:col-span-2">
              <FormMessage state={state} />
            </div>
          )}
        </div>
      </ActionForm>
    </div>
  );
}
