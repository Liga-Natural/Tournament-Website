import { isLocale, type Locale } from "@/lib/i18n/locales";
import { ChangeCodeForm } from "@/components/change-code-form";

export default async function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-cream">Settings</h1>
      <div className="mt-6 max-w-md rounded-lg border border-gold/20 bg-navy-raised/40 p-5">
        <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wide text-gold-light">Organizer Access Code</h2>
        <p className="mb-4 text-sm text-muted">
          This code signs you in with full control over the site. Keep it private — anyone with it can manage events,
          teams, results, and referees.
        </p>
        <ChangeCodeForm locale={locale} />
      </div>
    </div>
  );
}
