import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ClientGrid } from "./client-grid";

export const metadata = { title: "Харилцагчийн лого" };

export default async function ClientsPage() {
  await requireStaff({ admin: true });
  const items = await db.clientLogo.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { logo: { select: { url: true } } } });
  return (
    <>
      <PageHeader description="Нүүр хуудас болон «Амжилтын түүх» хуудасны «Бидэнд итгэдэг байгууллагууд» хэсэгт өнгөтөөр гарна. Тухайн байгууллагын зөвшөөрөлтэйгээр оруулна уу." title="Харилцагчийн лого" />
      <ClientGrid items={items.map((c) => ({ id: c.id, name: c.name, url: c.url ?? "", isPublic: c.isPublic, sortOrder: c.sortOrder, logoUrl: c.logo.url }))} />
    </>
  );
}
