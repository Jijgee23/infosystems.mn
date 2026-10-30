import { idParam } from "@/lib/ids";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader } from "@/components/admin/ui";
import { deleteNotification } from "@/lib/actions/admin";
import { requireStaff } from "@/lib/auth/session";
import { toDateInput } from "@/lib/time";
import { db } from "@/lib/db";
import { NotificationForm } from "../notification-form";

export const metadata = { title: "Мэдэгдэл засах" };

export default async function EditNotificationPage({ params }: PageProps<"/admin/notifications/[id]">) {
  await requireStaff();
  const id = idParam((await params).id);
  const n = id ? await db.insertNotification.findUnique({ where: { id } }) : null;
  if (!n) notFound();
  return (
    <>
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href="/admin/notifications">
        ← Мэдэгдлүүд
      </Link>
      <div className="mt-3">
        <PageHeader title={n.description || `Мэдэгдэл #${n.id}`} />
      </div>
      <NotificationForm
        value={{
          id: n.id,
          description: n.description ?? "",
          macsversion: n.macsversion,
          apptype: n.apptype,
          toCustomer: n.toCustomer,
          filetype: n.filetype,
          isActive: n.isActive === 1,
          expireDate: toDateInput(n.expireDate),
          newsText: n.newsText ?? "",
          pdfFile: n.pdfFile ?? "",
          fileUrl: n.fileUrl ?? "",
          customerId: n.customerId ?? "",
        }}
      />
      <div className="mt-10 border-t border-line pt-6">
        <ConfirmButton action={deleteNotification.bind(null, n.id)} confirm="Энэ мэдэгдлийг устгах уу?" variant="danger">
          Устгах
        </ConfirmButton>
      </div>
    </>
  );
}
