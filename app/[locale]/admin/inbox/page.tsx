import { getContactSubmissions, getPartnerEnquiries, getJoinSubmissions } from "@/lib/store";

export default async function AdminInboxPage() {
  const [contacts, enquiries, joins] = await Promise.all([
    getContactSubmissions(),
    getPartnerEnquiries(),
    getJoinSubmissions(),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-cream">Inbox</h1>

      <Group title="Partner Enquiries">
        {enquiries.map((e) => (
          <Row key={e.id} title={`${e.name}${e.company ? ` · ${e.company}` : ""}`} subtitle={`${e.email}${e.phone ? ` · ${e.phone}` : ""}`}>
            <p className="text-sm text-cream/85">
              <span className="text-muted">Interested in:</span> {e.interest || "—"}
            </p>
            {e.message && <p className="mt-1 text-sm text-cream/70">{e.message}</p>}
          </Row>
        ))}
      </Group>

      <Group title="Join the League Submissions">
        {joins.map((j) => (
          <Row key={j.id} title={`${j.name} · ${j.type}`} subtitle={`${j.email}${j.phone ? ` · ${j.phone}` : ""}`}>
            {j.details && <p className="mt-1 text-sm text-cream/70">{j.details}</p>}
          </Row>
        ))}
      </Group>

      <Group title="Contact Messages">
        {contacts.map((c) => (
          <Row key={c.id} title={`${c.name} · ${c.reason}`} subtitle={`${c.email}${c.phone ? ` · ${c.phone}` : ""}`}>
            {c.message && <p className="mt-1 text-sm text-cream/70">{c.message}</p>}
          </Row>
        ))}
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-gold-light">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-navy-raised/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-medium text-cream">{title}</span>
        <span className="text-xs text-muted">{subtitle}</span>
      </div>
      {children}
    </div>
  );
}
