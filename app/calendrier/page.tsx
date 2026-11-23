"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

type PeriodWindow = { start: string; end: string; estimated?: boolean };

type CycleData = {
  configured: boolean;
  currentCycleDay?: number;
  cycleStartDate?: string;
  nextPeriodDate?: string;
  nextPeriodEndDate?: string;
  periods?: PeriodWindow[];
  ovulationDate?: string;
  avgPeriodLength?: number;
  fertileWindow?: { start: string; end: string };
  disclaimer?: string;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayFirstOffset = (firstDay.getDay() + 6) % 7;
  return { mondayFirstOffset, daysInMonth };
}

export default function CalendrierPage() {
  const today = new Date();
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayDate, setDisplayDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  useEffect(() => {
    let active = true;
    async function loadCycle() {
      try {
        const response = await fetch("/api/cycle", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossible de récupérer le cycle.");
        if (active) setCycleData(data);
      } catch (error) {
        console.error(error);
        if (active) setCycleData({ configured: false });
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadCycle();
    return () => { active = false; };
  }, []);

  const calendar = useMemo(() => getMonthDays(displayDate.getFullYear(), displayDate.getMonth()), [displayDate]);

  const periodKeys = useMemo(() => {
    const keys = new Set<string>();
    const windows = cycleData?.periods ?? [];
    for (const window of windows) {
      let cursor = new Date(window.start);
      const end = new Date(window.end);
      cursor.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      for (let guard = 0; cursor <= end && guard < 15; guard += 1) {
        keys.add(toDateKey(cursor));
        cursor = addDays(cursor, 1);
      }
    }
    if (windows.length === 0 && cycleData?.cycleStartDate) {
      const start = new Date(cycleData.cycleStartDate);
      for (let index = 0; index < (cycleData.avgPeriodLength ?? 5); index += 1) {
        keys.add(toDateKey(addDays(start, index)));
      }
    }
    return keys;
  }, [cycleData]);

  const periodStartKeys = useMemo(() => {
    return new Set((cycleData?.periods ?? []).map((window) => toDateKey(new Date(window.start))));
  }, [cycleData]);

  const fertileStartKey = cycleData?.fertileWindow?.start ? toDateKey(new Date(cycleData.fertileWindow.start)) : null;
  const fertileEndKey = cycleData?.fertileWindow?.end ? toDateKey(new Date(cycleData.fertileWindow.end)) : null;
  const ovulationKey = cycleData?.ovulationDate ? toDateKey(new Date(cycleData.ovulationDate)) : null;
  const nextPeriodKey = cycleData?.nextPeriodDate ? toDateKey(new Date(cycleData.nextPeriodDate)) : null;
  const nextPeriodEndKey = cycleData?.nextPeriodEndDate ? toDateKey(new Date(cycleData.nextPeriodEndDate)) : nextPeriodKey;
  const todayKey = toDateKey(today);

  const isDateInFertileWindow = (dateKey: string) =>
    Boolean(fertileStartKey && fertileEndKey && dateKey >= fertileStartKey && dateKey <= fertileEndKey);

  const monthLabel = displayDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const nextPeriodLabel = cycleData?.nextPeriodDate
    ? new Date(cycleData.nextPeriodDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  if (loading) {
    return <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]"><div className="mx-auto max-w-md"><p className="text-sm text-[#2C1A16]/60">Chargement du calendrier...</p></div></main>;
  }

  if (!cycleData?.configured) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <header className="mb-8"><p className="text-sm text-[#2C1A16]/50">Calendrier</p><h1 className="mt-1 text-2xl font-bold">Ton calendrier</h1></header>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-[#2C1A16]/70">Configure ton cycle pour afficher les dates estimées dans ton calendrier.</p>
            <Link href="/onboarding" className="mt-6 block w-full rounded-2xl bg-[#D96C5B] px-6 py-4 text-center font-bold text-white shadow-lg">Configurer mon cycle</Link>
          </section>
          <BottomNav />
        </div>
      </main>
    );
  }

  const totalCells = calendar.mondayFirstOffset + calendar.daysInMonth;

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div><p className="text-sm text-[#2C1A16]/50">Calendrier</p><h1 className="mt-1 text-2xl font-bold capitalize">{monthLabel}</h1></div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm" aria-label="Mois précédent">←</button>
            <button type="button" onClick={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm" aria-label="Mois suivant">→</button>
          </div>
        </header>

        <section className="mb-6 flex flex-wrap gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#D96C5B]" /> Début de règles noté</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#FCEBE7] border border-[#E8C7A5]" /> Durée estimée</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#F4D8D8]" /> Fertilité estimée</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-[#D96C5B] bg-white" /> Ovulation estimée</div>
        </section>

        <section className="rounded-3xl bg-white p-4 shadow-sm">
          <div className="mb-4 grid grid-cols-7 text-center text-xs font-bold uppercase text-[#2C1A16]/40">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: totalCells }, (_, index) => {
              if (index < calendar.mondayFirstOffset) return <div key={"empty-" + index} className="h-10 w-10" />;
              const day = index - calendar.mondayFirstOffset + 1;
              const currentDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
              const dateKey = toDateKey(currentDate);
              const isPeriod = periodKeys.has(dateKey);
              const isFertile = isDateInFertileWindow(dateKey);
              const isOvulation = dateKey === ovulationKey;
              const isToday = dateKey === todayKey;
              const isNextPeriod = Boolean(nextPeriodKey && nextPeriodEndKey && dateKey >= nextPeriodKey && dateKey <= nextPeriodEndKey);

              let classes = "relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold";
              if (isPeriod && periodStartKeys.has(dateKey)) classes += " bg-[#D96C5B] text-white";
              else if (isPeriod) classes += " border border-[#E8C7A5] bg-[#FCEBE7] text-[#6B2D5C]";
              else if (isNextPeriod) classes += " border border-[#D96C5B] bg-[#FCEBE7] text-[#6B2D5C]";
              else if (isOvulation) classes += " border-2 border-[#D96C5B] text-[#D96C5B]";
              else if (isFertile) classes += " bg-[#F4D8D8] text-[#2C1A16]";
              else classes += " text-[#2C1A16]/70";

              if (isToday && !isPeriod && !isNextPeriod && !isOvulation) classes += " ring-2 ring-[#6B2D5C]/30";

              return (
                <div key={dateKey} className="flex justify-center">
                  <div className={classes}>
                    {day}
                    {isNextPeriod && dateKey === nextPeriodKey && <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#6B2D5C]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#6B2D5C]">Prochaines règles estimées</p>
          <p className="mt-2 text-2xl font-bold text-[#D96C5B]">{nextPeriodLabel}</p>
          <p className="mt-1 text-sm leading-6 text-[#2C1A16]/50">
            {cycleData.disclaimer || "Cette date est une estimation basée sur les informations enregistrées dans Naya."}
          </p>
        </section>

        <Link href="/journal" className="mt-6 block w-full rounded-2xl bg-[#D96C5B] px-6 py-4 text-center font-bold text-white">+ Ajouter mon suivi</Link>
        <Link href="/profil" className="mt-3 block w-full rounded-2xl border border-[#E7DDD8] bg-white px-6 py-4 text-center font-bold text-[#6B2D5C]">✏️ Modifier mes objectifs et préférences</Link>
        <BottomNav />
      </div>
    </main>
  );
}
