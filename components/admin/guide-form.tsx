"use client";

import { useActionState } from "react";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Field, FormMessage, Input, Select } from "@/components/ui/form";
import { saveGuide } from "@/lib/actions/guides";
import { GUIDE_CATEGORIES } from "@/lib/guide-categories";
import { RichTextEditor } from "./rich-text-editor";

export type GuideFormValues = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  sortOrder: number;
  body: string;
  /** `YYYY-MM-DD`, or "" */
  contentDate: string;
  /** `YYYY-MM-DDTHH:mm` in Ulaanbaatar time, or "" for drafts */
  publishedAt: string;
};

export function GuideForm({ guide, saved }: { guide: GuideFormValues; saved?: boolean }) {
  const [state, action, pending] = useActionState(saveGuide, saved ? { ok: true, message: "Хадгалагдлаа." } : null);
  const err = (k: string) => state?.errors?.[k];
  return (
    <ActionForm action={action} className="grid gap-6 xl:grid-cols-[1fr_18rem]">
      {guide.id && <input name="id" type="hidden" value={guide.id} />}
      <div className="space-y-5">
        <Field error={err("title")} label="Гарчиг">
          <Input defaultValue={guide.title} invalid={!!err("title")} name="title" required />
        </Field>
        <div>
          <span className="text-sm font-semibold text-fg">Агуулга</span>
          <p className="mt-0.5 text-xs text-fg-subtle">
            YouTube-ийн холбоосыг тусдаа мөрөнд оруулбал сайт дээр видео карт болж харагдана. Тусдаа мөрөнд байгаа зургийг дарж томруулж болно.
          </p>
          <RichTextEditor initialHtml={guide.body} name="body" />
        </div>
      </div>
      <aside className="space-y-5">
        <div className="space-y-4 rounded-3xl border border-line bg-card p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-fg">
            <input className="h-4 w-4 accent-[var(--brand)]" defaultChecked={!!guide.publishedAt} name="published" type="checkbox" />
            Нийтлэх
          </label>
          <Field hint="Хоосон бол одоо" label="Нийтлэх огноо">
            <Input className="h-10" defaultValue={guide.publishedAt} name="publishedAt" type="datetime-local" />
          </Field>
          <FormMessage state={state} />
          <Button className="w-full" disabled={pending}>
            {pending ? "Хадгалж байна…" : "Хадгалах"}
          </Button>
        </div>
        <div className="space-y-4 rounded-3xl border border-line bg-card p-5">
          <Field label="Бүлэг">
            <Select className="h-10" defaultValue={guide.category || GUIDE_CATEGORIES[0].key} name="category">
              {GUIDE_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field error={err("sortOrder")} hint="Бүлэг доторх дараалал (алхмын дугаар). Бага нь эхэнд." label="Дараалал">
            <Input className="h-10" defaultValue={guide.sortOrder} min={0} name="sortOrder" type="number" />
          </Field>
          <Field error={err("contentDate")} hint="«Шинэчилсэн» огноо: заавар хамгийн сүүлд өөрчлөгдсөн өдөр" label="Шинэчилсэн огноо">
            <Input className="h-10" defaultValue={guide.contentDate} name="contentDate" type="date" />
          </Field>
          <Field error={err("slug")} hint="Хоосон бол гарчгаас үүснэ" label="Slug (URL)">
            <Input className="h-10" defaultValue={guide.slug} invalid={!!err("slug")} name="slug" />
          </Field>
        </div>
      </aside>
    </ActionForm>
  );
}
