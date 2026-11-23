"use client";

import { useEffect, useState } from "react";

export default function PwaRuntime() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const updateConnection = () => setOffline(!navigator.onLine);
    updateConnection();
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("Naya PWA registration unavailable", error);
      });
    }

    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed left-3 right-3 top-3 z-[100] mx-auto max-w-md rounded-2xl border border-[#E8C7A5] bg-[#FFF8EF] px-4 py-3 text-xs font-medium text-[#7A4728] shadow-lg"
    >
      Tu es hors connexion. Les données privées ne sont pas conservées automatiquement sur cet appareil. Reconnecte-toi pour actualiser Naya et enregistrer tes changements.
    </div>
  );
}
