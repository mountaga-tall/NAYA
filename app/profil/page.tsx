"use client";

import { useEffect, useState } from "react";
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
  if (goal === "PREVENT") {
    return "Éviter une grossesse";
  }

  if (goal === "CONCEIVE") {
    return "Essayer de concevoir";
  }

  return "Suivre mon cycle";
}

export default function ProfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Impossible de récupérer le profil."
          );
        }

        setProfile(data.profile);
      } catch (error) {
        console.error(error);

        setError(
          "Impossible de charger ton profil."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function toggleDiscreetMode() {
    if (!profile || saving) {
      return;
    }

    const nextValue = !profile.discreetMode;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discreetMode: nextValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de modifier le mode discret."
        );
      }

      setProfile(data.profile);
    } catch (error) {
      console.error(error);

      setError(
        "Impossible de modifier le mode discret."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <p className="text-sm text-[#2C1A16]/60">
            Chargement de ton profil...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <header className="mb-8">
            <p className="text-sm text-[#2C1A16]/50">
              Mon espace
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Profil
            </h1>
          </header>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm leading-6 text-red-600">
              {error || "Profil introuvable."}
            </p>
          </section>

          <BottomNav />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm text-[#2C1A16]/50">
            Mon espace
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Profil
          </h1>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Mon compte
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-[#2C1A16]/50">
                Prénom
              </p>

              <p className="mt-1 font-semibold">
                {profile.firstName || "Amina"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#2C1A16]/50">
                Email
              </p>

              <p className="mt-1 font-semibold">
                {profile.email || "Non renseigné"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#2C1A16]/50">
                Objectif
              </p>

              <p className="mt-1 font-semibold">
                {getGoalLabel(profile.goal)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#2C1A16]/50">
                Durée moyenne du cycle
              </p>

              <p className="mt-1 font-semibold">
                {profile.avgCycleLength} jours
              </p>
            </div>

            <div>
              <p className="text-xs text-[#2C1A16]/50">
                Durée moyenne des règles
              </p>

              <p className="mt-1 font-semibold">
                {profile.avgPeriodLength} jours
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Préférences
          </h2>

          <div className="mt-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="font-semibold">
                Mode discret
              </p>

              <p className="mt-1 text-sm leading-5 text-[#2C1A16]/55">
                Utiliser un vocabulaire plus neutre dans l'application.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDiscreetMode}
              disabled={saving}
              className={`relative h-7 w-12 rounded-full transition ${
                profile.discreetMode
                  ? "bg-[#D96C5B]"
                  : "bg-[#E7DDD8]"
              } disabled:opacity-60`}
              aria-label="Activer ou désactiver le mode discret"
              aria-pressed={profile.discreetMode}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  profile.discreetMode
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Données & sécurité
          </h2>

          <div className="mt-4 space-y-3">
            <button
              type="button"
              className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold"
            >
              📥 Exporter mes données
            </button>

            <button
              type="button"
              className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold"
            >
              🔒 Sécurité et confidentialité
            </button>

            <button
              type="button"
              className="w-full rounded-2xl border border-red-200 px-4 py-4 text-left font-semibold text-red-600"
            >
              🗑️ Supprimer mon compte et mes données
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-[#F4D8D8] p-5">
          <h2 className="font-bold text-[#6B2D5C]">
            🌸 Notre promesse
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/75">
            Tes informations liées à ton cycle sont personnelles.
            Naya est conçu pour te donner le contrôle sur tes données.
          </p>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}