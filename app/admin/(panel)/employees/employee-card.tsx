"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PhotoInput } from "@/components/admin/photo-input";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { deleteEmployee, saveEmployee } from "@/lib/actions/company";
import { useCloseOnSave } from "@/components/admin/list-editor";

export type Option = { id: string; label: string };
export type PositionOption = Option & { departmentId: string };

type Employee = {
  id: string;
  name: string;
  departmentId: string;
  positionId: string;
  phone: string;
  email: string;
  bio: string;
  sortOrder: number;
  isPublic: boolean;
  photoUrl: string | null;
};

export function EmployeeCard({ employee: e, departments, positions }: { employee: Employee | null; departments: Option[]; positions: PositionOption[] }) {
  const [state, action, pending] = useActionState(saveEmployee, null);
  useCloseOnSave(state);
  // The department only narrows the position list; the saved value is the position.
  const [dept, setDept] = useState<string>(e?.departmentId ?? "");
  const [pos, setPos] = useState<string>(e?.positionId ?? "");
  const deptPositions = positions.filter((p) => p.departmentId === dept);
  const err = (k: string) => state?.errors?.[k];
  // Clear the "new" card after each successful save.
  const [formKey, setFormKey] = useState(0);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    if (!e && state?.ok) {
      setFormKey((k) => k + 1);
      setDept("");
      setPos("");
    }
  }
  return (
    <div className="rounded-3xl border border-line bg-card p-4 sm:p-5">
      <ActionForm action={action} className="flex flex-col gap-5 sm:flex-row" key={formKey}>
        {e && <input name="id" type="hidden" value={e.id} />}
        <div className="mx-auto w-40 shrink-0 sm:mx-0">
          <PhotoInput currentUrl={e?.photoUrl ?? null} error={err("photo")} name="photo" removeName="removePhoto" />
        </div>
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
          <Field className="sm:col-span-2" error={err("name")} label="Нэр *">
            <Input className="h-10" defaultValue={e?.name} invalid={!!err("name")} name="name" required />
          </Field>
          <Field label="Хэлтэс, тасаг *">
            <Select
              className="h-10"
              onChange={(ev) => {
                setDept(ev.target.value);
                setPos("");
              }}
              required
              value={dept}
            >
              <option disabled value="">
                Сонгох…
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            error={err("positionId")}
            hint={
              dept === "" ? (
                "Эхлээд хэлтсээ сонгоно уу"
              ) : deptPositions.length === 0 ? (
                <>
                  Энэ хэлтэст албан тушаал бүртгэгдээгүй байна.{" "}
                  <Link className="font-semibold text-brand hover:underline" href="/admin/departments">
                    Бүртгэх →
                  </Link>
                </>
              ) : undefined
            }
            label="Албан тушаал *"
          >
            <Select
              aria-invalid={!!err("positionId") || undefined}
              className="h-10"
              disabled={deptPositions.length === 0}
              name="positionId"
              onChange={(ev) => setPos(ev.target.value)}
              required
              value={pos}
            >
              <option disabled value="">
                Сонгох…
              </option>
              {deptPositions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field error={err("phone")} label="Утас">
            <Input className="h-10" defaultValue={e?.phone} inputMode="tel" invalid={!!err("phone")} name="phone" />
          </Field>
          <Field error={err("email")} label="И-мэйл">
            <Input className="h-10" defaultValue={e?.email} invalid={!!err("email")} name="email" type="email" />
          </Field>
          <Field className="sm:col-span-2" label="Товч танилцуулга">
            <Textarea defaultValue={e?.bio} maxLength={2000} name="bio" rows={2} />
          </Field>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <label className="flex items-center gap-1.5 text-sm text-fg-muted">
              <input defaultChecked={e?.isPublic ?? true} name="isPublic" type="checkbox" /> Сайтад харуулах
            </label>
            <label className="flex items-center gap-1.5 text-sm text-fg-muted">
              Дараалал
              <input className="h-9 w-16 rounded-xl border border-line bg-card px-2 text-sm text-fg" defaultValue={e?.sortOrder ?? 0} min={0} name="sortOrder" type="number" />
            </label>
            <span className="flex-1" />
            {e && (
              <ConfirmButton action={deleteEmployee.bind(null, e.id)} confirm={`${e.name}-г устгах уу?`} size="sm" variant="ghost">
                Устгах
              </ConfirmButton>
            )}
            <Button disabled={pending} size="sm" variant={e ? "secondary" : "primary"}>
              {pending ? "Хадгалж байна…" : e ? "Хадгалах" : "Нэмэх"}
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
