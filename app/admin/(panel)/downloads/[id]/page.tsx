import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { DownloadForm } from "@/components/admin/download-form";
import { PageHeader } from "@/components/admin/ui";
import { deleteDownload } from "@/lib/actions/downloads";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";

export const metadata = { title: "Файл засах" };

export default async function EditDownloadPage({ params, searchParams }: PageProps<"/admin/downloads/[id]">) {
  await requireStaff();
  const id = idParam((await params).id);
  const saved = (await searchParams).saved === "1";
  const [item, guides] = await Promise.all([
    id ? db.download.findUnique({ where: { id }, include: { file: { select: { url: true, name: true, sizeKb: true } } } }) : null,
    db.guide.findMany({ orderBy: { title: "asc" }, select: { slug: true, title: true } }),
  ]);
  if (!item) notFound();
  return (
    <>
      <PageHeader title="Файл засах" />
      <DownloadForm
        guides={guides}
        item={{
          id: item.id,
          title: item.title,
          description: item.description ?? "",
          externalUrl: item.externalUrl ?? "",
          guideSlug: item.guideSlug ?? "",
          sortOrder: item.sortOrder,
          isPublic: item.isPublic,
          file: item.file,
        }}
        saved={saved}
      />
      <div className="mt-10 border-t border-line pt-6">
        <ConfirmButton action={deleteDownload.bind(null, item.id)} confirm="Энэ файлыг жагсаалтаас устгах уу?" variant="danger">
          Устгах
        </ConfirmButton>
      </div>
    </>
  );
}
