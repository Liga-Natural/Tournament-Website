import type { ReactNode } from "react";

const accents: Record<string, string> = {
  gold: "from-gold/25 via-navy-raised to-navy-deep",
  navy: "from-navy-raised via-navy to-navy-deep",
};

/**
 * Branded fallback used wherever a real photo is not yet available.
 * Never a grey box or stock image — a navy/gold panel carrying the
 * league mark, per the org's imagery guidelines.
 */
export function BrandPanel({
  label,
  accent = "gold",
  className = "",
  bare = false,
  children,
}: {
  label?: string;
  accent?: "gold" | "navy";
  className?: string;
  /** Skip the default centered badge — use when the panel sits behind its own overlay text. */
  bare?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${accents[accent]} ${className}`}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(212,175,95,0.10) 0px, rgba(212,175,95,0.10) 1px, transparent 1px, transparent 28px)",
        }}
        aria-hidden="true"
      />
      {children ??
        (!bare && (
          <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full crest-ring">
              <span className="font-display text-lg font-extrabold text-navy-deep">LN</span>
            </span>
            {label && <span className="text-xs font-semibold uppercase tracking-widest text-gold-light/90">{label}</span>}
          </div>
        ))}
    </div>
  );
}
