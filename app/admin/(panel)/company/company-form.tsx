"use client";

import { useActionState, type ReactNode } from "react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Card, Field, FormMessage, Input, Textarea } from "@/components/ui/form";
import { saveCompany } from "@/lib/actions/company";

/** One tab's form: its fields in a card, the save button under them. saveCompany only stores the fields it receives. */
function SettingsForm({ children, title, description }: { children: (err: (k: string) => string | undefined) => ReactNode; title: string; description: string }) {
  const [state, action, pending] = useActionState(saveCompany, null);
  const err = (k: string) => state?.errors?.[k];
  return (
    <ActionForm action={action} className="max-w-3xl">
      <Card className="space-y-5">
        <div>
          <h2 className="font-display text-lg font-bold text-fg">{title}</h2>
          <p className="mt-0.5 text-sm text-fg-muted">{description}</p>
        </div>
        {children(err)}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line pt-4">
          <div className="mr-auto">
            <FormMessage state={state} />
          </div>
          <Button disabled={pending}>{pending ? "Хадгалж байна…" : "Хадгалах"}</Button>
        </div>
      </Card>
    </ActionForm>
  );
}

export function ProfileForm({ value }: { value: { name: string; legalName: string; foundedYear: string; shortDescription: string; about: string } }) {
  return (
    <SettingsForm description="Сайтын footer, «Бидний тухай» хуудас, хайлтын үр дүнд харагдана." title="Ерөнхий мэдээлэл">
      {(err) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field error={err("name")} label="Нэр">
              <Input defaultValue={value.name} invalid={!!err("name")} name="name" required />
            </Field>
            <Field hint="Footer-ийн © мөрөнд" label="Хуулийн этгээдийн нэр">
              <Input defaultValue={value.legalName} name="legalName" placeholder="Инфосистемс Монголиа ХХК" />
            </Field>
          </div>
          <Field error={err("foundedYear")} hint="Тоон үзүүлэлтийн «… жил салбартаа»-г үүнээс тооцно" label="Үүсгэн байгуулагдсан он">
            <Input className="max-w-40" defaultValue={value.foundedYear} inputMode="numeric" invalid={!!err("foundedYear")} name="foundedYear" placeholder="1997" />
          </Field>
          <Field hint="1–2 өгүүлбэр. Footer болон хайлтын үр дүнд гарна." label="Товч тайлбар">
            <Textarea defaultValue={value.shortDescription} maxLength={500} name="shortDescription" rows={3} />
          </Field>
          <div>
            <span className="text-sm font-semibold text-fg">Дэлгэрэнгүй танилцуулга</span>
            <p className="mb-1.5 text-xs text-fg-subtle">«Бидний тухай» хуудасны үндсэн текст.</p>
            <RichTextEditor initialHtml={value.about} name="about" />
          </div>
        </>
      )}
    </SettingsForm>
  );
}

export function LocationForm({
  value,
}: {
  value: { address: string; locationName: string; latitude: string; longitude: string; mapUrl: string; workingHours: string };
}) {
  return (
    <SettingsForm description="«Холбоо барих» хуудас, footer болон газрын зурагт харагдана." title="Хаяг, ажлын цаг">
      {(err) => (
        <>
          <Field label="Хаяг">
            <Textarea defaultValue={value.address} name="address" placeholder="Улаанбаатар хот, Чингэлтэй дүүрэг, …" rows={2} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field hint="Хаягийн товч нэр (байр, төв)" label="Байршлын нэр">
              <Input defaultValue={value.locationName} name="locationName" placeholder="Баянбогд плаза" />
            </Field>
            <Field label="Ажлын цаг">
              <Input defaultValue={value.workingHours} name="workingHours" placeholder="Даваа–Баасан 09:00–18:00" />
            </Field>
          </div>
          <details className="group rounded-2xl border border-line p-4 open:pb-5" open={!!(value.latitude || value.longitude || value.mapUrl)}>
            <summary className="cursor-pointer list-none text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden">
              <span className="inline-block transition-transform group-open:rotate-90">›</span> Газрын зураг (заавал биш)
              <span className="ml-2 font-normal text-fg-subtle">Хоосон бол хаягаар хайж харуулна.</span>
            </summary>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Field error={err("latitude")} label="Өргөрөг">
                <Input defaultValue={value.latitude} inputMode="decimal" invalid={!!err("latitude")} name="latitude" placeholder="47.9221" />
              </Field>
              <Field error={err("longitude")} label="Уртраг">
                <Input defaultValue={value.longitude} inputMode="decimal" invalid={!!err("longitude")} name="longitude" placeholder="106.9155" />
              </Field>
              <Field className="sm:col-span-2" error={err("mapUrl")} hint="«Газрын зураг дээр нээх» товчны холбоос" label="Google Maps холбоос">
                <Input defaultValue={value.mapUrl} invalid={!!err("mapUrl")} name="mapUrl" placeholder="https://maps.app.goo.gl/…" />
              </Field>
            </div>
          </details>
        </>
      )}
    </SettingsForm>
  );
}
