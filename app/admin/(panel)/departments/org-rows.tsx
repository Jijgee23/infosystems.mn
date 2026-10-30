"use client";

import { useActionState, useState, useTransition } from "react";
import { ActionForm } from "@/components/ui/action-form";
import { Badge, Button } from "@/components/ui/form";
import { saveDepartment, savePosition } from "@/lib/actions/company";
import { useCloseOnSave } from "@/components/admin/list-editor";
import type { FormState } from "@/lib/actions/contact";

const INPUT = "h-10 rounded-xl border border-line bg-card px-3 text-sm text-fg focus:border-brand focus:outline-none";

type Option = { id: string; label: string };

/** Clears the "new" row after a successful save. */
function useResetKey(state: FormState, isNew: boolean) {
  const [key, setKey] = useState(0);
  const [last, setLast] = useState(state);
  if (state !== last) {
    setLast(state);
    if (isNew && state?.ok) setKey((k) => k + 1);
  }
  return key;
}

/** Delete with confirm; shows the server's refusal (e.g. the department still has employees). */
export function DeleteButton({ action, confirm }: { action: () => Promise<FormState>; confirm: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <button
        className="h-9 rounded-full px-3.5 text-sm font-semibold text-fg-muted hover:bg-surface hover:text-red-600 disabled:opacity-60"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirm)) return;
          start(async () => {
            const res = await action();
            setError(res && !res.ok ? res.message : null);
          });
        }}
        type="button"
      >
        Устгах
      </button>
      {error && <p className="basis-full text-right text-xs text-red-600 dark:text-red-400">{error}</p>}
    </>
  );
}

type Dept = { id: string; name: string; parentId: string | null; sortOrder: number; employees: number; children: number; positions: number };

/** Department name / parent / order. `dept = null` renders the "add department" row. */
export function DepartmentForm({ dept, options }: { dept: Dept | null; options: Option[] }) {
  const [state, action, pending] = useActionState(saveDepartment, null);
  useCloseOnSave(state);
  const key = useResetKey(state, !dept);
  // A department can't be moved under itself.
  const parents = options.filter((o) => o.id !== dept?.id);
  return (
    <div>
      <ActionForm action={action} className="flex flex-wrap items-center gap-2" key={key}>
        {dept && <input name="id" type="hidden" value={dept.id} />}
        <input aria-label="Хэлтэс, тасгийн нэр" className={`${INPUT} min-w-48 flex-1 ${dept ? "font-semibold" : ""}`} defaultValue={dept?.name} name="name" placeholder={dept ? "" : "Хэлтэс, тасгийн нэр"} required />
        <select aria-label="Харьяалах хэлтэс" className={`${INPUT} w-52`} defaultValue={dept?.parentId ?? ""} name="parentId">
          <option value="">— Дээд түвшин —</option>
          {parents.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <input aria-label="Дараалал" className={`${INPUT} w-20`} defaultValue={dept?.sortOrder ?? 0} min={0} name="sortOrder" title="Дараалал" type="number" />
        {dept && <Badge>{dept.employees} ажилтан</Badge>}
        <Button disabled={pending} size="sm" variant={dept ? "secondary" : "primary"}>
          {dept ? "Хадгалах" : "Хэлтэс нэмэх"}
        </Button>
      </ActionForm>
      {state && !state.ok && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{state.message}</p>}
    </div>
  );
}

type Pos = { id: string; name: string; sortOrder: number; employees: number; departmentId: string };

/**
 * One position inside a department card. Existing positions can be moved to another
 * department (their employees move with them). `position = null` adds a new one to `departmentId`.
 */
export function PositionRow({ position, departmentId, options }: { position: Pos | null; departmentId: string; options: Option[] }) {
  const [state, action, pending] = useActionState(savePosition, null);
  useCloseOnSave(state);
  const key = useResetKey(state, !position);
  return (
    <div>
      <ActionForm action={action} className="flex flex-wrap items-center gap-2" key={key}>
        {position && <input name="id" type="hidden" value={position.id} />}
        <input aria-label="Албан тушаал" className={`${INPUT} min-w-44 flex-1`} defaultValue={position?.name} name="name" placeholder={position ? "" : "Албан тушаалын нэр"} required />
        {position ? (
          <select aria-label="Хэлтэс" className={`${INPUT} w-44`} defaultValue={position.departmentId} name="departmentId" title="Өөр хэлтэс рүү шилжүүлэх">
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input name="departmentId" type="hidden" value={departmentId} />
        )}
        <input aria-label="Дараалал" className={`${INPUT} w-20`} defaultValue={position?.sortOrder ?? 0} min={0} name="sortOrder" title="Дараалал" type="number" />
        {position && <Badge>{position.employees} ажилтан</Badge>}
        <Button disabled={pending} size="sm" variant={position ? "ghost" : "secondary"}>
          {position ? "Хадгалах" : "Нэмэх"}
        </Button>
      </ActionForm>
      {state && !state.ok && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{state.message}</p>}
    </div>
  );
}
