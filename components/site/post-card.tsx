import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";
import { formatDate, type getPublishedPosts, summary } from "@/lib/data/posts";

export type PublishedPost = Awaited<ReturnType<typeof getPublishedPosts>>[number];

/** Post card used on /news and the home page; `heading` keeps the outline right on each page. */
export function PostCard({ post, heading: Heading = "h2" }: { post: PublishedPost; heading?: "h2" | "h3" }) {
  return (
    <Link className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card transition-colors hover:border-brand/40" href={`/news/${post.slug}`}>
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {post.imageUrl ? (
          <Image alt="" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" fill sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" src={post.imageUrl} />
        ) : (
          <div className="bg-grid h-full w-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-fg-subtle uppercase">
          {post.category && <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand normal-case">{post.category}</span>}
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
        </p>
        <Heading className="mt-3 font-display text-lg font-bold text-fg group-hover:text-brand">{post.title}</Heading>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">{summary(post)}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand">
          Унших <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
