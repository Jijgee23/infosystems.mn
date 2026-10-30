import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { NotificationForm } from "../notification-form";

export const metadata = { title: "Шинэ мэдэгдэл" };

const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

export default async function NewNotificationPage() {
  await requireStaff();
  const inMonth = inDays(30);
  return (
    <>
      <PageHeader title="Шинэ мэдэгдэл" />
      <NotificationForm
        value={{ description: "", macsversion: 0, apptype: 0, toCustomer: 0, filetype: 1, isActive: true, expireDate: inMonth, newsText: "", pdfFile: "", fileUrl: "", customerId: "" }}
      />
    </>
  );
}
