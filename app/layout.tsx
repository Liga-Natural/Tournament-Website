import type { Metadata } from "next";
import { Outfit, Anton } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const anton = Anton({
  variable: "--font-cp-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Liga Natural Tournaments",
    template: "%s | Liga Natural Tournaments",
  },
  description:
    "Liga Natural Tournaments — soccer competitions in Doral, Miami. Standings, schedules, results, and more than a game.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "es" ? "es" : "en";
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${outfit.variable} ${anton.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Big Shoulders Display isn't in next/font/google's bundled dataset yet,
            so it's loaded directly — the true condensed "Display" cut, not the
            base Big Shoulders family. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router's
            root layout is the equivalent of _document.js; this rule predates
            App Router and doesn't recognize that. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;600;700;800;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
