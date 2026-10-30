"use client";

import { useActionState } from "react";
import { Button, Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { savePost } from "@/lib/actions/admin";
import { RichTextEditor } from "./rich-text-editor";
import { ActionForm } from "@/components/ui/action-form";
import { POST_CATEGORIES } from "@/lib/post-categories";

export type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  /** `YYYY-MM-DDTHH:mm` in Ulaanbaatar time, or "" for drafts */
  publishedAt: string;
  imageUrl: string | null;
};

export function PostForm({ post, saved }: { post: PostFormValues; saved?: boolean }) {
  const [state, action, pending] = useActionState(savePost, saved ? { ok: true, message: "Хадгалагдлаа." } : null);
  const err = (k: string) => state?.errors?.[k];
  return (
    <ActionForm action={action} className="grid gap-6 xl:grid-cols-[1fr_18rem]">
      {post.id && <input name="id" type="hidden" value={post.id} />}
      <div className="space-y-5">
        <Field error={err("title")} label="Гарчиг">
          <Input defaultValue={post.title} invalid={!!err("title")} name="title" required />
        </Field>
        <Field error={err("excerpt")} hint="Жагсаалт болон хайлтын үр дүнд харагдана. Хоосон бол агуулгаас автоматаар авна." label="Товч тайлбар">
          <Textarea defaultValue={post.excerpt} maxLength={500} name="excerpt" rows={2} />
        </Field>
        <div>
          <span className="text-sm font-semibold text-fg">Агуулга</span>
          <RichTextEditor initialHtml={post.body} name="body" />
        </div>
      </div>
      <aside className="space-y-5">
        <div className="space-y-4 rounded-3xl border border-line bg-card p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-fg">
            <input className="h-4 w-4 accent-[var(--brand)]" defaultChecked={!!post.publishedAt} name="published" type="checkbox" />
            Нийтлэх
          </label>
          <Field hint="Хоосон бол одоо" label="Нийтлэх огноо">
            <Input className="h-10" defaultValue={post.publishedAt} name="publishedAt" type="datetime-local" />
          </Field>
          <FormMessage state={state} />
          <Button className="w-full" disabled={pending}>
            {pending ? "Хадгалж байна…" : "Хадгалах"}
          </Button>
        </div>
        <div className="space-y-4 rounded-3xl border border-line bg-card p-5">
          <Field error={err("slug")} hint="Хоосон бол гарчгаас үүснэ" label="Slug (URL)">
            <Input className="h-10" defaultValue={post.slug} invalid={!!err("slug")} name="slug" />
          </Field>
          <Field label="Ангилал">
            <Select className="h-10" defaultValue={post.category || POST_CATEGORIES[0].name} name="category">
              {POST_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <div>
            <span className="text-sm font-semibold text-fg">Нүүр зураг</span>
            {post.imageUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="mt-1.5 aspect-video w-full rounded-xl border border-line object-cover" src={post.imageUrl} />
                <label className="mt-2 flex items-center gap-2 text-xs text-fg-muted">
                  <input name="removeImage" type="checkbox" /> Зургийг устгах
                </label>
              </>
            )}
            <input accept="image/png,image/jpeg,image/webp,image/gif" className="mt-2 block w-full text-xs text-fg-muted file:mr-2 file:rounded-full file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:font-semibold file:text-brand" name="image" type="file" />
          </div>
        </div>
      </aside>
    </ActionForm>
  );
}
