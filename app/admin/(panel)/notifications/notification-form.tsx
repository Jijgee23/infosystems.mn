"use client";

import { useActionState } from "react";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Card, Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { saveNotification } from "@/lib/actions/admin";
import { APP_LABEL, FILETYPE_LABEL, MACS_LABEL } from "./labels";

export type NotificationValues = {
  id?: string;
  description: string;
  macsversion: number;
  apptype: number;
  toCustomer: number;
  filetype: number;
  isActive: boolean;
  expireDate: string;
  newsText: string;
  pdfFile: string;
  fileUrl: string;
  customerId: string;
};

const options = (labels: Record<number, string>) =>
  Object.entries(labels).map(([v, l]) => (
    <option key={v} value={v}>
      {l}
    </option>
  ));

export function NotificationForm({ value }: { value: NotificationValues }) {
  const [state, action, pending] = useActionState(saveNotification, null);
  const err = (k: string) => state?.errors?.[k];
  return (
    <ActionForm action={action} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      {value.id && <input name="id" type="hidden" value={value.id} />}
      <Card className="space-y-5">
        <Field error={err("description")} label="Тайлбар (дотоод нэр)">
          <Input defaultValue={value.description} invalid={!!err("description")} maxLength={255} name="description" required />
        </Field>
        <Field label="Агуулгын төрөл">
          <Select defaultValue={value.filetype} name="filetype">
            {options(FILETYPE_LABEL)}
          </Select>
        </Field>
        <Field hint="HTML төрөлтэй үед програм дотор харагдах агуулга" label="HTML текст">
          <Textarea className="font-mono text-sm" defaultValue={value.newsText} name="newsText" rows={10} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="PDF файлын нэр">
            <Input defaultValue={value.pdfFile} name="pdfFile" />
          </Field>
          <Field label="Файлын холбоос (URL)">
            <Input defaultValue={value.fileUrl} name="fileUrl" placeholder="https://infosystems.mn/uploads/…" />
          </Field>
        </div>
        <Field error={err("pdf")} hint="PDF төрөлтэй үед програм дотор харагдах файл (10MB хүртэл). Сонговол дээрх нэр, холбоос автоматаар бөглөгдөнө." label="PDF файл оруулах">
          <input
            accept="application/pdf"
            className="block w-full text-sm text-fg-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-soft file:px-4 file:py-2 file:font-semibold file:text-brand"
            name="pdf"
            type="file"
          />
        </Field>
      </Card>
      <div className="space-y-5">
        <Card className="space-y-4 p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-fg">
            <input className="h-4 w-4" defaultChecked={value.isActive} name="isActive" type="checkbox" />
            Идэвхтэй
          </label>
          <Field error={err("expireDate")} label="Дуусах огноо">
            <Input className="h-10" defaultValue={value.expireDate} invalid={!!err("expireDate")} name="expireDate" required type="date" />
          </Field>
          <Field label="Програм">
            <Select className="h-10" defaultValue={value.apptype} name="apptype">
              {options(APP_LABEL)}
            </Select>
          </Field>
          <Field label="MACS хувилбар">
            <Select className="h-10" defaultValue={value.macsversion} name="macsversion">
              {options(MACS_LABEL)}
            </Select>
          </Field>
          <Field label="Хэнд">
            <Select className="h-10" defaultValue={value.toCustomer} name="toCustomer">
              <option value={0}>Бүх харилцагч</option>
              <option value={1}>Сонгосон харилцагч</option>
            </Select>
          </Field>
          <Field hint="Сонгосон харилцагч үед: регистрийн дугааруудыг таслалаар тусгаарлана" label="Регистрийн дугаарууд">
            <Textarea className="text-sm" defaultValue={value.customerId} name="customerId" rows={3} />
          </Field>
        </Card>
        <FormMessage state={state} />
        <Button className="w-full" disabled={pending}>
          {pending ? "Хадгалж байна…" : "Хадгалах"}
        </Button>
      </div>
    </ActionForm>
  );
}
