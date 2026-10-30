import { getPublicMilestones } from "@/lib/data/company";

/** «Он цагийн хэлхээс» on the about page, edited in admin; hidden when there are none. */
export async function MilestonesSection() {
  const milestones = await getPublicMilestones();
  if (milestones.length === 0) return null;
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl font-bold text-fg">Он цагийн хэлхээс</h2>
        {/* overflow-x-clip trims each row's connector line at the right edge. */}
        <ol className={`relative mt-10 grid gap-8 overflow-x-clip md:grid-cols-3 md:gap-6 ${milestones.length > 3 ? "lg:grid-cols-4" : ""}`}>
          {milestones.map((m, i) => (
            <li className="reveal relative pl-8 md:pl-0" key={m.id} style={{ "--reveal-delay": `${Math.min(i, 5) * 100}ms` }}>
              <span aria-hidden="true" className="absolute top-[11px] -right-6 left-0 hidden h-px bg-line md:block" />
              <span aria-hidden="true" className="absolute top-1.5 left-0 h-[22px] w-px bg-line md:hidden" />
              <span className="absolute top-0 left-[-5px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-4 border-bg bg-brand md:relative md:left-0" />
              <p className="mt-0 font-display text-4xl font-extrabold text-brand md:mt-5">{m.year}</p>
              <p className="mt-2 font-display text-lg font-bold text-fg">{m.title}</p>
              {m.description && <p className="mt-1.5 leading-relaxed text-fg-muted">{m.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
