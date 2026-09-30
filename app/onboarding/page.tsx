"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Goal } from "@/lib/storage";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [goal, setGoal] = useState<Goal>("TRACK");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function finishOnboarding() {
    if (!lastPeriodDate || !firstName || !email || !password) {
      setError("Remplis tous les champs obligatoires.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          password,
          lastPeriodDate,
          cycleLength,
          goal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible de créer ton espace.");
      }

      router.replace("/accueil");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Impossible de créer ton espace.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#6B2D5C]">Naya</span>
            <span className="text-[#2C1A16]/50">Étape {step} / 3</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#F4D8D8]">
            <div
              className="h-full rounded-full bg-[#D96C5B] transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <section>
            <div className="mb-8 text-center">
              <div className="mb-4 text-5xl">🌸</div>
              <h1 className="text-3xl font-bold">Créer ton espace</h1>
              <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
                Ton mot de passe est stocké uniquement sous forme de hash sécurisé côté serveur.
              </p>
            </div>

            <label className="mb-2 block text-sm font-semibold">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              autoComplete="given-name"
              required
              className="mb-4 w-full rounded-2xl border border-[#E7DDD8] bg-white px-4 py-4 outline-none focus:border-[#D96C5B]"
              placeholder="Ton prénom"
            />

            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="mb-4 w-full rounded-2xl border border-[#E7DDD8] bg-white px-4 py-4 outline-none focus:border-[#D96C5B]"
              placeholder="toi@exemple.com"
            />

            <label className="mb-2 block text-sm font-semibold">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className="mb-6 w-full rounded-2xl border border-[#E7DDD8] bg-white px-4 py-4 outline-none focus:border-[#D96C5B]"
              placeholder="8 caractères minimum"
            />

            <label className="mb-2 block text-sm font-semibold">
              Date de début des dernières règles
            </label>
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(event) => setLastPeriodDate(event.target.value)}
              required
              className="w-full rounded-2xl border border-[#E7DDD8] bg-white px-4 py-4 outline-none focus:border-[#D96C5B]"
            />

            <button
              type="button"
              onClick={() => {
                setError("");
                if (!lastPeriodDate || !firstName || !email || !password) {
                  setError("Remplis tous les champs obligatoires.");
                  return;
                }
                setStep(2);
              }}
              className="mt-8 w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg"
            >
              Suivant
            </button>

            <p className="mt-5 text-center text-sm text-[#2C1A16]/60">
              Tu as déjà un compte ?{" "}
              <Link href="/connexion" className="font-bold text-[#6B2D5C]">
                Se connecter
              </Link>
            </p>
          </section>
        )}

        {step === 2 && (
          <section>
            <div className="mb-8 text-center">
              <div className="mb-4 text-5xl">📅</div>
              <h1 className="text-3xl font-bold">Ton rythme habituel</h1>
              <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
                Combien de jours dure ton cycle en général ?
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="text-center">
                <span className="text-5xl font-bold text-[#D96C5B]">{cycleLength}</span>
                <span className="ml-2 text-[#2C1A16]/60">jours</span>
              </div>

              <input
                type="range"
                min="21"
                max="35"
                value={cycleLength}
                onChange={(event) => setCycleLength(Number(event.target.value))}
                className="mt-8 w-full accent-[#D96C5B]"
              />

              <div className="mt-2 flex justify-between text-xs text-[#2C1A16]/50">
                <span>21 jours</span>
                <span>35 jours</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(3);
              }}
              className="mt-8 w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg"
            >
              Suivant
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-3 w-full py-3 text-sm font-semibold text-[#6B2D5C]"
            >
              Retour
            </button>
          </section>
        )}

        {step === 3 && (
          <section>
            <div className="mb-8 text-center">
              <div className="mb-4 text-5xl">💛</div>
              <h1 className="text-3xl font-bold">Que souhaites-tu faire ?</h1>
              <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
                Tu pourras modifier ton choix plus tard.
              </p>
            </div>

            <div className="space-y-3">
              {([
                ["TRACK", "🌸 Suivre mon cycle", "Comprendre mon rythme et mes symptômes."],
                ["PREVENT", "🛡️ Éviter une grossesse", "Les estimations de Naya ne remplacent pas une contraception."],
                ["CONCEIVE", "👶 Essayer de concevoir", "Suivre mon cycle dans un projet de conception."],
              ] as const).map(([value, title, description]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGoal(value)}
                  className={`w-full rounded-2xl border p-5 text-left shadow-sm ${
                    goal === value
                      ? "border-[#D96C5B] bg-[#F4D8D8]"
                      : "border-[#E7DDD8] bg-white"
                  }`}
                >
                  <div className="font-bold">{title}</div>
                  <div className="mt-1 text-sm text-[#2C1A16]/60">{description}</div>
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={finishOnboarding}
              disabled={saving}
              className="mt-8 w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? "Création..." : "Créer mon espace"}
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-[#2C1A16]/50">
              Naya fournit des estimations et ne remplace pas un avis médical.
            </p>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-3 w-full py-3 text-sm font-semibold text-[#6B2D5C]"
            >
              Retour
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
