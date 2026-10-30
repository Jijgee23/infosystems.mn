/** Boundary for navigations between admin pages (the panel layout stays mounted). */
export default function AdminLoading() {
  return (
    <div aria-busy="true" className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-card" />
      <div className="h-64 animate-pulse rounded-3xl bg-card" />
    </div>
  );
}
