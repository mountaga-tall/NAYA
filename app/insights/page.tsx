"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";

type InsightData = {
  configured: boolean;
  averageCycle?: number;
  averagePeriod?: number;
  cycles?: number[];
  symptoms?: {
    value: string;
    label: string;
    count: number;
  }[];
  moods?: {
    value: string;
    label: string;
    count: number;
  }[];
  totalLogs?: number;
  message?: string;
};

export default function InsightsPage() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const response = await fetch("/api/insights", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Impossible de récupérer les insights."
          );
        }

        setData(result);
      } catch (error) {
        console.error(error);

        setData({
          configured: false,
        });
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <p className="text-sm text-[#2C1A16]/60">
            Chargement de tes données...
          </p>
        </div>
      </main>
    );
  }

  if (!data?.configured) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <header className="mb-8">
            <p className="text-sm text-[#2C1A16]/50">
              Tes données
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Insights
            </h1>
          </header>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-[#2C1A16]/70">
              Configure ton cycle et commence à enregistrer
              tes données pour voir tes tendances.
            </p>
          </section>

          <BottomNav />
        </div>
      </main>
    );
  }

  const cycles = data.cycles ?? [];

  const maxCycle = Math.max(
    ...(cycles.length > 0 ? cycles : [35]),
    35
  );

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm text-[#2C1A16]/50">
            Tes données
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Insights
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/60">
            Des tendances simples pour mieux comprendre ton rythme.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2C1A16]/50">
              Cycle moyen
            </p>

            <p className="mt-2 text-3xl font-bold text-[#D96C5B]">
              {data.averageCycle ?? "-"}
              <span className="ml-1 text-sm text-[#2C1A16]/50">
                jours
              </span>
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2C1A16]/50">
              Règles moyennes
            </p>

            <p className="mt-2 text-3xl font-bold text-[#6B2D5C]">
              {data.averagePeriod ?? "-"}
              <span className="ml-1 text-sm text-[#2C1A16]/50">
                jours
              </span>
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Durée de tes cycles enregistrés
          </h2>

          {cycles.length > 0 ? (
            <div className="mt-6 flex h-48 items-end justify-between gap-3">
              {cycles.map((cycle, index) => {
                const height = `${Math.max(
                  (cycle / maxCycle) * 100,
                  8
                )}%`;

                return (
                  <div
                    key={`${cycle}-${index}`}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >
                    <span className="mb-2 text-xs font-semibold text-[#2C1A16]/60">
                      {cycle}j
                    </span>

                    <div
                      className="w-full max-w-8 rounded-t-xl bg-[#6B2D5C]"
                      style={{ height }}
                    />

                    <span className="mt-2 text-xs text-[#2C1A16]/40">
                      C{index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#2C1A16]/50">
              Pas encore assez de cycles enregistrés.
            </p>
          )}
        </section>

        <section className="mb-6 rounded-3xl bg-[#F4D8D8] p-5">
          <h2 className="font-bold text-[#6B2D5C]">
            💡 Ce que montrent tes données
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/75">
            {cycles.length === 1
              ? `Naya dispose actuellement d'un cycle de ${cycles[0]} jours enregistré. Plus tu renseigneras de cycles, plus les tendances pourront être comparées.`
              : `Tes données actuelles permettent de suivre ${cycles.length} cycles. L'évolution sera plus informative avec davantage d'enregistrements.`}
          </p>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Symptômes récurrents
          </h2>

          {data.symptoms && data.symptoms.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.symptoms.map((symptom) => (
                <div
                  key={symptom.value}
                  className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] p-4"
                >
                  <span className="text-sm font-semibold">
                    {symptom.label}
                  </span>

                  <span className="text-xs text-[#2C1A16]/50">
                    {symptom.count} fois
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#2C1A16]/50">
              Aucun symptôme enregistré pour le moment.
            </p>
          )}
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Humeurs enregistrées
          </h2>

          {data.moods && data.moods.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.moods.map((mood) => (
                <div
                  key={mood.value}
                  className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] p-4"
                >
                  <span className="text-sm font-semibold">
                    {mood.label}
                  </span>

                  <span className="text-xs text-[#2C1A16]/50">
                    {mood.count} fois
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#2C1A16]/50">
              Aucune humeur enregistrée pour le moment.
            </p>
          )}
        </section>

        <section className="mb-6 rounded-2xl bg-[#F4D8D8] p-5">
          <p className="text-sm leading-6 text-[#2C1A16]/70">
            {data.totalLogs ?? 0} suivi
            {data.totalLogs === 1 ? "" : "s"} enregistré
            {data.totalLogs === 1 ? "" : "s"} dans Naya.
          </p>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-[#2C1A16]/45">
          {data.message ||
            "Ces observations sont basées sur les données que tu renseignes. Elles ne constituent pas un diagnostic médical."}
        </p>

        <BottomNav />
      </div>
    </main>
  );
}