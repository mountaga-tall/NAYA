"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";

export default function ProfilPage() {
  const [discreetMode, setDiscreetMode] = useState(false);

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm text-[#2C1A16]/50">
            Mon espace
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Profil
          </h1>
        </header>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Mon compte
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-[#2C1A16]/50">
                Prénom
              </p>
              <p className="mt-1 font-semibold">
                Amina
              </p>
            </div>

            <div>
              <p className="text-xs text-[#2C1A16]/50">
                Email
              </p>
              <p className="mt-1 font-semibold">
                Non renseigné
              </p>
            </div>

            <div>
              <p className="text-xs text-[#2C1A16]/50">
                Objectif
              </p>
              <p className="mt-1 font-semibold">
                Suivre mon cycle
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Préférences
          </h2>

          <div className="mt-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="font-semibold">
                Mode discret
              </p>

              <p className="mt-1 text-sm leading-5 text-[#2C1A16]/55">
                Utiliser un vocabulaire plus neutre dans l'application.
              </p>
            </div>

            <button
              onClick={() => setDiscreetMode(!discreetMode)}
              className={`relative h-7 w-12 rounded-full transition ${
                discreetMode
                  ? "bg-[#D96C5B]"
                  : "bg-[#E7DDD8]"
              }`}
              aria-label="Activer ou désactiver le mode discret"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  discreetMode ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">
            Données & sécurité
          </h2>

          <div className="mt-4 space-y-3">
            <button className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold">
              📥 Exporter mes données
            </button>

            <button className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold">
              🔒 Sécurité et confidentialité
            </button>

            <button className="w-full rounded-2xl border border-red-200 px-4 py-4 text-left font-semibold text-red-600">
              🗑️ Supprimer mon compte et mes données
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-[#F4D8D8] p-5">
          <h2 className="font-bold text-[#6B2D5C]">
            🌸 Notre promesse
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/75">
            Tes informations liées à ton cycle sont personnelles.
            Naya est conçu pour te donner le contrôle sur tes données.
          </p>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
