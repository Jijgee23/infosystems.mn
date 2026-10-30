import "server-only";
import { db } from "@/lib/db";

export type PositionItem = { id: string; name: string; sortOrder: number; departmentId: string; employees: number };
export type DepartmentNode = {
  id: string;
  name: string;
  parentId: string | null;
  sortOrder: number;
  depth: number;
  /** "Хэлтэс › Тасаг" */
  path: string;
  children: number;
  positions: PositionItem[];
  employees: number;
};

/** Departments in tree order (parents first, then their units), each with its positions. */
export async function getOrgTree(): Promise<DepartmentNode[]> {
  const [departments, positions] = await Promise.all([
    db.department.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { _count: { select: { children: true } } } }),
    db.position.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { _count: { select: { employees: true } } } }),
  ]);
  const positionsOf = new Map<string, PositionItem[]>();
  for (const p of positions) {
    const item = { id: p.id, name: p.name, sortOrder: p.sortOrder, departmentId: p.departmentId, employees: p._count.employees };
    positionsOf.set(p.departmentId, [...(positionsOf.get(p.departmentId) ?? []), item]);
  }
  const byParent = new Map<string | null, typeof departments>();
  for (const d of departments) byParent.set(d.parentId, [...(byParent.get(d.parentId) ?? []), d]);

  const out: DepartmentNode[] = [];
  const walk = (parentId: string | null, depth: number, prefix: string) => {
    for (const d of byParent.get(parentId) ?? []) {
      const pos = positionsOf.get(d.id) ?? [];
      const path = prefix ? `${prefix} › ${d.name}` : d.name;
      out.push({ id: d.id, name: d.name, parentId: d.parentId, sortOrder: d.sortOrder, depth, path, children: d._count.children, positions: pos, employees: pos.reduce((n, p) => n + p.employees, 0) });
      if (depth < 10) walk(d.id, depth + 1, path);
    }
  };
  walk(null, 0, "");
  return out;
}
