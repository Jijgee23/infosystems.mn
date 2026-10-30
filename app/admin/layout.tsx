import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Админ | InfoSystems", template: "%s · Админ" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  // `admin-ui` switches shared form controls to the denser admin sizes (globals.css).
  return <div className="admin-ui min-h-dvh bg-surface">{children}</div>;
}
