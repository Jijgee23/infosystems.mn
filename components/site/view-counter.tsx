"use client";

import { useEffect } from "react";
import { recordView, type ViewKind } from "@/lib/actions/views";

/** Counts one view per page per browser session. */
export function ViewCounter({ kind, id }: { kind: ViewKind; id: string }) {
  useEffect(() => {
    const key = `viewed:${kind}:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    void recordView(kind, id);
  }, [kind, id]);
  return null;
}
