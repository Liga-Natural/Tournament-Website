import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { StickyMobileBar } from "@/components/sticky-mobile-bar";
import { CtaBand } from "@/components/cta-band";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return {
    title: dict.meta.siteName,
    description: dict.home.eventsBody,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const session = await getSession();

  return (
    <>
      <div className="field-backdrop" aria-hidden="true" />
      <div className="flex min-h-dvh flex-col pb-16 lg:pb-0">
        <SiteNav locale={locale} dict={dict} session={session} />
        <main className="flex-1">{children}</main>
        <CtaBand locale={locale} dict={dict} />
        <SiteFooter locale={locale} dict={dict} />
      </div>
      <StickyMobileBar locale={locale} dict={dict} />
    </>
  );
}
