import Link from "next/link";
import { ArrowRight } from "@/components/site/icons";
import { PostCard } from "@/components/site/post-card";
import { getPublishedPosts } from "@/lib/data/posts";
import { POST_CATEGORIES } from "@/lib/post-categories";

const [NEWS, ADVICE] = POST_CATEGORIES;

/**
 * «Мэдээ, зөвлөгөө» on the home page: the three latest posts, with at least one advice post
 * when there is any, so a run of news doesn't push advice off the page. Hidden when there are none.
 */
export async function HomeNews() {
  const all = await getPublishedPosts();
  const latest = all.slice(0, 3);
  const advice = all.find((p) => p.category === ADVICE.name);
  if (advice && latest.length === 3 && !latest.includes(advice)) latest[2] = advice;
  if (!latest.length) return null;

  return (
    <section aria-labelledby="home-news-heading" className="border-t border-line py-16 sm:py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-fg sm:text-4xl" id="home-news-heading">
              Мэдээ, зөвлөгөө
            </h2>
            <p className="mt-3 text-lg text-fg-muted">Компанийн мэдээ мэдээлэл, MACS-ийг илүү үр дүнтэй ашиглах зөвлөгөө.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2">
            {[NEWS, ADVICE].map((c) => (
              <Link className="text-sm font-semibold text-fg-muted hover:text-brand" href={`/news?category=${c.slug}`} key={c.slug}>
                {c.name}
              </Link>
            ))}
            <Link className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all hover:gap-2.5" href="/news">
              Бүгдийг үзэх <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <li key={post.id}>
              <PostCard heading="h3" post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
