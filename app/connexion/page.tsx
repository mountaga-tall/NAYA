"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Connexion impossible.");

      router.replace("/accueil");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Connexion impossible.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-10 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="text-5xl">🌸</div>
          <h1 className="mt-4 text-3xl font-bold">Se connecter</h1>
          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/60">
            Retrouve ton espace Naya et tes données privées.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm">
          <label className="block text-sm font-semibold">Email</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}
            autoComplete="email" required
            className="mt-2 w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 outline-none focus:border-[#D96C5B]" />

          <label className="mt-5 block text-sm font-semibold">Mot de passe</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password" required
            className="mt-2 w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 outline-none focus:border-[#D96C5B]" />

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">{error}</div>
          )}

          <button type="submit" disabled={saving}
            className="mt-6 w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg disabled:opacity-60">
            {saving ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#2C1A16]/60">
          Pas encore de compte?{" "}
          <Link href="/onboarding" className="font-bold text-[#6B2D5C]">Créer mon espace</Link>
        </p>
      </div>
    </main>
  );
}
