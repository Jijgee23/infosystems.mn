"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { EditableItem, ItemList, ListToolbar, NewItem, useCloseOnSave } from "@/components/admin/list-editor";
import { ActionForm } from "@/components/ui/action-form";
import { Button } from "@/components/ui/form";
import { deleteProductLink, saveProductLink } from "@/lib/actions/admin";
import { linkKind, linkText, PRODUCT_LINK_KINDS, type ProductLinkKind } from "@/lib/product-links";

const INPUT = "h-10 w-full rounded-xl border border-line bg-card px-3 text-sm text-fg focus:border-brand focus:outline-none";
const FIELD_LABEL = "mb-1 block text-[11px] font-semibold tracking-wide text-fg-subtle uppercase";

export type ProductLinkRow = { id: string; kind: ProductLinkKind; label: string; url: string; sortOrder: number };

/** Add / edit form for one link. */
function LinkForm({ productId, link }: { productId: string; link: ProductLinkRow | null }) {
  const [state, action, pending] = useActionState(saveProductLink.bind(null, productId), null);
  useCloseOnSave(state);
  const [kind, setKind] = useState<ProductLinkKind>(link?.kind ?? "website");
  const k = linkKind(kind);
  const err = (name: string) => state?.errors?.[name];
  return (
    <ActionForm action={action} className="grid gap-3 sm:grid-cols-[13rem_1fr]">
      {link && <input name="id" type="hidden" value={link.id} />}
      <label>
        <span className={FIELD_LABEL}>Төрөл</span>
        <select className={INPUT} name="kind" onChange={(e) => setKind(e.target.value as ProductLinkKind)} value={kind}>
          {PRODUCT_LINK_KINDS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className={FIELD_LABEL}>Холбоос</span>
        <input aria-invalid={!!err("url")} autoFocus className={`${INPUT} ${err("url") ? "border-red-500" : ""}`} defaultValue={link?.url} name="url" placeholder={k.placeholder} required type="url" />
        {err("url") && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{err("url")}</span>}
      </label>
      <label>
        <span className={FIELD_LABEL}>Товчны бичиг (заавал биш)</span>
        <input className={INPUT} defaultValue={link?.label} maxLength={80} name="label" placeholder={k.button} />
      </label>
      <div className="flex items-end gap-3">
        <label className="w-24">
          <span className={FIELD_LABEL}>Дараалал</span>
          <input className={INPUT} defaultValue={link?.sortOrder ?? 0} max={999} min={0} name="sortOrder" type="number" />
        </label>
        <span className="flex-1" />
        <Button disabled={pending} size="sm">
          {pending ? "…" : link ? "Хадгалах" : "Нэмэх"}
        </Button>
      </div>
      {state && !state.ok && !err("url") && <p className="text-xs text-red-600 sm:col-span-2 dark:text-red-400">{state.message}</p>}
    </ActionForm>
  );
}

/** «Холбоосууд» tab: the product's website and app links, shown as buttons on its page. */
export function ProductLinks({ productId, links }: { productId: string; links: ProductLinkRow[] }) {
  return (
    <section>
      <ListToolbar note="Бүтээгдэхүүний хуудасны дээд хэсэгт товч болж гарна, шинэ таб дээр нээгдэнэ.">
        <NewItem label="Холбоос нэмэх">
          <LinkForm link={null} productId={productId} />
        </NewItem>
      </ListToolbar>
      <ItemList empty="Холбоос алга. Тусдаа вэб сайт эсвэл апп байвал нэмнэ үү.">
        {links.map((l) => (
          <EditableItem
            actions={
              <ConfirmButton action={deleteProductLink.bind(null, l.id)} confirm={`«${linkText(l)}» холбоосыг устгах уу?`} size="sm" variant="ghost">
                Устгах
              </ConfirmButton>
            }
            key={l.id}
            summary={
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-fg-muted">{linkKind(l.kind).name}</span>
                <span className="text-sm font-semibold text-fg">{linkText(l)}</span>
                <a className="min-w-0 truncate text-xs text-fg-subtle hover:text-brand" href={l.url} rel="noopener noreferrer" target="_blank">
                  {l.url.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </div>
            }
          >
            <LinkForm link={l} productId={productId} />
          </EditableItem>
        ))}
      </ItemList>
    </section>
  );
}
