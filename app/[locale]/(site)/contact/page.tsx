import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader, Section } from "@/components/page-parts";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.contactPage.heading} subtitle={dict.contactPage.subheading} />
      <Section className="pt-0">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-xl border border-gold/25 bg-navy-raised/50 p-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-gold-light">
              {dict.contactPage.directHeading}
            </h2>
            <a href="mailto:liganatural12@gmail.com" className="mt-3 block text-cream hover:text-gold-light">
              liganatural12@gmail.com
            </a>
            <a
              href="https://instagram.com/liga.natural"
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 block text-cream hover:text-gold-light"
            >
              @liga.natural
            </a>
          </div>
          <ContactForm dict={dict} />
        </div>
      </Section>
    </>
  );
}
