import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";
import { formatDate } from "@/lib/data/posts";
import { getComparison, getSolutionProducts } from "@/lib/data/products";
import { getUpdates } from "@/lib/data/updates";
import { ProductMark } from "@/lib/product-icons";
import { SOLUTIONS } from "@/lib/site";

const CONTAINER = "mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl";

/** "✓ …" renders a tick, "—" a dash, anything else as text. Empty = not filled in yet. */
function CellValue({ value }: { value: string | undefined }) {
  if (!value) return null;
  const tick = value.startsWith("✓");
  const dash = value === "—" || value === "-";
  if (!tick && !dash) return <>{value}</>;
  const rest = value.replace(/^✓\s*/, "");
  return (
    <span className="inline-flex items-center gap-1.5">
      {tick ? (
        <svg aria-label="Тийм" className="h-5 w-5 shrink-0 text-accent-ink" fill="none" role="img" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <span aria-label="Үгүй" className="text-fg-subtle" role="img">
          —
        </span>
      )}
      {tick && rest && <span>{rest}</span>}
    </span>
  );
}

/** «Бүтээгдэхүүн харьцуулах» table; hidden with fewer than two products. */
export async function ProductComparison() {
  const { products, rows } = await getComparison();
  if (products.length < 2 || !rows.length) return null;
  return (
    <section className="scroll-mt-24 py-14 sm:py-16" id="compare">
      <div className={CONTAINER}>
        <h2 className="text-3xl font-bold text-fg">Бүтээгдэхүүн харьцуулах</h2>
        <p className="mt-3 text-fg-muted">Аль нь танай байгууллагад тохирохыг харьцуулж үзээрэй.</p>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-line bg-card">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="w-1/4 p-4 sm:p-5" scope="col">
                  <span className="sr-only">Үзүүлэлт</span>
                </th>
                {products.map((p) => (
                  <th className="p-4 align-bottom sm:p-5" key={p.id} scope="col">
                    <Link className="font-display text-lg font-bold text-fg hover:text-brand" href={`/products/${p.slug}`}>
                      {p.name}
                    </Link>
                    {p.status === "coming_soon" && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">Тун удахгүй</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr className="border-b border-line" key={r.id}>
                  <th className="p-4 font-semibold text-fg sm:p-5" scope="row">
                    {r.label}
                  </th>
                  {products.map((p) => (
                    <td className="p-4 text-fg-muted sm:p-5" key={p.id}>
                      <CellValue value={r.values[p.id]} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 sm:p-5" />
                {products.map((p) => (
                  <td className="p-4 sm:p-5" key={p.id}>
                    <Link className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all hover:gap-2.5" href={`/products/${p.slug}`}>
                      Дэлгэрэнгүй <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/** Latest release notes of a product (version_infos); hidden when it has none. */
export async function ProductUpdates({ slug, versionNames }: { slug: string; versionNames: string[] }) {
  const updates = await getUpdates(versionNames, 5);
  if (!updates.length) return null;
  return (
    <div className="mt-14 rounded-3xl border border-line p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-fg">Шинэчлэлтүүд</h2>
        <Link className="text-sm font-semibold text-brand" href={`/updates?product=${slug}`}>
          Бүх шинэчлэлт
        </Link>
      </div>
      <UpdateList updates={updates} />
    </div>
  );
}

/** Release notes as a timeline; `labelOf` adds a product tag (for lists that mix products). */
export function UpdateList({ updates, labelOf }: { updates: Awaited<ReturnType<typeof getUpdates>>; labelOf?: (productname: string | null) => string | undefined }) {
  return (
    <ol className="mt-5 space-y-5 border-l border-line pl-5">
      {updates.map((u) => (
        <li className="relative" key={u.id}>
          <span aria-hidden="true" className="absolute top-1.5 -left-[26px] h-3 w-3 rounded-full border-2 border-bg bg-brand" />
          <p className="flex flex-wrap items-center gap-2">
            <time className="text-xs font-semibold text-fg-subtle" dateTime={u.changedDate.toISOString().slice(0, 10)}>
              {formatDate(u.changedDate)}
            </time>
            {labelOf?.(u.productname) && <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-fg-muted">{labelOf(u.productname)}</span>}
          </p>
          <p className="mt-0.5 leading-relaxed whitespace-pre-line text-fg">{u.description}</p>
        </li>
      ))}
    </ol>
  );
}

/** «Тохирох салбарууд»: the /solutions pages a product is used in. */
export function ProductSolutions({ solutions }: { solutions: string[] }) {
  const list = SOLUTIONS.filter((s) => solutions.includes(s.slug));
  if (!list.length) return null;
  return (
    <nav aria-label="Тохирох салбарууд" className="rounded-3xl border border-line p-6">
      <p className="mb-3 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Тохирох салбарууд</p>
      <ul className="flex flex-wrap gap-2">
        {list.map((s) => (
          <li key={s.slug}>
            <Link className="inline-flex rounded-full border border-line bg-card px-3 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:border-brand/40 hover:text-brand" href={`/solutions/${s.slug}`}>
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** «Холбогдох бүтээгдэхүүн» at the end of a /solutions page, from Product.solutions. */
export async function SolutionProducts({ solution }: { solution: string }) {
  const products = await getSolutionProducts(solution);
  if (!products.length) return null;
  return (
    <section className="border-t border-line bg-surface py-14 sm:py-16">
      <div className={CONTAINER}>
        <h2 className="text-3xl font-bold text-fg">Холбогдох бүтээгдэхүүн</h2>
        <p className="mt-3 text-fg-muted">Энэ салбарт ашиглагддаг манай системүүд.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40"
                href={p.parent ? `/products/${p.parent.slug}/${p.slug}` : `/products/${p.slug}`}
              >
                <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl ${p.logo ? "border border-line bg-white p-1" : "bg-brand-soft text-brand"}`}>
                  <ProductMark className="h-5 w-5" icon={p.icon} logoUrl={p.logo?.url} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold text-fg group-hover:text-brand">{p.name}</span>
                  {p.tagline && <span className="mt-1 line-clamp-2 block text-sm text-fg-muted">{p.tagline}</span>}
                </span>
                <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
