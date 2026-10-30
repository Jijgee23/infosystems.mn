import { ContactList } from "@/components/admin/contact-list";
import { FilterTabs, PageHeader } from "@/components/admin/ui";
import { loadContacts } from "@/lib/actions/admin";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Хүсэлтүүд" };

export default async function AdminContacts({ searchParams }: PageProps<"/admin/contacts">) {
  await requireStaff();
  const raw = (await searchParams).filter;
  const filter = typeof raw === "string" ? raw : "";
  const { rows, hasMore } = await loadContacts(filter);
  return (
    <>
      <PageHeader description="Вэб сайтын маягтаар ирсэн хүсэлтүүд" title="Хүсэлтүүд" />
      <FilterTabs base="/admin/contacts" current={filter} tabs={[{ value: "", label: "Бүгд" }, { value: "new", label: "Шинэ" }]} />
      {/* key resets the scrolled pages when the filter tab changes */}
      <ContactList filter={filter} initial={rows} initialHasMore={hasMore} key={filter} />
    </>
  );
}
