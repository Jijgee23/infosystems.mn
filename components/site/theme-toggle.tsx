"use client";

import { Moon, Sun } from "./icons";

/** Light / dark switch. Light is the default; the choice is remembered per browser. */
export function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };
  return (
    <button
      aria-label="Өнгөний горим солих"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface hover:text-fg"
      onClick={toggle}
      title="Өнгөний горим солих"
      type="button"
    >
      <Sun className="hidden h-[18px] w-[18px] dark:block" />
      <Moon className="h-[18px] w-[18px] dark:hidden" />
    </button>
  );
}
