import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getEvents } from "@/lib/store";
import { createEventAction, deleteEventAction } from "@/app/actions/admin";

export default async function AdminEventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const base = `/${locale}/admin`;
  const events = await getEvents();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-cream">Events</h1>

      <div className="mt-6 overflow-hidden rounded-lg border border-gold/20">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-navy-raised text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Season</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Theme</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t border-gold/10">
                <td className="px-3 py-2 font-medium text-cream">{e.name}</td>
                <td className="px-3 py-2 text-muted">{e.seasonLabel}</td>
                <td className="px-3 py-2 text-muted">{e.status}</td>
                <td className="px-3 py-2 text-muted">{e.theme}</td>
                <td className="px-3 py-2 text-right space-x-3">
                  <Link href={`${base}/events/${e.id}`} className="text-gold-light hover:underline">
                    Manage
                  </Link>
                  <form action={deleteEventAction} className="inline">
                    <input type="hidden" name="id" value={e.id} />
                    <button type="submit" className="text-red-300 hover:underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-2xl rounded-lg border border-gold/20 bg-navy-raised/40 p-5">
        <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide text-gold-light">New Event</h2>
        <form action={createEventAction} className="grid gap-3 sm:grid-cols-2">
          <LabeledInput name="name" label="Name" required />
          <LabeledInput name="shortName" label="Short name" />
          <LabeledInput name="seasonLabel" label="Season label (e.g. 2027)" />
          <LabeledInput name="year" label="Year" type="number" />
          <LabeledInput name="venueName" label="Venue name" />
          <LabeledInput name="venueAddress" label="Venue address" />
          <LabeledSelect name="kind" label="Kind" options={[["league", "League"], ["cup", "Cup"]]} />
          <LabeledSelect name="theme" label="Theme" options={[["liga", "Liga Natural"], ["copa", "Copa Piston"]]} />
          <LabeledSelect
            name="status"
            label="Status"
            options={[["upcoming", "Upcoming"], ["active", "Active"], ["completed", "Completed"]]}
          />
          <LabeledInput name="order" label="Display order (lower = first)" type="number" />
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted">Description (English)</label>
            <textarea name="descriptionEn" rows={2} className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2 text-sm text-cream" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted">Description (Español)</label>
            <textarea name="descriptionEs" rows={2} className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2 text-sm text-cream" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="gold-pill px-5 py-2.5 text-sm">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LabeledInput({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
      />
    </div>
  );
}

export function LabeledSelect({ name, label, options }: { name: string; label: string; options: [string, string][] }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      <select name={name} className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none">
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}
