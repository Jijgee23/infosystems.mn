import { idParam } from "@/lib/ids";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { deleteProduct } from "@/lib/actions/admin";
import { requireStaff } from "@/lib/auth/session";
import { db, toNum } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize";
import { ProductBlocks } from "../product-blocks";
import { ProductCustomers } from "../product-customers";
import { ProductForm } from "../product-form";

export const metadata = { title: "Бүтээгдэхүүн засах" };

/** Feature card text is stored as <p> paragraphs and edited as plain text with blank lines between them. */
const paragraphsToText = (html: string | null) =>
  (html ?? "")
    .replace(/<\/p>\s*<p[^>]*>/g, "\n\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  await requireStaff();
  const id = idParam((await params).id);
  const saved = (await searchParams).saved === "1";
  const product = id
    ? await db.product.findUnique({
        where: { id },
        include: {
          image: { select: { url: true } },
          logo: { select: { url: true } },
          background: { select: { url: true } },
          parent: { select: { id: true, name: true, slug: true } },
          modules: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, name: true, slug: true, listed: true, publishedAt: true } },
          blocks: { orderBy: { sortOrder: "asc" }, include: { items: { orderBy: { sortOrder: "asc" } } } },
          users: { include: { user: { select: { id: true, username: true, companyName: true, companyRegister: true, email: true } } } },
          _count: { select: { issues: true } },
        },
      })
    : null;
  if (!product) notFound();
  const [customers, parents] = await Promise.all([
    db.user.findMany({
      where: { role: "customer" },
      orderBy: [{ companyName: "asc" }, { username: "asc" }],
      select: { id: true, username: true, companyName: true, companyRegister: true, email: true },
    }),
    db.product.findMany({ where: { parentId: null, NOT: { id: product.id } }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true, group: true } }),
  ]);
  const toCustomer = (u: (typeof customers)[number]) => ({ id: u.id, name: u.companyName || u.username, register: toNum(u.companyRegister)?.toString() ?? "", email: u.email });
  const publicHref = product.parent ? `/products/${product.parent.slug}/${product.slug}` : `/products/${product.slug}`;

  return (
    <>
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href={product.parent ? `/admin/products/${product.parent.id}` : "/admin/products"}>
        ← {product.parent ? product.parent.name : "Бүтээгдэхүүн"}
      </Link>
      <div className="mt-3">
        <PageHeader
          description={
            <>
              {product.parent ? `${product.parent.name}-ийн модуль · ` : ""}
              {product.viewCount.toLocaleString("mn-MN")} удаа үзсэн · {product._count.issues} асуудал ·{" "}
              {product.publishedAt ? (
                <Link className="text-brand hover:underline" href={publicHref} target="_blank">
                  Сайтад харах ↗
                </Link>
              ) : (
                "нийтлээгүй"
              )}
            </>
          }
          title={product.name}
        />
      </div>
      <ProductForm
        currentMain={parents.find((x) => x.group === "main")?.name}
        hasModules={product.modules.length > 0}
        parents={parents}
        product={{
          id: product.id,
          name: product.name,
          title: product.title === product.name ? "" : product.title,
          slug: product.slug,
          tagline: product.tagline ?? "",
          icon: product.icon ?? "",
          badge: product.badge ?? "",
          status: product.status,
          group: product.group,
          sortOrder: product.sortOrder,
          parentId: product.parentId ?? "",
          listed: product.listed,
          published: !!product.publishedAt,
          imageUrl: product.image?.url ?? null,
          logoUrl: product.logo?.url ?? null,
          backgroundUrl: product.background?.url ?? null,
          videoUrl: product.videoUrl ?? "",
          versionNames: product.versionNames.join(", "),
          solutions: product.solutions,
          inComparison: product.inComparison,
        }}
        saved={saved}
      />

      <section className="mt-10">
        <h2 className="text-lg font-bold text-fg">Хуудасны агуулга</h2>
        <p className="mt-1 mb-4 text-sm text-fg-muted">Сайтын хуудсанд дээрээс доош энэ дарааллаар гарна. «Холбоосууд» блок хуудасны төгсгөлд гарна.</p>
        <ProductBlocks
          blocks={product.blocks.map((b) => ({
            id: b.id,
            kind: b.kind,
            heading: b.heading ?? "",
            style: b.style ?? "",
            body: sanitizeHtml(b.body ?? ""),
            columns: b.columns,
            items: b.items.map((it) => ({ title: it.title, body: b.kind === "features" ? paragraphsToText(it.body) : (it.body ?? ""), href: it.href ?? "" })),
          }))}
          productId={product.id}
        />
      </section>

      {!product.parent && (
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-fg">Модулиуд</h2>
              <p className="text-sm text-fg-muted">/products/{product.slug}/… хаягаар, бүтээгдэхүүний хуудсанд жагсаалтаар гарна.</p>
            </div>
            <Link className="h-9 shrink-0 rounded-full border border-line bg-card px-3.5 py-2 text-sm font-semibold text-fg hover:border-brand/50 hover:text-brand" href={`/admin/products/new?parent=${product.id}`}>
              + Модуль нэмэх
            </Link>
          </div>
          {product.modules.length ? (
            <ul className="divide-y divide-line rounded-3xl border border-line bg-card">
              {product.modules.map((m) => (
                <li className="flex items-center gap-3 px-5 py-3" key={m.id}>
                  <Link className="font-semibold text-fg hover:text-brand" href={`/admin/products/${m.id}`}>
                    {m.name}
                  </Link>
                  <span className="text-xs text-fg-subtle">{m.slug}</span>
                  <span className="flex-1" />
                  {!m.listed && <Badge>Нуусан</Badge>}
                  {m.publishedAt ? <Badge tone="accent">Нийтэлсэн</Badge> : <Badge>Ноорог</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-3xl border border-dashed border-line p-5 text-sm text-fg-muted">Модуль алга.</p>
          )}
        </section>
      )}

      {!product.parent && (
        <div className="mt-10">
          <ProductCustomers
            all={customers.map(toCustomer)}
            assigned={product.users.map((l) => toCustomer(l.user)).sort((a, b) => a.name.localeCompare(b.name, "mn"))}
            productId={product.id}
          />
        </div>
      )}

      <div className="mt-10 border-t border-line pt-6">
        {product.modules.length ? (
          <p className="text-sm text-fg-muted">Модулиудыг нь устгасны дараа бүтээгдэхүүнийг устгах боломжтой.</p>
        ) : (
          <ConfirmButton
            action={deleteProduct.bind(null, product.id)}
            confirm={`«${product.name}»-г устгах уу? Хуудасны агуулга, ${product.users.length} харилцагчийн холбоос устана; ${product._count.issues} асуудал бүтээгдэхүүнгүй үлдэнэ.`}
            variant="danger"
          >
            Бүтээгдэхүүн устгах
          </ConfirmButton>
        )}
      </div>
    </>
  );
}
