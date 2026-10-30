"use client";

import { useActionState, useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ActionForm } from "@/components/ui/action-form";
import {
  Button,
  Field,
  FormMessage,
  Input,
  Select,
} from "@/components/ui/form";
import { saveProduct } from "@/lib/actions/admin";
import { PRODUCT_ICON_NAMES, ProductIcon } from "@/lib/product-icons";
import { SOLUTIONS } from "@/lib/site";

export type ProductFormValues = {
  id?: string;
  name: string;
  title: string;
  slug: string;
  tagline: string;
  icon: string;
  badge: string;
  status: "available" | "coming_soon";
  group: "main" | "featured" | "other";
  sortOrder: number;
  parentId: string;
  listed: boolean;
  published: boolean;
  imageUrl: string | null;
  logoUrl: string | null;
  backgroundUrl: string | null;
  videoUrl: string;
  versionNames: string;
  solutions: string[];
  inComparison: boolean;
};

export function ProductForm({
  product,
  parents,
  hasModules,
  currentMain,
  saved,
}: {
  product: ProductFormValues;
  /** Top-level products this one can be a module of. */
  parents: { id: string; name: string }[];
  hasModules?: boolean;
  /** Name of the other product that is main now, if any (only one can be). */
  currentMain?: string | null;
  saved?: boolean;
}) {
  const [state, action, pending] = useActionState(
    saveProduct,
    saved ? { ok: true, message: "Хадгалагдлаа." } : null,
  );
  const err = (k: string) => state?.errors?.[k];
  const [icon, setIcon] = useState(product.icon);
  const [parentId, setParentId] = useState(product.parentId);
  const [isMain, setIsMain] = useState(product.group === "main");
  const isModule = !!parentId;
  return (
    <ActionForm
      action={action}
      className="grid items-start gap-6 xl:grid-cols-[1fr_20rem]"
    >
      {product.id && <input name="id" type="hidden" value={product.id} />}
      <div className="min-w-0 space-y-6">
        <div className="space-y-5 rounded-3xl border border-line bg-card p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              error={err("name")}
              hint="Сайт, цэсэнд гарна. Жишээ нь PACS"
              label="Нэр *"
            >
              <Input
                defaultValue={product.name}
                invalid={!!err("name")}
                name="name"
                required
              />
            </Field>
            <Field
              hint="Харилцагчийн буланд гарна. Хоосон бол нэр"
              label="Бүтэн нэр"
            >
              <Input
                defaultValue={product.title}
                name="title"
                placeholder="PACS төслийн санхүүгийн программ"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
            <Field
              hint="Нэрийн доор, жагсаалт ба цэсэнд гарах нэг өгүүлбэр"
              label="Уриа"
            >
              <Input
                defaultValue={product.tagline}
                maxLength={255}
                name="tagline"
              />
            </Field>
            <Field hint="Icon-ы хажууд. Жишээ нь «Кассын систем»" label="Шошго">
              <Input defaultValue={product.badge} maxLength={40} name="badge" />
            </Field>
          </div>
          {!isModule && (
            <div>
              <span className="text-sm font-semibold text-fg">Icon</span>
              <input name="icon" type="hidden" value={icon} />
              <div className="mt-1.5 flex flex-wrap gap-2" role="radiogroup">
                {PRODUCT_ICON_NAMES.map((n) => (
                  <button
                    aria-checked={icon === n}
                    aria-label={n}
                    className={`grid size-11 place-items-center rounded-xl border transition-colors ${icon === n ? "border-brand bg-brand text-white dark:text-ink" : "border-line bg-surface text-fg-muted hover:border-brand/50 hover:text-brand"}`}
                    key={n}
                    onClick={() => setIcon(n)}
                    role="radio"
                    title={n}
                    type="button"
                  >
                    <ProductIcon className="size-5" name={n} />
                  </button>
                ))}
              </div>
            </div>
          )}
          <Field
            error={err("videoUrl")}
            hint="YouTube эсвэл Vimeo холбоос. Байвал нүүрэнд «Танилцуулга бичлэг үзэх» товч гарна"
            label="Танилцуулга бичлэг"
          >
            <Input
              defaultValue={product.videoUrl}
              invalid={!!err("videoUrl")}
              name="videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              type="url"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              hint="Хувилбарын түүхийн бүтээгдэхүүний нэр, таслалаар. Жишээ нь MACS эсвэл POS, MACSPOS"
              label="Шинэчлэлтүүд (хувилбарын нэр)"
            >
              <Input
                defaultValue={product.versionNames}
                name="versionNames"
                placeholder="MACS"
              />
            </Field>
            <div>
              <span className="text-sm font-semibold text-fg">
                Тохирох салбарууд
              </span>
              <span className="block text-xs text-fg-subtle">
                Сонгосон шийдлийн хуудсанд энэ бүтээгдэхүүн гарна
              </span>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {SOLUTIONS.map((s) => (
                  <label
                    className="flex items-center gap-1.5 text-sm text-fg-muted"
                    key={s.slug}
                  >
                    <input
                      defaultChecked={product.solutions.includes(s.slug)}
                      name="solutions"
                      type="checkbox"
                      value={s.slug}
                    />{" "}
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-fg-muted">
            Хуудасны дэлгэрэнгүй агуулгыг доорх «Хуудасны агуулга» хэсэгт засна.
          </p>
        </div>
        <div className="grid gap-5 rounded-3xl border border-line bg-card p-5 sm:grid-cols-3 sm:p-6">
          <Picture
            aspect="aspect-square"
            currentUrl={product.logoUrl}
            error={err("logo")}
            hint="Icon-ы оронд гарна (нүүр, жагсаалт, цэс). Тунгалаг дэвсгэртэй PNG тохиромжтой."
            label="Лого"
            maxSide={800}
            name="logo"
            width="w-28"
          />
          <Picture
            aspect="aspect-video"
            cover
            currentUrl={product.backgroundUrl}
            error={err("background")}
            hint="Нүүр хэсгийн ард бүдэг гарна. Хэвтээ, 1920px орчим өргөн."
            label="Арын зураг"
            maxSide={2400}
            name="background"
            width="w-full"
          />
          {!isModule && (
            <Picture
              aspect="aspect-[4/3]"
              currentUrl={product.imageUrl}
              error={err("image")}
              hint="Нүүрний баруун талд, icon-той зургийн оронд гарна (дэлгэцийн зураг г.м.)."
              label="Танилцуулга зураг"
              maxSide={1600}
              name="image"
              width="w-full"
            />
          )}
        </div>
      </div>

      <aside className="space-y-5">
        <div className="space-y-4 rounded-3xl border border-line bg-card p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-fg">
            <input
              className="h-4 w-4"
              defaultChecked={product.published}
              name="published"
              type="checkbox"
            />
            Нийтлэх
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-fg">
            <input
              className="h-4 w-4"
              defaultChecked={product.listed}
              name="listed"
              type="checkbox"
            />
            Жагсаалт, цэсэнд харуулах
          </label>
          {!isModule && (
            <>
              <label className="flex items-start gap-2 text-sm font-semibold text-fg">
                <input
                  checked={isMain}
                  className="mt-0.5 h-4 w-4"
                  name="isMain"
                  onChange={(e) => setIsMain(e.target.checked)}
                  type="checkbox"
                />
                <span>
                  Үндсэн бүтээгдэхүүн
                  <span className="block text-xs font-normal text-fg-subtle">
                    /products хуудас, цэсэнд модулиудтайгаа том хайрцгаар эхэнд
                    гарна. Нэг л бүтээгдэхүүн үндсэн байна.
                  </span>
                  {isMain && currentMain && product.group !== "main" && (
                    <span className="mt-1 block text-xs font-medium text-amber-600 dark:text-amber-400">
                      Хадгалахад одоогийн үндсэн «{currentMain}» онцлох карт
                      болно.
                    </span>
                  )}
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-fg">
                <input
                  className="h-4 w-4"
                  defaultChecked={product.inComparison}
                  name="inComparison"
                  type="checkbox"
                />
                Харьцуулах хүснэгтэд
              </label>
            </>
          )}
          <FormMessage state={state} />
          <Button className="w-full" disabled={pending}>
            {pending ? "Хадгалж байна…" : "Хадгалах"}
          </Button>
        </div>
        <div className="space-y-4 rounded-3xl border border-line bg-card p-5">
          <Field
            error={err("parentId")}
            hint={
              hasModules
                ? "Модультай тул өөрчлөх боломжгүй"
                : "Сонговол тухайн бүтээгдэхүүний модуль болно"
            }
            label="Эх бүтээгдэхүүн"
          >
            <Select
              disabled={hasModules}
              name="parentId"
              onChange={(e) => setParentId(e.target.value)}
              value={parentId}
            >
              <option value="">— Бие даасан бүтээгдэхүүн —</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          {!isModule && !isMain && (
            <Field hint="/products хуудас, цэсэнд байрлах хэсэг" label="Бүлэг">
              <Select
                defaultValue={
                  product.group === "main" ? "featured" : product.group
                }
                name="group"
              >
                <option value="featured">Онцлох карт</option>
                <option value="other">Бусад систем</option>
              </Select>
            </Field>
          )}
          <Field label="Төлөв">
            <Select defaultValue={product.status} name="status">
              <option value="available">Худалдаанд байгаа</option>
              <option value="coming_soon">Тун удахгүй</option>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field hint="Бага нь эхэнд" label="Дараалал">
              <Input
                className="h-10"
                defaultValue={product.sortOrder}
                min={0}
                name="sortOrder"
                type="number"
              />
            </Field>
            <Field error={err("slug")} label="Slug">
              <Input
                className="h-10"
                defaultValue={product.slug}
                invalid={!!err("slug")}
                name="slug"
                placeholder="нэрээс"
              />
            </Field>
          </div>
        </div>
      </aside>
    </ActionForm>
  );
}

/** One picture field: preview + upload, and a «remove» box once there is a stored image. */
function Picture({
  label,
  hint,
  name,
  currentUrl,
  error,
  width,
  ...rest
}: {
  label: string;
  hint: string;
  name: string;
  currentUrl: string | null;
  error?: string;
  width: string;
  aspect: string;
  maxSide: number;
  cover?: boolean;
}) {
  return (
    <div>
      <span className="text-sm font-semibold text-fg">{label}</span>
      <span className="block text-xs text-fg-subtle">{hint}</span>
      <div className={`mx-auto mt-2 ${width}`}>
        <ImageUpload
          currentUrl={currentUrl}
          error={error}
          name={name}
          {...rest}
        />
      </div>
      {currentUrl && (
        <label className="mt-1 flex items-center justify-center gap-2 text-xs text-fg-muted">
          <input name={`remove_${name}`} type="checkbox" /> Устгах
        </label>
      )}
    </div>
  );
}
