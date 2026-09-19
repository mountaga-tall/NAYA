import BottomNav from "@/components/BottomNav";

const cycles = [28, 30, 27, 29, 31, 28];

export default function InsightsPage() {
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
              29
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
              5
              <span className="ml-1 text-sm text-[#2C1A16]/50">
                jours
              </span>
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Durée de tes 6 derniers cycles
          </h2>

          <div className="mt-6 flex h-48 items-end justify-between gap-3">
            {cycles.map((cycle, index) => {
              const height = `${(cycle / 35) * 100}%`;

              return (
                <div
                  key={index}
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
        </section>

        <section className="mb-6 rounded-3xl bg-[#F4D8D8] p-5">
          <h2 className="font-bold text-[#6B2D5C]">
            💡 Ce que montrent tes données
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/75">
            Tes cycles enregistrés varient actuellement entre
            27 et 31 jours.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Symptômes récurrents
          </h2>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] p-4">
              <span className="text-sm font-semibold">
                😣 Maux de tête
              </span>

              <span className="text-xs text-[#2C1A16]/50">
                3 cycles
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] p-4">
              <span className="text-sm font-semibold">
                🌙 Fatigue
              </span>

              <span className="text-xs text-[#2C1A16]/50">
                2 cycles
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-[#FDFBF7] p-4">
              <span className="text-sm font-semibold">
                🤍 Sensibilité des seins
              </span>

              <span className="text-xs text-[#2C1A16]/50">
                2 cycles
              </span>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-[#2C1A16]/45">
          Ces observations sont basées sur les données que tu
          renseignes. Elles ne constituent pas un diagnostic médical.
        </p>

        <BottomNav />
      </div>
    </main>
  );
}
