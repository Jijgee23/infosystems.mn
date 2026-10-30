"use client";

import { useState } from "react";
import { MapPin } from "./icons";

/** Loads the Google Maps iframe only after a click (no third-party requests on page load). */
export function MapEmbed({ address, embedUrl }: { address: string; embedUrl: string }) {
  const [open, setOpen] = useState(false);
  if (open) {
    return <iframe className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={embedUrl} title="Газрын зураг" />;
  }
  return (
    <button className="bg-grid group absolute inset-0 flex w-full items-center justify-center gap-4 p-6 text-left" onClick={() => setOpen(true)} type="button">
      <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xl transition-transform group-hover:scale-110 dark:text-ink">
        <MapPin className="h-6 w-6" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-lg font-bold text-fg">Газрын зураг харах</span>
        {address && <span className="block max-w-md text-sm text-fg-muted">{address}</span>}
        <span className="mt-1 block text-xs text-fg-subtle">Газрын зургийг дарахад Google Maps ачаалагдана.</span>
      </span>
    </button>
  );
}
