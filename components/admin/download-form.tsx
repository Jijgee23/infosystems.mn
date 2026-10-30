"use client";

import { useActionState } from "react";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Field, FormMessage, Input, Select } from "@/components/ui/form";
import { saveDownload } from "@/lib/actions/downloads";

export type DownloadFormValues = {
  id?: string;
  title: string;
  description: string;
  externalUrl: string;
  guideSlug: string;
  sortOrder: number;
  isPublic: boolean;
  file: { url: string; name: string; sizeKb: number | null } | null;
};

const ACCEPT = ".exe,.msi,.zip,.rar,.7z,.apk,.pdf,.xlsx,.xls,.docx,.doc";

export function DownloadForm({ item, guides, saved }: { item: DownloadFormValues; guides: { slug: string; title: string }[]; saved?: boolean }) {
  const [state, action, pending] = useActionState(saveDownload, saved ? { ok: true, message: "Хадгалагдлаа." } : null);
  const err = (k: string) => state?.errors?.[k];
  return (
    <ActionForm action={action} className="grid max-w-3xl gap-5">
      {item.id && <input name="id" type="hidden" value={item.id} />}
      <Field error={err("title")} label="Нэр">
        <Input defaultValue={item.title} invalid={!!err("title")} name="title" required />
      </Field>
      <Field error={err("description")} label="Тайлбар">
        <Input defaultValue={item.description} maxLength={500} name="description" />
      </Field>
      <div className="rounded-3xl border border-line bg-card p-5">
        <p className="text-sm font-semibold text-fg">Файл</p>
        <p className="mt-0.5 text-xs text-fg-subtle">Суулгах файл, архив, PDF, Excel (50MB хүртэл). Илүү том бол албан ёсны сайтын холбоос ашиглана уу.</p>
        {item.file && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <a className="font-semibold text-brand hover:underline" href={item.file.url}>
              {item.file.name}
            </a>
            <label className="flex items-center gap-2 text-xs text-fg-muted">
              <input name="removeFile" type="checkbox" /> Файлыг хасах
            </label>
          </div>
        )}
        <input
          accept={ACCEPT}
          className="mt-3 block w-full text-xs text-fg-muted file:mr-2 file:rounded-full file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:font-semibold file:text-brand"
          name="file"
          type="file"
        />
        {err("file") && <p className="mt-1 text-xs text-red-600">{err("file")}</p>}
      </div>
      <Field error={err("externalUrl")} hint="Албан ёсны татах хуудас (жишээ нь https://anydesk.com/en/downloads)" label="Холбоос">
        <Input defaultValue={item.externalUrl} invalid={!!err("externalUrl")} name="externalUrl" placeholder="https://" type="url" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Заавар">
          <Select defaultValue={item.guideSlug} name="guideSlug">
            <option value="">—</option>
            {guides.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field hint="Бага нь эхэнд" label="Дараалал">
          <Input defaultValue={item.sortOrder} min={0} name="sortOrder" type="number" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-fg">
        <input className="h-4 w-4 accent-[var(--brand)]" defaultChecked={item.isPublic} name="isPublic" type="checkbox" />
        Сайт дээр харуулах
      </label>
      <FormMessage state={state} />
      <div>
        <Button disabled={pending}>{pending ? "Хадгалж байна…" : "Хадгалах"}</Button>
      </div>
    </ActionForm>
  );
}
