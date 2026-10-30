"use client";

import "./globals.css";

/** Same as the root layout: dark only when the visitor chose it. */
const THEME_SCRIPT = `(function(){try{document.documentElement.classList.toggle('dark',localStorage.getItem('theme')==='dark');}catch(e){}})();`;

/** Last resort when the root layout itself fails; replaces it, so it renders its own document. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <title>Алдаа гарлаа | InfoSystems Mongolia</title>
        <main className="flex min-h-dvh items-center justify-center px-4" id="main">
          <div className="max-w-md text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-brand uppercase">InfoSystems Mongolia</p>
            <h1 className="mt-4 text-3xl font-extrabold text-fg">Уучлаарай, алдаа гарлаа</h1>
            <p className="mt-4 text-fg-muted">Сайт түр ажиллахгүй байна. Хэсэг хугацааны дараа дахин оролдоно уу.</p>
            {error.digest && <p className="mt-3 font-mono text-xs text-fg-subtle">Код: {error.digest}</p>}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                className="inline-flex h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-strong dark:text-ink"
                onClick={() => retry()}
                type="button"
              >
                Дахин оролдох
              </button>
              {/* Full reload on purpose: the app shell is what failed. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-fg hover:text-brand" href="/">
                Нүүр хуудас
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
