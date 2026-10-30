"use client";

import { useState } from "react";

/**
 * Filters the server-rendered guide list in place: hides `li` items in each
 * `section[id].scroll-mt-24` that don't match, and whole sections with no hits.
 */
export function GuideSearch() {
  const [q, setQ] = useState("");
  const [empty, setEmpty] = useState(false);

  const filter = (value: string) => {
    setQ(value);
    const needle = value.trim().toLowerCase();
    const sections = document.querySelectorAll<HTMLElement>("section[id].scroll-mt-24");
    let any = false;
    sections.forEach((sec) => {
      let shown = 0;
      sec.querySelectorAll("li").forEach((li) => {
        const hit = !needle || (li.textContent ?? "").toLowerCase().includes(needle);
        li.hidden = !hit;
        if (hit) shown++;
      });
      sec.hidden = shown === 0;
      if (shown) any = true;
    });
    setEmpty(!any && sections.length > 0);
  };

  return (
    <>
      <input
        className="h-12 w-full rounded-full border border-line bg-card pr-4 pl-11 text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none"
        onChange={(e) => filter(e.target.value)}
        placeholder="Заавар хайх…"
        type="search"
        value={q}
      />
      {empty && (
        <p className="fixed inset-x-4 bottom-24 z-30 mx-auto max-w-md rounded-3xl border border-dashed border-line bg-bg p-4 text-center text-fg-muted shadow-lg lg:static lg:mt-4 lg:shadow-none" role="status">
          Хайлтад тохирох заавар олдсонгүй.
        </p>
      )}
    </>
  );
}
