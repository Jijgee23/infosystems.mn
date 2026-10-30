"use client";

import { useActionState, useEffect, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ActionForm } from "@/components/ui/action-form";
import { Button, Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { deleteProductBlock, moveProductBlock, saveProductBlock } from "@/lib/actions/admin";

type Kind = "text" | "features" | "links";
type Item = { title: string; body: string; href: string };
export type BlockValues = { id: string; kind: Kind; heading: string; style: string; body: string; columns: number; items: Item[] };

const KIND_LABEL: Record<Kind, string> = { text: "Текст", features: "Онцлогууд (картууд)", links: "Холбоосууд" };
const EMPTY_ITEM: Item = { title: "", body: "", href: "" };

/** Editor for the blocks of a product page: one form per block, plus an «add» form. */
export function ProductBlocks({ productId, blocks }: { productId: string; blocks: BlockValues[] }) {
  const [adding, setAdding] = useState<Kind | null>(null);
  return (
    <div className="space-y-4">
      {blocks.length === 0 && !adding && <p className="rounded-3xl border border-dashed border-line p-6 text-center text-sm text-fg-muted">Агуулга алга. Доороос блок нэмнэ үү.</p>}
      {blocks.map((b, i) => (
        <BlockCard block={b} first={i === 0} key={b.id} last={i === blocks.length - 1} productId={productId} />
      ))}
      {adding ? (
        <BlockCard
          block={{ id: "", kind: adding, heading: adding === "links" ? "Холбогдох заавар" : "", style: "", body: "", columns: 1, items: adding === "text" ? [] : [EMPTY_ITEM] }}
          onDone={() => setAdding(null)}
          productId={productId}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-fg">Блок нэмэх:</span>
          {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
            <button className="h-9 rounded-full border border-line bg-card px-3.5 text-sm font-semibold text-fg hover:border-brand/50 hover:text-brand" key={k} onClick={() => setAdding(k)} type="button">
              + {KIND_LABEL[k]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BlockCard({ block: b, productId, first, last, onDone }: { block: BlockValues; productId: string; first?: boolean; last?: boolean; onDone?: () => void }) {
  const isNew = !b.id;
  const [state, action, pending] = useActionState(saveProductBlock, null);
  const [items, setItems] = useState<Item[]>(b.items);
  // A saved new block shows up in the list after the refresh, so the «new» form closes.
  useEffect(() => {
    if (isNew && state?.ok) onDone?.();
  }, [isNew, state, onDone]);
  const setItem = (i: number, patch: Partial<Item>) => setItems((list) => list.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const moveItem = (i: number, d: -1 | 1) =>
    setItems((list) => {
      const next = [...list];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  return (
    <div className={`rounded-3xl border bg-card p-5 ${isNew ? "border-dashed border-brand/40" : "border-line"}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-fg-muted">{KIND_LABEL[b.kind]}</span>
        {isNew && <span className="text-sm font-semibold text-fg">Шинэ блок</span>}
        <span className="flex-1" />
        {!isNew && !first && (
          <ConfirmButton action={moveProductBlock.bind(null, b.id, -1)} size="sm" variant="ghost">
            <span aria-label="Дээш зөөх">↑</span>
          </ConfirmButton>
        )}
        {!isNew && !last && (
          <ConfirmButton action={moveProductBlock.bind(null, b.id, 1)} size="sm" variant="ghost">
            <span aria-label="Доош зөөх">↓</span>
          </ConfirmButton>
        )}
      </div>
      <ActionForm action={action} className="space-y-4">
        {!isNew && <input name="id" type="hidden" value={b.id} />}
        <input name="productId" type="hidden" value={productId} />
        <input name="kind" type="hidden" value={b.kind} />

        <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
          <Field hint={b.kind === "text" ? "Заавал биш" : undefined} label="Гарчиг">
            <Input className="h-10" defaultValue={b.heading} name="heading" />
          </Field>
          {b.kind === "text" && (
            <Field label="Хэлбэр">
              <Select className="h-10" defaultValue={b.style} name="style">
                <option value="">Энгийн</option>
                <option value="lead">Оршил (том үсэг)</option>
                <option value="checklist">Жагсаалт ✓ тэмдэгтэй</option>
              </Select>
            </Field>
          )}
          {b.kind === "features" && (
            <Field label="Багана">
              <Select className="h-10" defaultValue={String(b.columns)} name="columns">
                <option value="1">1 багана</option>
                <option value="2">2 багана</option>
              </Select>
            </Field>
          )}
        </div>

        {b.kind === "text" ? (
          <RichTextEditor compact initialHtml={b.body} name="body" />
        ) : (
          <ol className="space-y-3">
            {items.map((it, i) => (
              // Index keys: rows are controlled, so reordering just moves values.
              <li className="rounded-2xl border border-line bg-surface p-3" key={i}>
                <div className="flex items-start gap-2">
                  <span className="mt-2.5 w-5 text-right text-xs font-semibold text-fg-subtle">{i + 1}.</span>
                  <div className="grid min-w-0 flex-1 gap-2">
                    <Input className="h-10" name="itemTitle" onChange={(e) => setItem(i, { title: e.target.value })} placeholder={b.kind === "links" ? "Холбоосын нэр" : "Онцлогийн нэр"} value={it.title} />
                    {b.kind === "links" && (
                      <Input className="h-10" name="itemHref" onChange={(e) => setItem(i, { href: e.target.value })} placeholder="/support/guides/... эсвэл https://..." value={it.href} />
                    )}
                    <Textarea
                      name="itemBody"
                      onChange={(e) => setItem(i, { body: e.target.value })}
                      placeholder={b.kind === "links" ? "Тайлбар (заавал биш)" : "Тайлбар. Хоосон мөрөөр догол мөр тусгаарлана."}
                      rows={b.kind === "links" ? 1 : 3}
                      value={it.body}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <button aria-label="Дээш" className="grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-card disabled:opacity-30" disabled={i === 0} onClick={() => moveItem(i, -1)} type="button">
                      ↑
                    </button>
                    <button aria-label="Доош" className="grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-card disabled:opacity-30" disabled={i === items.length - 1} onClick={() => moveItem(i, 1)} type="button">
                      ↓
                    </button>
                    <button aria-label="Устгах" className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-red-500/10" onClick={() => setItems((list) => list.filter((_, j) => j !== i))} type="button">
                      ✕
                    </button>
                  </div>
                </div>
              </li>
            ))}
            <li>
              <button className="h-9 rounded-full border border-dashed border-line px-3.5 text-sm font-semibold text-fg-muted hover:border-brand/50 hover:text-brand" onClick={() => setItems((list) => [...list, EMPTY_ITEM])} type="button">
                + Мөр нэмэх
              </button>
            </li>
          </ol>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <FormMessage state={state} />
          <span className="flex-1" />
          {isNew ? (
            <Button onClick={onDone} size="sm" type="button" variant="ghost">
              Болих
            </Button>
          ) : (
            <ConfirmButton action={deleteProductBlock.bind(null, b.id)} confirm="Энэ блокийг устгах уу?" size="sm" variant="ghost">
              Устгах
            </ConfirmButton>
          )}
          <Button disabled={pending} size="sm" variant={isNew ? "primary" : "secondary"}>
            {pending ? "Хадгалж байна…" : isNew ? "Нэмэх" : "Хадгалах"}
          </Button>
        </div>
      </ActionForm>
    </div>
  );
}
