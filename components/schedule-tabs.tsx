"use client";

import { useState, type ReactNode } from "react";
import { TabBar } from "./tab-bar";

export function ScheduleTabs({
  upcomingLabel,
  resultsLabel,
  upcoming,
  results,
  initialActive = "upcoming",
}: {
  upcomingLabel: string;
  resultsLabel: string;
  upcoming: ReactNode;
  results: ReactNode;
  initialActive?: "upcoming" | "results";
}) {
  const [active, setActive] = useState(initialActive);

  return (
    <div>
      <TabBar
        tabs={[
          { id: "upcoming", label: upcomingLabel },
          { id: "results", label: resultsLabel },
        ]}
        active={active}
        onChange={(id) => setActive(id as "upcoming" | "results")}
      />
      <div className="pt-8" hidden={active !== "upcoming"}>
        {upcoming}
      </div>
      <div className="pt-8" hidden={active !== "results"}>
        {results}
      </div>
    </div>
  );
}
