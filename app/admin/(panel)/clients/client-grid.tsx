"use client";

import { useState, useTransition } from "react";
import { CloseContext } from "@/components/admin/list-editor";
import { Badge, buttonClass } from "@/components/ui/form";
import { deleteClientLogo } from "@/lib/actions/trust";
import { ClientCard } from "./client-card";

type Item = { id: string; name: string; url: string; isPublic: boolean; sortOrder: number; logoUrl: string };

/** Edit/add panels span the whole row so the form never sits in one narrow column. */
const FULL_ROW = "col-span-full";

function DeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      className="py-2.5 text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`«${name}»-г устгах уу?`)) return;
        start(async () => {
          await deleteClientLogo(id);
        });
      }}
      type="button"
    >
      {pending ? "Устгаж байна…" : "Устгах"}
    </button>
  );
}

export function ClientGrid({ items }: { items: Item[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const hiddenCount = items.filter((c) => !c.isPublic).length;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          {items.length} лого
          {hiddenCount > 0 && <span className="text-fg-subtle"> · {hiddenCount} нуусан</span>}
        </p>
        <button
          className={buttonClass(adding ? "secondary" : "primary", "sm")}
          onClick={() => {
            setEditingId(null);
            setAdding((v) => !v);
          }}
          type="button"
        >
          {adding ? "Болих" : "+ Лого нэмэх"}
        </button>
      </div>

      {adding && (
        <div className="mb-5 rounded-2xl bg-surface p-3 sm:p-4">
          <p className="mb-3 px-1 text-sm font-semibold text-fg">Шинэ лого</p>
          <CloseContext.Provider value={() => setAdding(false)}>
            <ClientCard item={null} />
          </CloseContext.Provider>
        </div>
      )}

      {items.length === 0 ? (
        <div className="grid place-items-center gap-2 rounded-2xl border border-dashed border-line px-6 py-12 text-center">
          <p className="font-medium text-fg">Лого бүртгэгдээгүй байна</p>
          <p className="text-sm text-fg-subtle">«+ Лого нэмэх» дарж эхний харилцагчаа нэмнэ үү.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {items.map((c) =>
            editingId === c.id ? (
              <li className={`${FULL_ROW} rounded-2xl bg-surface p-3 sm:p-4`} key={c.id}>
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <p className="min-w-0 truncate text-sm font-semibold text-fg">«{c.name}» засах</p>
                  <button className={buttonClass("ghost", "sm")} onClick={() => setEditingId(null)} type="button">
                    Болих
                  </button>
                </div>
                <CloseContext.Provider value={() => setEditingId(null)}>
                  <ClientCard item={c} />
                </CloseContext.Provider>
              </li>
            ) : (
              <li
                className="group grid aspect-[4/3] min-w-0 min-[420px]:aspect-[4/5] grid-rows-[3fr_1fr_1fr] overflow-hidden rounded-2xl border border-line bg-card transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_28px_-18px_rgb(16_24_40/0.4)]"
                key={c.id}
              >
                {/* Fixed 3 : 1 : 1 rows (logo : label : actions) keep every card's sections aligned. */}
                {/* Logos are drawn for light backgrounds, so the plate stays light in dark mode too. */}
                <div className="relative grid min-h-0 place-items-center border-b border-line bg-white p-6 dark:bg-[#eef3f8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={c.name}
                    className={`max-h-full max-w-full object-contain transition-[filter,opacity] ${c.isPublic ? "" : "opacity-40 grayscale group-hover:opacity-70"}`}
                    src={c.logoUrl}
                  />
                  {!c.isPublic && (
                    <span className="absolute left-2.5 top-2.5">
                      <Badge>Нуусан</Badge>
                    </span>
                  )}
                </div>

                <div className="flex min-h-0 min-w-0 flex-col justify-center px-4">
                  <p className="truncate text-sm font-semibold text-fg" title={c.name}>
                    {c.name}
                  </p>
                  {c.url && (
                    <a className="mt-0.5 block truncate text-xs text-fg-subtle hover:text-brand hover:underline" href={c.url} rel="noreferrer" target="_blank">
                      {c.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>

                <div className="grid min-h-0 grid-cols-2 divide-x divide-line border-t border-line text-sm font-medium">
                  <button
                    className="py-2.5 text-fg-muted transition-colors hover:bg-surface hover:text-fg"
                    onClick={() => {
                      setAdding(false);
                      setEditingId(c.id);
                    }}
                    type="button"
                  >
                    Засах
                  </button>
                  <DeleteButton id={c.id} name={c.name} />
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </>
  );
}
