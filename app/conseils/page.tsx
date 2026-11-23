"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";

type Goal = "TRACK" | "PREVENT" | "CONCEIVE";

type Article = {
  date: string;
  source: string;
  title: string;
  summary: string;
  url: string;
};

type Advice = {
  title: string;
  description: string;
};

type GoalGuide = {
  label: string;
  shortLabel: string;
  icon: string;
  intro: string;
  news: Article[];
  advice: Advice[];
  checklist: string[];
  consult: string[];
  nayaRole: string;
  reminder: string;
};

const guides: Record<Goal, GoalGuide> = {
  TRACK: {
    label: "Suivre mon cycle",
    shortLabel: "Mon cycle",
    icon: "🌸",
    intro:
      "Apprends à reconnaître tes habitudes, à mettre des mots sur tes symptômes et à repérer les changements qui méritent une attention.",
    news: [
      {
        date: "18 juin 2026",
        source: "Organisation mondiale de la Santé",
        title: "La santé menstruelle mérite une information et des soins de qualité",
        summary:
          "L’OMS rappelle que les cycles varient d’une personne à l’autre. Les douleurs très fortes, les saignements abondants ou les symptômes qui perturbent la vie quotidienne ne doivent pas être banalisés.",
        url: "https://www.who.int/fr/news-room/fact-sheets/detail/menstrual-health",
      },
      {
        date: "Fiche pratique",
        source: "NHS",
        title: "Reconnaître des règles très abondantes",
        summary:
          "Changer de protection toutes les 1 à 2 heures, saigner plus de 7 jours, se sentir très fatiguée ou être limitée dans ses activités sont des raisons de demander un avis médical.",
        url: "https://www.nhs.uk/conditions/heavy-periods/",
      },
    ],
    advice: [
      {
        title: "Note le premier jour des règles",
        description:
          "Le premier jour de saignement correspond au jour 1 du cycle. Note aussi le dernier jour pour suivre la durée des règles.",
      },
      {
        title: "Observe le flux sans te juger",
        description:
          "Indique s’il est léger, moyen ou abondant. Note aussi les changements inhabituels et les saignements entre les règles.",
      },
      {
        title: "Décris tes symptômes",
        description:
          "Douleurs, maux de tête, fatigue, sommeil, humeur et pertes vaginales peuvent aider à mieux comprendre ton vécu au fil des mois.",
      },
      {
        title: "Compare plusieurs cycles",
        description:
          "Un seul cycle ne suffit pas à définir une habitude. Garde tes notes sur plusieurs mois et observe les tendances plutôt que de chercher une date parfaite.",
      },
      {
        title: "Prends soin de toi pendant les règles",
        description:
          "Le repos, l’hydratation et une source de chaleur peuvent soulager certaines crampes. Demande conseil avant de prendre un médicament si tu as un doute.",
      },
    ],
    checklist: [
      "Enregistrer la date de début et de fin des règles",
      "Noter le flux et les douleurs",
      "Suivre l’humeur, l’énergie et le sommeil",
      "Consulter si un changement important persiste ou t’inquiète",
    ],
    consult: [
      "Douleurs fortes, nouvelles ou qui t’empêchent de vivre normalement.",
      "Saignements très abondants, règles de plus de 7 jours, fatigue importante ou essoufflement.",
      "Saignements entre les règles ou après un rapport sexuel.",
      "Cycles qui deviennent très irréguliers, règles absentes ou symptômes qui s’aggravent.",
    ],
    nayaRole:
      "Naya t’aide à enregistrer tes règles et tes symptômes, à visualiser tes cycles passés et à suivre des estimations. Elle ne détecte pas une maladie et ne remplace pas une consultation.",
    reminder:
      "À titre de repère, l’OMS indique que la durée d’un cycle peut souvent se situer entre 21 et 35 jours. Une variation isolée n’est pas automatiquement un problème : c’est ton évolution et ton ressenti qui comptent.",
  },
  PREVENT: {
    label: "Éviter une grossesse",
    shortLabel: "Prévention",
    icon: "🛡️",
    intro:
      "L’objectif est de choisir une contraception fiable qui correspond à ta santé, à tes préférences et à ta situation. Le calendrier de Naya ne protège pas d’une grossesse.",
    news: [
      {
        date: "23 septembre 2026",
        source: "Organisation mondiale de la Santé",
        title: "L’OMS élargit les options d’utilisation de certaines contraceptions",
        summary:
          "Une actualité récente présente de nouvelles recommandations sur certaines pilules, les implants et la contraception d’urgence. Le choix et les modalités doivent être discutés avec un professionnel de santé.",
        url: "https://www.who.int/news/item/23-09-2026-who-expands-safe-options-for-contraception",
      },
      {
        date: "3 juillet 2025",
        source: "Organisation mondiale de la Santé",
        title: "Panorama des méthodes de contraception",
        summary:
          "Il existe plusieurs méthodes réversibles ou permanentes. Le préservatif est la seule méthode contraceptive qui protège aussi contre les infections sexuellement transmissibles, dont le VIH.",
        url: "https://www.who.int/fr/news-room/fact-sheets/detail/family-planning-contraception/",
      },
    ],
    advice: [
      {
        title: "Ne compte pas sur le calendrier de Naya",
        description:
          "L’ovulation peut varier d’un cycle à l’autre. Une fenêtre fertile estimée ou une date affichée comme « sûre » ne constitue jamais une contraception.",
      },
      {
        title: "Choisis une méthode adaptée avec un soignant",
        description:
          "Parle des options disponibles, de leur efficacité, des effets secondaires possibles, de tes traitements et de ta facilité à les utiliser correctement.",
      },
      {
        title: "Pense à la double protection",
        description:
          "Le préservatif aide à prévenir une grossesse et réduit le risque d’infections sexuellement transmissibles. Il peut être associé à une autre contraception.",
      },
      {
        title: "Prévois quoi faire en cas d’oubli ou d’accident",
        description:
          "Demande à l’avance la conduite à tenir si un préservatif se déchire, si une pilule est oubliée ou si une méthode échoue. Les consignes dépendent de la méthode.",
      },
      {
        title: "Agis rapidement après un rapport à risque",
        description:
          "La contraception d’urgence doit être recherchée le plus tôt possible. Certaines options peuvent être utilisées dans les 5 jours : contacte rapidement un pharmacien ou un service de santé pour connaître l’option adaptée et disponible.",
      },
    ],
    checklist: [
      "Demander conseil sur les méthodes contraceptives adaptées à ma santé",
      "Savoir comment utiliser ma méthode et quoi faire en cas d’oubli",
      "Prévoir des préservatifs si une protection contre les IST est nécessaire",
      "Connaître où demander rapidement une contraception d’urgence",
    ],
    consult: [
      "Après un rapport non protégé, un préservatif déchiré ou un incident contraceptif : demande conseil sans attendre.",
      "Avant de commencer, arrêter ou changer une contraception, surtout en cas de maladie ou de traitement.",
      "En cas de douleurs importantes, de saignements inhabituels ou d’effets secondaires difficiles à supporter.",
      "Après un rapport imposé ou une agression sexuelle : cherche rapidement un service de santé et un soutien de confiance.",
    ],
    nayaRole:
      "Naya peut t’aider à comprendre ton cycle et à noter tes règles. Elle ne prédit pas avec certitude les jours sans risque, ne remplace aucun contraceptif et ne doit pas être utilisée seule pour éviter une grossesse.",
    reminder:
      "Important : les méthodes basées uniquement sur le calendrier ou l’observation de la fertilité sont moins fiables que plusieurs méthodes contraceptives modernes. Naya ne doit jamais être présentée comme une méthode de contraception.",
  },
  CONCEIVE: {
    label: "Essayer de concevoir",
    shortLabel: "Conception",
    icon: "👶",
    intro:
      "Prépare ton projet à ton rythme : comprends les signes du cycle, prends soin de ta santé et garde des repères réalistes. La conception peut prendre du temps.",
    news: [
      {
        date: "15 juillet 2026",
        source: "Centers for Disease Control and Prevention (CDC)",
        title: "Acide folique : un geste à anticiper avant une grossesse",
        summary:
          "Le CDC rappelle l’importance de l’acide folique avant et au début de la grossesse. La recommandation générale publiée est de 400 microgrammes par jour ; certaines situations nécessitent un avis médical personnalisé.",
        url: "https://www.cdc.gov/folic-acid/about/intake-and-sources.html",
      },
      {
        date: "28 novembre 2025",
        source: "Organisation mondiale de la Santé",
        title: "Nouvelle ligne directrice mondiale sur l’infertilité",
        summary:
          "L’OMS rappelle que les difficultés de fertilité peuvent concerner les deux partenaires et qu’elles méritent une prise en charge sans culpabilisation ni stigmatisation.",
        url: "https://www.who.int/fr/news/item/28-11-2025-who-issues-first-global-guideline-on-infertility",
      },
    ],
    advice: [
      {
        title: "Comprends la période autour de l’ovulation",
        description:
          "La période la plus favorable se situe autour de l’ovulation. Elle survient souvent environ 14 jours avant les prochaines règles, mais le jour exact varie et n’est pas toujours le jour 14.",
      },
      {
        title: "Garde un rythme qui te convient",
        description:
          "Des rapports tous les 2 à 3 jours peuvent couvrir la période fertile sans devoir viser une seule date précise. Choisissez un rythme confortable pour vous deux.",
      },
      {
        title: "Parle d’acide folique avec un professionnel",
        description:
          "Le CDC recommande généralement 400 microgrammes d’acide folique par jour aux personnes susceptibles de devenir enceintes. Demande un avis personnalisé, notamment si tu as des antécédents médicaux ou un traitement.",
      },
      {
        title: "Prépare un bilan avant la grossesse",
        description:
          "Un rendez-vous peut permettre de faire le point sur les vaccins, les traitements, les maladies chroniques, les dépistages et les habitudes de vie. N’arrête jamais un traitement prescrit sans avis médical.",
      },
      {
        title: "N’oublie pas la santé des deux partenaires",
        description:
          "La fertilité ne concerne pas uniquement la personne qui porte la grossesse. Si la conception tarde, un bilan peut être utile pour les deux partenaires.",
      },
    ],
    checklist: [
      "Noter les dates des règles et les variations du cycle",
      "Repérer les signes corporels sans considérer une estimation comme certaine",
      "Demander conseil sur l’acide folique et les traitements en cours",
      "Prévoir un rendez-vous de préparation à la grossesse",
      "Préserver le bien-être émotionnel et celui du couple",
    ],
    consult: [
      "Si tu as une maladie chronique, un traitement régulier, des cycles très irréguliers ou une condition connue pouvant affecter la fertilité.",
      "Si tu as des douleurs pelviennes importantes, des antécédents d’infection ou une inquiétude concernant ta santé reproductive.",
      "Si une grossesse ne survient pas après 12 mois de rapports réguliers sans contraception : l’OMS utilise ce repère pour définir l’infertilité. Un avis peut être demandé plus tôt selon l’âge, les antécédents ou les préoccupations.",
    ],
    nayaRole:
      "Naya t’aide à noter tes cycles et à estimer des périodes autour de l’ovulation. Ces dates restent approximatives : elles ne confirment pas qu’une ovulation a eu lieu et ne garantissent pas une grossesse.",
    reminder:
      "La durée avant une grossesse varie beaucoup d’un couple à l’autre. Une difficulté à concevoir n’est pas une faute personnelle : les causes peuvent concerner l’un, l’autre ou les deux partenaires.",
  },
};

