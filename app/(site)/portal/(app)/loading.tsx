/** Boundary for navigations between portal pages (the portal layout stays mounted). */
export default function PortalLoading() {
  return <div aria-busy="true" className="h-64 animate-pulse rounded-3xl bg-card" />;
}
