export interface Stat {
  value: string;
  label: string;
}

export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-xl shadow-black/40">
      <div className="grid grid-cols-2 gap-px bg-navy-deep/10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white px-4 py-6 text-center">
            <div className="font-display tabular text-3xl font-bold text-navy-deep sm:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy/60">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
