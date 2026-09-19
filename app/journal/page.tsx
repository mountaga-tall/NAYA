"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const fluxOptions = ["Léger", "Moyen", "Abondant", "Spotting"];

const douleurOptions = [
  "Tête",
  "Ventre",
  "Bas du dos",
  "Seins sensibles",
];

const humeurOptions = [
  "Calme",
  "Heureuse",
  "Triste",
  "Irritable",
  "Anxieuse",
];

export default function JournalPage() {
  const [flux, setFlux] = useState<string | null>(null);
  const [douleurs, setDouleurs] = useState<string[]>([]);
  const [humeur, setHumeur] = useState<string | null>(null);

  function toggleDouleur(value: string) {
    setDouleurs((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function saveLog() {
    alert("Ton suivi a été enregistré. 🌸");
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
                key={option}
                onClick={() => setFlux(option)}
                className={`rounded-full px-4 py-3 text-sm font-semibold ${
                  flux === option
                    ? "bg-[#D96C5B] text-white"
                    : "border border-[#E7DDD8] bg-white"
                }`}
              >
                {option}
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
              const selected = douleurs.includes(option);

              return (
                <button
                  key={option}
                  onClick={() => toggleDouleur(option)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold ${
                    selected
                      ? "bg-[#6B2D5C] text-white"
                      : "border border-[#E7DDD8] bg-white"
                  }`}
                >
                  {option}
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
                key={option}
                onClick={() => setHumeur(option)}
                className={`rounded-full px-4 py-3 text-sm font-semibold ${
                  humeur === option
                    ? "bg-[#D96C5B] text-white"
                    : "border border-[#E7DDD8] bg-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-[#6B2D5C]">
            📝 Note personnelle
          </h2>

          <textarea
            placeholder="Écris quelque chose..."
            className="min-h-32 w-full resize-none rounded-2xl border border-[#E7DDD8] bg-white p-4 text-sm outline-none focus:border-[#D96C5B]"
          />
        </section>

        <button
          onClick={saveLog}
          className="w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg"
        >
          Enregistrer
        </button>

        <BottomNav />
      </div>
    </main>
  );
}
