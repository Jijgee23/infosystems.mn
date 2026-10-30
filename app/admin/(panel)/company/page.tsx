import Link from "next/link";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader } from "@/components/admin/ui";
import { StatCards } from "@/components/site/stat-cards";
import { addAutoStat } from "@/lib/actions/trust";
import { requireStaff } from "@/lib/auth/session";
import { autoStatTemplates, fillStats, getStatTokens } from "@/lib/data/trust";
import { db } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize";
import { LocationForm, ProfileForm } from "./company-form";
import { ContactList } from "./contact-row";
import { StatList } from "./stat-row";

export const metadata = { title: "Компанийн мэдээлэл" };

const TABS = [
  { key: "profile", label: "Ерөнхий" },
  { key: "location", label: "Хаяг, цаг" },
  { key: "contacts", label: "Холбоо барих" },
  { key: "stats", label: "Тоон үзүүлэлт" },
] as const;
type Tab = (typeof TABS)[number]["key"];

const GROUPS = [
  { type: "phone", title: "Утас", hint: "Эхнийх нь гар утасны «Залгах» товчинд ашиглагдана." },
  { type: "email", title: "И-мэйл", hint: "Эхнийх нь сайтын хаа сайгүй гарна." },
  { type: "social", title: "Сошиал холбоос", hint: "Facebook, YouTube, Instagram, LinkedIn-д тохирох icon өөрөө гарна." },
] as const;

export default async function CompanyPage({ searchParams }: PageProps<"/admin/company">) {
  await requireStaff({ admin: true });
  const requested = (await searchParams).tab;
  const tab: Tab = TABS.some((t) => t.key === requested) ? (requested as Tab) : "profile";

  return (
    <>
      <PageHeader description="Сайтын footer, «Холбоо барих», «Бидний тухай» хуудас болон нүүр хуудсанд харагдах мэдээлэл." title="Компанийн мэдээлэл" />
      <nav aria-label="Хэсгүүд" className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <Link
            aria-current={t.key === tab ? "page" : undefined}
            className="-mb-px shrink-0 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium whitespace-nowrap text-fg-muted transition-colors hover:text-fg aria-[current=page]:border-brand aria-[current=page]:text-fg"
            href={t.key === "profile" ? "/admin/company" : `/admin/company?tab=${t.key}`}
            key={t.key}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {tab === "profile" && <ProfileTab />}
      {tab === "location" && <LocationTab />}
      {tab === "contacts" && <ContactsTab />}
      {tab === "stats" && <StatsTab />}
    </>
  );
}

async function ProfileTab() {
  const s = await db.companySettings.findFirst();
  return (
    <ProfileForm
      value={{
        name: s?.name ?? "",
        legalName: s?.legalName ?? "",
        foundedYear: s?.foundedYear?.toString() ?? "",
        shortDescription: s?.shortDescription ?? "",
        about: sanitizeHtml(s?.about),
      }}
    />
  );
}

async function LocationTab() {
  const s = await db.companySettings.findFirst();
  return (
    <LocationForm
      value={{
        address: s?.address ?? "",
        locationName: s?.locationName ?? "",
        latitude: s?.latitude?.toString() ?? "",
        longitude: s?.longitude?.toString() ?? "",
        mapUrl: s?.mapUrl ?? "",
        workingHours: s?.workingHours ?? "",
      }}
    />
  );
}

async function ContactsTab() {
  const contacts = await db.companyContact.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm text-fg-muted">Дарааллын бага тоотой нь эхэнд харагдана.</p>
      {GROUPS.map((g) => (
        <ContactList
          hint={g.hint}
          items={contacts
            .filter((c) => c.type === g.type)
            .map((c) => ({ id: c.id, type: c.type, label: c.label ?? "", value: c.value, sortOrder: c.sortOrder, showInFooter: c.showInFooter }))}
          key={g.type}
          title={g.title}
          type={g.type}
        />
      ))}
    </div>
  );
}

async function StatsTab() {
  const [stats, tokens] = await Promise.all([db.companyStat.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }), getStatTokens()]);
  const templates = autoStatTemplates(tokens);
  const publicStats = stats.filter((s) => s.isPublic).map((s) => ({ id: s.id, value: s.value, label: s.label, note: s.note }));
  // Same placeholder value = already added, even if the wording was edited afterwards.
  const added = (value: string) => stats.some((s) => s.value === value);
  const autoToAdd = fillStats(templates, tokens).filter((_, i) => !added(templates[i].value));

  return (
    <div className="max-w-3xl space-y-6">
      <section className="rounded-3xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-fg">Нүүр хуудсанд ингэж харагдана</h2>
          <span className="text-xs text-fg-subtle">{publicStats.length ? `Таны оруулсан ${publicStats.length} үзүүлэлт` : "Автомат тоонууд (та оруулаагүй тул)"}</span>
        </div>
        <StatCards className="mt-4" stats={fillStats(publicStats.length ? publicStats : templates, tokens)} />
        {publicStats.length > 4 && <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">4-өөс олон үзүүлэлт хоёр мөрөнд хуваагдана. 4 хүртэл байлгахыг зөвлөж байна.</p>}
      </section>

      <StatList
        items={stats.map((s) => {
          const [shown] = fillStats([{ id: s.id, value: s.value, label: s.label, note: s.note }], tokens);
          return { id: s.id, value: s.value, label: s.label, note: s.note ?? "", isPublic: s.isPublic, sortOrder: s.sortOrder, shown: { value: shown.value, note: shown.note } };
        })}
      />

      {autoToAdd.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-fg">Автомат тоо нэмэх</h3>
          <p className="mt-0.5 text-xs text-fg-subtle">Системийн мэдээллээс тооцогдох тул он солигдох, бүтээгдэхүүн нэмэгдэхэд өөрөө шинэчлэгдэнэ.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {autoToAdd.map((t) => (
              <li className="flex items-center gap-2 rounded-full border border-line bg-card py-1 pr-1 pl-3.5 text-sm" key={t.id}>
                <span className="font-bold text-brand">{t.value}</span>
                <span className="text-fg">{t.label}</span>
                <ConfirmButton action={addAutoStat.bind(null, t.id)} size="sm" variant="ghost">
                  + Нэмэх
                </ConfirmButton>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs leading-relaxed text-fg-subtle">
        Зөвхөн баталж чадах тоо оруулна уу. Тайлбар мөрөнд тоо хэзээний, юунд үндэслэсэн болохыг бичвэл зочинд илүү итгэл төрүүлнэ. Нэг ч үзүүлэлт
        харуулахаар байвал автомат тоонууд нуугдана.
      </p>
    </div>
  );
}
