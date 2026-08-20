"use client";

import { useState, type ReactNode } from "react";

export interface TabDef {
  id: string;
  label: string;
  content: ReactNode;
}

export function CssTabs({ name, tabs, defaultId }: { name: string; tabs: TabDef[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);

  return (
    <div>
      <div role="tablist" aria-label={name} className="mb-6 flex flex-wrap gap-2 border-b border-gold/20 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={`cursor-pointer rounded-t-md border-b-2 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
              active === t.id ? "border-gold text-gold-light" : "border-transparent text-muted hover:text-gold-light"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
