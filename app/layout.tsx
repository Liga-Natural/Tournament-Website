import type { Metadata } from "next";
import { Outfit, Anton, Archivo } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
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
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${archivo.variable} ${anton.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
