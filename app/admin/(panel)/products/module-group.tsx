"use client";

import { type ReactNode, useState } from "react";

/**
 * A top-level product row followed by its module rows, which stay collapsed until the
 * chevron is clicked. `cells` are the product's own (server-rendered) cells.
 */
export function ModuleGroup({ cells, modules, count, name }: { cells: ReactNode; modules: ReactNode; count: number; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr className="hover:bg-surface/50">
        <td className="w-10 py-3 pl-3">
          {count > 0 && (
            <button
              aria-expanded={open}
              aria-label={`${name}: ${count} модуль ${open ? "нуух" : "харуулах"}`}
              className="grid size-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-surface hover:text-fg"
              onClick={() => setOpen((o) => !o)}
              title={`${count} модуль`}
              type="button"
            >
              <svg aria-hidden="true" className={`size-4 transition-transform ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </td>
        {cells}
      </tr>
      {open && modules}
    </>
  );
}
