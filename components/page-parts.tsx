import type { ReactNode } from "react";
import Image from "next/image";

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

export function PageHeader({
  kicker,
  title,
  subtitle,
  imageUrl,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}) {
  if (imageUrl) {
    return (
      <div className="relative overflow-hidden">
        <div className="relative aspect-[16/11] w-full sm:aspect-[21/9]">
          <Image src={imageUrl} alt="" fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/65 to-navy-deep/15" />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-8 text-center sm:pb-12">
            {kicker && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">{kicker}</p>}
            <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-wide text-cream sm:text-5xl">
              {title}
            </h1>
            {subtitle && <p className="mt-4 max-w-2xl text-base text-cream/85 sm:text-lg">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  }
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
