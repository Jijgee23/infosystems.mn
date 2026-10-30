import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { GuideForm } from "@/components/admin/guide-form";
import { PageHeader } from "@/components/admin/ui";
import { deleteGuide } from "@/lib/actions/guides";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { idParam } from "@/lib/ids";
import { sanitizeHtml } from "@/lib/sanitize";
import { toDateInput, toLocalInput } from "@/lib/time";

export const metadata = { title: "Заавар засах" };

export default async function EditGuidePage({ params, searchParams }: PageProps<"/admin/guides/[id]">) {
  await requireStaff();
  const id = idParam((await params).id);
  const saved = (await searchParams).saved === "1";
  const guide = id ? await db.guide.findUnique({ where: { id } }) : null;
  if (!guide) notFound();
  return (
    <>
      <PageHeader
        description={
          guide.publishedAt ? (
            <Link className="text-brand hover:underline" href={`/support/guides/${guide.slug}`} target="_blank">
              /support/guides/{guide.slug} ↗
            </Link>
          ) : (
            "Ноорог"
          )
        }
        title="Заавар засах"
      />
      <GuideForm
        guide={{
          id: guide.id,
          title: guide.title,
          slug: guide.slug,
          category: guide.category,
          sortOrder: guide.sortOrder,
          body: sanitizeHtml(guide.body),
          contentDate: toDateInput(guide.contentDate),
          publishedAt: toLocalInput(guide.publishedAt),
        }}
        saved={saved}
      />
      <div className="mt-10 border-t border-line pt-6">
        <ConfirmButton action={deleteGuide.bind(null, guide.id)} confirm="Энэ зааврыг устгах уу?" variant="danger">
          Заавар устгах
        </ConfirmButton>
      </div>
    </>
  );
}
