import { getPartners } from "@/lib/store";
import { createPartnerAction, deletePartnerAction } from "@/app/actions/admin";
import { LabeledInput, LabeledSelect } from "../events/page";

export default async function AdminPartnersPage() {
  const partners = await getPartners();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-cream">Partners</h1>

      <div className="mt-6 overflow-hidden rounded-lg border border-gold/20">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-navy-raised text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-t border-gold/10">
                <td className="px-3 py-2 font-medium text-cream">{p.name}</td>
                <td className="px-3 py-2 text-muted">{p.tier}</td>
                <td className="px-3 py-2 text-muted">{p.status}</td>
                <td className="px-3 py-2 text-right">
                  <form action={deletePartnerAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="text-red-300 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={createPartnerAction} className="mt-6 grid gap-3 rounded-lg border border-gold/20 bg-navy-raised/40 p-4 sm:grid-cols-2">
        <LabeledInput name="name" label="Partner name" required />
        <LabeledInput name="instagram" label="Instagram (optional)" />
        <LabeledSelect name="tier" label="Tier" options={[["title", "Title"], ["season", "Season"], ["current", "Current"], ["previous", "Previous"]]} />
        <LabeledSelect name="status" label="Status" options={[["current", "Current"], ["previous", "Previous"]]} />
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
            Add Partner
          </button>
        </div>
      </form>
    </div>
  );
}
