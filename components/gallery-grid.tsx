import Image from "next/image";
import type { GalleryImageRecord } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locales";
import { BrandPanel } from "./brand-panel";

const spanFor = { landscape: "sm:col-span-2", portrait: "row-span-2", square: "" } as const;

export function GalleryGrid({ images, locale }: { images: GalleryImageRecord[]; locale: Locale }) {
  return (
    <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[210px] sm:grid-cols-4">
      {images.map((img) => (
        <div
          key={img.id}
          className={`group relative overflow-hidden rounded-xl border border-gold/15 shadow-md shadow-black/20 transition-colors duration-300 hover:border-gold/50 ${spanFor[img.orientation]}`}
        >
          {img.url ? (
            <>
              <Image
                src={img.url}
                alt={locale === "es" ? img.altEs : img.altEn}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/0 to-navy-deep/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {img.caption && (
                <p className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-xs font-medium text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {img.caption}
                </p>
              )}
            </>
          ) : (
            <BrandPanel
              accent={img.accentColor === "navy" ? "navy" : "gold"}
              label={img.caption ?? undefined}
              className="absolute inset-0"
            />
          )}
        </div>
      ))}
    </div>
  );
}
