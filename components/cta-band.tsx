import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export function CtaBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  return (
    <section className="relative border-t border-gold/20 bg-navy-raised/60 py-14">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-cream sm:text-4xl">
          {dict.ctaBand.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted">{dict.ctaBand.body}</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={`${base}/partners`} className="gold-pill px-6 py-3 text-base">
            {dict.ctaBand.partnerBtn}
          </Link>
          <Link
            href={`${base}/join`}
            className="rounded-full border border-gold/50 px-6 py-3 text-base font-semibold text-gold-light hover:bg-gold/10"
          >
            {dict.ctaBand.joinBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}
