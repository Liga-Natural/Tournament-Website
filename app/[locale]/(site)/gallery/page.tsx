import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getGalleryImages } from "@/lib/store";
import { PageHeader, Section } from "@/components/page-parts";
import { BrandPanel } from "@/components/brand-panel";

const spanFor = { landscape: "sm:col-span-2", portrait: "row-span-2", square: "" } as const;

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);

  const images = await getGalleryImages();

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.galleryPage.heading} subtitle={dict.galleryPage.subheading} />
      <Section className="pt-0">
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted">{dict.galleryPage.empty}</p>
        <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative overflow-hidden rounded-lg border border-gold/20 ${spanFor[img.orientation]}`}
            >
              <BrandPanel
                accent={img.accentColor === "navy" ? "navy" : "gold"}
                label={img.caption ?? undefined}
                className="absolute inset-0"
              />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
