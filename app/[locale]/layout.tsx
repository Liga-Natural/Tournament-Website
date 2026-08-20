import { locales } from "@/lib/i18n/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
