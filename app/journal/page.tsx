"use client";

import { useEffect, useState } from "react";
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

type PeriodAction = "start_period" | "end_period" | null;

type ExistingLog = {
  flow: string | null;
  symptoms: string[];
  mood: string | null;
  energy: number | null;
  sleep: number | null;
  discharge: string | null;
  notes: string | null;
};

export default function JournalPage() {
  const [flux, setFlux] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [discharge, setDischarge] = useState("");
  const [notes, setNotes] = useState("");
  const [periodAction, setPeriodAction] = useState<PeriodAction>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadToday() {
      try {
        const response = await fetch("/api/logs", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossible de charger le suivi du jour.");
        const log = data.log as ExistingLog | null;
        if (active && log) {
          setFlux(log.flow);
          setSymptoms(Array.isArray(log.symptoms) ? log.symptoms : []);
          setMood(log.mood);
          setEnergy(log.energy);
          setSleep(log.sleep);
          setDischarge(log.discharge ?? "");
          setNotes(log.notes ?? "");
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Impossible de charger le suivi.");
      } finally {
        if (active) setLoadingExisting(false);
      }
    }
    void loadToday();
    return () => { active = false; };
  }, []);

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
    let journalSaved = false;

    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logDate: getTodayDate(),
          flow: flux,
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
      journalSaved = true;

      if (periodAction) {
        const cycleResponse = await fetch("/api/cycle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: periodAction, date: getTodayDate() }),
        });
        const cycleData = await cycleResponse.json();
        if (!cycleResponse.ok) {
          throw new Error(cycleData.error || "Le journal est enregistré, mais le calendrier n'a pas pu être mis à jour.");
        }
        window.dispatchEvent(new Event("naya:cycle-updated"));
      }

      setPeriodAction(null);
      setMessage("Ton suivi a bien été enregistré dans Naya. 🌸");
    } catch (err) {
      console.error(err);
      if (journalSaved) {
        setMessage("Ton journal est enregistré, mais l'actualisation du calendrier a échoué.");
        setError(err instanceof Error ? err.message : "Réessaie de mettre à jour tes règles.");
      } else {
        setError(
          !navigator.onLine
            ? "Tu es hors connexion. Ton journal n'a pas été envoyé : reconnecte-toi pour l'enregistrer."
            : err instanceof Error ? err.message : "Une erreur est survenue."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm text-[#2C1A16]/50">Aujourd'hui · {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
          {loadingExisting && <p className="mt-2 text-xs text-[#6B2D5C]">Chargement de ton suivi existant...</p>}
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

        <section className="mb-7 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#6B2D5C]">🗓️ Suivi des règles</h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/60">
            Indique séparément si tes règles commencent ou se terminent aujourd'hui. Cela mettra à jour ton calendrier et tes estimations.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <button type="button" aria-pressed={periodAction === "start_period"} onClick={() => setPeriodAction(periodAction === "start_period" ? null : "start_period")}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${periodAction === "start_period" ? "border-[#D96C5B] bg-[#FCEBE7] text-[#6B2D5C]" : "border-[#E7DDD8] bg-white"}`}>
              🩸 Premier jour des règles aujourd'hui
            </button>
            <button type="button" aria-pressed={periodAction === "end_period"} onClick={() => setPeriodAction(periodAction === "end_period" ? null : "end_period")}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${periodAction === "end_period" ? "border-[#D96C5B] bg-[#FCEBE7] text-[#6B2D5C]" : "border-[#E7DDD8] bg-white"}`}>
              ✓ Dernier jour des règles aujourd'hui
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#2C1A16]/45">Ces informations ne sont envoyées qu'après avoir appuyé sur « Enregistrer mon suivi ».</p>
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

        <button type="button" onClick={saveLog} disabled={saving || loadingExisting} className="w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg disabled:opacity-60">
          {saving ? "Enregistrement..." : loadingExisting ? "Chargement..." : "Enregistrer mon suivi"}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-[#2C1A16]/45">Tes observations sont personnelles. Elles aident à suivre ton vécu, mais ne permettent pas de poser un diagnostic.</p>
        <BottomNav />
      </div>
    </main>
  );
}
