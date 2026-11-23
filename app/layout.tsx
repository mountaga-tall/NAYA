import type { Metadata } from "next";
import "./globals.css";
import LanguageRuntime from "@/components/LanguageRuntime";
import PwaRuntime from "@/components/PwaRuntime";
import ReminderRuntime from "@/components/ReminderRuntime";

export const metadata: Metadata = {
  title: "Naya — Ton cycle, ton rythme",
  description:
    "Application de suivi du cycle menstruel pensée pour la Côte d'Ivoire et l'Afrique francophone.",
  manifest: "/manifest.webmanifest",
  applicationName: "Naya",
  appleWebApp: {
    capable: true,
    title: "Naya",
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#FDFBF7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <LanguageRuntime />
        <PwaRuntime />
        <ReminderRuntime />
      </body>
    </html>
  );
}
