import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://infosystems.mn"),
  title: {
    default: "Санхүү, бүртгэлийн програм хангамж — 1998 оноос | InfoSystems Mongolia",
    template: "%s",
  },
  description: "InfoSystems Mongolia — MACS ERP, MACS POS болон санхүү, бүртгэлийн програм хангамж.",
  applicationName: "InfoSystems Mongolia",
  openGraph: { siteName: "InfoSystems Mongolia", locale: "mn_MN", type: "website" },
};

export const viewport: Viewport = {
  // Light is the default whatever the OS uses; dark is an explicit choice (ThemeToggle).
  themeColor: "#ffffff",
};

/** Runs before paint so a saved dark choice applies without a flash; light is the default. */
const THEME_SCRIPT = `(function(){try{document.documentElement.classList.toggle('dark',localStorage.getItem('theme')==='dark');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${inter.variable} ${manrope.variable}`} data-scroll-behavior="smooth" lang="mn" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
