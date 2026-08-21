import type { ReactNode } from "react";

export function MomentRail({ children }: { children: ReactNode }) {
  return (
    <div
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0"
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}
