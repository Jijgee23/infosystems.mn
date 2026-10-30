/**
 * Embed URL for a product intro video: YouTube (watch, youtu.be, shorts, embed) or Vimeo
 * links. Anything else is rejected so admins can't embed arbitrary pages.
 */
export function videoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www\.|m\.)/, "");
  const yt = (id: string | null | undefined) => (id && /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null);
  if (host === "youtu.be") return yt(u.pathname.slice(1));
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") return yt(u.searchParams.get("v"));
    const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/);
    return yt(m?.[1]);
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = u.pathname.match(/(\d{6,})/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  return null;
}
