"use client";

import { useActionState } from "react";
import { Button, Card, Field, FormMessage, Input, Select } from "@/components/ui/form";
import { updateUser } from "@/lib/actions/admin";
import { ActionForm } from "@/components/ui/action-form";

type U = {
  id: string;
  username: string;
  email: string;
  companyName: string;
  companyRegister: string;
  customerType: "company" | "individual";
  personalRegister: string;
  role: "customer" | "employee" | "admin";
  adminConfirmed: boolean;
  blocked: boolean;
};

export function UserForm({ user, products, ownedIds, canEditRole, isSelf }: { user: U; products: { id: string; title: string }[]; ownedIds: string[]; canEditRole: boolean; isSelf: boolean }) {
  const [state, action, pending] = useActionState(updateUser, null);
  const err = (k: string) => state?.errors?.[k];
  return (
    <ActionForm action={action} className="grid gap-6 lg:grid-cols-2">
      <input name="id" type="hidden" value={user.id} />
      <Card className="space-y-5">
        <Field label="Харилцагчийн төрөл">
          <Select defaultValue={user.customerType} name="customerType">
            <option value="company">Байгууллага</option>
            <option value="individual">Хувь хүн</option>
          </Select>
        </Field>
        <Field label="Байгууллагын нэр">
          <Input defaultValue={user.companyName} name="companyName" />
        </Field>
        <Field error={err("companyRegister")} label="Байгууллагын регистр">
          <Input defaultValue={user.companyRegister} inputMode="numeric" invalid={!!err("companyRegister")} name="companyRegister" />
        </Field>
        <Field error={err("personalRegister")} hint="Хувь хүн бол, жишээ нь УБ12345678" label="Хувь хүний регистр">
          <Input defaultValue={user.personalRegister} invalid={!!err("personalRegister")} name="personalRegister" />
        </Field>
        <Field label="Холбогдох хүн / овог нэр">
          <Input defaultValue={user.username} name="username" />
        </Field>
        <Field error={err("email")} label="И-мэйл">
          <Input defaultValue={user.email} invalid={!!err("email")} name="email" type="email" />
        </Field>
      </Card>
      <div className="space-y-6">
        <Card className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-fg">
            <input className="h-4 w-4" defaultChecked={user.adminConfirmed} name="adminConfirmed" type="checkbox" />
            Баталгаажсан <span className="font-normal text-fg-subtle">(анх идэвхжүүлэхэд мэйл илгээнэ)</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-fg">
            <input className="h-4 w-4" defaultChecked={user.blocked} disabled={isSelf} name="blocked" type="checkbox" />
            Эрх хаах
          </label>
          <Field label="Эрх">
            <Select defaultValue={user.role} disabled={!canEditRole} name="role">
              <option value="customer">Харилцагч</option>
              <option value="employee">Ажилтан</option>
              <option value="admin">Админ</option>
            </Select>
          </Field>
          {!canEditRole && <input name="role" type="hidden" value={user.role} />}
        </Card>
        <Card>
          <p className="text-sm font-semibold text-fg">Бүтээгдэхүүн</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {products.map((p) => (
              <label className="flex items-center gap-2 text-sm text-fg-muted" key={p.id}>
                <input className="h-4 w-4" defaultChecked={ownedIds.includes(p.id)} name="products" type="checkbox" value={p.id} />
                {p.title}
              </label>
            ))}
          </div>
        </Card>
        <FormMessage state={state} />
        <Button disabled={pending}>{pending ? "Хадгалж байна…" : "Хадгалах"}</Button>
      </div>
    </ActionForm>
  );
}
