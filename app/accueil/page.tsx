"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";

type Goal = "TRACK" | "PREVENT" | "CONCEIVE";

type CycleData = {
  configured: boolean;
  firstName?: string | null;
  primaryGoal?: Goal;
  goals?: Goal[];
  currentCycleDay?: number;
  nextPeriodDate?: string;
  daysUntilNextPeriod?: number;
  cycleLength?: number;
  avgPeriodLength?: number;
  cycleProgressPercent?: number;
  status?: string;
  dataNote?: string;
};

type TodayLog = {
  flow: string | null;
  mood: string | null;
  symptoms?: string[];
  energy?: number | null;
  sleep?: number | null;
};

const goalLabels: Record<Goal, string> = {
  TRACK: "Suivre mon cycle",
  PREVENT: "Éviter une grossesse",
  CONCEIVE: "Essayer de concevoir",
};

const goalAdvice: Record<Goal, { title: string; body: string; icon: string }> = {
  TRACK: {
    title: "Apprendre à reconnaître ton rythme",
    body: "Note les jours de règles, le flux, l'humeur et les symptômes. Les tendances deviennent plus utiles après plusieurs cycles.",
    icon: "🌸",
  },
  PREVENT: {
    title: "Ta protection avant tout",
    body: "Les estimations de calendrier de Naya ne préviennent pas une grossesse. Pour choisir une contraception, demande conseil à un professionnel de santé.",
    icon: "🛡️",
  },
  CONCEIVE: {
    title: "Ton projet, à ton rythme",
    body: "Observe tes cycles sans pression. Les dates autour de l'ovulation sont approximatives et ne garantissent pas une grossesse.",
    icon: "👶",
  },
};

