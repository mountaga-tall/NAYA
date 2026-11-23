"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const fluxOptions = [
  { label: "Léger", value: "LIGHT" },
  { label: "Moyen", value: "MEDIUM" },
  { label: "Abondant", value: "HEAVY" },
  { label: "Spotting", value: "SPOTTING" },
];

const symptomOptions = [
  { label: "Crampes", value: "CRAMPS" },
  { label: "Maux de tête", value: "HEADACHE" },
  { label: "Douleurs lombaires", value: "LOW_BACK_PAIN" },
  { label: "Seins sensibles", value: "TENDER_BREASTS" },
  { label: "Fatigue", value: "FATIGUE" },
  { label: "Ballonnements", value: "BLOATING" },
  { label: "Nausées", value: "NAUSEA" },
  { label: "Acné", value: "ACNE" },
];

const moodOptions = [
  { label: "Calme", value: "CALM" },
  { label: "Heureuse", value: "HAPPY" },
  { label: "Triste", value: "SAD" },
  { label: "Irritable", value: "IRRITABLE" },
  { label: "Anxieuse", value: "ANXIOUS" },
];

const dischargeOptions = [
  { label: "Je préfère ne pas noter", value: "" },
  { label: "Aucune observation", value: "NONE" },
  { label: "Claire / transparente", value: "CLEAR" },
  { label: "Blanche", value: "WHITE" },
  { label: "Épaisse / collante", value: "STICKY" },
  { label: "Changement qui m’interroge", value: "UNUSUAL" },
];

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export default function JournalPage() {
  const [flux, setFlux] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [discharge, setDischarge] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function toggleSymptom(value: string) {
    setSymptoms((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  async function saveLog() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logDate: getTodayDate(),
          flow,
          symptoms,
          mood,
          energy,
          sleep,
          discharge: discharge || null,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible d'enregistrer le suivi.");

      setMessage("Ton suivi a bien été enregistré dans Naya. 🌸");
    } catch (err) {
      console.error(err);
      setError(
        !navigator.onLine
          ? "Tu es hors connexion. Ton journal n'a pas été envoyé : reconnecte-toi pour l'enregistrer."
          : err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm text-[#2C1A16]/50">Aujourd'hui · {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
          <h1 className="mt-1 text-3xl font-bold">Comment te sens-tu ?</h1>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/60">Tu peux compléter les éléments que tu souhaites. Rien n'est obligatoire.</p>
        </header>

        <section className="mb-7">
          <h2 className="mb-3 text-lg font-bold text-[#6B2D5C]">🩸 Flux</h2>
          <div className="flex flex-wrap gap-2">
            {fluxOptions.map((option) => (
              <button key={option.value} type="button" aria-pressed={flux === option.value} onClick={() => setFlux(flux === option.value ? null : option.value)}
                className={`rounded-full px-4 py-3 text-sm font-semibold ${flux === option.value ? "bg-[#D96C5B] text-white" : "border border-[#E7DDD8] bg-white"}`}>
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 text-lg font-bold text-[#6B2D5C]">😣 Symptômes et ressentis</h2>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map((option) => {
              const selected = symptoms.includes(option.value);
              return (
                <button key={option.value} type="button" aria-pressed={selected} onClick={() => toggleSymptom(option.value)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold ${selected ? "bg-[#6B2D5C] text-white" : "border border-[#E7DDD8] bg-white"}`}>
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 text-lg font-bold text-[#6B2D5C]">😊 Humeur</h2>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((option) => (
              <button key={option.value} type="button" aria-pressed={mood === option.value} onClick={() => setMood(mood === option.value ? null : option.value)}
                className={`rounded-full px-4 py-3 text-sm font-semibold ${mood === option.value ? "bg-[#D96C5B] text-white" : "border border-[#E7DDD8] bg-white"}`}>
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-7 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#6B2D5C]">⚡ Énergie</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#2C1A16]/55">Basse</span>
            <strong className="text-2xl text-[#D96C5B]">{energy === null ? "Non notée" : energy + "/10"}</strong>
            <span className="text-sm text-[#2C1A16]/55">Haute</span>
          </div>
          <input aria-label="Niveau d'énergie de 0 à 10" type="range" min="0" max="10" value={energy ?? 5} onChange={(event) => setEnergy(Number(event.target.value))} className="mt-4 w-full accent-[#D96C5B]" />
        </section>

        <section className="mb-7 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#6B2D5C]">🌙 Sommeil</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#2C1A16]/55">Heures dormies</span>
            <strong className="text-2xl text-[#6B2D5C]">{sleep === null ? "Non noté" : sleep + " h"}</strong>
          </div>
          <input aria-label="Durée du sommeil de 0 à 16 heures" type="range" min="0" max="16" value={sleep ?? 8} onChange={(event) => setSleep(Number(event.target.value))} className="mt-4 w-full accent-[#6B2D5C]" />
        </section>

        <section className="mb-7">
          <label htmlFor="discharge" className="mb-3 block text-lg font-bold text-[#6B2D5C]">💧 Pertes vaginales (facultatif)</label>
          <select id="discharge" value={discharge} onChange={(event) => setDischarge(event.target.value)} className="w-full rounded-2xl border border-[#E7DDD8] bg-white px-4 py-4 text-sm outline-none focus:border-[#D96C5B]">
            {dischargeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <p className="mt-2 text-xs leading-5 text-[#2C1A16]/45">Les pertes peuvent varier naturellement. Si un changement t'inquiète, s'accompagne de douleur ou d'autres symptômes, demande un avis professionnel.</p>
        </section>

        <section className="mb-7">
          <label htmlFor="notes" className="mb-3 block text-lg font-bold text-[#6B2D5C]">📝 Notes personnelles</label>
          <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} rows={4}
            className="w-full rounded-2xl border border-[#E7DDD8] bg-white px-4 py-4 text-sm leading-6 outline-none focus:border-[#D96C5B]"
            placeholder="Comment te sens-tu aujourd'hui ? Tu peux noter ce qui te semble important..." />
          <p className="mt-1 text-right text-xs text-[#2C1A16]/35">{notes.length}/2000</p>
        </section>

        {message && <div role="status" className="mb-5 rounded-2xl bg-[#EAF3ED] p-4 text-sm font-semibold text-[#35634A]">{message}</div>}
        {error && <div role="alert" className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">{error}</div>}

        <button type="button" onClick={saveLog} disabled={saving} className="w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg disabled:opacity-60">
          {saving ? "Enregistrement..." : "Enregistrer mon suivi"}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-[#2C1A16]/45">Tes observations sont personnelles. Elles aident à suivre ton vécu, mais ne permettent pas de poser un diagnostic.</p>
        <BottomNav />
      </div>
    </main>
  );
}
