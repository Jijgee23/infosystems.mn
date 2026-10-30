import { formatPhone, getCompany, telHref } from "@/lib/data/company";
import { Mail, Phone } from "./icons";

/** Phone and email tiles of the dark "book a demo" band, from admin (Компанийн мэдээлэл). */
export async function CtaContacts() {
  const company = await getCompany();
  const email = company.emails[0];
  return (
    <div className="relative grid gap-3 lg:col-span-5">
      {company.phones.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="flex items-center gap-2 text-sm text-white/60">
            <Phone className="h-4 w-4" /> Утсаар
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {company.phones.map((p) => (
              <a className="font-display text-lg font-bold text-white hover:text-accent" href={telHref(p.value)} key={p.id}>
                {formatPhone(p.value)}
              </a>
            ))}
          </p>
        </div>
      )}
      {email && (
        <a className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10" href={`mailto:${email.value}`}>
          <p className="flex items-center gap-2 text-sm text-white/60">
            <Mail className="h-4 w-4" /> И-мэйлээр
          </p>
          <p className="mt-2 font-display text-lg font-bold text-white">{email.value}</p>
        </a>
      )}
    </div>
  );
}
