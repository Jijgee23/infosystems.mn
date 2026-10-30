"use client";

import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const OUT = 600; // output size (square, px)
const ACCEPT = ["image/png", "image/jpeg", "image/webp"];
const MAX_SOURCE = 15 * 1024 * 1024;

type Crop = { zoom: number; x: number; y: number }; // x/y: image offset in frame px

/**
 * Square profile-photo picker for forms.
 * - click or drag & drop a file
 * - drag the image to position it, slider to zoom
 * - the cropped result is encoded in the browser (600×600 WebP) and placed into a
 *   hidden <input type="file" name={name}>, so the form submits only the small file
 * - "Устгах" sets `removeName` when there was an existing photo
 */
export function PhotoInput({ name, removeName, currentUrl, error }: { name: string; removeName: string; currentUrl: string | null; error?: string }) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({ zoom: 1, x: 0, y: 0 });
  const [removed, setRemoved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number | null>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const [frameSize, setFrameSize] = useState(160);

  // After a successful save the server sends the new photo URL: drop the local crop.
  const [lastUrl, setLastUrl] = useState(currentUrl);
  if (lastUrl !== currentUrl) {
    setLastUrl(currentUrl);
    setImg(null);
    setRemoved(false);
    setOutSize(null);
  }

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFrameSize(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [img]);

  // Scale at zoom 1 = image covers the frame.
  const baseScale = img ? Math.max(frameSize / img.naturalWidth, frameSize / img.naturalHeight) : 1;
  const scale = baseScale * crop.zoom;
  const clamp = useCallback(
    (c: Crop): Crop => {
      if (!img) return c;
      const s = baseScale * c.zoom;
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      return { zoom: c.zoom, x: Math.min(0, Math.max(frameSize - w, c.x)), y: Math.min(0, Math.max(frameSize - h, c.y)) };
    },
    [img, baseScale, frameSize],
  );

  const load = (file: File | undefined) => {
    setProblem(null);
    if (!file) return;
    if (!ACCEPT.includes(file.type)) return setProblem("PNG, JPG эсвэл WebP зураг сонгоно уу.");
    if (file.size > MAX_SOURCE) return setProblem("Зураг 15MB-аас бага байх ёстой.");
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth < 200 || image.naturalHeight < 200) {
        URL.revokeObjectURL(url);
        return setProblem("Зураг хэт жижиг байна (200×200-аас дээш).");
      }
      setImg(image);
      setRemoved(false);
      const s = Math.max(frameSize / image.naturalWidth, frameSize / image.naturalHeight);
      setCrop({ zoom: 1, x: (frameSize - image.naturalWidth * s) / 2, y: (frameSize - image.naturalHeight * s) / 2 });
    };
    image.onerror = () => setProblem("Зургийг уншиж чадсангүй.");
    image.src = url;
  };

  // Re-encode the crop into the hidden file input whenever it changes (debounced).
  useEffect(() => {
    if (!img) return;
    const t = setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = OUT;
      canvas.height = OUT;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      const k = OUT / frameSize;
      ctx.drawImage(img, crop.x * k, crop.y * k, img.naturalWidth * scale * k, img.naturalHeight * scale * k);
      canvas.toBlob(
        (blob) => {
          if (!blob || !fileInput.current) return;
          const type = blob.type || "image/jpeg";
          const file = new File([blob], `photo.${type === "image/webp" ? "webp" : "jpg"}`, { type });
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInput.current.files = dt.files;
          setOutSize(blob.size);
        },
        "image/webp",
        0.86,
      );
    }, 150);
    return () => clearTimeout(t);
  }, [img, crop, scale, frameSize]);

  const clear = () => {
    setImg(null);
    setOutSize(null);
    setProblem(null);
    if (fileInput.current) fileInput.current.value = "";
    if (picker.current) picker.current.value = "";
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!img) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x: crop.x, y: crop.y };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    setCrop((c) => clamp({ ...c, x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py }));
  };
  const setZoom = (zoom: number) =>
    setCrop((c) => {
      // Zoom around the frame centre.
      const cx = frameSize / 2;
      const ratio = zoom / c.zoom;
      return clamp({ zoom, x: cx - (cx - c.x) * ratio, y: cx - (cx - c.y) * ratio });
    });

  const showExisting = !img && currentUrl && !removed;

  return (
    <div>
      {/* What the form actually submits */}
      <input className="hidden" name={name} ref={fileInput} type="file" />
      {removed && <input name={removeName} type="hidden" value="on" />}

      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl border-2 ${dragOver ? "border-brand bg-brand-soft" : error || problem ? "border-red-500" : "border-dashed border-line"} bg-surface select-none`}
        onDragLeave={() => setDragOver(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          load(e.dataTransfer.files[0]);
        }}
        ref={frame}
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="absolute max-w-none cursor-grab touch-none active:cursor-grabbing"
            draggable={false}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => (drag.current = null)}
            src={img.src}
            style={{ left: crop.x, top: crop.y, width: img.naturalWidth * scale, height: img.naturalHeight * scale }}
          />
        ) : showExisting ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="h-full w-full object-cover" src={currentUrl} />
        ) : (
          <button className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-xs text-fg-subtle hover:text-brand" onClick={() => picker.current?.click()} type="button">
            <svg aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect height="18" rx="2" width="18" x="3" y="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
            </svg>
            Зураг чирж оруулах эсвэл дарж сонгох
          </button>
        )}
        {img && <span className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-white">Чирж байрлуулна</span>}
      </div>

      <input accept={ACCEPT.join(",")} className="sr-only" id={id} onChange={(e) => load(e.target.files?.[0])} ref={picker} type="file" />

      {img && (
        <input aria-label="Томруулах" className="mt-2 w-full accent-[var(--brand)]" max={3} min={1} onChange={(e) => setZoom(Number(e.target.value))} step={0.01} type="range" value={crop.zoom} />
      )}

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
        <label className="cursor-pointer font-semibold text-brand hover:underline" htmlFor={id}>
          {img || showExisting ? "Солих" : "Сонгох"}
        </label>
        {img && (
          <button className="font-semibold text-fg-muted hover:text-fg" onClick={clear} type="button">
            Болих
          </button>
        )}
        {showExisting && (
          <button className="font-semibold text-red-600 hover:underline dark:text-red-400" onClick={() => setRemoved(true)} type="button">
            Устгах
          </button>
        )}
        {removed && !img && (
          <button className="font-semibold text-fg-muted hover:text-fg" onClick={() => setRemoved(false)} type="button">
            Буцаах
          </button>
        )}
      </div>
      {outSize !== null && <p className="mt-1 text-center text-[11px] text-fg-subtle">600×600 · {Math.max(1, Math.round(outSize / 1024))} KB</p>}
      {(problem || error) && <p className="mt-1 text-center text-xs text-red-600 dark:text-red-400">{problem ?? error}</p>}
    </div>
  );
}
