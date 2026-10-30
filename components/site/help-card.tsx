import Link from "next/link";
import { buttonClass } from "@/components/ui/form";
import { formatPhone, getCompany, telHref } from "@/lib/data/company";
import { ArrowRight, Mail, Phone } from "./icons";

/**
 * "Need help?" card with the company's phones and email from admin (Компанийн мэдээлэл),
 * so a number changed there shows up on every page that has the card.
 */
export async function HelpCard({
  title = "Асуудал шийдэгдсэнгүй юу?",
  text = "Манай инженер алсаас холбогдож тусална.",
  action = { href: "/support/downloads", label: "Програм татах" },
  phones = 2,
}: {
  title?: string;
  text?: string;
  action?: { href: string; label: string } | null;
  /** How many phone numbers to list (in admin order). */
  phones?: number;
}) {
  const company = await getCompany();
  const email = company.emails[0];
  return (
    <div className="rounded-3xl border border-line bg-surface p-6">
      <p className="font-display text-lg font-bold text-fg">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{text}</p>
      {action && (
        <Link className={`${buttonClass("primary", "sm")} mt-5 h-10 w-full px-4`} href={action.href}>
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
      <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
        {company.phones.slice(0, phones).map((p) => (
          <a className="flex items-center gap-2 font-medium text-fg hover:text-brand" href={telHref(p.value)} key={p.id}>
            <Phone className="h-4 w-4 text-brand" /> {formatPhone(p.value)}
          </a>
        ))}
        {email && (
          <a className="flex items-center gap-2 font-medium text-fg hover:text-brand" href={`mailto:${email.value}`}>
            <Mail className="h-4 w-4 text-brand" /> {email.value}
          </a>
        )}
      </div>
    </div>
  );
}
