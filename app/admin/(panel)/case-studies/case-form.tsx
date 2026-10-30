"use client";

import { useActionState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Field, FormMessage, Input, Textarea } from "@/components/ui/form";
import { saveCaseStudy } from "@/lib/actions/trust";
import { SOLUTIONS } from "@/lib/site";

export type CaseValues = {
  id?: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  summary: string;
  highlights: string;
  body: string;
  productIds: string[];
  sortOrder: number;
  published: boolean;
  coverUrl: string | null;
  logoUrl: string | null;
};

const TEMPLATE = "<h2>Сорилт</h2><p></p><h2>Шийдэл</h2><p></p><h2>Үр дүн</h2><p></p>";

export function CaseForm({ value: c, products, saved }: { value: CaseValues; products: { id: string; name: string }[]; saved?: boolean }) {
  const [state, action, pending] = useActionState(saveCaseStudy, saved ? { ok: true, message: "Хадгалагдлаа." } : null);
  const err = (k: string) => state?.errors?.[k];
  return (
    <ActionForm action={action} className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      {c.id && <input name="id" type="hidden" value={c.id} />}
      <div className="space-y-5 rounded-3xl border border-line bg-card p-5 sm:p-6">
        <Field error={err("title")} label="Гарчиг *">
          <Input defaultValue={c.title} invalid={!!err("title")} name="title" placeholder="Сарын хаалтыг 3 хоногоос 1 өдөр болгосон нь" required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field error={err("clientName")} label="Байгууллага *">
            <Input defaultValue={c.clientName} invalid={!!err("clientName")} name="clientName" required />
          </Field>
          <Field label="Салбар">
            <Input defaultValue={c.industry} list="case-industries" name="industry" />
            <datalist id="case-industries">
              {SOLUTIONS.map((s) => (
                <option key={s.slug} value={s.name} />
              ))}
            </datalist>
          </Field>
        </div>
        <Field hint="Жагсаалтын картад гарах 1–2 өгүүлбэр" label="Товч">
          <Textarea defaultValue={c.summary} maxLength={600} name="summary" rows={2} />
        </Field>
        <Field hint="Мөр бүрт «утга | тайлбар», 3 хүртэл. Жишээ нь: 3 → 1 өдөр | сарын хаалт" label="Гол үр дүн">
          <Textarea defaultValue={c.highlights} maxLength={600} name="highlights" placeholder={"3 → 1 өдөр | сарын хаалт\n12 салбар | нэг системд"} rows={3} />
        </Field>
        <div>
          <span className="text-sm font-semibold text-fg">Дэлгэрэнгүй</span>
          <span className="block text-xs text-fg-subtle">Сорилт, шийдэл, үр дүн гэсэн бүтэцтэй бичихийг зөвлөж байна.</span>
          <RichTextEditor initialHtml={c.body || TEMPLATE} name="body" />
        </div>
      </div>
      <aside className="space-y-5">
        <div className="space-y-4 rounded-3xl border border-line bg-card p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-fg">
            <input className="h-4 w-4" defaultChecked={c.published} name="published" type="checkbox" />
            Нийтлэх
          </label>
          <FormMessage state={state} />
          <Button className="w-full" disabled={pending}>
            {pending ? "Хадгалж байна…" : "Хадгалах"}
          </Button>
        </div>
        <div className="space-y-4 rounded-3xl border border-line bg-card p-5">
          <div>
            <span className="text-sm font-semibold text-fg">Ашигласан бүтээгдэхүүн</span>
            <span className="block text-xs text-fg-subtle">Тухайн бүтээгдэхүүний хуудсанд энэ түүх гарна</span>
            <div className="mt-2 grid gap-1.5">
              {products.map((p) => (
                <label className="flex items-center gap-2 text-sm text-fg-muted" key={p.id}>
                  <input defaultChecked={c.productIds.includes(p.id)} name="products" type="checkbox" value={p.id} /> {p.name}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Дараалал">
              <Input className="h-10" defaultValue={c.sortOrder} min={0} name="sortOrder" type="number" />
            </Field>
            <Field error={err("slug")} label="Slug">
              <Input className="h-10" defaultValue={c.slug} invalid={!!err("slug")} name="slug" placeholder="автомат" />
            </Field>
          </div>
        </div>
        <div className="space-y-5 rounded-3xl border border-line bg-card p-5">
          <Picture aspect="aspect-video" cover currentUrl={c.coverUrl} error={err("cover")} label="Нүүр зураг" maxSide={2000} name="cover" width="w-full" />
          <Picture aspect="aspect-[3/2]" currentUrl={c.logoUrl} error={err("logo")} label="Байгууллагын лого" maxSide={600} name="logo" width="w-40" />
        </div>
      </aside>
    </ActionForm>
  );
}

function Picture({ label, name, currentUrl, error, width, ...rest }: { label: string; name: string; currentUrl: string | null; error?: string; width: string; aspect: string; maxSide: number; cover?: boolean }) {
  return (
    <div>
      <span className="text-sm font-semibold text-fg">{label}</span>
      <div className={`mx-auto mt-2 ${width}`}>
        <ImageUpload currentUrl={currentUrl} error={error} name={name} {...rest} />
      </div>
      {currentUrl && (
        <label className="mt-1 flex items-center justify-center gap-2 text-xs text-fg-muted">
          <input name={`remove_${name}`} type="checkbox" /> Устгах
        </label>
      )}
    </div>
  );
}
