import type { Metadata } from "next";
import "./globals.css";
import LanguageRuntime from "@/components/LanguageRuntime";

export const metadata: Metadata = {
  title: "Naya — Ton cycle, ton rythme",
  description:
    "Application de suivi du cycle menstruel pensée pour la Côte d'Ivoire et l'Afrique francophone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}<LanguageRuntime /></body>
    </html>
  );
}