export default function AccueilPage() {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [todayLog, setTodayLog] = useState<TodayLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [cycleResponse, logResponse] = await Promise.all([
          fetch("/api/cycle", { cache: "no-store" }),
          fetch("/api/logs", { cache: "no-store" }),
        ]);

        const cycle = await cycleResponse.json();
        const logData = await logResponse.json();

        if (!cycleResponse.ok) {
          throw new Error(cycle.error || "Impossible de récupérer le cycle.");
        }
        if (!logResponse.ok) {
          throw new Error(logData.error || "Impossible de récupérer le suivi.");
        }

        if (active) {
          setCycleData(cycle);
          setTodayLog(logData.log);
          setLoadError("");
        }
      } catch (error) {
        if (active) {
          console.error(error);
          setCycleData({ configured: false });
          setTodayLog(null);
          setLoadError(error instanceof Error ? error.message : "Certaines données ne sont pas disponibles.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <p className="text-sm text-[#2C1A16]/60">Préparation de ton espace...</p>
        </div>
      </main>
    );
  }

  if (!cycleData?.configured) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <header className="mb-8">
            <p className="text-sm text-[#2C1A16]/60">Bonjour 👋</p>
            <h1 className="mt-1 text-2xl font-bold">Bienvenue sur Naya</h1>
          </header>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-[#2C1A16]/70">
              Configure ton cycle pour afficher les premières estimations adaptées à ton rythme.
            </p>
            <Link href="/onboarding" className="mt-6 block w-full rounded-2xl bg-[#D96C5B] px-6 py-4 text-center font-bold text-white shadow-lg">
              Configurer mon cycle
            </Link>
          </section>
          {loadError && <p className="mt-4 text-xs text-[#8A4B24]">{loadError}</p>}
          <BottomNav />
        </div>
      </main>
    );
  }

  const primaryGoal = cycleData.primaryGoal ?? "TRACK";
  const advice = goalAdvice[primaryGoal];
  const nextPeriodLabel = cycleData.nextPeriodDate
    ? new Date(cycleData.nextPeriodDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
    : "à estimer";

  const flowLabel =
    todayLog?.flow === "LIGHT" ? "Léger" :
    todayLog?.flow === "MEDIUM" ? "Moyen" :
    todayLog?.flow === "HEAVY" ? "Abondant" :
    todayLog?.flow === "SPOTTING" ? "Spotting" : "Pas encore indiqué";

  const moodLabel =
    todayLog?.mood === "CALM" ? "Calme" :
    todayLog?.mood === "HAPPY" ? "Heureuse" :
    todayLog?.mood === "SAD" ? "Triste" :
    todayLog?.mood === "IRRITABLE" ? "Irritable" :
    todayLog?.mood === "ANXIOUS" ? "Anxieuse" : "Pas encore indiquée";

  const hasTodayLog = Boolean(
    todayLog?.flow || todayLog?.mood ||
    (todayLog?.symptoms?.length ?? 0) > 0 ||
    todayLog?.energy !== null || todayLog?.sleep !== null
  );

  const daysUntil = cycleData.daysUntilNextPeriod;
  const progress = Math.max(0, Math.min(100, cycleData.cycleProgressPercent ?? 0));

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#2C1A16]/60">Bonjour 👋</p>
            <h1 className="mt-1 text-2xl font-bold">{cycleData.firstName || "Bienvenue"}</h1>
            <p className="mt-1 text-xs text-[#2C1A16]/45">Ton espace personnel Naya</p>
          </div>
          <Link href="/profil" aria-label="Ouvrir mon profil" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm">👤</Link>
        </header>

        <section className="mb-5 rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#6B2D5C]">Ton cycle aujourd'hui</p>
          <div className="mx-auto mt-5 flex h-48 w-48 items-center justify-center rounded-full border-[11px] border-[#F4D8D8] relative">
            <div className="absolute inset-[-11px] rounded-full border-[11px] border-transparent border-t-[#D96C5B]" style={{ transform: "rotate(" + Math.round(progress * 3.6) + "deg)" }} />
            <div>
              <p className="text-sm text-[#2C1A16]/50">Jour du cycle</p>
              <p className="mt-1 text-5xl font-bold text-[#D96C5B]">J{cycleData.currentCycleDay ?? 1}</p>
              <p className="mt-2 text-sm font-medium text-[#6B2D5C]">{cycleData.status || "Cycle en cours"}</p>
            </div>
          </div>
          <p className="mt-5 text-sm text-[#2C1A16]/70">
            Prochaines règles estimées le <strong>{nextPeriodLabel}</strong>.
          </p>
          {typeof daysUntil === "number" && (
            <p className="mt-1 text-xs text-[#2C1A16]/45">
              {daysUntil > 0 ? "Dans environ " + daysUntil + " jour(s)." : daysUntil === 0 ? "Date estimée aujourd'hui." : "La date estimée est passée : mets à jour ton suivi si nécessaire."}
            </p>
          )}
          <p className="mt-3 text-[11px] leading-5 text-[#2C1A16]/40">{cycleData.dataNote}</p>
        </section>

        <section className="mb-5 rounded-3xl bg-[#F4D8D8] p-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{advice.icon}</span>
            <p className="text-xs font-bold uppercase tracking-wide text-[#6B2D5C]">Ton objectif principal</p>
          </div>
          <h2 className="mt-2 text-lg font-bold">{goalLabels[primaryGoal]}</h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/75">{advice.body}</p>
          <Link href="/profil" className="mt-3 inline-flex text-sm font-bold text-[#6B2D5C] underline underline-offset-4">
            Gérer mes objectifs →
          </Link>
        </section>

        <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#6B2D5C]">Mon suivi du jour</h2>
            <span className={hasTodayLog ? "text-xs font-bold text-[#4E7862]" : "text-xs font-semibold text-[#2C1A16]/40"}>
              {hasTodayLog ? "Enregistré" : "À compléter"}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#FDFBF7] p-4">
              <p className="text-2xl">🩸</p>
              <p className="mt-2 text-sm font-semibold">Flux</p>
              <p className="mt-1 text-xs text-[#2C1A16]/55">{flowLabel}</p>
            </div>
            <div className="rounded-2xl bg-[#FDFBF7] p-4">
              <p className="text-2xl">😊</p>
              <p className="mt-2 text-sm font-semibold">Humeur</p>
              <p className="mt-1 text-xs text-[#2C1A16]/55">{moodLabel}</p>
            </div>
          </div>
          <Link href="/journal" className="mt-4 block w-full rounded-2xl bg-[#D96C5B] px-5 py-4 text-center font-bold text-white">
            {hasTodayLog ? "Compléter mon journal" : "Ajouter mon suivi du jour"}
          </Link>
        </section>

        <section className="mb-5 grid grid-cols-2 gap-3">
          <Link href="/calendrier" className="rounded-2xl bg-white p-4 shadow-sm">
            <span className="text-2xl">📅</span>
            <h2 className="mt-2 text-sm font-bold">Mon calendrier</h2>
            <p className="mt-1 text-xs leading-5 text-[#2C1A16]/50">Voir mes repères et estimations</p>
          </Link>
          <Link href="/insights" className="rounded-2xl bg-white p-4 shadow-sm">
            <span className="text-2xl">📊</span>
            <h2 className="mt-2 text-sm font-bold">Mes tendances</h2>
            <p className="mt-1 text-xs leading-5 text-[#2C1A16]/50">Comparer les cycles et symptômes</p>
          </Link>
        </section>

        <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-2xl">📰</p>
          <h2 className="mt-2 font-bold text-[#6B2D5C]">Conseils & actualités</h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/65">Des informations sourcées et des conseils adaptés à tes objectifs.</p>
          <Link href="/conseils" className="mt-4 inline-flex rounded-xl bg-[#F4D8D8] px-4 py-3 text-sm font-bold text-[#6B2D5C]">
            Découvrir mes conseils →
          </Link>
        </section>

        <section className="mb-5 rounded-3xl border border-[#E7DDD8] bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h2 className="font-bold text-[#6B2D5C]">Repères santé</h2>
              <p className="mt-1 text-xs text-[#2C1A16]/50">Des réponses pédagogiques aux questions courantes.</p>
            </div>
          </div>
          <Link href="/assistant" className="mt-4 inline-flex text-sm font-bold text-[#6B2D5C] underline underline-offset-4">
            Ouvrir l’assistant d’orientation →
          </Link>
        </section>

        {loadError && <p className="mb-4 text-xs text-[#8A4B24]">{loadError}</p>}
        <p className="mb-5 text-center text-[11px] leading-5 text-[#2C1A16]/40">
          Les prédictions sont approximatives. Naya ne diagnostique pas et ne remplace pas une contraception ni un avis médical.
        </p>
        <BottomNav />
      </div>
    </main>
  );
}
