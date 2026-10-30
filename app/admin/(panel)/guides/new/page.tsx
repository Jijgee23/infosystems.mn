import { GuideForm } from "@/components/admin/guide-form";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { toDateInput } from "@/lib/time";

export const metadata = { title: "Шинэ заавар" };

export default async function NewGuidePage() {
  await requireStaff();
  return (
    <>
      <PageHeader title="Шинэ заавар" />
      <GuideForm guide={{ title: "", slug: "", category: "", sortOrder: 0, body: "", contentDate: toDateInput(new Date()), publishedAt: "" }} />
    </>
  );
}
