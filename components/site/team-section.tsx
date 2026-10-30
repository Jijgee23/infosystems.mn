import Image from "next/image";
import { formatPhone, getPublicEmployees, telHref } from "@/lib/data/company";
import { Mail, Phone } from "./icons";

/** "Хамт олон" grid on the about page; renders nothing until employees are added in the admin. */
export async function TeamSection() {
  const team = await getPublicEmployees();
  if (team.length === 0) return null;
  return (
    <section className="border-t border-line py-14 sm:py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl font-bold text-fg">Хамт олон</h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((e) => (
            <li className="rounded-3xl border border-line bg-card p-6" key={e.id}>
              {e.photoUrl ? (
                <Image
                  alt={e.name}
                  className="aspect-square w-full rounded-2xl bg-surface object-cover"
                  height={400}
                  sizes="(min-width: 1280px) 280px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  src={e.photoUrl}
                  width={400}
                />
              ) : (
                <div aria-hidden="true" className="bg-grid flex aspect-square w-full items-center justify-center rounded-2xl bg-surface font-display text-5xl font-extrabold text-fg-subtle">
                  {e.name.slice(0, 1)}
                </div>
              )}
              <p className="mt-5 font-display text-lg font-bold text-fg">{e.name}</p>
              {(e.position || e.department) && <p className="mt-0.5 text-sm text-fg-muted">{[e.position, e.department].filter(Boolean).join(" · ")}</p>}
              {e.bio && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{e.bio}</p>}
              {(e.phone || e.email) && (
                <div className="mt-4 space-y-1 text-sm">
                  {e.phone && (
                    <a className="flex items-center gap-2 font-medium text-fg hover:text-brand" href={telHref(e.phone)}>
                      <Phone className="h-4 w-4 text-brand" /> {formatPhone(e.phone)}
                    </a>
                  )}
                  {e.email && (
                    <a className="flex items-center gap-2 font-medium break-all text-fg hover:text-brand" href={`mailto:${e.email}`}>
                      <Mail className="h-4 w-4 shrink-0 text-brand" /> {e.email}
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
