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

export const metadata: Metadata = {
  title: "Cauchemar en Crêpe — avec Arthur Leloup",
  description:
    "La crêperie où les crêpes volent. Littéralement. Galettes, crêpes sucrées et retournements ratés par le chef Arthur Leloup.",
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
