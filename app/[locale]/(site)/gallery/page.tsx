import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";

// Gallery merged into the Archive page (Past Editions) — keep this route as a
// redirect so old links and bookmarks still land somewhere useful.
export default async function GalleryRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  redirect(`/${locale}/past-editions`);
}
