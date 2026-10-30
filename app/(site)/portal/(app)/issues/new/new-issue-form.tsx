"use client";

import { useActionState } from "react";
import { Button, Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { createIssue } from "@/lib/actions/issues";
import { ActionForm } from "@/components/ui/action-form";

export function NewIssueForm({ products }: { products: { id: string; title: string }[] }) {
  const [state, action, pending] = useActionState(createIssue, null);
  const err = (k: string) => state?.errors?.[k];
  return (
    <ActionForm action={action} className="space-y-5">
      {products.length > 0 && (
        <Field label="Бүтээгдэхүүн">
          <Select defaultValue="" name="productId">
            <option value="">Сонгоогүй</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <Field error={err("title")} label="Гарчиг">
        <Input invalid={!!err("title")} maxLength={200} name="title" required />
      </Field>
      <Field error={err("content")} label="Дэлгэрэнгүй">
        <Textarea invalid={!!err("content")} name="content" placeholder="Ямар цонхонд, ямар үйлдэл хийхэд асуудал гарсныг бичнэ үү." required rows={8} />
      </Field>
      <Field hint="Зураг эсвэл PDF, 5 хүртэл файл, тус бүр 10MB хүртэл" label="Хавсралт">
        <input accept="image/png,image/jpeg,image/webp,image/gif,application/pdf" className="mt-1.5 block w-full text-sm text-fg-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-soft file:px-4 file:py-2 file:font-semibold file:text-brand" multiple name="attachments" type="file" />
      </Field>
      <FormMessage state={state} />
      <Button disabled={pending}>{pending ? "Илгээж байна…" : "Илгээх"}</Button>
    </ActionForm>
  );
}
