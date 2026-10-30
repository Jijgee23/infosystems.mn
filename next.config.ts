import { LEGACY_PRODUCT_PAGES } from "./lib/product-pages";
import type { NextConfig } from "next";

/**
 * Content Security Policy. Scripts allow 'unsafe-inline' because the theme script and the
 * RSC payload are inline and a nonce would make every page dynamic (no prerendering); the
 * policy still stops scripts, frames and images from any other origin. External origins:
 * YouTube thumbnails (guide video cards), old CKEditor posts linking images by absolute
 * https://infosystems.mn URLs, and the click-to-load iframes (lib/video.ts, map-embed).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://infosystems.mn https://i.ytimg.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // Dev only: let other devices on the local network (phones, other PCs) open the dev
  // server by IP, e.g. http://192.168.88.114:3000. Without this, Next blocks HMR and
  // other dev resources for that origin and the page's JavaScript doesn't fully run.
  allowedDevOrigins: ["192.168.88.*"],
  experimental: {
    agentFeedback: true,
    // Dev only: the debug channel's HMR handler writes late chunks to a writer it has
    // already closed, which shows "Cannot write to a CLOSED writable stream" in the overlay.
    reactDebugChannel: false,
    // Issue attachments: up to 5 files × 10MB, plus multipart overhead.
    serverActions: { bodySizeLimit: "52mb" },
  },
  images: {
    // Only uploads (served by app/uploads) and bundled public images, never arbitrary URLs.
    localPatterns: [
      { pathname: "/uploads/**", search: "" },
      { pathname: "/images/**", search: "" },
    ],
    qualities: [75],
    formats: ["image/avif", "image/webp"],
    // Upload names carry a random hash and are never rewritten, so resized copies can live long.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // The largest uploaded photo is ~2MB; the 50MB default only invites memory spikes.
    maximumResponseBody: 15_000_000,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // URLs from the old site (../infosystems-front pages/), so existing links and search results keep working.
    const OLD_PAGES: Record<string, string> = {
      product: "/products",
      advice: "/news?category=advice",
      "about-us": "/about",
      contact: "/contact",
      download: "/support/downloads",
      privacy_policy: "/privacy",
      macshelp: "/support/guides",
    };
    return [
      { source: "/home", destination: "/", permanent: true },
      ...Object.entries(LEGACY_PRODUCT_PAGES).map(([slug, destination]) => ({ source: `/product/${slug}`, destination, permanent: true })),
      // Same products under the new prefix.
      ...Object.entries(LEGACY_PRODUCT_PAGES)
        .map(([slug, destination]) => ({ source: `/products/${slug}`, destination, permanent: true })),
      { source: "/product/:slug", destination: "/products/:slug", permanent: true },
      ...Object.entries(OLD_PAGES).map(([slug, destination]) => ({ source: `/p/${slug}`, destination, permanent: true })),
      { source: "/p/:slug", destination: "/", permanent: false },
      { source: "/posts/:slug", destination: "/news/:slug", permanent: true },
      { source: "/post/:slug", destination: "/news/:slug", permanent: true },
      // Old customer area (feedback / issues).
      { source: "/feedback/:path*", destination: "/portal", permanent: true },
      // Old project-issue pages: /cf?pname=… was a public form (unused since 2022; the
      // POST /api/coreissues API still works), /cf and /cf/:id were the staff view.
      { source: "/cf", has: [{ type: "query", key: "pname" }], destination: "/contact", permanent: false },
      { source: "/cf", destination: "/admin/core-issues", permanent: true },
      { source: "/cf/:id", destination: "/admin/core-issues", permanent: true },
      { source: "/login", destination: "/portal/login", permanent: true },
      { source: "/register", destination: "/portal/register", permanent: true },
      // Old admin pages that have a new counterpart.
      { source: "/admin/insert-notif", destination: "/admin/notifications", permanent: true },
      { source: "/admin/care", destination: "/admin/issues", permanent: true },
    ];
  },
  async headers() {
    const production = process.env.NODE_ENV === "production";
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
          // Production only: dev needs eval and the HMR websocket, and isn't served over HTTPS.
          ...(production
            ? [
                { key: "Content-Security-Policy", value: CSP },
                { key: "Strict-Transport-Security", value: "max-age=31536000" },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
