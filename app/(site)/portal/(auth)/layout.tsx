import type { Metadata } from "next";

// Sign-in, sign-up and password pages: useful to visitors, not to search results.
export const metadata: Metadata = { robots: { index: false } };

export default function AuthLayout({ children }: LayoutProps<"/portal">) {
  return (
    <main className="relative overflow-hidden" id="main">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,black_20%,transparent_65%)]" />
      <div className="relative mx-auto w-full max-w-md px-4 py-14 sm:py-20 has-[[data-wide]]:max-w-2xl">{children}</div>
    </main>
  );
}
