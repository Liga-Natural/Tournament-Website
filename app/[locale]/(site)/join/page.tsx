import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader, Section } from "@/components/page-parts";
import { JoinForm } from "@/components/join-form";

export default async function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.joinPage.heading} subtitle={dict.joinPage.subheading} />
      <Section className="pt-0">
        <div className="mx-auto max-w-2xl rounded-xl border border-gold/30 bg-navy-raised/60 p-6 sm:p-10">
          <p className="mb-6 text-sm text-muted">{dict.joinPage.intro}</p>
          <JoinForm dict={dict} />
        </div>
      </Section>
    </>
  );
}
