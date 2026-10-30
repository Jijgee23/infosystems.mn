"use client";

import { useEffect } from "react";
import { buttonClass, Card } from "@/components/ui/form";

/** Errors in admin pages; the sidebar stays in place. */
export default function AdminError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <Card className="mx-auto mt-10 max-w-lg p-6 text-center">
      <h1 className="font-display text-xl font-bold text-fg">Алдаа гарлаа</h1>
      <p className="mt-2 text-sm text-fg-muted">Хуудсыг ачаалж чадсангүй. Дахин оролдоно уу. Асуудал давтагдвал доорх кодыг хөгжүүлэгчид илгээнэ үү.</p>
      {error.digest && <p className="mt-3 font-mono text-xs text-fg-subtle">Код: {error.digest}</p>}
      <button className={`${buttonClass()} mt-5`} onClick={() => retry()} type="button">
        Дахин оролдох
      </button>
    </Card>
  );
}
