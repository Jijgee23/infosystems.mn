import type { Metadata } from "next";
import { SiteChrome } from "@/components/site/site-chrome";
import { NOT_FOUND_TITLE, NotFoundContent } from "@/components/site/status-page";

export const metadata: Metadata = { title: `${NOT_FOUND_TITLE} | InfoSystems Mongolia` };

/** URLs that match no route. Only the root layout applies here, so it adds the site header and footer itself. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
