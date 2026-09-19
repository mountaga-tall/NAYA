"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#6B2D5C]">
              Naya
            </span>
            <span className="text-[#2C1A16]/50">
              Étape {step} / 3
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#F4D8D8]">
            <div
              className="h-full rounded-full bg-[#D96C5B] transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <section>
            <div className="mb-8 text-center">
              <div className="mb-4 text-5xl">🌸</div>

              <h1 className="text-3xl font-bold">
                Commençons doucement
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
                Quand ont commencé tes dernières règles ?
              </p>
            </div>

            <label className="mb-3 block text-sm font-semibold">
              Date de début
            </label>

            <input
              type="date"
              className="w-full rounded-2xl border border-[#E7DDD8] bg-white px-4 py-4 outline-none focus:border-[#D96C5B]"
            />

            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg"
            >
              Suivant
            </button>
          </section>
        )}

        {step === 2 && (
          <section>
            <div className="mb-8 text-center">
              <div className="mb-4 text-5xl">📅</div>

              <h1 className="text-3xl font-bold">
                Ton rythme habituel
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
                Combien de jours dure ton cycle en général ?
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="text-center">
                <span className="text-5xl font-bold text-[#D96C5B]">
                  28
                </span>
                <span className="ml-2 text-[#2C1A16]/60">
                  jours
                </span>
              </div>

              <input
                type="range"
                min="21"
                max="35"
                defaultValue="28"
                className="mt-8 w-full accent-[#D96C5B]"
              />

              <div className="mt-2 flex justify-between text-xs text-[#2C1A16]/50">
                <span>21 jours</span>
                <span>35 jours</span>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="mt-8 w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg"
            >
              Suivant
            </button>

            <button
              onClick={() => setStep(1)}
              className="mt-3 w-full py-3 text-sm font-semibold text-[#6B2D5C]"
            >
              Retour
            </button>
          </section>
        )}

        {step === 3 && (
          <section>
            <div className="mb-8 text-center">
              <div className="mb-4 text-5xl">💛</div>

              <h1 className="text-3xl font-bold">
                Que souhaites-tu faire ?
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#2C1A16]/65">
                Tu pourras modifier ton choix plus tard.
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full rounded-2xl border border-[#E7DDD8] bg-white p-5 text-left shadow-sm">
                <div className="font-bold">🌸 Suivre mon cycle</div>
                <div className="mt-1 text-sm text-[#2C1A16]/60">
                  Comprendre mon rythme et mes symptômes.
                </div>
              </button>

              <button className="w-full rounded-2xl border border-[#E7DDD8] bg-white p-5 text-left shadow-sm">
                <div className="font-bold">🛡️ Éviter une grossesse</div>
                <div className="mt-1 text-sm text-[#2C1A16]/60">
                  Les estimations de Naya ne remplacent pas une contraception.
                </div>
              </button>

              <button className="w-full rounded-2xl border border-[#E7DDD8] bg-white p-5 text-left shadow-sm">
                <div className="font-bold">👶 Essayer de concevoir</div>
                <div className="mt-1 text-sm text-[#2C1A16]/60">
                  Suivre mon cycle dans un projet de conception.
                </div>
              </button>
            </div>

            <button className="mt-8 w-full rounded-2xl bg-[#D96C5B] px-6 py-4 font-bold text-white shadow-lg">
              Créer mon espace
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-[#2C1A16]/50">
              Naya fournit des estimations et ne remplace pas un avis médical.
            </p>

            <button
              onClick={() => setStep(2)}
              className="mt-3 w-full py-3 text-sm font-semibold text-[#6B2D5C]"
            >
              Retour
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
