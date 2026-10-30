import { idParam } from "@/lib/ids";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PostForm } from "@/components/admin/post-form";
import { PageHeader } from "@/components/admin/ui";
import { deletePost } from "@/lib/actions/admin";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize";
import { toLocalInput } from "@/lib/time";

export const metadata = { title: "Мэдээ засах" };

export default async function EditPostPage({ params, searchParams }: PageProps<"/admin/posts/[id]">) {
  await requireStaff();
  const id = idParam((await params).id);
  const saved = (await searchParams).saved === "1";
  const post = id ? await db.post.findUnique({ where: { id }, include: { image: { select: { url: true } } } }) : null;
  if (!post) notFound();
  return (
    <>
      <PageHeader
        description={
          post.publishedAt ? (
            <Link className="text-brand hover:underline" href={`/news/${post.slug}`} target="_blank">
              /news/{post.slug} ↗
            </Link>
          ) : (
            "Ноорог"
          )
        }
        title="Мэдээ засах"
      />
      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          category: post.category ?? "",
          excerpt: post.excerpt ?? "",
          body: sanitizeHtml(post.body),
          publishedAt: toLocalInput(post.publishedAt),
          imageUrl: post.image?.url ?? null,
        }}
        saved={saved}
      />
      <div className="mt-10 border-t border-line pt-6">
        <ConfirmButton action={deletePost.bind(null, post.id)} confirm="Энэ мэдээг устгах уу?" variant="danger">
          Мэдээ устгах
        </ConfirmButton>
      </div>
    </>
  );
}
