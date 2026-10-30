import type { ReactNode } from "react";
import { Footer, StickyBar } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { SiteEffects } from "@/components/site/site-effects";
import { getCompany, telHref } from "@/lib/data/company";
import { getProductNav } from "@/lib/data/products";
import { absUrl, JsonLd, SITE_URL } from "./json-ld";

/** Header, footer and sticky bar of the public site. Used by the (site) layout and the root 404. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  // Both cached ("use cache" + tags), so this doesn't make the page dynamic.
  const [products, company] = await Promise.all([getProductNav(), getCompany()]);
  return (
    <div className="min-h-dvh pb-[calc(68px+env(safe-area-inset-bottom,0px))] lg:pb-0">
      <JsonLd
        data={{
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: company.name,
          ...(company.legalName ? { legalName: company.legalName } : {}),
          url: SITE_URL,
          logo: absUrl("/icon.svg"),
          ...(company.foundedYear ? { foundingDate: String(company.foundedYear) } : {}),
          ...(company.address ? { address: { "@type": "PostalAddress", streetAddress: company.address, addressLocality: "Улаанбаатар", addressCountry: "MN" } } : {}),
          ...(company.phones[0] ? { telephone: telHref(company.phones[0].value).slice(4) } : {}),
          ...(company.emails[0] ? { email: company.emails[0].value } : {}),
          sameAs: company.socials.map((s) => s.value),
        }}
      />
      <a className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white" href="#main">
        Үндсэн агуулга руу шилжих
      </a>
      <Header products={products} />
      {children}
      <Footer />
      <StickyBar />
      <SiteEffects />
    </div>
  );
}
