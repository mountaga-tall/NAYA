import Link from "next/link";

export default function AccueilPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#2C1A16]/60">
              Bonjour 👋
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Bienvenue sur Naya
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
                J14
              </p>

              <p className="mt-2 text-sm font-medium text-[#6B2D5C]">
                Phase estimée
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-[#2C1A16]/70">
            Tes prochaines règles sont estimées dans 14 jours.
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
                Pas encore indiqué
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-2xl">😊</p>
              <p className="mt-2 text-sm font-semibold">
                Humeur
              </p>
              <p className="mt-1 text-xs text-[#2C1A16]/50">
                Pas encore indiquée
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-[#F4D8D8] p-5">
          <h2 className="font-bold text-[#6B2D5C]">
            💡 À savoir
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/75">
            Les informations affichées par Naya sont des estimations
            basées sur les données que tu renseignes.
          </p>
        </section>
      </div>
    </main>
  );
}
