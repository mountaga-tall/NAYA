"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";

type CycleData = {
  configured: boolean;
  firstName?: string | null;
  currentCycleDay?: number;
  nextPeriodDate?: string;
  status?: string;
};

type TodayLog = {
  flow: string | null;
  mood: string | null;
};

export default function AccueilPage() {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [todayLog, setTodayLog] = useState<TodayLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cycleResponse, logResponse] = await Promise.all([
          fetch("/api/cycle", {
            cache: "no-store",
          }),
          fetch("/api/logs", {
            cache: "no-store",
          }),
        ]);

        const cycle = await cycleResponse.json();
        const logData = await logResponse.json();

        if (!cycleResponse.ok) {
          throw new Error(
            cycle.error || "Impossible de récupérer le cycle."
          );
        }

        if (!logResponse.ok) {
          throw new Error(
            logData.error || "Impossible de récupérer le suivi."
          );
        }

        setCycleData(cycle);
        setTodayLog(logData.log);
      } catch (error) {
        console.error(error);

        setCycleData({
          configured: false,
        });

        setTodayLog(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <p className="text-sm text-[#2C1A16]/60">
            Chargement de ton cycle...
          </p>
        </div>
      </main>
    );
  }

  if (!cycleData?.configured) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <header className="mb-8">
            <p className="text-sm text-[#2C1A16]/60">
              Bonjour 👋
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Bienvenue sur Naya
            </h1>
          </header>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-[#2C1A16]/70">
              Configure ton cycle pour afficher les estimations
              adaptées à ton rythme.
            </p>

            <Link
              href="/onboarding"
              className="mt-6 block w-full rounded-2xl bg-[#D96C5B] px-6 py-4 text-center font-bold text-white shadow-lg"
            >
              Configurer mon cycle
            </Link>
          </section>

          <BottomNav />
        </div>
      </main>
    );
  }

  const nextPeriodLabel = cycleData.nextPeriodDate
    ? new Date(cycleData.nextPeriodDate).toLocaleDateString(
        "fr-FR",
        {
          day: "numeric",
          month: "long",
        }
      )
    : "-";

  const flowLabel =
    todayLog?.flow === "LIGHT"
      ? "Léger"
      : todayLog?.flow === "MEDIUM"
        ? "Moyen"
        : todayLog?.flow === "HEAVY"
          ? "Abondant"
          : todayLog?.flow === "SPOTTING"
            ? "Spotting"
            : "Pas encore indiqué";

  const moodLabel =
    todayLog?.mood === "CALM"
      ? "Calme"
      : todayLog?.mood === "HAPPY"
        ? "Heureuse"
        : todayLog?.mood === "SAD"
          ? "Triste"
          : todayLog?.mood === "IRRITABLE"
            ? "Irritable"
            : todayLog?.mood === "ANXIOUS"
              ? "Anxieuse"
              : "Pas encore indiquée";

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#2C1A16]/60">
              Bonjour 👋
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {cycleData.firstName || "Amina"}
            </h1>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
            🔔
          </div>
        </header>

        <section className="mb-6 rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#6B2D5C]">
            Aujourd'hui
          </p>

          <div className="mx-auto mt-5 flex h-56 w-56 items-center justify-center rounded-full border-[12px] border-[#F4D8D8]">
            <div>
              <p className="text-sm text-[#2C1A16]/50">
                Jour du cycle
              </p>

              <p className="mt-1 text-5xl font-bold text-[#D96C5B]">
                J{cycleData.currentCycleDay ?? 1}
              </p>

              <p className="mt-2 text-sm font-medium text-[#6B2D5C]">
                {cycleData.status || "Cycle en cours"}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-[#2C1A16]/70">
            Tes prochaines règles sont estimées le{" "}
            <strong>{nextPeriodLabel}</strong>.
          </p>
        </section>

        <Link
          href="/journal"
          className="mb-6 block w-full rounded-2xl bg-[#D96C5B] px-6 py-4 text-center font-bold text-white shadow-lg"
        >
          + Ajouter mes symptômes
        </Link>

        <section className="mb-6">
          <h2 className="mb-3 text-lg font-bold">
            Aujourd'hui
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-2xl">🩸</p>

              <p className="mt-2 text-sm font-semibold">
                Flux
              </p>

              <p className="mt-1 text-xs text-[#2C1A16]/50">
                {flowLabel}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-2xl">😊</p>

              <p className="mt-2 text-sm font-semibold">
                Humeur
              </p>

              <p className="mt-1 text-xs text-[#2C1A16]/50">
                {moodLabel}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-[#F4D8D8] p-5">
          <h2 className="font-bold text-[#6B2D5C]">
            💡 À savoir
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/75">
            Les informations affichées par Naya sont des
            estimations basées sur les données que tu renseignes.
          </p>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}