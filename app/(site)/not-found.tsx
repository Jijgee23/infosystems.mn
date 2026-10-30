import type { Metadata } from "next";
import { NOT_FOUND_TITLE, NotFoundContent } from "@/components/site/status-page";

export const metadata: Metadata = { title: `${NOT_FOUND_TITLE} | InfoSystems Mongolia` };

/** notFound() from a site page (unknown product, post, ...); rendered inside the site layout. */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
