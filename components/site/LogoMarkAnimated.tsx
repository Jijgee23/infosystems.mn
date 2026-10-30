// InfoSystems — animated logo mark (pen draw-on → fill), ~6 s, plays once.
// Pure SVG + CSS: no libraries, no video file, sharp at any size.
// Usage:  <LogoMarkAnimated className="h-24 w-24" />
//         <LogoMarkAnimated className="h-9 w-9" loop />   // loop = repeat forever

import type { CSSProperties } from "react";

type Props = { className?: string; loop?: boolean };

const TILE = "M12 0H28A12 12 0 0 1 40 12V28A12 12 0 0 1 28 40H12A12 12 0 0 1 0 28V12A12 12 0 0 1 12 0Z";
const DOT = "M13 8.9A2.7 2.7 0 1 1 13 14.3A2.7 2.7 0 1 1 13 8.9Z";
const STEM = "M13 16.6A2.5 2.5 0 0 1 15.5 19.1V27.5A2.5 2.5 0 0 1 10.5 27.5V19.1A2.5 2.5 0 0 1 13 16.6Z";
const S = "M29.6 15.6c-.9-2.2-2.9-3.5-5.3-3.5-2.9 0-4.9 1.8-4.9 4.1 0 5.4 10.6 3 10.6 8.9 0 2.6-2.2 4.6-5.4 4.6-2.6 0-4.6-1.2-5.6-3.4";

const css = `
.ism{--brand:#0B6BD3;--brand-deep:#0956AB;--iter:1;overflow:visible}
.ism .tr{fill:none;stroke:var(--brand);stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 2}
.ism .tile{stroke-width:.7;animation:ism-draw 6s cubic-bezier(.45,0,.55,1) both var(--iter)}
.ism .dot{stroke-width:.6;animation:ism-dot 6s ease-in-out both var(--iter)}
.ism .stem{stroke-width:.6;animation:ism-stem 6s ease-in-out both var(--iter)}
.ism .s{stroke-width:1.2;animation:ism-s 6s ease-in-out both var(--iter)}
.ism .fill,.ism .solid{animation:ism-fill 6s ease-in-out both var(--iter)}
.ism .sheen{animation:ism-sheen 6s ease-in-out both var(--iter)}
.ism .body{transform-origin:20px 20px;transform-box:view-box;animation:ism-body 6s ease-in-out both var(--iter)}
@keyframes ism-draw{0%{stroke-dashoffset:.9}27%{stroke-dashoffset:0;opacity:1}58%{opacity:1}70%,100%{stroke-dashoffset:0;opacity:0}}
@keyframes ism-dot{0%,28%{stroke-dashoffset:1;opacity:0}28.5%{opacity:1}33%{stroke-dashoffset:0}58%{opacity:1}70%,100%{stroke-dashoffset:0;opacity:0}}
@keyframes ism-stem{0%,34%{stroke-dashoffset:1;opacity:0}34.5%{opacity:1}41%{stroke-dashoffset:0}58%{opacity:1}70%,100%{stroke-dashoffset:0;opacity:0}}
@keyframes ism-s{0%,42%{stroke-dashoffset:1;opacity:0}42.5%{opacity:1;stroke:var(--brand);stroke-width:1.2}55%{stroke-dashoffset:0;stroke:var(--brand);stroke-width:1.2}
  69%{stroke-width:4.7}72%,100%{stroke-dashoffset:0;opacity:1;stroke:#fff;stroke-width:4.4}}
@keyframes ism-fill{0%,58%{opacity:0}71%,100%{opacity:1}}
@keyframes ism-sheen{0%,76%{transform:translateX(-14px);opacity:0}82%{opacity:1}89%,100%{transform:translateX(52px);opacity:0}}
@keyframes ism-body{0%{transform:scale(.95)}57%{transform:scale(1)}64%{transform:scale(1.03)}74%{transform:scale(1)}100%{transform:scale(1.02)}}
@media (prefers-reduced-motion:reduce){.ism *{animation:none!important}.ism .tr:not(.s){opacity:0}.ism .s{stroke:#fff;stroke-width:4.4;stroke-dasharray:none}.ism .fill,.ism .solid{opacity:1}}
`;

export function LogoMarkAnimated({ className = "h-24 w-24", loop = false }: Props) {
  return (
    <svg
      className={`ism ${className}`}
      viewBox="0 0 40 40"
      role="img"
      aria-label="InfoSystems"
      style={loop ? ({ "--iter": "infinite" } as CSSProperties) : undefined}
    >
      <style>{css}</style>
      <defs>
        <linearGradient id="ism-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1A7BE6" />
          <stop offset="1" stopColor="#0956AB" />
        </linearGradient>
        <clipPath id="ism-c">
          <rect width="40" height="40" rx="12" />
        </clipPath>
      </defs>
      <g className="body">
        <rect className="fill" width="40" height="40" rx="12" fill="url(#ism-g)" />
        <g clipPath="url(#ism-c)">
          <g transform="rotate(20)">
            <rect className="sheen" x="-7" y="-10" width="7" height="60" fill="#fff" fillOpacity=".3" />
          </g>
        </g>
        <path className="solid" d={STEM + DOT} fill="#fff" />
        <path className="tr tile" pathLength={1} d={TILE} />
        <path className="tr dot" pathLength={1} d={DOT} />
        <path className="tr stem" pathLength={1} d={STEM} />
        <path className="tr s" pathLength={1} d={S} />
      </g>
    </svg>
  );
}

export default LogoMarkAnimated;
