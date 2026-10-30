"use client";

import { useRef, useState } from "react";
import { X } from "./icons";

/**
 * «Танилцуулга бичлэг үзэх»: opens the video in a modal <dialog>. The iframe is only
 * created while the dialog is open, so the page makes no third-party requests until then.
 */
export function VideoButton({ embedUrl, title, className }: { embedUrl: string; title: string; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => dialog.current?.close();
  return (
    <>
      <button
        className={className}
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
        type="button"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
        </svg>
        Танилцуулга бичлэг үзэх
      </button>
      <dialog
        aria-label={title}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && close()}
        onClose={() => setOpen(false)}
        ref={dialog}
      >
        <div className="relative">
          <button
            aria-label="Хаах"
            className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-lg transition-transform hover:scale-105"
            onClick={close}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
            {open && <iframe allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full" src={embedUrl} title={title} />}
          </div>
        </div>
      </dialog>
    </>
  );
}
