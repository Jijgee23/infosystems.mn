import Link from "next/link";
import { getGuides } from "@/lib/data/guides";
import { ArrowRight } from "./icons";

/** The most recently updated guides, for the home page. */
export async function HomeGuides({ limit = 3 }: { limit?: number }) {
  const guides = (await getGuides())
    .filter((g) => g.contentDate)
    .sort((a, b) => b.contentDate!.getTime() - a.contentDate!.getTime())
    .slice(0, limit);
  if (!guides.length) return null;
  return (
    <ul className="divide-y divide-line border-y border-line lg:col-span-8">
      {guides.map((g) => {
        const date = g.contentDate!.toISOString().slice(0, 10);
        return (
          <li key={g.id}>
            <Link className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 sm:grid-cols-[7rem_1fr_auto] sm:px-2" href={`/support/guides/${g.slug}`}>
              <time className="text-xs font-semibold text-fg-subtle tabular-nums sm:text-sm" dateTime={date}>
                {date.replaceAll("-", ".")}
              </time>
              <span className="col-start-1 font-display text-lg font-semibold text-fg transition-colors group-hover:text-brand sm:col-start-2">{g.title}</span>
              <ArrowRight className="row-span-2 row-start-1 h-5 w-5 text-fg-subtle transition-all group-hover:translate-x-1 group-hover:text-brand sm:col-start-3 sm:row-span-1" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
