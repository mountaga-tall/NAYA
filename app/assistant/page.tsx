"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

type Topic = "late" | "pain" | "contraception" | "fertility" | "pregnancy";

const topics: { id: Topic; title: string; icon: string }[] = [
  { id: "late", title: "Mes règles sont en retard", icon: "📅" },
  { id: "pain", title: "J'ai des douleurs importantes", icon: "🩷" },
  { id: "contraception", title: "Je veux éviter une grossesse", icon: "🛡️" },
  { id: "fertility", title: "Je veux comprendre l'ovulation", icon: "🌱" },
  { id: "pregnancy", title: "Je prépare une grossesse", icon: "👶" },
];

const answers: Record<Topic, { title: string; paragraphs: string[]; action: string; href: string }> = {
  late: {
    title: "Un retard peut avoir plusieurs explications",
    paragraphs: [
      "Un cycle peut varier d'un mois à l'autre. Le stress, un changement de rythme, une maladie, certains traitements ou une grossesse possible peuvent intervenir.",
      "Si une grossesse est possible, un test de grossesse réalisé selon sa notice peut aider à clarifier la situation. Si le retard se répète ou t'inquiète, demande conseil à un professionnel de santé.",
      "Naya ne peut pas déterminer la cause d'un retard à partir du calendrier."
    ],
    action: "Consulter mon calendrier",
    href: "/calendrier"
  },
  pain: {
    title: "La douleur mérite d'être prise au sérieux",
    paragraphs: [
      "Des crampes peuvent accompagner les règles, mais une douleur nouvelle, très intense, qui s'aggrave ou t'empêche de vivre normalement mérite un avis médical.",
      "Si la douleur est soudaine ou très forte, ou s'accompagne d'un malaise, d'un évanouissement, de fièvre ou de saignements importants, recherche rapidement une aide médicale.",
      "Note la date, l'intensité et les symptômes associés dans ton journal pour pouvoir les décrire au soignant."
    ],
    action: "Noter mes symptômes",
    href: "/journal"
  },
  contraception: {
    title: "Le calendrier Naya n'est pas une contraception",
    paragraphs: [
      "Les dates d'ovulation et de fertilité affichées sont des estimations. Elles peuvent varier d'un cycle à l'autre et ne permettent pas d'identifier des jours sans risque.",
      "Il existe plusieurs méthodes contraceptives. Un professionnel de santé ou un centre de planification familiale peut t'aider à choisir celle qui correspond à ta santé et à tes préférences.",
      "Le préservatif aide également à réduire le risque d'infections sexuellement transmissibles."
    ],
    action: "Lire les conseils de prévention",
    href: "/conseils"
  },
  fertility: {
    title: "L'ovulation n'arrive pas toujours au même jour",
    paragraphs: [
      "L'ovulation survient souvent environ deux semaines avant les prochaines règles, mais le moment exact peut changer et n'est pas nécessairement le 14e jour.",
      "Une estimation dans Naya ne confirme pas qu'une ovulation a eu lieu. Les observations sur plusieurs cycles donnent davantage de contexte, sans rendre une date certaine.",
      "Si tes cycles sont très irréguliers ou si tu as une question médicale, un professionnel peut t'accompagner."
    ],
    action: "Voir mes estimations",
    href: "/calendrier"
  },
  pregnancy: {
    title: "Préparer une grossesse avec des repères fiables",
    paragraphs: [
      "Un rendez-vous préconceptionnel permet de discuter des traitements en cours, des maladies chroniques, des vaccins et des dépistages. N'arrête pas un traitement prescrit sans avis médical.",
      "Le CDC recommande généralement 400 microgrammes d'acide folique par jour aux personnes susceptibles de devenir enceintes. Des situations particulières nécessitent un avis médical individuel.",
      "La conception peut prendre du temps et les difficultés ne sont pas une faute personnelle. Si tu es inquiète, demande conseil."
    ],
    action: "Lire les conseils conception",
    href: "/conseils"
  }
};


