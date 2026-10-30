"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ImageUpload } from "@/components/admin/image-upload";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { deleteTestimonial, saveTestimonial } from "@/lib/actions/trust";
import { useCloseOnSave } from "@/components/admin/list-editor";

type T = { id: string; quote: string; authorName: string; authorTitle: string; companyName: string; productId: string; isPublic: boolean; sortOrder: number; photoUrl: string | null };

export function TestimonialCard({ item: t, products }: { item: T | null; products: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(saveTestimonial, null);
  useCloseOnSave(state);
  const err = (k: string) => state?.errors?.[k];
  // Clear the "new" card after each successful save.
  const [formKey, setFormKey] = useState(0);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (!t && state?.ok) setFormKey((k) => k + 1);
  }
  return (
    <div className="rounded-3xl border border-line bg-card p-4 sm:p-5">
      <ActionForm action={action} className="flex flex-col gap-5 sm:flex-row" key={formKey}>
        {t && <input name="id" type="hidden" value={t.id} />}
        <div className="mx-auto w-28 shrink-0 sm:mx-0">
          <ImageUpload aspect="aspect-square" cover currentUrl={t?.photoUrl ?? null} error={err("photo")} maxSide={400} name="photo" />
          <p className="mt-1 text-center text-[11px] text-fg-subtle">Зураг (заавал биш)</p>
          {t?.photoUrl && (
            <label className="mt-1 flex items-center justify-center gap-1.5 text-xs text-fg-muted">
              <input name="remove_photo" type="checkbox" /> Устгах
            </label>
          )}
        </div>
        <div className="grid min-w-0 flex-1 content-start gap-3 sm:grid-cols-2">
          <Field className="sm:col-span-2" error={err("quote")} label="Сэтгэгдэл *">
            <Textarea defaultValue={t?.quote} invalid={!!err("quote")} maxLength={2000} name="quote" required rows={3} />
          </Field>
          <Field error={err("authorName")} label="Нэр *">
            <Input className="h-10" defaultValue={t?.authorName} invalid={!!err("authorName")} name="authorName" placeholder="Б.Болд" required />
          </Field>
          <Field label="Албан тушаал">
            <Input className="h-10" defaultValue={t?.authorTitle} name="authorTitle" placeholder="Ерөнхий нягтлан бодогч" />
          </Field>
          <Field label="Байгууллага">
            <Input className="h-10" defaultValue={t?.companyName} name="companyName" />
          </Field>
          <Field hint="Сонговол тухайн бүтээгдэхүүний хуудсанд ч гарна" label="Бүтээгдэхүүн">
            <Select className="h-10" defaultValue={t?.productId ?? ""} name="productId">
              <option value="">—</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <label className="flex items-center gap-1.5 text-sm text-fg-muted">
              <input defaultChecked={t?.isPublic ?? true} name="isPublic" type="checkbox" /> Сайтад харуулах
            </label>
            <label className="flex items-center gap-1.5 text-sm text-fg-muted">
              Дараалал
              <input className="h-9 w-16 rounded-xl border border-line bg-card px-2 text-sm text-fg" defaultValue={t?.sortOrder ?? 0} min={0} name="sortOrder" type="number" />
            </label>
            <span className="flex-1" />
            {t && (
              <ConfirmButton action={deleteTestimonial.bind(null, t.id)} confirm={`${t.authorName}-ийн сэтгэгдлийг устгах уу?`} size="sm" variant="ghost">
                Устгах
              </ConfirmButton>
            )}
            <Button disabled={pending} size="sm" variant={t ? "secondary" : "primary"}>
              {pending ? "Хадгалж байна…" : t ? "Хадгалах" : "Нэмэх"}
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
