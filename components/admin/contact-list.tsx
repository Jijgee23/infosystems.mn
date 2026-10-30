"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { fmtDateTime } from "@/components/admin/ui";
import { Badge, buttonClass } from "@/components/ui/form";
import { loadContacts, markContactSeen } from "@/lib/actions/admin";
import type { ContactRequest } from "@/lib/generated/prisma/client";

const KIND = { demo: "Демо", quote: "Үнийн санал", feedback: "Санал хүсэлт", notify: "Мэдэгдэл авах" } as const;

/** Contact requests list that fetches the next page when the sentinel scrolls into view. */
export function ContactList({ filter, initial, initialHasMore }: { filter: string; initial: ContactRequest[]; initialHasMore: boolean }) {
  const [rows, setRows] = useState(initial);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  async function loadMore() {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError(false);
    try {
      const page = await loadContacts(filter, rows.at(-1)?.id);
      setRows((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        return [...prev, ...page.rows.filter((r) => !seen.has(r.id))];
      });
      setHasMore(page.hasMore);
    } catch {
      setError(true);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || error) return;
    const io = new IntersectionObserver((entries) => entries[0]?.isIntersecting && loadMore(), { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  });

  if (rows.length === 0) {
    return <p className="rounded-3xl border border-dashed border-line bg-card p-8 text-center text-fg-muted">Хүсэлт алга.</p>;
  }

  return (
    <>
      <ul className="space-y-3">
        {rows.map((r) => (
          <ContactItem key={r.id} row={r} />
        ))}
      </ul>
      <div className="py-6 text-center text-sm text-fg-subtle" ref={sentinel}>
        {error ? (
          <button className={buttonClass("secondary", "sm")} onClick={loadMore} type="button">
            Ачаалж чадсангүй — дахин оролдох
          </button>
        ) : loading ? (
          "Ачаалж байна…"
        ) : (
          !hasMore && rows.length > 20 && "Бүх хүсэлтийг харууллаа."
        )}
      </div>
    </>
  );
}

function ContactItem({ row: r }: { row: ContactRequest }) {
  // Local state so rows appended by scrolling also reflect the toggle.
  const [seen, setSeen] = useState(r.seen);
  const [pending, start] = useTransition();
  return (
    <li className={`rounded-3xl border bg-card p-5 ${seen ? "border-line" : "border-brand/40"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-fg">{r.name || r.email || "—"}</span>
            {r.company && <span className="text-sm text-fg-muted">· {r.company}</span>}
            <Badge tone="brand">{KIND[r.kind]}</Badge>
            {r.product && <Badge>{r.product}</Badge>}
            {!seen && <Badge tone="warn">Шинэ</Badge>}
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            {r.phone && (
              <a className="mr-3 font-medium text-brand" href={`tel:${r.phone}`}>
                {r.phone}
              </a>
            )}
            {r.email && (
              <a className="font-medium text-brand" href={`mailto:${r.email}`}>
                {r.email}
              </a>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-fg-subtle">{fmtDateTime(r.createdAt)}</span>
          <button
            className={buttonClass("ghost", "sm")}
            disabled={pending}
            onClick={() =>
              start(async () => {
                await markContactSeen(r.id, !seen);
                setSeen(!seen);
              })
            }
            type="button"
          >
            {seen ? "Шинэ болгох" : "Харсан"}
          </button>
        </div>
      </div>
      {r.message && <p className="mt-3 text-sm whitespace-pre-line text-fg">{r.message}</p>}
    </li>
  );
}
