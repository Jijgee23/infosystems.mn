"use client";

import { useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CloseContext } from "@/components/admin/list-editor";
import { Badge, buttonClass } from "@/components/ui/form";
import { deleteClientLogo } from "@/lib/actions/trust";
import { ClientCard } from "./client-card";

type Item = { id: string; name: string; url: string; isPublic: boolean; sortOrder: number; logoUrl: string };

/** Full-width span so the edit/add form is never squeezed into one grid column. */
const SPAN = "sm:col-span-2 lg:col-span-3 xl:col-span-4";

export function ClientGrid({ items }: { items: Item[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">{items.length} лого</p>
        <button
          className={buttonClass("primary", "sm")}
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
        <div className="mb-5 rounded-2xl bg-surface/60 p-3 sm:p-4">
          <p className="mb-3 text-sm font-semibold text-fg">Лого нэмэх</p>
          <CloseContext.Provider value={() => setAdding(false)}>
            <ClientCard item={null} />
          </CloseContext.Provider>
        </div>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-fg-subtle">Лого бүртгэгдээгүй байна.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((c) =>
            editingId === c.id ? (
              <div className={`rounded-2xl bg-surface/60 p-3 sm:p-4 ${SPAN}`} key={c.id}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-fg">«{c.name}» засах</p>
                  <button className={buttonClass("ghost", "sm")} onClick={() => setEditingId(null)} type="button">
                    Болих
                  </button>
                </div>
                <CloseContext.Provider value={() => setEditingId(null)}>
                  <ClientCard item={c} />
                </CloseContext.Provider>
              </div>
            ) : (
              <div className="group flex flex-col rounded-2xl border border-line bg-card p-4 transition-colors hover:border-brand/40" key={c.id}>
                <div className="grid h-24 place-items-center rounded-xl border border-line bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="max-h-full max-w-full object-contain" src={c.logoUrl} />
                </div>
                <div className="mt-3 min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-medium text-fg">
                    <span className="truncate">{c.name}</span>
                    {!c.isPublic && <Badge>Нуусан</Badge>}
                  </p>
                  {c.url && <p className="mt-0.5 truncate text-xs text-fg-subtle">{c.url.replace(/^https?:\/\/(www\.)?/, "")}</p>}
                </div>
                <div className="mt-3 flex items-center justify-end gap-1 border-t border-line pt-2 opacity-80 transition-opacity group-hover:opacity-100">
                  <ConfirmButton action={deleteClientLogo.bind(null, c.id)} confirm={`«${c.name}»-г устгах уу?`} size="sm" variant="ghost">
                    Устгах
                  </ConfirmButton>
                  <button
                    className={buttonClass("ghost", "sm")}
                    onClick={() => {
                      setAdding(false);
                      setEditingId(c.id);
                    }}
                    type="button"
                  >
                    Засах
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </>
  );
}
