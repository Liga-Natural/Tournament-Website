import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Section } from "@/components/page-parts";
import { SignInForm } from "@/components/sign-in-form";

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);

  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-gold/25 bg-navy-raised/60 p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full crest-ring">
          <span className="font-display text-lg font-extrabold text-navy-deep">LN</span>
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-cream">{dict.signinPage.heading}</h1>
        <p className="mt-2 text-sm text-muted">{dict.signinPage.subheading}</p>
        <div className="mt-6 text-left">
          <SignInForm locale={locale} dict={dict} />
        </div>
        <p className="mt-6 text-xs text-muted">{dict.signinPage.publicNote}</p>
      </div>
    </Section>
  );
}
