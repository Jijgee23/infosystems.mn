import Link from "next/link";
import { PageHeader, Table, Td } from "@/components/admin/ui";
import { Badge } from "@/components/ui/form";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ProductMark } from "@/lib/product-icons";
import { ModuleGroup } from "./module-group";

export const metadata = { title: "Бүтээгдэхүүн" };

const GROUP_LABEL = { main: "Үндсэн", featured: "Онцлох", other: "Бусад" } as const;
const GROUP_ORDER = { main: 0, featured: 1, other: 2 } as const;

type Row = Awaited<ReturnType<typeof load>>[number];

const load = () =>
  db.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { logo: { select: { url: true } }, _count: { select: { users: true, issues: true, blocks: true, modules: true } } },
  });

export default async function AdminProducts() {
  await requireStaff();
  const rows = await load();
  // Top-level products in site order; their modules are folded under them.
  const top = rows.filter((p) => !p.parentId).sort((a, b) => GROUP_ORDER[a.group] - GROUP_ORDER[b.group] || Number(!a.listed) - Number(!b.listed));

  return (
    <>
      <PageHeader action={{ href: "/admin/products/new", label: "Шинэ бүтээгдэхүүн" }} description="Сайтын бүтээгдэхүүний хуудсууд, харилцагчид оноох бүтээгдэхүүнүүд" title="Бүтээгдэхүүн" />
      <Table empty={!rows.length} head={["", "Нэр", "Бүлэг", "Агуулга", "Харилцагч", "Асуудал", "Үзсэн", "Төлөв"]}>
        {top.map((p) => (
          <ModuleGroup
            cells={<Cells p={p} />}
            count={p._count.modules}
            key={p.id}
            modules={rows
              .filter((m) => m.parentId === p.id)
              .map((m) => (
                <tr className="bg-surface/30 hover:bg-surface/60" key={m.id}>
                  <td />
                  <Cells p={m} />
                </tr>
              ))}
            name={p.name}
          />
        ))}
      </Table>
    </>
  );
}

function Cells({ p }: { p: Row }) {
  return (
    <>
      <Td>
        <div className={`flex items-center gap-3 ${p.parentId ? "pl-4" : ""}`}>
          {p.parentId ? (
            <span className="text-fg-subtle">└</span>
          ) : (
            <span className={`grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl ${p.logo ? "border border-line bg-white p-1" : "bg-surface text-fg-muted"}`}>
              <ProductMark className="size-4.5" icon={p.icon} logoUrl={p.logo?.url} />
            </span>
          )}
          <span className="min-w-0">
            <Link className="font-semibold text-fg hover:text-brand" href={`/admin/products/${p.id}`}>
              {p.name}
            </Link>
            <span className="block truncate text-xs text-fg-subtle">
              {p.slug}
              {p._count.modules > 0 && ` · ${p._count.modules} модуль`}
            </span>
          </span>
        </div>
      </Td>
      <Td>{p.parentId ? <span className="text-fg-subtle">Модуль</span> : p.group === "main" ? <Badge tone="brand">Үндсэн</Badge> : GROUP_LABEL[p.group]}</Td>
      <Td className="tabular-nums">{p._count.blocks ? `${p._count.blocks} блок` : <span className="text-fg-subtle">—</span>}</Td>
      <Td className="tabular-nums">{p.parentId ? "" : p._count.users}</Td>
      <Td className="tabular-nums">{p._count.issues || ""}</Td>
      <Td className="tabular-nums">{p.viewCount ? p.viewCount.toLocaleString("mn-MN") : ""}</Td>
      <Td>
        <span className="flex flex-wrap gap-1">
          {p.publishedAt ? <Badge tone="accent">Нийтэлсэн</Badge> : <Badge>Ноорог</Badge>}
          {!p.listed && <Badge>Нуусан</Badge>}
          {p.status === "coming_soon" && <Badge tone="warn">Тун удахгүй</Badge>}
        </span>
      </Td>
    </>
  );
}
