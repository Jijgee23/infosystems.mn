import { DownloadForm } from "@/components/admin/download-form";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = { title: "Шинэ файл" };

export default async function NewDownloadPage() {
  await requireStaff();
  const guides = await db.guide.findMany({ orderBy: { title: "asc" }, select: { slug: true, title: true } });
  return (
    <>
      <PageHeader title="Шинэ файл" />
      <DownloadForm guides={guides} item={{ title: "", description: "", externalUrl: "", guideSlug: "", sortOrder: 0, isPublic: true, file: null }} />
    </>
  );
}