const goalOptions: { value: Goal; icon: string; label: string }[] = [
  { value: "TRACK", icon: "🌸", label: "Mon cycle" },
  { value: "PREVENT", icon: "🛡️", label: "Prévention" },
  { value: "CONCEIVE", icon: "👶", label: "Conception" },
];

export default function ConseilsPage() {
  const [goal, setGoal] = useState<Goal>("TRACK");
  const [savedGoals, setSavedGoals] = useState<Goal[]>(["TRACK"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadGoal() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        const validGoals: Goal[] = ["TRACK", "PREVENT", "CONCEIVE"];
        const savedGoal = data?.user?.goal;
        const profileGoals: Goal[] = Array.isArray(data?.user?.goals)
          ? data.user.goals.filter((value: unknown): value is Goal =>
              typeof value === "string" && validGoals.includes(value as Goal)
            )
          : validGoals.includes(savedGoal) ? [savedGoal] : ["TRACK"];
        const activeGoals: Goal[] = profileGoals.length > 0 ? profileGoals : ["TRACK"];

        if (active) {
          setSavedGoals(activeGoals);
          setGoal(activeGoals[0]);
        }
      } catch (error) {
        console.error("Impossible de charger l’objectif Naya", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadGoal();
    return () => {
      active = false;
    };
  }, []);

  const guide = guides[goal];

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-5 py-8 pb-28 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-7 pr-12">
          <p className="text-sm font-semibold text-[#6B2D5C]">
            TON ESPACE BIEN-ÊTRE
          </p>
          <h1 className="mt-2 text-3xl font-bold">Conseils & actus</h1>
          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
            Des informations fiables et des conseils adaptés à ton projet de santé reproductive.
          </p>
        </header>

        <section className="mb-6 rounded-3xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#6B2D5C]">
              Explorer les trois objectifs
            </h2>
            {loading && (
              <span className="text-xs text-[#2C1A16]/45">Personnalisation...</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {goalOptions.map((option) => {
              const selected = goal === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGoal(option.value)}
                  aria-pressed={selected}
                  className={`rounded-2xl border px-2 py-3 text-center transition ${
                    selected
                      ? "border-[#D96C5B] bg-[#FCEBE7] text-[#6B2D5C]"
                      : "border-[#E7DDD8] bg-[#FDFBF7] text-[#2C1A16]/65"
                  }`}
                >
                  <span className="block text-xl">{option.icon}</span>
                  <span className="mt-1 block text-xs font-bold leading-4">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#2C1A16]/50">
            Objectifs enregistrés dans ton profil :{" "}
            {savedGoals.map((value) => goalOptions.find((option) => option.value === value)?.label).filter(Boolean).join(" · ")}.
            Choisis un parcours pour afficher ses conseils. Tu peux modifier tes objectifs depuis ton profil.
          </p>
        </section>

        <section className="mb-6 rounded-3xl bg-[#F4D8D8] p-5">
          <div className="text-3xl">{guide.icon}</div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#6B2D5C]">
            Ton guide personnalisé
          </p>
          <h2 className="mt-1 text-2xl font-bold">{guide.label}</h2>
          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/75">
            {guide.intro}
          </p>
        </section>

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">📰 Actualités santé</h2>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#2C1A16]/40">
              Sélection vérifiée
            </span>
          </div>
          <div className="space-y-3">
            {guide.news.map((article) => (
              <article
                key={article.url}
                className="rounded-3xl border border-[#E7DDD8] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#6B2D5C]">
                  <span>{article.source}</span>
                  <span aria-hidden="true">•</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="mt-3 text-base font-bold leading-6">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#2C1A16]/65">
                  {article.summary}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#6B2D5C] underline underline-offset-4"
                >
                  Lire la source <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#2C1A16]/45">
            Sélection éditoriale mise à jour le 23 novembre 2026. Les liens ouvrent les publications des organismes cités ; ce n’est pas un fil d’actualité en direct.
          </p>
        </section>

        <section className="mb-6 rounded-3xl border border-[#E7DDD8] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#6B2D5C]">Côte d’Ivoire</p>
          <h2 className="mt-2 text-lg font-bold">Où trouver des informations et des services ?</h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/65">
            Consulte les annonces officielles sur la planification familiale et les ressources locales. La gratuité annoncée dans le public ne garantit pas que chaque méthode soit disponible dans chaque centre au moment de ta visite.
          </p>
          <a href="/ressources" className="mt-4 inline-flex rounded-xl bg-[#F4D8D8] px-4 py-3 text-sm font-bold text-[#6B2D5C]">
            Voir les ressources ivoiriennes →
          </a>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-xl font-bold">💡 Conseils pratiques</h2>
          <div className="space-y-3">
            {guide.advice.map((item, index) => (
              <article
                key={item.title}
                className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4D8D8] text-sm font-bold text-[#6B2D5C]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#2C1A16]/65">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#6B2D5C]">
            ✓ Ton petit plan d’action
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/60">
            Quelques repères simples à garder en tête.
          </p>
          <ul className="mt-4 space-y-3">
            {guide.checklist.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-5">
                <span className="mt-0.5 text-[#D96C5B]" aria-hidden="true">●</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6 rounded-3xl border border-[#E8C7A5] bg-[#FFF8EF] p-5">
          <h2 className="font-bold text-[#8A4B24]">
            Quand demander un avis médical ?
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/65">
            N’attends pas que tes symptômes deviennent difficiles à supporter. Demande conseil à un professionnel de santé si tu remarques :
          </p>
          <ul className="mt-3 space-y-2">
            {guide.consult.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-[#2C1A16]/75">
                <span aria-hidden="true">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Le rôle de Naya</h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/70">
            {guide.nayaRole}
          </p>
          <div className="mt-4 rounded-2xl bg-[#FDFBF7] p-4">
            <p className="text-sm font-bold">À retenir</p>
            <p className="mt-1 text-sm leading-6 text-[#2C1A16]/65">
              {guide.reminder}
            </p>
          </div>
        </section>

        <p className="mb-6 text-center text-xs leading-5 text-[#2C1A16]/45">
          Les contenus de Naya sont éducatifs et s’appuient sur des sources de santé reconnues. Ils ne constituent ni un diagnostic, ni une prescription, ni une contraception. En cas d’urgence ou de doute important, contacte un service de santé.
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
