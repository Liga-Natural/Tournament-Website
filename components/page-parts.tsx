import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-6 py-14 ${className}`}>
      {children}
    </section>
  );
}

export function PageHeader({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center">
      {kicker && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{kicker}</p>}
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-wide text-cream sm:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-4 text-base text-muted sm:text-lg">{subtitle}</p>}
    </div>
  );
}

export function StarDivider() {
  return (
    <div className="star-divider py-2" aria-hidden="true">
      ★
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gold/30 bg-navy-raised/40 p-8 text-center text-sm text-muted">
      {message}
    </div>
  );
}
