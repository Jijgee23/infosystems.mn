"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
  type WheelEvent as RWheelEvent,
} from "react";

/**
 * Image viewer for any element with `data-zoom-src` (optional `data-zoom-alt`,
 * `data-zoom-group` to page through a set). Opens in place — no navigation — with a
 * zoom-from-thumbnail animation, wheel / double-click / pinch zoom, drag to pan,
 * previous / next, browser fullscreen, and Esc or the close button to dismiss.
 */

type Item = { src: string; alt: string; el: Element };
type Rect = { x: number; y: number; w: number; h: number };
type View = { scale: number; x: number; y: number };

const MAX_SCALE = 4;
const DURATION = 320;
const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function itemsFor(el: Element): Item[] {
  const group = el.getAttribute("data-zoom-group");
  const els = group
    ? [...document.querySelectorAll(`[data-zoom-group="${CSS.escape(group)}"]`)]
    : [el];
  return els.map((e) => ({
    src: e.getAttribute("data-zoom-src")!,
    alt: e.getAttribute("data-zoom-alt") ?? "",
    el: e,
  }));
}

/** Largest rect of the image's aspect ratio that fits the viewport (with room for the toolbar). */
function fitRect(nw: number, nh: number): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = vw - (vw < 640 ? 24 : 160);
  const maxH = vh - (vw < 640 ? 140 : 160);
  const k = Math.min(maxW / nw, maxH / nh);
  const w = nw * k;
  const h = nh * k;
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h };
}

function thumbRect(el: Element): Rect | null {
  const img = el.querySelector("img") ?? el;
  const r = img.getBoundingClientRect();
  return r.width && r.height
    ? { x: r.left, y: r.top, w: r.width, h: r.height }
    : null;
}

