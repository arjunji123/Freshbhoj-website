import type { ReactNode } from "react";

/** Devanagari / Hinglish accent word in the display serif. */
export function Deva({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-deva ${className}`}>{children}</span>;
}

/** Pennant string hanging from the top edge of the parent (parent must be `relative`). */
export function Torana({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`torana pointer-events-none absolute top-0 inset-x-0 z-[5] ${className}`} />;
}

/** Marigold garland divider. */
export function Garland({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`garland w-full max-w-xs mx-auto ${className}`} />;
}

/** Small bilingual section label: "THE REALITY CHECK · सच्चाई". */
export function Eyebrow({ en, hi, tone = "light", className = "" }: { en: string; hi: string; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <p className={`inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-[#FFC21A]" : "text-[#087F78]"} ${className}`}>
      {en}
      <span className={`w-1.5 h-1.5 rounded-full ${dark ? "bg-white/50" : "bg-[#FFC21A]"}`} />
      <span className="font-deva normal-case tracking-normal text-base md:text-lg leading-none">{hi}</span>
    </p>
  );
}
