import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/form";
import { requireUser } from "@/lib/auth/session";
import { getUserProducts } from "@/lib/data/issues";
import { NewIssueForm } from "./new-issue-form";

export const metadata: Metadata = { title: "Асуудал илгээх | InfoSystems Mongolia", robots: { index: false } };

export default async function NewIssuePage() {
  const user = await requireUser("/portal/issues/new");
  const products = await getUserProducts(user.id);
  return (
    <div className="max-w-2xl">
      <Link className="text-sm font-medium text-fg-muted hover:text-brand" href="/portal">
        ← Буцах
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-fg">Асуудал, санал илгээх</h1>
      <Card className="mt-6">
        <NewIssueForm products={products} />
      </Card>
    </div>
  );
}
