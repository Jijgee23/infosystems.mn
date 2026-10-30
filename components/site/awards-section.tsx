import Image from "next/image";
import { getPublicAwards } from "@/lib/data/company";

/** "Шагнал урамшуулал" on the about page (anchor #awards); hidden when there are none. */
export async function AwardsSection() {
  const awards = await getPublicAwards();
  if (awards.length === 0) return null;
  return (
    <section className="scroll-mt-24 bg-surface py-14 sm:py-20" id="awards">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <h2 className="text-3xl font-bold text-fg">Шагнал урамшуулал</h2>
          <p className="text-sm text-fg-subtle">Зураг дээр дарж томоор үзнэ үү.</p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {awards.map((a) => {
            const caption = [a.title, a.issuer, a.year].filter(Boolean).join(" · ");
            return (
              <li key={a.id}>
                <figure>
                  <button
                    aria-label={`${caption} — томоор харах`}
                    className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-card p-2 text-left transition-shadow hover:shadow-xl hover:shadow-ink/10"
                    data-zoom-alt={caption}
                    data-zoom-group="awards"
                    data-zoom-src={a.imageUrl}
                    type="button"
                  >
                    <Image
                      alt={caption}
                      className="aspect-[3/4] w-full rounded-xl bg-surface object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      height={a.height ?? 800}
                      sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      src={a.imageUrl}
                      width={a.width ?? 600}
                    />
                  </button>
                  {(a.issuer || a.year) && <figcaption className="mt-2 px-1 text-xs text-fg-subtle">{[a.issuer, a.year].filter(Boolean).join(" · ")}</figcaption>}
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
