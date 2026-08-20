export interface Stat {
  value: string;
  label: string;
}

export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-gold/25 bg-gold/15 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-navy-raised px-4 py-6 text-center">
          <div className="font-display tabular text-3xl font-bold text-gold-light sm:text-4xl">{s.value}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
