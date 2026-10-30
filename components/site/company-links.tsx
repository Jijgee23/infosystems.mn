import type { ReactNode } from "react";
import { formatPhone, getCompany, telHref } from "@/lib/data/company";

/**
 * Phone / email links from admin (Компанийн мэдээлэл) for places in page copy, so a changed
 * number never has to be edited in page code. Each renders nothing when the value is missing.
 */

/** Every phone number (or the first `limit`), each its own link. */
export async function PhoneLinks({ className, limit }: { className?: string; limit?: number }) {
  const { phones } = await getCompany();
  return phones.slice(0, limit).map((p) => (
    <a className={className} href={telHref(p.value)} key={p.id}>
      {formatPhone(p.value)}
    </a>
  ));
}

/** The first phone number as one link, with an optional icon before it. */
export async function PrimaryPhone({ className, icon }: { className?: string; icon?: ReactNode }) {
  const phone = (await getCompany()).phones[0];
  if (!phone) return null;
  return (
    <a className={className} href={telHref(phone.value)}>
      {icon} {formatPhone(phone.value)}
    </a>
  );
}

/** The first email address as a mailto link, with an optional icon before it. */
export async function CompanyEmail({ className, icon }: { className?: string; icon?: ReactNode }) {
  const email = (await getCompany()).emails[0];
  if (!email) return null;
  return (
    <a className={className} href={`mailto:${email.value}`}>
      {icon} {email.value}
    </a>
  );
}
