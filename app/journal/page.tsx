"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const fluxOptions = [
  { label: "Léger", value: "LIGHT" },
  { label: "Moyen", value: "MEDIUM" },
  { label: "Abondant", value: "HEAVY" },
  { label: "Spotting", value: "SPOTTING" },
];

const douleurOptions = [
  { label: "Tête", value: "HEADACHE" },
  { label: "Ventre", value: "CRAMPS" },
  { label: "Bas du dos", value: "LOW_BACK_PAIN" },
  { label: "Seins sensibles", value: "TENDER_BREASTS" },
];

const humeurOptions = [
  { label: "Calme", value: "CALM" },
  { label: "Heureuse", value: "HAPPY" },
  { label: "Triste", value: "SAD" },
  { label: "Irritable", value: "IRRITABLE" },
  { label: "Anxieuse", value: "ANXIOUS" },
];

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function JournalPage() {
  const [flux, setFlux] = useState<string | null>(null);
  const [douleurs, setDouleurs] = useState<string[]>([]);
  const [humeur, setHumeur] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function toggleDouleur(value: string) {
    setDouleurs((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  async function saveLog() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logDate: getTodayDate(),
          flow: flux,
          symptoms: douleurs,
          mood: humeur,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible d'enregistrer le suivi."
        );
      }

      setMessage("Ton suivi a bien été enregistré dans Naya. 🌸");
    } catch (error) {
      console.error(error);

      setMessage(
        "Une erreur est survenue pendant l'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm text-[#2C1A16]/50">
            Aujourd'hui
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Comment te sens-tu ?
          </h1>

          <p className="mt-2 text-sm text-[#2C1A16]/60">
            Cela prend moins d'une minute.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-[#6B2D5C]">
            🩸 Flux
          </h2>

          <div className="flex flex-wrap gap-2">
            {fluxOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFlux(option.value)}
                className={`rounded-full px-4 py-3 text-sm font-semibold ${
                  flux === option.value
                    ? "bg-[#D96C5B] text-white"
                    : "border border-[#E7DDD8] bg-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-[#6B2D5C]">
            😣 Douleurs
          </h2>

          <div className="flex flex-wrap gap-2">
            {douleurOptions.map((option) => {
              const selected = douleurs.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleDouleur(option.value)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold ${
                    selected
                      ? "bg-[#6B2D5C] text-white"
                      : "border border-[#E7DDD8] bg-white"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-[#6B2D5C]">
            😊 Humeur
          </h2>

          <div className="flex flex-wrap gap-2">
            {humeurOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setHumeur(option.value)}
                className={`rounded-full px-4 py-3 text-sm font-semibold ${
                  humeur === option.value
                    ? "bg-[#D96C5B] text-white"
                    : "border border-[#E7DDD8] bg-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-[#6B2D5C]">
            📝 Note personnelle
          </h2>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Écris quelque chose..."
            className="min-h-32 w-full resize-none rounded-2xl border border-[#E7DDD8] bg-white p-4 text-sm outline-none focus:border-[#D96C5B]"
          />
        </section>

        <button
          type="button"
          onClick={saveLog}
          disabled={saving}
          className="w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>

        {message && (
          <div className="mt-4 rounded-2xl bg-white p-4 text-center text-sm shadow-sm">
            {message}
          </div>
        )}

        <BottomNav />
      </div>
    </main>
  );
}
