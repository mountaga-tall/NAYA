"use client";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

const periodDays = [1, 2, 3, 4, 5];
const fertileDays = [12, 13, 14, 15, 16];
const ovulationDay = 14;

export default function CalendrierPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#2C1A16]/50">
              Calendrier
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Août 2026
            </h1>
          </div>

          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              ←
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              →
            </button>
          </div>
        </header>

        <section className="mb-6 flex flex-wrap gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#D96C5B]" />
            Règles
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#F4D8D8]" />
            Fertilité estimée
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-[#D96C5B] bg-white" />
            Ovulation estimée
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 shadow-sm">
          <div className="mb-4 grid grid-cols-7 text-center text-xs font-bold uppercase text-[#2C1A16]/40">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mer</div>
            <div>Jeu</div>
            <div>Ven</div>
            <div>Sam</div>
            <div>Dim</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const isPeriod = periodDays.includes(day);
              const isFertile = fertileDays.includes(day);
              const isOvulation = day === ovulationDay;

              let classes =
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold";

              if (isPeriod) {
                classes += " bg-[#D96C5B] text-white";
              } else if (isOvulation) {
                classes += " border-2 border-[#D96C5B] text-[#D96C5B]";
              } else if (isFertile) {
                classes += " bg-[#F4D8D8] text-[#2C1A16]";
              } else {
                classes += " text-[#2C1A16]/70";
              }

              return (
                <div key={day} className="flex justify-center">
                  <div className={classes}>
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#6B2D5C]">
            Prochaines règles estimées
          </p>

          <p className="mt-2 text-2xl font-bold text-[#D96C5B]">
            28 août
          </p>

          <p className="mt-1 text-sm text-[#2C1A16]/50">
            Estimation basée sur les informations enregistrées.
          </p>
        </section>

        <button className="mt-6 w-full rounded-2xl border border-[#E7DDD8] bg-white px-6 py-4 font-bold text-[#6B2D5C]">
          ✏️ Modifier mes dates
        </button>
      </div>
    </main>
  );
}
