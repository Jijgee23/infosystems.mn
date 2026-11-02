"use client";

import { useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CloseContext } from "@/components/admin/list-editor";
import { Badge, buttonClass } from "@/components/ui/form";
import { deleteClientLogo } from "@/lib/actions/trust";
import { ClientCard } from "./client-card";

type Item = { id: string; name: string; url: string; isPublic: boolean; sortOrder: number; logoUrl: string };

/** Edit/add panels span the whole row so the form never sits in one narrow column. */
const FULL_ROW = "col-span-full";

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
                className="flex min-w-0 flex-col gap-3 rounded-2xl border border-line bg-card p-3.5 transition-[border-color,box-shadow] hover:border-brand/40 hover:shadow-[0_8px_24px_-16px_rgb(16_24_40/0.35)]"
                key={c.id}
              >
                {/* Logos are drawn for light backgrounds, so the plate stays light in dark mode too. */}
                <div className="grid h-20 place-items-center rounded-xl border border-line bg-white px-4 py-3 dark:bg-[#eef3f8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={c.name} className={`max-h-full max-w-full object-contain ${c.isPublic ? "" : "opacity-40 grayscale"}`} src={c.logoUrl} />
                </div>

                <div className="min-w-0 flex-1 px-0.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="min-w-0 truncate text-sm font-semibold text-fg" title={c.name}>
                      {c.name}
                    </p>
                    {!c.isPublic && <Badge>Нуусан</Badge>}
                  </div>
                  {c.url ? (
                    <a className="mt-0.5 block truncate text-xs text-fg-subtle hover:text-brand" href={c.url} rel="noreferrer" target="_blank">
                      {c.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-xs text-fg-subtle">Вэбсайтгүй</p>
                  )}
                </div>

                <div className="-mx-1 -mb-1 flex flex-wrap items-center justify-end gap-1">
                  <ConfirmButton action={deleteClientLogo.bind(null, c.id)} confirm={`«${c.name}»-г устгах уу?`} size="sm" variant="ghost">
                    Устгах
                  </ConfirmButton>
                  <button
                    className={buttonClass("secondary", "sm")}
                    onClick={() => {
                      setAdding(false);
                      setEditingId(c.id);
                    }}
                    type="button"
                  >
                    Засах
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </>
  );
}
