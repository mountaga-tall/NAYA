"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const resources = [
  {
    category: "Services publics",
    title: "Planification familiale dans les centres publics",
    organization: "Ministère de la Santé de Côte d’Ivoire",
    date: "1 octobre 2026",
    description:
      "Le ministère annonce la gratuité des actes, intrants et médicaments de planification familiale dans les centres de santé publics. Vérifie toutefois les services et les stocks auprès du centre avant de te déplacer.",
    url: "https://sante.gouv.ci/actualite/2232",
  },
  {
    category: "Disponibilité des produits",
    title: "Approvisionnement et disponibilité des produits contraceptifs",
    organization: "UNFPA Côte d’Ivoire",
    date: "4 septembre 2026",
    description:
      "L’UNFPA rapporte des tensions de stock sur certaines méthodes à la date du 31 juillet 2026 et décrit les mesures prévues pour les réduire. Cette information explique pourquoi la disponibilité réelle doit être confirmée localement.",
    url: "https://cotedivoire.unfpa.org/fr/news/le-gouvernement-et-ses-partenaires-renforcent-leur-engagement-pour-s%C3%A9curiser-les-produits",
  },
  {
    category: "Programme national",
    title: "Accès universel à la contraception moderne",
    organization: "Ministère de la Santé de Côte d’Ivoire",
    date: "27 février 2026",
    description:
      "Présentation du projet AUCm-CI, déployé dans 67 districts sanitaires répartis dans 19 régions. Cet article décrit le programme, mais ne fournit pas un annuaire actualisé des stocks ou des consultations disponibles.",
    url: "https://www.sante.gouv.ci/index.php/actualite/1982",
  },
  {
    category: "Accompagnement communautaire",
    title: "Renforcer les services de santé reproductive au plus près des communautés",
    organization: "UNFPA Côte d’Ivoire",
    date: "24 février 2026",
    description:
      "Un aperçu des actions menées avec des ONG et des districts sanitaires pour faciliter l’information et l’accès à la planification familiale.",
    url: "https://cotedivoire.unfpa.org/fr/news/planification-familiale-ong-et-districts-sanitaires-renforcent-leurs-capacit%C3%A9s-pour-rapprocher",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-7">
          <p className="text-sm font-semibold text-[#6B2D5C]">REPÈRES LOCAUX</p>
          <h1 className="mt-2 text-3xl font-bold">Ressources en Côte d’Ivoire</h1>
          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
            Des liens officiels pour mieux comprendre les services de santé reproductive et vérifier les informations avant de te déplacer.
          </p>
        </header>

        <section className="mb-6 rounded-3xl border border-[#E8C7A5] bg-[#FFF8EF] p-5">
          <h2 className="font-bold text-[#8A4B24]">À savoir avant de te déplacer</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#2C1A16]/75">
            <li>• La gratuité annoncée concerne les prestations visées dans les établissements publics.</li>
            <li>• La gratuité ne garantit pas que toutes les méthodes soient disponibles dans chaque centre le jour de ta visite.</li>
            <li>• Contacte ou visite le centre pour confirmer les horaires, les services et le stock actuel.</li>
            <li>• Tu peux demander un échange confidentiel avec un professionnel de santé.</li>
          </ul>
        </section>

        <section className="space-y-3">
          {resources.map((resource) => (
            <article key={resource.url} className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B2D5C]">{resource.category}</p>
              <h2 className="mt-2 text-base font-bold leading-6">{resource.title}</h2>
              <p className="mt-2 text-xs font-semibold text-[#2C1A16]/50">{resource.organization} · {resource.date}</p>
              <p className="mt-3 text-sm leading-6 text-[#2C1A16]/70">{resource.description}</p>
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-bold text-[#6B2D5C] underline underline-offset-4">
                Lire la publication officielle ↗
              </a>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Autres sources utiles</h2>
          <div className="mt-3 space-y-3 text-sm">
            <a href="https://cotedivoire.unfpa.org/fr" target="_blank" rel="noopener noreferrer" className="block font-semibold text-[#6B2D5C] underline underline-offset-4">UNFPA Côte d’Ivoire ↗</a>
            <a href="https://sante.gouv.ci/actualites" target="_blank" rel="noopener noreferrer" className="block font-semibold text-[#6B2D5C] underline underline-offset-4">Actualités du ministère de la Santé ↗</a>
            <a href="https://www.who.int/fr" target="_blank" rel="noopener noreferrer" className="block font-semibold text-[#6B2D5C] underline underline-offset-4">Organisation mondiale de la Santé ↗</a>
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-[#2C1A16]/45">
          Dernière vérification éditoriale : 23 novembre 2026. Ces liens ne remplacent pas un conseil médical et ne confirment pas la disponibilité en temps réel d’un service.
        </p>
        <Link href="/conseils" className="mt-5 block rounded-2xl border border-[#E7DDD8] bg-white px-5 py-4 text-center text-sm font-bold text-[#6B2D5C]">Retour aux conseils</Link>
        <BottomNav />
      </div>
    </main>
  );
}