const sources: Record<Topic, { label: string; url: string }[]> = {
  late: [
    { label: "OMS — Santé menstruelle", url: "https://www.who.int/fr/news-room/fact-sheets/detail/menstrual-health" },
    { label: "NHS — Règles irrégulières", url: "https://www.nhs.uk/conditions/irregular-periods/" },
  ],
  pain: [
    { label: "OMS — Santé menstruelle", url: "https://www.who.int/fr/news-room/fact-sheets/detail/menstrual-health" },
    { label: "NHS — Douleurs de règles", url: "https://www.nhs.uk/conditions/period-pain/" },
  ],
  contraception: [
    { label: "OMS — Recommandations contraceptives, septembre 2026", url: "https://www.who.int/fr/news/item/23-09-2026-who-expands-safe-options-for-contraception" },
    { label: "OMS — Planification familiale et contraception", url: "https://www.who.int/fr/news-room/fact-sheets/detail/family-planning-contraception/" },
  ],
  fertility: [
    { label: "NHS — Essayer de tomber enceinte", url: "https://www.nhs.uk/pregnancy/trying-for-a-baby/" },
    { label: "OMS — Santé menstruelle", url: "https://www.who.int/fr/news-room/fact-sheets/detail/menstrual-health" },
  ],
  pregnancy: [
    { label: "CDC — Acide folique et sources alimentaires", url: "https://www.cdc.gov/folic-acid/about/intake-and-sources.html" },
    { label: "OMS — Ligne directrice sur l'infertilité", url: "https://www.who.int/fr/publications/i/item/B09599" },
  ],
};

export default function AssistantPage() {
  const [selected, setSelected] = useState<Topic | null>(null);
  const answer = selected ? answers[selected] : null;

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-7">
          <p className="text-sm font-semibold text-[#6B2D5C]">REPÈRES SANTÉ</p>
          <h1 className="mt-2 text-3xl font-bold">Comment t'aider ?</h1>
          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
            Choisis un sujet pour lire des informations générales et les prochaines étapes possibles.
          </p>
        </header>

        <section className="space-y-3">
          {topics.map((topic) => (
            <button key={topic.id} type="button" onClick={() => setSelected(topic.id)} aria-pressed={selected === topic.id}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${selected === topic.id ? "border-[#D96C5B] bg-[#FCEBE7]" : "border-[#E7DDD8] bg-white"}`}>
              <span className="text-2xl">{topic.icon}</span>
              <span className="flex-1 text-sm font-bold">{topic.title}</span>
              <span className="text-[#6B2D5C]">→</span>
            </button>
          ))}
        </section>

        {answer && (
          <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm" aria-live="polite">
            <h2 className="text-lg font-bold text-[#6B2D5C]">{answer.title}</h2>
            <div className="mt-3 space-y-3">
              {answer.paragraphs.map((paragraph, index) => <p key={index} className="text-sm leading-6 text-[#2C1A16]/75">{paragraph}</p>)}
            </div>
            <Link href={answer.href} className="mt-5 inline-flex rounded-xl bg-[#F4D8D8] px-4 py-3 text-sm font-bold text-[#6B2D5C]">{answer.action} →</Link>
            <div className="mt-5 border-t border-[#E7DDD8] pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#6B2D5C]">Sources fiables</p>
              <ul className="mt-2 space-y-2">
                {sources[selected ?? "late"].map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#6B2D5C] underline underline-offset-4">
                      {source.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-2xl">🇨🇮</p>
          <h2 className="mt-2 font-bold text-[#6B2D5C]">Ressources en Côte d’Ivoire</h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/65">Liens officiels pour vérifier les informations et les services de santé reproductive.</p>
          <Link href="/ressources" className="mt-4 inline-flex rounded-xl bg-[#F4D8D8] px-4 py-3 text-sm font-bold text-[#6B2D5C]">Consulter les ressources →</Link>
        </section>

        <section className="mt-6 rounded-3xl border border-[#E8C7A5] bg-[#FFF8EF] p-5">
          <h2 className="font-bold text-[#8A4B24]">Important</h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/70">
            Ces réponses sont des repères pédagogiques préparés à partir de sources de santé reconnues. Ce n'est pas un chatbot médical, un diagnostic ou une prescription. En cas de symptôme sévère, de danger immédiat ou de doute urgent, contacte un service de santé.
          </p>
        </section>

        <p className="mt-5 text-center text-xs text-[#2C1A16]/45">Pour choisir un sujet, sélectionne une question ci-dessus. Naya n'envoie pas tes questions à un service externe.</p>
        <BottomNav />
      </div>
    </main>
  );
}
