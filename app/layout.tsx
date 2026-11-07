import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const hand = Caveat({
  variable: "--font-hand-src",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Cauchemar en Crêpe — avec Arthur Leloup";
const description =
  "La crêperie où les crêpes volent. Littéralement. Galettes, crêpes sucrées et retournements ratés par le chef Arthur Leloup.";

export const metadata: Metadata = {
  // URL absolue des images d'aperçu (WhatsApp ne lit pas les chemins relatifs)
  metadataBase: new URL(process.env.SITE_URL ?? "https://cauchemar-en-crepe.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description: "Le chef, c'est le problème. Venez voir les crêpes décoller.",
    siteName: "Cauchemar en Crêpe",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${hand.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
