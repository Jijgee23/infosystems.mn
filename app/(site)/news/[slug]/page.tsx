import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { absUrl, JsonLd, SITE_URL } from "@/components/site/json-ld";
import { ViewCounter } from "@/components/site/view-counter";
import { ArrowRight } from "@/components/site/icons";
import { formatDate, getPopularPosts, getPostBySlug, summary } from "@/lib/data/posts";
import { POST_CATEGORIES } from "@/lib/post-categories";
import { sanitizeHtml } from "@/lib/sanitize";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const post = await getPostBySlug(decodeURIComponent((await params).slug));
  if (!post) return { title: "Мэдээ олдсонгүй | InfoSystems Mongolia" };
  return {
    title: `${post.title} | InfoSystems Mongolia`,
    description: summary(post, 160),
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: { type: "article", title: post.title, images: post.imageUrl ? [post.imageUrl] : [DEFAULT_OG_IMAGE] },
  };
}

export default function PostPage(props: PageProps<"/news/[slug]">) {
  return (
    <main id="main">
      <Suspense fallback={<PostSkeleton />}>
        <PostDetails params={props.params} />
      </Suspense>
    </main>
  );
}

async function PostDetails({ params }: Pick<PageProps<"/news/[slug]">, "params">) {
  const post = await getPostBySlug(decodeURIComponent((await params).slug));
  if (!post) notFound();
  const category = POST_CATEGORIES.find((c) => c.name === post.category);
  return (
    <article>
      <JsonLd
        data={{
          "@type": "NewsArticle",
          headline: post.title,
          description: summary(post, 160),
          ...(post.imageUrl ? { image: absUrl(post.imageUrl) } : {}),
          ...(post.publishedAt ? { datePublished: post.publishedAt.toISOString() } : {}),
          dateModified: post.updatedAt.toISOString(),
          mainEntityOfPage: absUrl(`/news/${post.slug}`),
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />
      <header className="border-b border-line bg-surface">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl pt-8 pb-12">
          <Breadcrumbs
            items={[
              { href: "/news", label: "Мэдээ, зөвлөгөө" },
              ...(category ? [{ href: `/news?category=${category.slug}`, label: category.name }] : []),
              { label: post.title },
            ]}
          />
          <p className="mt-8 flex items-center gap-2 text-sm font-semibold text-fg-subtle">
            {post.category && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-brand">{post.category}</span>}
            <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
          </p>
          <h1 className="mt-4 text-3xl font-extrabold text-fg sm:text-4xl">{post.title}</h1>
        </div>
      </header>
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
        {post.imageUrl && (
          <figure className="md-figure mt-0">
            <Image
              alt=""
              className="h-auto w-full"
              fetchPriority="high"
              height={post.imageHeight ?? 900}
              loading="eager"
              sizes="(min-width: 896px) 832px, calc(100vw - 32px)"
              src={post.imageUrl}
              width={post.imageWidth ?? 1600}
            />
          </figure>
        )}
        <div className="md-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body) }} />
        <Link className="mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 transition-all" href="/news">
          Бүх мэдээ <ArrowRight className="h-4 w-4" />
        </Link>
        <PopularPosts currentId={post.id} />
      </div>
      <ViewCounter id={post.id} kind="post" />
    </article>
  );
}

async function PopularPosts({ currentId }: { currentId: string }) {
  const posts = (await getPopularPosts(6)).filter((p) => p.id !== currentId).slice(0, 5);
  if (!posts.length) return null;
  return (
    <section className="mt-14 border-t border-line pt-8">
      <h2 className="text-xl font-bold text-fg">Их уншсан</h2>
      <ol className="mt-4 divide-y divide-line">
        {posts.map((p, i) => (
          <li key={p.id}>
            <Link className="group flex items-baseline gap-4 py-3" href={`/news/${p.slug}`}>
              <span className="w-5 shrink-0 font-display text-sm font-bold text-fg-subtle tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1 font-medium text-fg group-hover:text-brand">{p.title}</span>
              <time className="hidden shrink-0 text-xs text-fg-subtle sm:block" dateTime={p.publishedAt?.toISOString()}>
                {formatDate(p.publishedAt)}
              </time>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PostSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl py-16">
      <div className="h-6 w-40 animate-pulse rounded bg-surface" />
      <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-surface" />
      <div className="mt-10 h-64 animate-pulse rounded-3xl bg-surface" />
    </div>
  );
}
