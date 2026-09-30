"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

type Profile = {
  id: string;
  firstName: string | null;
  email: string | null;
  avgCycleLength: number;
  avgPeriodLength: number;
  goal: "TRACK" | "PREVENT" | "CONCEIVE";
  discreetMode: boolean;
};

function getGoalLabel(goal: Profile["goal"]) {
  if (goal === "PREVENT") return "Prévenir une grossesse";
  if (goal === "CONCEIVE") return "Projet de conception";
  return "Suivi du cycle";
}

export default function ProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossible de récupérer le profil.");
        setProfile(data.profile);
      } catch {
        setError("Impossible de charger ton profil.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function toggleDiscreetMode() {
    if (!profile || saving || deleting || exporting) return;
    const nextValue = !profile.discreetMode;
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discreetMode: nextValue }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible de modifier le mode d'affichage.");
      setProfile(data.profile);
    } catch {
      setError("Impossible de modifier le mode d'affichage.");
    } finally {
      setSaving(false);
    }
  }

  async function exportData() {
    if (saving || deleting || exporting) return;
    setExporting(true);
    setError("");

    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Export impossible.");

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "naya-mes-donnees.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Impossible d'exporter les données.");
    } finally {
      setExporting(false);
    }
  }

  async function logout() {
    if (saving || deleting || exporting) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Déconnexion impossible.");
      router.replace("/connexion");
      router.refresh();
    } catch {
      setError("Impossible de se déconnecter.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAccount() {
    if (saving || deleting || exporting) return;
    const confirmed = window.confirm("Supprimer définitivement le compte et toutes les données associées ?");
    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/profile", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Suppression impossible.");
      router.replace("/");
      router.refresh();
    } catch {
      setError("Impossible de supprimer le compte et les données.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
        <div className="mx-auto max-w-md"><p className="text-sm text-[#2C1A16]/60">Chargement du profil...</p></div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <header className="mb-8"><p className="text-sm text-[#2C1A16]/50">Mon espace</p><h1 className="mt-1 text-3xl font-bold">Profil</h1></header>
          <section className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-sm leading-6 text-red-600">{error || "Profil introuvable."}</p></section>
          <BottomNav />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm text-[#2C1A16]/50">Mon espace</p>
          <h1 className="mt-1 text-3xl font-bold">Profil</h1>
        </header>

        {error && <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Mon compte</h2>
          <div className="mt-4 space-y-4">
            <div><p className="text-xs text-[#2C1A16]/50">Prénom</p><p className="mt-1 font-semibold">{profile.firstName || "—"}</p></div>
            <div><p className="text-xs text-[#2C1A16]/50">Email</p><p className="mt-1 font-semibold">{profile.email || "—"}</p></div>
            <div><p className="text-xs text-[#2C1A16]/50">Préférence</p><p className="mt-1 font-semibold">{getGoalLabel(profile.goal)}</p></div>
            <div><p className="text-xs text-[#2C1A16]/50">Durée moyenne du cycle</p><p className="mt-1 font-semibold">{profile.avgCycleLength} jours</p></div>
            <div><p className="text-xs text-[#2C1A16]/50">Durée moyenne des règles</p><p className="mt-1 font-semibold">{profile.avgPeriodLength} jours</p></div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Préférences d'affichage</h2>
          <div className="mt-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="font-semibold">Mode d'affichage neutre</p>
              <p className="mt-1 text-sm leading-5 text-[#2C1A16]/55">Utiliser un vocabulaire plus neutre dans l'application.</p>
            </div>
            <button type="button" onClick={toggleDiscreetMode} disabled={saving || deleting || exporting}
              className={`relative h-7 w-12 rounded-full transition ${profile.discreetMode ? "bg-[#D96C5B]" : "bg-[#E7DDD8]"} disabled:opacity-60`}
              aria-label="Activer ou désactiver le mode d'affichage neutre" aria-pressed={profile.discreetMode}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${profile.discreetMode ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Données & sécurité</h2>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={exportData}
              disabled={saving || deleting || exporting}
              className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold disabled:opacity-60"
            >
              {exporting ? "Préparation de l'export..." : "📥 Exporter mes données"}
            </button>

            <button
              type="button"
              onClick={() => setShowSecurity((value) => !value)}
              disabled={saving || deleting || exporting}
              className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold disabled:opacity-60"
              aria-expanded={showSecurity}
            >
              🔒 Sécurité et confidentialité
            </button>

            {showSecurity && (
              <div className="rounded-2xl bg-[#FDFBF7] p-4 text-sm leading-6 text-[#2C1A16]/70">
                <p>Le mot de passe n'est pas conservé en clair : l'application enregistre un hash côté serveur.</p>
                <p className="mt-2">La session de connexion utilise un cookie de session protégé. Les données du profil sont accessibles uniquement depuis la session connectée.</p>
              </div>
            )}

            <button
              type="button"
              onClick={deleteAccount}
              disabled={saving || deleting || exporting}
              className="w-full rounded-2xl border border-red-200 px-4 py-4 text-left font-semibold text-red-600 disabled:opacity-60"
            >
              {deleting ? "Suppression..." : "🗑️ Supprimer mon compte et mes données"}
            </button>

            <button
              type="button"
              onClick={logout}
              disabled={saving || deleting || exporting}
              className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold disabled:opacity-60"
            >
              {saving ? "Déconnexion..." : "↪️ Se déconnecter"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-[#F4D8D8] p-5">
          <h2 className="font-bold text-[#6B2D5C]">🌸 Notre engagement</h2>
          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/75">Tes informations personnelles restent associées à ton espace Naya. Tu peux demander leur export ou supprimer ton compte depuis cette page.</p>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
