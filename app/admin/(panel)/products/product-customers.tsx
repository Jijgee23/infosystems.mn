"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Card, FormMessage, Input } from "@/components/ui/form";
import { addProductUser, removeProductUser } from "@/lib/actions/admin";

type Customer = { id: string; name: string; register: string; email: string };

/** Customers assigned to a product, with search-and-add. */
export function ProductCustomers({ productId, assigned, all }: { productId: string; assigned: Customer[]; all: Customer[] }) {
  const add = useMemo(() => addProductUser.bind(null, productId), [productId]);
  const [state, action, pending] = useActionState(add, null);
  const [q, setQ] = useState("");
  const [pick, setPick] = useState("");
  const assignedIds = new Set(assigned.map((c) => c.id));
  const needle = q.trim().toLowerCase();
  const matches = all.filter((c) => !assignedIds.has(c.id) && (!needle || `${c.name} ${c.register} ${c.email}`.toLowerCase().includes(needle))).slice(0, 50);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-fg">Харилцагчид</h2>
        <span className="text-sm text-fg-subtle">{assigned.length} харилцагч ашигладаг</span>
      </div>

      <ActionForm action={action} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <Input className="h-10" onChange={(e) => setQ(e.target.value)} placeholder="Хайх: нэр, РД, и-мэйл" type="search" value={q} />
        <select
          aria-label="Харилцагч"
          className="h-10 rounded-2xl border border-line bg-card px-3 text-sm text-fg focus:border-brand focus:outline-none"
          name="userId"
          onChange={(e) => setPick(e.target.value)}
          required
          value={pick}
        >
          <option value="">{matches.length ? `Сонгох… (${matches.length}${matches.length === 50 ? "+" : ""})` : "Тохирох харилцагч алга"}</option>
          {matches.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.register ? ` · ${c.register}` : ""}
            </option>
          ))}
        </select>
        <Button disabled={pending || pick === ""} size="sm">
          Нэмэх
        </Button>
      </ActionForm>
      {state && !state.ok && (
        <div className="mt-2">
          <FormMessage state={state} />
        </div>
      )}

      {assigned.length > 0 ? (
        <ul className="mt-4 divide-y divide-line">
          {assigned.map((c) => (
            <li className="flex items-center gap-3 py-2.5" key={c.id}>
              <span className="min-w-0 flex-1">
                <Link className="font-semibold text-fg hover:text-brand" href={`/admin/users/${c.id}`}>
                  {c.name}
                </Link>
                <span className="block truncate text-xs text-fg-subtle">{[c.register && `РД ${c.register}`, c.email].filter(Boolean).join(" · ")}</span>
              </span>
              <ConfirmButton action={removeProductUser.bind(null, productId, c.id)} confirm={`«${c.name}»-г энэ бүтээгдэхүүнээс хасах уу?`} size="sm" variant="ghost">
                Хасах
              </ConfirmButton>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-fg-muted">Одоогоор харилцагч оноогоогүй.</p>
      )}
    </Card>
  );
}
