import { PostForm } from "@/components/admin/post-form";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Шинэ мэдээ" };

export default async function NewPostPage() {
  await requireStaff();
  return (
    <>
      <PageHeader title="Шинэ мэдээ" />
      <PostForm post={{ title: "", slug: "", category: "", excerpt: "", body: "", publishedAt: "", imageUrl: null }} />
    </>
  );
}
