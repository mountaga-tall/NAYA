export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2C1A16]">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">🌸</div>

          <h1 className="text-4xl font-bold tracking-tight">
            Naya
          </h1>

          <p className="mt-3 text-lg font-medium text-[#6B2D5C]">
            Ton cycle, ton rythme.
          </p>

          <p className="mt-4 text-sm leading-6 text-[#2C1A16]/70">
            Une application simple pour suivre ton cycle,
            comprendre ton rythme et garder tes données privées.
          </p>
        </div>

        <button className="w-full rounded-2xl bg-[#D96C5B] px-6 py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90">
          Commencer gratuitement
        </button>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-2xl">🔒</div>
            <p className="mt-2 text-xs font-semibold">
              Confidentialité
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-2xl">📱</div>
            <p className="mt-2 text-xs font-semibold">
              Simple
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-2xl">🌍</div>
            <p className="mt-2 text-xs font-semibold">
              Pensé pour toi
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-[#2C1A16]/50">
          Naya fournit des estimations et ne remplace pas
          un avis médical ou une méthode contraceptive.
        </p>
      </section>
    </main>
  );
}