export function Lightbox() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [index, setIndex] = useState(0);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [phase, setPhase] = useState<"opening" | "open" | "closing">("opening");
  const [animate, setAnimate] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startDist: number;
    startScale: number;
    startX: number;
    startY: number;
    viewX: number;
    viewY: number;
    moved: boolean;
  } | null>(null);
  const lastTap = useRef(0);

  const item = items?.[index] ?? null;
  const fit = natural ? fitRect(natural.w, natural.h) : null;
  // Latest fitted rect for the (stable) zoom callbacks below.
  const fitRef = useRef(fit);
  useLayoutEffect(() => {
    fitRef.current = fit;
  });

  // ---- open from any [data-zoom-src] click -------------------------------------------
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest?.("[data-zoom-src]");
      if (!el) return;
      e.preventDefault();
      const list = itemsFor(el);
      setItems(list);
      setIndex(
        Math.max(
          0,
          list.findIndex((i) => i.el === el),
        ),
      );
      setNatural(null);
      setView({ scale: 1, x: 0, y: 0 });
      setPhase(reducedMotion() ? "open" : "opening");
      setAnimate(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Measure the image (from the already-loaded thumbnail when possible).
  useEffect(() => {
    if (!item) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () =>
      !cancelled && setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => !cancelled && setNatural({ w: 4, h: 3 });
    img.src = item.src;
    return () => {
      cancelled = true;
    };
  }, [item]);

  // FLIP: start at the thumbnail, then transition to the fitted rect.
  useLayoutEffect(() => {
    if (!fit || phase !== "opening") return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimate(true);
        setPhase("open");
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, [fit, phase]);

  const close = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    if (reducedMotion()) {
      setItems(null);
      return;
    }
    setAnimate(true);
    setView({ scale: 1, x: 0, y: 0 });
    setPhase("closing");
    setTimeout(() => setItems(null), DURATION);
  }, []);

  const go = useCallback(
    (d: number) => {
      if (!items || items.length < 2) return;
      setIndex((i) => (i + d + items.length) % items.length);
      setNatural(null);
      setView({ scale: 1, x: 0, y: 0 });
      setAnimate(false);
    },
    [items],
  );

  // ---- zoom & pan ----------------------------------------------------------------------
  const clampView = useCallback((v: View): View => {
    const fit = fitRef.current;
    if (!fit) return v;
    const scale = Math.min(MAX_SCALE, Math.max(1, v.scale));
    if (scale === 1) return { scale, x: 0, y: 0 };
    const maxX = Math.max(0, (fit.w * scale - window.innerWidth) / 2 + 40);
    const maxY = Math.max(0, (fit.h * scale - window.innerHeight) / 2 + 40);
    return {
      scale,
      x: Math.min(maxX, Math.max(-maxX, v.x)),
      y: Math.min(maxY, Math.max(-maxY, v.y)),
    };
  }, []);

  /** Zoom keeping the point (cx, cy) — in viewport px — under the cursor. */
  const zoomAt = useCallback(
    (factor: number, cx = window.innerWidth / 2, cy = window.innerHeight / 2) =>
      setView((v) => {
        const scale = Math.min(MAX_SCALE, Math.max(1, v.scale * factor));
        const k = scale / v.scale;
        const ox = cx - window.innerWidth / 2;
        const oy = cy - window.innerHeight / 2;
        return clampView({
          scale,
          x: ox - (ox - v.x) * k,
          y: oy - (oy - v.y) * k,
        });
      }),
    [clampView],
  );
  const zoomBy = useCallback(
    (f: number) => {
      setAnimate(true);
      zoomAt(f);
    },
    [zoomAt],
  );

  // Keyboard, scroll lock, focus.
  useEffect(() => {
    if (!items) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoomBy(1.5);
      else if (e.key === "-") zoomBy(1 / 1.5);
    };
    document.addEventListener("keydown", onKey);
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [items, close, go, zoomBy]);

  const onWheel = (e: RWheelEvent) => {
    setAnimate(false);
    zoomAt(Math.exp(-e.deltaY * 0.0022), e.clientX, e.clientY);
  };

  const onPointerDown = (e: RPointerEvent) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const dist =
      pts.length === 2
        ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        : 0;
    gesture.current = {
      startDist: dist,
      startScale: view.scale,
      startX: e.clientX,
      startY: e.clientY,
      viewX: view.x,
      viewY: view.y,
      moved: false,
    };
    setAnimate(false);
  };
  const onPointerMove = (e: RPointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    const pts = [...pointers.current.values()];
    if (pts.length === 2 && g.startDist) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      g.moved = true;
      setView(
        clampView({
          scale: g.startScale * (dist / g.startDist),
          x: g.viewX,
          y: g.viewY,
        }),
      );
      return;
    }
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) g.moved = true;
    if (view.scale > 1)
      setView(
        clampView({ scale: view.scale, x: g.viewX + dx, y: g.viewY + dy }),
      );
  };
  const onPointerUp = (e: RPointerEvent) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (!g || pointers.current.size > 0) return;
    gesture.current = null;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    // Swipe between images (only when not zoomed).
    if (view.scale === 1 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy))
      return go(dx < 0 ? 1 : -1);
    if (view.scale === 1 && dy > 90 && Math.abs(dy) > Math.abs(dx))
      return close();
    if (!g.moved) {
      // Double tap / double click toggles zoom.
      const now = Date.now();
      if (now - lastTap.current < 300) {
        setAnimate(true);
        if (view.scale > 1) setView({ scale: 1, x: 0, y: 0 });
        else zoomAt(2.5, e.clientX, e.clientY);
        lastTap.current = 0;
      } else lastTap.current = now;
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen?.();
  };

  if (!items || !item) return null;

  // Transform from the fitted rect to the thumbnail rect (for open/close).
  const thumb = thumbRect(item.el);
  let transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  if (fit && thumb && phase !== "open") {
    const s = thumb.w / fit.w;
    const tx = thumb.x + thumb.w / 2 - (fit.x + fit.w / 2);
    const ty = thumb.y + thumb.h / 2 - (fit.y + fit.h / 2);
    transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  }
  const visible = phase === "open";
  const many = items.length > 1;
  // The close button is the primary action: solid light circle with a dark icon.
  const CLOSE_BTN =
    "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0b1b2b] shadow-lg shadow-black/30 ring-1 ring-black/10 transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-white active:scale-95";
  const btn =
    "inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white shadow-lg shadow-black/30 ring-1 ring-white/20 backdrop-blur-md transition hover:bg-black/75 hover:ring-white/40 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40";

  return (
    <div
      aria-label={item.alt || "Зураг"}
      aria-modal="true"
      className="fixed inset-0 z-[90] touch-none select-none"
      onWheel={onWheel}
      ref={root}
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#060d16]/90 backdrop-blur-sm"
        onClick={() => view.scale === 1 && close()}
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${DURATION}ms ease`,
        }}
      />

      {/* Image */}
      {fit && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={item.alt}
          className={`absolute rounded-lg shadow-2xl shadow-black/50 will-change-transform ${view.scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
          draggable={false}
          onPointerCancel={onPointerUp}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          src={item.src}
          style={{
            left: fit.x,
            top: fit.y,
            width: fit.w,
            height: fit.h,
            transform,
            transformOrigin: "center",
            transition: animate
              ? `transform ${DURATION}ms cubic-bezier(.2,.8,.2,1)`
              : "none",
          }}
        />
      )}
      {!fit && (
        <div className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      )}

      {/* Top bar */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3 sm:p-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${DURATION}ms ease`,
          paddingTop: "max(12px, env(safe-area-inset-top))",
        }}
      >
        <p className="min-w-0 truncate rounded-full bg-black/55 px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-black/30 ring-1 ring-white/15 backdrop-blur-md">
          {many && (
            <span className="mr-2 tabular-nums text-white/60">{`${index + 1} / ${items.length}`}</span>
          )}
          {item.alt}
        </p>
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Phones zoom with a pinch, so the +/- buttons are desktop-only. */}
          <div className="hidden gap-2 sm:flex">
            <button
              aria-label="Жижигрүүлэх"
              className={btn}
              disabled={view.scale <= 1}
              onClick={() => zoomBy(1 / 1.5)}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
            <button
              aria-label="Томруулах"
              className={btn}
              disabled={view.scale >= MAX_SCALE}
              onClick={() => zoomBy(1.5)}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>
          <button
            aria-label={fullscreen ? "Бүтэн дэлгэцээс гарах" : "Бүтэн дэлгэц"}
            className={btn}
            onClick={toggleFullscreen}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {fullscreen ? (
                <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
              ) : (
                <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
              )}
            </svg>
          </button>
          <button
            aria-label="Хаах (Esc)"
            className={CLOSE_BTN}
            onClick={close}
            ref={closeBtn}
            title="Хаах (Esc)"
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Prev / next */}
      {many && (
        <div
          className="pointer-events-none absolute inset-y-0 inset-x-0 hidden items-center justify-between px-4 sm:flex"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity ${DURATION}ms ease`,
          }}
        >
          <button
            aria-label="Өмнөх"
            className={`${btn} pointer-events-auto h-12 w-12`}
            onClick={() => go(-1)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            aria-label="Дараах"
            className={`${btn} pointer-events-auto h-12 w-12`}
            onClick={() => go(1)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Hint */}
      <p
        className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-xs text-white/50"
        style={{
          opacity: visible && view.scale === 1 ? 1 : 0,
          transition: `opacity ${DURATION}ms ease`,
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        }}
      >
        <span className="hidden sm:inline">
          Mouse wheel эсвэл давхар дарж томруулна · ← → шилжинэ · Esc хаана
        </span>
        <span className="sm:hidden">
          Хоёр хуруугаар томруулна · Шудрах — шилжих
        </span>
      </p>
    </div>
  );
}
