"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StatusPage } from "@/components/site/status-page";
import { buttonClass } from "@/components/ui/form";

/** Errors in site pages (including the customer portal); the header and footer stay usable. */
export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <StatusPage
      actions={
        <>
          <button className={buttonClass()} onClick={() => retry()} type="button">
            Дахин оролдох
          </button>
          <Link className={buttonClass("secondary")} href="/">
            Нүүр хуудас
          </Link>
        </>
      }
      code="Алдаа"
      title="Уучлаарай, алдаа гарлаа"
    >
      Хуудсыг ачаалах үед түр зуурын алдаа гарлаа. Дахин оролдоно уу, асуудал давтагдвал бидэнтэй холбогдоно уу.
      {error.digest && <span className="mt-3 block font-mono text-xs text-fg-subtle">Код: {error.digest}</span>}
    </StatusPage>
  );
}
