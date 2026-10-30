import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArrowRight } from "@/components/site/icons";
import { PostCard, type PublishedPost } from "@/components/site/post-card";
import { getPublishedPosts } from "@/lib/data/posts";
import { POST_CATEGORIES } from "@/lib/post-categories";

export const metadata: Metadata = {
  title: "Мэдээ, зөвлөгөө | InfoSystems Mongolia",
  description: "InfoSystems Mongolia-ийн мэдээ мэдээлэл, MACS програмыг ашиглах зөвлөгөө.",
  alternates: { canonical: "/news" },
};

export default function NewsPage(props: PageProps<"/news">) {
  return (
    <main id="main">
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 pb-12">
          <Breadcrumbs items={[{ label: "Мэдээ, зөвлөгөө" }]} />
          <h1 className="mt-8 text-4xl font-extrabold text-fg sm:text-5xl">Мэдээ, зөвлөгөө</h1>
          <p className="mt-4 max-w-2xl text-lg text-fg-muted">Компанийн мэдээ мэдээлэл, MACS-ийг илүү үр дүнтэй ашиглах зөвлөгөө.</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Suspense fallback={<NewsSkeleton />}>
            <NewsList searchParams={props.searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function NewsList({ searchParams }: Pick<PageProps<"/news">, "searchParams">) {
  const sp = await searchParams;
  const all = await getPublishedPosts();
  const current = POST_CATEGORIES.find((c) => c.slug === sp.category) ?? null;
  const posts = current ? all.filter((p) => p.category === current.name) : all;
  const tab = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-brand text-white dark:text-ink" : "border border-line bg-card text-fg-muted hover:border-brand/40 hover:text-fg"}`;
  return (
    <>
      <nav aria-label="Ангилал" className="mb-8 flex flex-wrap gap-2">
        <Link aria-current={!current ? "page" : undefined} className={tab(!current)} href="/news">
          Бүгд
        </Link>
        {POST_CATEGORIES.map((c) => (
          <Link aria-current={current?.slug === c.slug ? "page" : undefined} className={tab(current?.slug === c.slug)} href={`/news?category=${c.slug}`} key={c.slug}>
            {c.name}
            <span className="ml-1.5 opacity-70">{all.filter((p) => p.category === c.name).length}</span>
          </Link>
        ))}
      </nav>
      {posts.length === 0 ? <EmptyState /> : <PostGrid posts={posts} />}
    </>
  );
}

function PostGrid({ posts }: { posts: PublishedPost[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

function NewsSkeleton() {
  return (
    <ul aria-hidden="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <li className="h-80 animate-pulse rounded-3xl border border-line bg-surface" key={i} />
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <p className="mt-4 text-lg text-fg-muted">Одоогоор нийтлэгдсэн мэдээ алга байна.</p>
      <Link className="inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 border border-line bg-card text-fg hover:border-brand/50 hover:text-brand h-10 px-4 text-sm mt-6" href="/support/guides">
        Заавар, гарын авлага үзэх <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
