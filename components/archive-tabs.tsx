"use client";

import { useState, type ReactNode } from "react";
import { TabBar } from "./tab-bar";

export function ArchiveTabs({
  recordBookLabel,
  galleryLabel,
  recordBook,
  gallery,
}: {
  recordBookLabel: string;
  galleryLabel: string;
  recordBook: ReactNode;
  gallery: ReactNode;
}) {
  const [active, setActive] = useState("record-book");

  return (
    <div>
      <TabBar
        tabs={[
          { id: "record-book", label: recordBookLabel },
          { id: "gallery", label: galleryLabel },
        ]}
        active={active}
        onChange={setActive}
      />
      <div className="pt-8" hidden={active !== "record-book"}>
        {recordBook}
      </div>
      <div className="pt-8" hidden={active !== "gallery"}>
        {gallery}
      </div>
    </div>
  );
}
