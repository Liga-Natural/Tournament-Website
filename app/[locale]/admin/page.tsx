import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getEvents, getReferees, getContactSubmissions, getPartnerEnquiries, getJoinSubmissions } from "@/lib/store";
import { isDemoMode } from "@/lib/store";

export default async function AdminOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}/admin`;

  const [events, referees, contacts, enquiries, joins] = await Promise.all([
    getEvents(),
    getReferees(),
    getContactSubmissions(),
    getPartnerEnquiries(),
    getJoinSubmissions(),
  ]);
  const inboxCount = contacts.length + enquiries.length + joins.length;

  return (
    <div>
      {isDemoMode && (
        <div className="mb-6 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm text-gold-light">
          Demo mode: data is stored in a local file on this server, not Supabase. Set{" "}
          <code className="rounded bg-navy-deep px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-navy-deep px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to switch to shared, persistent
          storage. See SETUP.md.
        </div>
      )}
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-cream">{dict.admin.nav.overview}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card href={`${base}/events`} value={events.length} label={dict.admin.nav.events} />
        <Card href={`${base}/referees`} value={referees.length} label={dict.admin.nav.referees} />
        <Card href={`${base}/inbox`} value={inboxCount} label={dict.admin.nav.inbox} />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-gold-light">{dict.admin.nav.events}</h2>
        <div className="overflow-hidden rounded-lg border border-gold/20">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-navy-raised text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Venue</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t border-gold/10">
                  <td className="px-3 py-2 font-medium text-cream">{e.name}</td>
                  <td className="px-3 py-2 text-muted">{e.status}</td>
                  <td className="px-3 py-2 text-muted">{e.venueName ?? "—"}</td>
                  <td className="px-3 py-2 text-right">
                    <Link href={`${base}/events/${e.id}`} className="text-gold-light hover:underline">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ href, value, label }: { href: string; value: number; label: string }) {
  return (
    <Link href={href} className="rounded-lg border border-gold/25 bg-navy-raised/50 p-5 hover:border-gold">
      <div className="font-display tabular text-3xl font-bold text-gold-light">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </Link>
  );
}
