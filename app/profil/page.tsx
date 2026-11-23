"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

type Goal = "TRACK" | "PREVENT" | "CONCEIVE";

type Profile = {
  id: string;
  firstName: string | null;
  email: string | null;
  avgCycleLength: number;
  avgPeriodLength: number;
  goal: Goal;
  goals: Goal[];
  discreetMode: boolean;
  remindersEnabled: boolean;
  reminderTime: string;
};

const goalOptions: { value: Goal; label: string; description: string }[] = [
  { value: "TRACK", label: "🌸 Suivre mon cycle", description: "Comprendre mon rythme et mes symptômes." },
  { value: "PREVENT", label: "🛡️ Éviter une grossesse", description: "M’informer sur la contraception. Les estimations de Naya ne protègent pas d’une grossesse." },
  { value: "CONCEIVE", label: "👶 Essayer de concevoir", description: "Suivre mon cycle dans un projet de conception." },
];

function getGoalLabel(goal: Goal) {
  if (goal === "PREVENT") return "Éviter une grossesse";
  if (goal === "CONCEIVE") return "Essayer de concevoir";
  return "Suivre mon cycle";
}

export default function ProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossible de récupérer le profil.");
        if (active) setProfile(data.profile);
      } catch {
        if (active) setError("Impossible de charger ton profil.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadProfile();
    return () => { active = false; };
  }, []);

  async function patchProfile(body: Record<string, unknown>) {
    if (!profile || saving || deleting || exporting) return false;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible de mettre à jour le profil.");
      setProfile(data.profile);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de mettre à jour le profil.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function toggleGoal(value: Goal) {
    if (!profile || saving || deleting || exporting) return;
    const current = profile.goals?.length ? profile.goals : [profile.goal];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    if (next.length === 0) {
      setError("Garde au moins un objectif sélectionné.");
      return;
    }
    void patchProfile({ goals: next, primaryGoal: next.includes(profile.goal) ? profile.goal : next[0] });
  }

  function setPrimaryGoal(value: Goal) {
    if (!profile || !profile.goals.includes(value) || profile.goal === value) return;
    void patchProfile({ primaryGoal: value });
  }

  async function toggleReminders() {
    if (!profile || saving || deleting || exporting) return;
    const enable = !profile.remindersEnabled;

    if (enable) {
      if (!("Notification" in window)) {
        setError("Les notifications ne sont pas prises en charge par ce navigateur.");
        return;
      }
      const permission = Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();

      if (permission !== "granted") {
        setError("Autorise les notifications dans ton navigateur pour activer ce rappel.");
        return;
      }
    }

    await patchProfile({ remindersEnabled: enable, reminderTime: profile.reminderTime || "20:00" });
  }

  async function saveReminderTime() {
    if (!profile || !/^([01]\d|2[0-3]):[0-5]\d$/.test(profile.reminderTime)) {
      setError("Choisis une heure valide.");
      return;
    }
    await patchProfile({ reminderTime: profile.reminderTime, remindersEnabled: profile.remindersEnabled });
  }

  async function toggleDiscreetMode() {
    if (!profile) return;
    await patchProfile({ discreetMode: !profile.discreetMode });
  }

  async function exportData() {
    if (saving || deleting || exporting) return;
    setExporting(true);
    setError("");
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Export impossible.");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "naya-mes-donnees.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Impossible d'exporter les données.");
    } finally {
      setExporting(false);
    }
  }

  async function logout() {
    if (saving || deleting || exporting) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Déconnexion impossible.");
      router.replace("/connexion");
      router.refresh();
    } catch {
      setError("Impossible de se déconnecter.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAccount() {
    if (saving || deleting || exporting) return;
    const confirmed = window.confirm("Supprimer définitivement le compte et toutes les données associées ?");
    if (!confirmed) return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch("/api/profile", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Suppression impossible.");
      router.replace("/");
      router.refresh();
    } catch {
      setError("Impossible de supprimer le compte et les données.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 text-[#2C1A16]"><div className="mx-auto max-w-md"><p className="text-sm text-[#2C1A16]/60">Chargement du profil...</p></div></main>;
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
        <div className="mx-auto max-w-md">
          <header className="mb-8"><p className="text-sm text-[#2C1A16]/50">Mon espace</p><h1 className="mt-1 text-3xl font-bold">Profil</h1></header>
          <section className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-sm leading-6 text-red-600">{error || "Profil introuvable."}</p></section>
          <BottomNav />
        </div>
      </main>
    );
  }

  const selectedGoals = profile.goals?.length ? profile.goals : [profile.goal];

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-8 pb-24 text-[#2C1A16]">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <p className="text-sm text-[#2C1A16]/50">Mon espace</p>
          <h1 className="mt-1 text-3xl font-bold">Profil</h1>
        </header>

        {error && <div role="alert" className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Mon compte</h2>
          <div className="mt-4 space-y-4">
            <div><p className="text-xs text-[#2C1A16]/50">Prénom</p><p className="mt-1 font-semibold">{profile.firstName || "—"}</p></div>
            <div><p className="text-xs text-[#2C1A16]/50">Email</p><p className="mt-1 font-semibold">{profile.email || "—"}</p></div>
            <div><p className="text-xs text-[#2C1A16]/50">Objectif principal</p><p className="mt-1 font-semibold">{getGoalLabel(profile.goal)}</p></div>
            <div><p className="text-xs text-[#2C1A16]/50">Durée moyenne du cycle</p><p className="mt-1 font-semibold">{profile.avgCycleLength} jours</p></div>
            <div><p className="text-xs text-[#2C1A16]/50">Durée moyenne des règles</p><p className="mt-1 font-semibold">{profile.avgPeriodLength} jours</p></div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Mes objectifs Naya</h2>
          <p className="mt-2 text-sm leading-6 text-[#2C1A16]/60">Sélectionne plusieurs objectifs si besoin, puis définis celui qui doit guider l'accueil et les conseils.</p>
          <div className="mt-4 space-y-3">
            {goalOptions.map((option) => {
              const selected = selectedGoals.includes(option.value);
              const primary = profile.goal === option.value;
              return (
                <div key={option.value} className={`rounded-2xl border p-4 ${selected ? "border-[#D96C5B] bg-[#FCEBE7]" : "border-[#E7DDD8] bg-white"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => toggleGoal(option.value)} disabled={saving || deleting || exporting} aria-pressed={selected} className="flex-1 text-left disabled:opacity-60">
                      <span className="block font-bold">{option.label}</span>
                      <span className="mt-1 block text-sm leading-5 text-[#2C1A16]/60">{option.description}</span>
                    </button>
                    <button type="button" onClick={() => toggleGoal(option.value)} disabled={saving || deleting || exporting} aria-label={selected ? "Retirer cet objectif" : "Ajouter cet objectif"} aria-pressed={selected}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${selected ? "border-[#D96C5B] bg-[#D96C5B] text-white" : "border-[#E7DDD8] bg-white text-transparent"}`}>✓</button>
                  </div>
                  {selected && (
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#E7DDD8] pt-3">
                      {primary ? <span className="text-xs font-bold text-[#6B2D5C]">Objectif principal</span> : <span className="text-xs text-[#2C1A16]/45">Objectif secondaire</span>}
                      {!primary && <button type="button" onClick={() => setPrimaryGoal(option.value)} disabled={saving || deleting || exporting} className="text-xs font-bold text-[#6B2D5C] underline underline-offset-4 disabled:opacity-60">Définir comme principal</button>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {saving && <p className="mt-3 text-xs text-[#2C1A16]/50">Enregistrement...</p>}
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#6B2D5C]">Rappels discrets</h2>
              <p className="mt-1 text-sm leading-5 text-[#2C1A16]/55">Un rappel quotidien pour penser à compléter ton journal.</p>
            </div>
            <button type="button" onClick={toggleReminders} disabled={saving || deleting || exporting}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${profile.remindersEnabled ? "bg-[#D96C5B]" : "bg-[#E7DDD8]"} disabled:opacity-60`}
              aria-label="Activer ou désactiver les rappels" aria-pressed={profile.remindersEnabled}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${profile.remindersEnabled ? "left-6" : "left-1"}`} />
            </button>
          </div>
          <label htmlFor="reminderTime" className="mt-4 block text-xs font-semibold text-[#2C1A16]/55">Heure du rappel (heure locale de ton appareil)</label>
          <input id="reminderTime" type="time" value={profile.reminderTime || "20:00"} onChange={(event) => setProfile({ ...profile, reminderTime: event.target.value })} onBlur={saveReminderTime} disabled={saving || deleting || exporting}
            className="mt-2 w-full rounded-2xl border border-[#E7DDD8] bg-[#FDFBF7] px-4 py-3 outline-none focus:border-[#D96C5B] disabled:opacity-60" />
          <p className="mt-3 text-xs leading-5 text-[#2C1A16]/45">
            Le rappel fonctionne sur cet appareil lorsque Naya est ouverte ou active dans le navigateur. Il ne s'agit pas encore d'une notification push garantie lorsque le navigateur est fermé.
          </p>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Préférences d'affichage</h2>
          <div className="mt-4 flex items-center justify-between">
            <div className="pr-4">
              <p className="font-semibold">Mode d'affichage neutre</p>
              <p className="mt-1 text-sm leading-5 text-[#2C1A16]/55">Utiliser un vocabulaire plus neutre dans l'application.</p>
            </div>
            <button type="button" onClick={toggleDiscreetMode} disabled={saving || deleting || exporting}
              className={`relative h-7 w-12 rounded-full transition ${profile.discreetMode ? "bg-[#D96C5B]" : "bg-[#E7DDD8]"} disabled:opacity-60`}
              aria-label="Activer ou désactiver le mode d'affichage neutre" aria-pressed={profile.discreetMode}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${profile.discreetMode ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </section>

        <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-[#6B2D5C]">Données & sécurité</h2>
          <div className="mt-4 space-y-3">
            <button type="button" onClick={exportData} disabled={saving || deleting || exporting} className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold disabled:opacity-60">
              {exporting ? "Préparation de l'export..." : "📥 Exporter mes données"}
            </button>
            <button type="button" onClick={() => setShowSecurity((value) => !value)} disabled={saving || deleting || exporting}
              className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold disabled:opacity-60" aria-expanded={showSecurity}>
              🔒 Sécurité et confidentialité
            </button>
            {showSecurity && (
              <div className="rounded-2xl bg-[#FDFBF7] p-4 text-sm leading-6 text-[#2C1A16]/70">
                <p>Ton mot de passe est conservé sous forme de hash sécurisé côté serveur.</p>
                <p className="mt-2">Les données de cycle et de journal ne sont pas placées dans le cache hors connexion public de l'application.</p>
                <p className="mt-2">Sur un téléphone partagé, pense à te déconnecter et à éviter l'affichage des notifications sensibles sur l'écran verrouillé.</p>
              </div>
            )}
            <button type="button" onClick={deleteAccount} disabled={saving || deleting || exporting} className="w-full rounded-2xl border border-red-200 px-4 py-4 text-left font-semibold text-red-600 disabled:opacity-60">
              {deleting ? "Suppression..." : "🗑️ Supprimer mon compte et mes données"}
            </button>
            <button type="button" onClick={logout} disabled={saving || deleting || exporting} className="w-full rounded-2xl border border-[#E7DDD8] px-4 py-4 text-left font-semibold disabled:opacity-60">
              {saving ? "Enregistrement..." : "↪️ Se déconnecter"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-[#F4D8D8] p-5">
          <h2 className="font-bold text-[#6B2D5C]">🌸 Notre engagement</h2>
          <p className="mt-3 text-sm leading-6 text-[#2C1A16]/75">Naya te permet d'exporter tes données ou de supprimer ton compte. Tes informations de santé ne sont pas conservées dans le cache hors connexion public.</p>
        </section>
        <BottomNav />
      </div>
    </main>
  );
}
