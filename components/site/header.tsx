"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import type { NavProduct } from "@/lib/data/products";
import { MAIN_NAV } from "@/lib/site";
import { ArrowRight, ChevronDown, Logo, Menu, X } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const PRIMARY_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-200 bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong dark:text-ink";

// Tighter between lg and xl, where the whole menu has to fit beside the logo and buttons.
const NAV_LINK =
  "relative z-10 inline-flex h-10 items-center rounded-full px-2.5 text-sm xl:px-3.5 xl:text-[15px] font-medium whitespace-nowrap text-fg-muted transition-colors hover:text-fg aria-[current=page]:text-fg";

/** One easing for every part of the header's motion: quick start, long soft landing. */
const EASE = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Reads the URL, so it renders inside its own Suspense boundary (dynamic routes stay prerenderable). */
function ActiveNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  return (
    <Link aria-current={pathname === href ? "page" : undefined} className={NAV_LINK} href={href}>
      {label}
    </Link>
  );
}

/** Site header. `products` comes from the DB (getProductNav) via the site layout. */
export function Header({ products }: { products: NavProduct[] }) {
  const main = products.filter((p) => p.group === "main");
  const featured = products.filter((p) => p.group === "featured");
  const other = products.filter((p) => p.group === "other");
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);
  // Hover highlight that glides between the desktop menu items.
  const [hover, setHover] = useState<{ left: number; width: number } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Close menus when any link inside the header is followed.
  const closeOnLink = (e: MouseEvent) => {
    if ((e.target as Element).closest("a")) {
      setMegaOpen(false);
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const openMega = (open: boolean) => {
    clearTimeout(closeTimer.current);
    if (open) setMegaOpen(true);
    else closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };
  // Floating pill once the page moves (or while the phone menu is open).
  const pill = scrolled || mobileOpen;
  const hoverAt = (e: MouseEvent<HTMLElement>) => setHover({ left: e.currentTarget.offsetLeft, width: e.currentTarget.offsetWidth });

  return (
    <>
      {/* Fixed height, so the page below never moves while the bar changes shape. The gap above
          the floating bar is padding here: a margin on the bar would collapse through the header. */}
      <header
        className={cn("sticky top-0 z-50 h-16 transition-[padding] lg:h-[72px]", EASE, pill ? "px-2.5 pt-1.5 sm:px-4 lg:pt-2.5" : "px-0 pt-0")}
        onClick={closeOnLink}
      >
        <div
          className={cn(
            "relative mx-auto flex items-center justify-between gap-4 border lg:gap-3 xl:gap-4 transition-[max-width,height,padding,border-radius,background-color,border-color,box-shadow]",
            EASE,
            pill
              ? "h-[52px] max-w-[76rem] rounded-[28px] border-line bg-card/85 pr-1.5 pl-4 backdrop-blur-xl backdrop-saturate-150 shadow-[0_18px_50px_-12px_rgb(11_27_43/0.28),0_3px_10px_-2px_rgb(11_27_43/0.08)] dark:border-white/12 dark:bg-card/90 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_18px_50px_-10px_rgb(0_0_0/0.7),0_0_0_1px_rgb(59_155_235/0.10)] sm:pl-5 lg:h-14 lg:pr-2"
              : "h-16 max-w-7xl rounded-none border-transparent bg-transparent px-4 shadow-none sm:px-6 lg:h-[72px] xl:px-8",
          )}
        >
          <Link aria-label="InfoSystems Mongolia — Нүүр" className={cn("shrink-0 origin-left rounded-lg transition-transform", EASE, pill && "scale-[0.92]")} href="/">
            <Logo />
          </Link>
          <nav aria-label="Үндсэн цэс" className="hidden lg:block">
            <ul className="relative flex items-center gap-1" onMouseLeave={() => setHover(null)}>
              <span
                aria-hidden="true"
                className={cn("pointer-events-none absolute inset-y-0 rounded-full bg-surface transition-[left,width,opacity]", EASE, hover ? "opacity-100" : "opacity-0")}
                style={hover ?? undefined}
              />
              <li
                onMouseEnter={(e) => {
                  openMega(true);
                  hoverAt(e);
                }}
                onMouseLeave={() => openMega(false)}
              >
                <button
                  aria-controls="mega-products"
                  aria-expanded={megaOpen}
                  className={cn(
                    "relative z-10 inline-flex h-10 items-center gap-1 rounded-full px-2.5 text-sm xl:px-3.5 xl:text-[15px] font-medium whitespace-nowrap transition-colors hover:text-fg",
                    // While the pointer is over the open panel the glide highlight is gone; keep the tab marked.
                    megaOpen ? cn("text-fg", !hover && "bg-surface") : "text-fg-muted",
                  )}
                  onClick={() => setMegaOpen((o) => !o)}
                  type="button"
                >
                  Бүтээгдэхүүн
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", megaOpen && "rotate-180")} />
                </button>
              </li>
              {MAIN_NAV.map((item) => (
                <li key={item.href} onMouseEnter={hoverAt}>
                  <Suspense
                    fallback={
                      <Link className={NAV_LINK} href={item.href}>
                        {item.label}
                      </Link>
                    }
                  >
                    <ActiveNavLink href={item.href} label={item.label} />
                  </Suspense>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg md:inline-flex" href="/portal">
              Нэвтрэх
            </Link>
            <span className="hidden sm:block">
              <Link className={cn(PRIMARY_BTN, "h-10 px-4 text-sm")} href="/contact">
                {/* Short label where the full menu leaves little room (lg up to xl). */}
                <span className="lg:hidden xl:inline">Демо захиалах</span>
                <span className="hidden lg:inline xl:hidden">Демо</span>
              </Link>
            </span>
            <button
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Хаах" : "Цэс"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg hover:bg-surface lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              type="button"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {/* Reading progress, along the bottom of the pill. */}
          <span
            aria-hidden="true"
            className={cn("scroll-progress pointer-events-none absolute right-6 bottom-0 left-6 h-0.5 rounded-full bg-brand transition-opacity", EASE, pill ? "opacity-70" : "opacity-0")}
          />
        </div>

        <div
          className={cn(
            // The padding is part of the hover area, so moving down from the menu keeps it open.
            "absolute inset-x-0 top-full hidden origin-top px-4 pt-2 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block",
            megaOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-[0.98] opacity-0",
          )}
          id="mega-products"
          onMouseEnter={() => openMega(true)}
          onMouseLeave={() => openMega(false)}
        >
          <div className="mx-auto grid max-w-[76rem] grid-cols-12 gap-8 rounded-3xl border border-line bg-bg/95 px-8 py-8 shadow-2xl shadow-ink/10 backdrop-blur-xl">
            {main.map((p) => (
              <div className="col-span-5 rounded-3xl border border-line bg-surface p-6" key={p.slug}>
                <Link className="group block" href={`/products/${p.slug}`}>
                  <p className="font-display text-lg font-bold text-fg group-hover:text-brand">{p.name}</p>
                  {p.tagline && <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{p.tagline}</p>}
                </Link>
                {p.modules.length > 0 && (
                  <>
                    <p className="mt-5 mb-2 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Модулиуд</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {p.modules.map((m) => (
                        <li key={m.slug}>
                          <Link className="block rounded-lg px-2 py-1.5 -mx-2 text-sm text-fg-muted transition-colors hover:bg-card hover:text-fg" href={`/products/${p.slug}/${m.slug}`}>
                            {m.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
            <div className="col-span-3 flex flex-col gap-2">
              {featured.map((p) => (
                <Link className="group rounded-2xl p-4 transition-colors hover:bg-surface" href={`/products/${p.slug}`} key={p.slug}>
                  <p className="flex items-center gap-2 font-display font-bold text-fg group-hover:text-brand">
                    {p.name}
                    {p.status === "coming_soon" && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">Тун удахгүй</span>}
                  </p>
                  {p.tagline && <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{p.tagline}</p>}
                </Link>
              ))}
            </div>
            <div className="col-span-4">
              <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-fg-subtle uppercase">Бусад систем</p>
              <ul>
                {other.map((p) => (
                  <li key={p.slug}>
                    <Link className="flex items-baseline justify-between gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-surface" href={`/products/${p.slug}`}>
                      <span className="text-sm font-semibold text-fg">{p.name}</span>
                      <span className="truncate text-xs text-fg-subtle">{p.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="mt-3 inline-flex items-center gap-1.5 px-3 text-sm font-semibold text-brand hover:gap-2.5 transition-all" href="/products">
                Бүх бүтээгдэхүүн <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter (once scrolled) would become the containing block
          of this fixed panel and collapse it to the header's height. */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto overscroll-contain bg-bg transition-all duration-300 lg:hidden",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        id="mobile-menu"
        onClick={closeOnLink}
      >
        <nav aria-label="Гар утасны цэс" className="flex min-h-full flex-col px-4 pt-4 pb-8">
          <ul className="divide-y divide-line">
            <li>
              <button
                aria-expanded={mobileProducts}
                className="flex w-full items-center justify-between py-4 font-display text-lg font-semibold text-fg"
                onClick={() => setMobileProducts((o) => !o)}
                type="button"
              >
                Бүтээгдэхүүн
                <ChevronDown className={cn("h-5 w-5 transition-transform", mobileProducts && "rotate-180")} />
              </button>
              <ul className={cn("grid gap-1 pb-4", !mobileProducts && "hidden")}>
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link className="block rounded-xl px-3 py-2 text-fg-muted hover:bg-surface hover:text-fg" href={`/products/${p.slug}`}>
                      {p.name}
                    </Link>
                    {p.modules.length > 0 && (
                      <ul className="mb-1 ml-3 grid grid-cols-2 gap-x-2 border-l border-line pl-3">
                        {p.modules.map((m) => (
                          <li key={m.slug}>
                            <Link className="block rounded-lg px-2 py-1.5 text-sm text-fg-subtle hover:bg-surface hover:text-fg" href={`/products/${p.slug}/${m.slug}`}>
                              {m.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link className="block py-4 font-display text-lg font-semibold text-fg" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="block py-4 font-display text-lg font-semibold text-fg" href="/portal">
                Харилцагчийн булан
              </Link>
            </li>
          </ul>
          <Link className={cn(PRIMARY_BTN, "h-12 px-6 text-base mt-6 w-full")} href="/contact">
            Демо захиалах
          </Link>
        </nav>
      </div>
    </>
  );
}
