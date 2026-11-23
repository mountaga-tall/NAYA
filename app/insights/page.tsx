"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";

type InsightData = {
  configured: boolean;
  averageCycle?: number;
  averagePeriod?: number;
  cycles?: number[];
  trackedCycleCount?: number;
  observedCycleCount?: number;
  cycleMin?: number | null;
  cycleMax?: number | null;
  cycleVariation?: number | null;
  symptoms?: { value: string; label: string; count: number }[];
  moods?: { value: string; label: string; count: number }[];
  averageEnergy?: number | null;
  averageSleep?: number | null;
  logsByMonth?: { month: string; count: number }[];
  totalLogs?: number;
  message?: string;
};

export default function InsightsPage() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadInsights() {
      try {
        const response = await fetch("/api/insights", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Impossible de récupérer les tendances.");
        if (active) setData(result);
      } catch (error) {
        console.error(error);
        if (active) setData({ configured: false });
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadInsights();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
        <div className="mx-auto max-w-md"><p className="text-sm text-[#2C1A16]/60">Chargement de tes données...</p></div>
      </main>
    );
  }

  if (!data?.configured) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <header className="mb-8"><p className="text-sm text-[#2C1A16]/50">Tes données</p><h1 className="mt-1 text-3xl font-bold">Insights</h1></header>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-[#2C1A16]/70">Commence à enregistrer tes cycles et ton journal pour faire apparaître tes tendances personnelles.</p>
          </section>
          <BottomNav />
        </div>
      </main>
    );
  }

  const cycles = data.cycles ?? [];
  const maxCycle = Math.max(...(cycles.length ? cycles : [35]), 35);
  const maxMonthlyLogs = Math.max(...(data.logsByMonth ?? []).map((item) => item.count), 1);

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-7">
          <p className="text-sm text-[#2C1A16]/50">Tes données personnelles</p>
          <h1 className="mt-1 text-3xl font-bold">Mes tendances</h1>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/60">Des observations simples pour mieux comprendre ton rythme au fil des mois.</p>
        </header>

        <section className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2C1A16]/50">Cycle moyen</p>
            <p className="mt-2 text-3xl font-bold text-[#D96C5B]">{data.averageCycle ?? "—"}<span className="ml-1 text-sm text-[#2C1A16]/50">jours</span></p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2C1A16]/50">Règles moyennes</p>
            <p className="mt-2 text-3xl font-bold text-[#6B2D5C]">{data.averagePeriod ?? "—"}<span className="ml-1 text-sm text-[#2C1A16]/50">jours</span></p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2C1A16]/50">Cycles suivis</p>
            <p className="mt-2 text-3xl font-bold">{data.trackedCycleCount ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2C1A16]/50">Journaux</p>
            <p className="mt-2 text-3xl font-bold">{data.totalLogs ?? 0}</p>
          </div>
        </section>

        <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Durée de tes cycles enregistrés</h2>
          {cycles.length > 0 ? (
            <div className="mt-6 flex h-48 items-end justify-between gap-3">
              {cycles.map((cycle, index) => {
                const height = Math.max((cycle / maxCycle) * 100, 8) + "%";
                return (
                  <div key={index} className="flex h-full flex-1 flex-col items-center justify-end">
                    <span className="mb-2 text-xs font-semibold text-[#2C1A16]/60">{cycle} j</span>
                    <div className="w-full max-w-8 rounded-t-xl bg-[#6B2D5C]" style={{ height }} />
                    <span className="mt-2 text-xs text-[#2C1A16]/40">C{index + 1}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#2C1A16]/50">Pas encore assez de dates de début enregistrées pour comparer plusieurs cycles.</p>
          )}
          <div className="mt-5 rounded-2xl bg-[#FDFBF7] p-4">
            <p className="text-sm font-bold">Variation observée</p>
            <p className="mt-1 text-sm leading-6 text-[#2C1A16]/65">
              {data.cycleMin !== null && data.cycleMin !== undefined && data.cycleMax !== null && data.cycleMax !== undefined
                ? "Les cycles enregistrés vont de " + data.cycleMin + " à " + data.cycleMax + " jours (écart de " + (data.cycleVariation ?? 0) + " jours)."
                : "Ajoute plusieurs débuts de règles pour observer une éventuelle variation."}
            </p>
          </div>
        </section>

        <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Régularité de ton suivi</h2>
          {data.logsByMonth && data.logsByMonth.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.logsByMonth.map((item) => (
                <div key={item.month}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-semibold">{item.month}</span>
                    <span className="text-[#2C1A16]/50">{item.count} entrée(s)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F4D8D8]">
                    <div className="h-full rounded-full bg-[#D96C5B]" style={{ width: (item.count / maxMonthlyLogs * 100) + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="mt-3 text-sm text-[#2C1A16]/50">Tes journaux apparaîtront ici.</p>}
        </section>

        <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Symptômes les plus notés</h2>
          {data.symptoms && data.symptoms.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.symptoms.map((symptom) => (
                <div key={symptom.value} className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] p-4">
                  <span className="text-sm font-semibold">{symptom.label}</span>
                  <span className="text-xs text-[#2C1A16]/50">{symptom.count} fois</span>
                </div>
              ))}
            </div>
          ) : <p className="mt-4 text-sm text-[#2C1A16]/50">Aucun symptôme enregistré pour le moment.</p>}
        </section>

        <section className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-[#2C1A16]/50">Énergie moyenne</p>
            <p className="mt-2 text-2xl font-bold text-[#D96C5B]">{data.averageEnergy ?? "—"}<span className="ml-1 text-xs">/10</span></p>
            <p className="mt-1 text-[11px] text-[#2C1A16]/40">Sur {data.energyLogCount ?? 0} entrée(s)</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-[#2C1A16]/50">Sommeil moyen</p>
            <p className="mt-2 text-2xl font-bold text-[#6B2D5C]">{data.averageSleep ?? "—"}<span className="ml-1 text-xs">h</span></p>
            <p className="mt-1 text-[11px] text-[#2C1A16]/40">Sur {data.sleepLogCount ?? 0} entrée(s)</p>
          </div>
        </section>

        <section className="mb-5 rounded-2xl bg-[#F4D8D8] p-5">
          <p className="text-sm leading-6 text-[#2C1A16]/70">{data.message}</p>
        </section>
        <p className="mt-6 text-center text-xs leading-5 text-[#2C1A16]/45">
          Ces statistiques décrivent uniquement les informations que tu as saisies. Elles ne constituent pas un diagnostic et ne remplacent pas un avis médical.
        </p>
        <BottomNav />
      </div>
    </main>
  );
}
