"use client";

import { useEffect, useId, useRef, useState } from "react";

const ACCEPT = ["image/png", "image/jpeg", "image/webp"];
const MAX_SOURCE = 20 * 1024 * 1024;

/**
 * Image picker that keeps the original aspect ratio (certificates, awards, logos).
 * Click or drag & drop; the image is scaled down in the browser to at most `maxSide` px
 * on the long side, encoded as WebP (transparency kept) and placed into a hidden
 * <input type="file" name={name}>. `aspect` only shapes the preview box.
 * Hidden `${name}Width` / `${name}Height` inputs carry the final pixel size.
 */
export function ImageUpload({
  name,
  currentUrl,
  required,
  error,
  aspect = "aspect-[3/4]",
  maxSide = 1600,
  cover,
}: {
  name: string;
  currentUrl: string | null;
  required?: boolean;
  error?: string;
  /** Tailwind aspect class of the preview box. */
  aspect?: string;
  maxSide?: number;
  /** Fill the preview box (backgrounds) instead of fitting the whole image. */
  cover?: boolean;
}) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [size, setSize] = useState<{ w: number; h: number; bytes: number } | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // After a successful save the server sends the stored image URL: drop the local preview.
  const [lastUrl, setLastUrl] = useState(currentUrl);
  if (lastUrl !== currentUrl) {
    setLastUrl(currentUrl);
    setPreview(null);
    setSize(null);
  }
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const load = async (file: File | undefined) => {
    setProblem(null);
    if (!file) return;
    if (!ACCEPT.includes(file.type)) return setProblem("PNG, JPG эсвэл WebP зураг сонгоно уу.");
    if (file.size > MAX_SOURCE) return setProblem("Зураг 20MB-аас бага байх ёстой.");
    setBusy(true);
    try {
      const bitmap = await createImageBitmap(file);
      const k = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const w = Math.round(bitmap.width * k);
      const h = Math.round(bitmap.height * k);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.88));
      if (!blob || !fileInput.current) throw new Error("encode failed");
      const out = new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "image"}.webp`, { type: blob.type || "image/webp" });
      const dt = new DataTransfer();
      dt.items.add(out);
      fileInput.current.files = dt.files;
      setPreview(URL.createObjectURL(out));
      setSize({ w, h, bytes: out.size });
    } catch {
      setProblem("Зургийг уншиж чадсангүй.");
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setPreview(null);
    setSize(null);
    if (fileInput.current) fileInput.current.value = "";
    if (picker.current) picker.current.value = "";
  };

  const shown = preview ?? currentUrl;
  return (
    <div>
      <input className="hidden" name={name} ref={fileInput} type="file" />
      {size && (
        <>
          <input name={`${name}Width`} type="hidden" value={size.w} />
          <input name={`${name}Height`} type="hidden" value={size.h} />
        </>
      )}
      <div
        className={`relative flex ${aspect} w-full items-center justify-center overflow-hidden rounded-2xl border-2 bg-surface ${dragOver ? "border-brand bg-brand-soft" : error || problem ? "border-red-500" : "border-dashed border-line"}`}
        onDragLeave={() => setDragOver(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void load(e.dataTransfer.files[0]);
        }}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className={cover ? "h-full w-full object-cover" : "h-full w-full object-contain p-1"} src={shown} />
        ) : (
          <button className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-xs text-fg-subtle hover:text-brand" onClick={() => picker.current?.click()} type="button">
            <svg aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect height="18" rx="2" width="18" x="3" y="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
            </svg>
            Зураг чирж оруулах эсвэл дарж сонгох{required && " *"}
          </button>
        )}
        {busy && <span className="absolute inset-0 flex items-center justify-center bg-bg/70 text-xs font-semibold text-fg">Боловсруулж байна…</span>}
      </div>
      <input accept={ACCEPT.join(",")} className="sr-only" id={id} onChange={(e) => void load(e.target.files?.[0])} ref={picker} type="file" />
      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 text-xs">
        <label className="cursor-pointer font-semibold text-brand hover:underline" htmlFor={id}>
          {shown ? "Солих" : "Сонгох"}
        </label>
        {preview && (
          <button className="font-semibold text-fg-muted hover:text-fg" onClick={clear} type="button">
            Болих
          </button>
        )}
      </div>
      {size && <p className="mt-1 text-center text-[11px] text-fg-subtle">{`${size.w}×${size.h} · ${Math.max(1, Math.round(size.bytes / 1024))} KB`}</p>}
      {(problem || error) && <p className="mt-1 text-center text-xs text-red-600 dark:text-red-400">{problem ?? error}</p>}
    </div>
  );
}
