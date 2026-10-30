import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Lucide({ children, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" {...props}>
      {children}
    </svg>
  );
}

export const ChevronDown = (p: IconProps) => (
  <Lucide {...p}>
    <path d="m6 9 6 6 6-6" />
  </Lucide>
);

export const ArrowRight = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Lucide>
);

export const ArrowLeft = (p: IconProps) => (
  <Lucide {...p}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </Lucide>
);

export const PlayCircle = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
    <circle cx="12" cy="12" r="10" />
  </Lucide>
);

export const Download = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M12 15V3" />
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
  </Lucide>
);

export const ExternalLink = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Lucide>
);

export const Menu = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M4 5h16" />
    <path d="M4 12h16" />
    <path d="M4 19h16" />
  </Lucide>
);

export const X = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Lucide>
);

export const Sun = (p: IconProps) => (
  <Lucide {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </Lucide>
);

export const Moon = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
  </Lucide>
);

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg aria-hidden="true" className="h-9 w-9" viewBox="0 0 40 40">
        <rect className="fill-brand" height="40" rx="12" width="40" />
        <circle cx="13" cy="11.6" fill="#fff" r="2.7" />
        <rect fill="#fff" height="13.4" rx="2.5" width="5" x="10.5" y="16.6" />
        <path d="M29.6 15.6c-.9-2.2-2.9-3.5-5.3-3.5-2.9 0-4.9 1.8-4.9 4.1 0 5.4 10.6 3 10.6 8.9 0 2.6-2.2 4.6-5.4 4.6-2.6 0-4.6-1.2-5.6-3.4" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.4" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-extrabold tracking-tight text-fg">InfoSystems</span>
        <span className="mt-0.5 text-[10px] font-semibold tracking-[0.22em] text-fg-muted uppercase">Mongolia</span>
      </span>
    </span>
  );
}

export const Phone = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  </Lucide>
);

export const Mail = (p: IconProps) => (
  <Lucide {...p}>
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    <rect height="16" rx="2" width="20" x="2" y="4" />
  </Lucide>
);

export const MapPin = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Lucide>
);

/** Brand-neutral icon for a social link, picked from its URL. */
export function SocialIcon({ url, ...p }: IconProps & { url: string }) {
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  })();
  if (host.includes("facebook"))
    return (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...p}>
        <path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10 4.4 10 6.3v2.2H7.5V12H10v10h4V12h2.9l.4-3.5H14z" />
      </svg>
    );
  if (host.includes("youtube"))
    return (
      <Lucide {...p}>
        <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </Lucide>
    );
  if (host.includes("instagram"))
    return (
      <Lucide {...p}>
        <rect height="20" rx="5" width="20" x="2" y="2" />
        <path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z" />
        <path d="M17.5 6.5h.01" />
      </Lucide>
    );
  if (host.includes("linkedin"))
    return (
      <Lucide {...p}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect height="12" width="4" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </Lucide>
    );
  return (
    <Lucide {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </Lucide>
  );
}

export const Eye = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </Lucide>
);

export const EyeOff = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </Lucide>
);

export const Lock = (p: IconProps) => (
  <Lucide {...p}>
    <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Lucide>
);

export const AlertCircle = (p: IconProps) => (
  <Lucide {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </Lucide>
);

export const User = (p: IconProps) => (
  <Lucide {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Lucide>
);
