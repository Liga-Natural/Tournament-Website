import { getReferees } from "@/lib/store";
import { createRefereeAction, deleteRefereeAction, regenerateRefereeCodeAction, toggleRefereeActiveAction } from "@/app/actions/admin";
import { LabeledInput } from "../events/page";

export default async function AdminRefereesPage() {
  const referees = await getReferees();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-cream">Referees</h1>
      <p className="mt-1 text-sm text-muted">
        Each referee gets a unique access code. Share it with them directly — it signs them in to see only their assigned
        matches.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-gold/20">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-navy-raised text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {referees.map((r) => (
              <tr key={r.id} className="border-t border-gold/10">
                <td className="px-3 py-2 font-medium text-cream">{r.name}</td>
                <td className="px-3 py-2 font-display tabular text-lg text-gold-light">{r.code}</td>
                <td className="px-3 py-2 text-muted">{r.active ? "Active" : "Inactive"}</td>
                <td className="px-3 py-2 text-right space-x-3">
                  <form action={regenerateRefereeCodeAction} className="inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-gold-light hover:underline">New code</button>
                  </form>
                  <form action={toggleRefereeActiveAction} className="inline">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="active" value={(!r.active).toString()} />
                    <button className="text-gold-light hover:underline">{r.active ? "Deactivate" : "Activate"}</button>
                  </form>
                  <form action={deleteRefereeAction} className="inline">
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-red-300 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={createRefereeAction} className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-gold/20 bg-navy-raised/40 p-4">
        <div className="w-64">
          <LabeledInput name="name" label="Referee name" required />
        </div>
        <button type="submit" className="gold-pill px-4 py-2 text-sm">
          Add Referee &amp; Generate Code
        </button>
      </form>
    </div>
  );
}
