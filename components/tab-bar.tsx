"use client";

import { useEffect, useRef, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
}

export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    function measure() {
      const rail = railRef.current;
      const btn = btnRefs.current.get(active);
      if (!rail || !btn) return;
      const railBox = rail.getBoundingClientRect();
      const btnBox = btn.getBoundingClientRect();
      setIndicator({ left: btnBox.left - railBox.left + rail.scrollLeft, width: btnBox.width });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, tabs]);

  return (
    <div className="border-b border-gold/15">
      <div ref={railRef} className="relative flex gap-6 overflow-x-auto sm:gap-8" style={{ scrollbarWidth: "none" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) btnRefs.current.set(tab.id, el);
            }}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-selected={active === tab.id}
            role="tab"
            className={`shrink-0 whitespace-nowrap py-3.5 font-display text-sm font-bold uppercase tracking-wide transition-colors duration-200 sm:text-base ${
              active === tab.id ? "text-gold-light" : "text-muted hover:text-cream"
            }`}
          >
            {tab.label}
          </button>
        ))}
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute bottom-0 h-[2.5px] rounded-full bg-gold transition-all duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
      </div>
    </div>
  );
}
