import { idParam } from "@/lib/ids";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader } from "@/components/admin/ui";
import { deleteUser } from "@/lib/actions/admin";
import { requireStaff } from "@/lib/auth/session";
import { listIssues } from "@/lib/data/issues";
import { db } from "@/lib/db";
import { IssueList } from "@/components/portal/issue-list";
import { UserForm } from "./user-form";

export const metadata = { title: "Хэрэглэгч" };

export default async function AdminUserPage({ params }: PageProps<"/admin/users/[id]">) {
  const me = await requireStaff();
  const id = idParam((await params).id);
  if (!id) notFound();
  const user = id ? await db.user.findUnique({ where: { id } }) : null;
  if (!user) notFound();
  const [products, owned, issues] = await Promise.all([
    db.product.findMany({ where: { parentId: null }, select: { id: true, title: true }, orderBy: { title: "asc" } }),
    db.userProduct.findMany({ where: { userId: id }, select: { productId: true } }),
    listIssues({ userId: id, viewerId: me.id, limit: 20 }),
  ]);
  return (
    <>
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href="/admin/users">
        ← Хэрэглэгчид
      </Link>
      <div className="mt-3">
        <PageHeader title={user.companyName || user.username} />
      </div>
      <UserForm
        canEditRole={me.role === "admin" && me.id !== user.id}
        isSelf={me.id === user.id}
        ownedIds={owned.map((o) => o.productId)}
        products={products}
        user={{
          id: user.id,
          username: user.username,
          email: user.email,
          companyName: user.companyName ?? "",
          companyRegister: user.companyRegister?.toString() ?? "",
          customerType: user.customerType,
          personalRegister: user.personalRegister ?? "",
          role: user.role,
          adminConfirmed: user.adminConfirmed,
          blocked: user.blocked,
        }}
      />
      <h2 className="mt-10 mb-3 text-lg font-bold text-fg">Илгээсэн асуудлууд</h2>
      <IssueList base="/admin/issues" items={issues} staffView />
      {me.role === "admin" && me.id !== user.id && (
        <div className="mt-10 border-t border-line pt-6">
          <ConfirmButton
            action={deleteUser.bind(null, user.id)}
            confirm={`«${user.companyName || user.username}» бүртгэлийг устгах уу? Илгээсэн асуудлууд нь зохиогчгүйгээр үлдэнэ. Буцаах боломжгүй.`}
            variant="danger"
          >
            Бүртгэл устгах
          </ConfirmButton>
          <p className="mt-2 text-xs text-fg-subtle">Түр хаах бол дээрх «Эрх хаах» тохиргоог ашиглана уу.</p>
        </div>
      )}
    </>
  );
}
