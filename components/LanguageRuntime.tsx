"use client";

import { useEffect, useRef } from "react";

type Locale = "fr" | "en";

const translations: Record<string, string> = {
  "Naya — Ton cycle, ton rythme": "Naya — Your cycle, your rhythm",
  "Ton cycle, ton rythme.": "Your cycle, your rhythm.",
  "Une application simple pour suivre ton cycle, comprendre ton rythme et garder tes données privées.": "A simple app to track your cycle, understand your rhythm, and keep your data private.",
  "Commencer gratuitement": "Start for free",
  "Confidentialité": "Privacy",
  "Simple": "Simple",
  "Pensé pour toi": "Made for you",
  "Naya fournit des estimations et ne remplace pas un avis médical ou une méthode contraceptive.": "Naya provides estimates and does not replace medical advice or contraception.",
  "Créer ton espace": "Create your space",
  "Ton mot de passe est stocké uniquement sous forme de hash sécurisé côté serveur.": "Your password is stored only as a secure hash on the server.",
  "Prénom": "First name",
  "Ton prénom": "Your first name",
  "Mot de passe": "Password",
  "8 caractères minimum": "8 characters minimum",
  "Date de début des dernières règles": "Start date of your last period",
  "Suivant": "Next",
  "Tu as déjà un compte ?": "Already have an account?",
  "Se connecter": "Log in",
  "Ton rythme habituel": "Your usual cycle",
  "Combien de jours dure ton cycle en général ?": "How many days does your cycle usually last?",
  "jours": "days",
  "Retour": "Back",
  "Que souhaites-tu faire ?": "What would you like to do?",
  "Tu pourras modifier ton choix plus tard.": "You can change your choice later.",
  "🌸 Suivre mon cycle": "🌸 Track my cycle",
  "Comprendre mon rythme et mes symptômes.": "Understand my rhythm and symptoms.",
  "🛡️ Éviter une grossesse": "🛡️ Avoid pregnancy",
  "Les estimations de Naya ne remplacent pas une contraception.": "Naya estimates do not replace contraception.",
  "👶 Essayer de concevoir": "👶 Try to conceive",
  "Suivre mon cycle dans un projet de conception.": "Track my cycle while trying to conceive.",
  "Créer mon espace": "Create my space",
  "Création...": "Creating...",
  "Naya fournit des estimations et ne remplace pas un avis médical.": "Naya provides estimates and does not replace medical advice.",
  "Se connecter": "Log in",
  "Retrouve ton espace Naya et tes données privées.": "Return to your Naya space and private data.",
  "Email": "Email",
  "Connexion...": "Logging in...",
  "Pas encore de compte?": "Don't have an account yet?",
  "Créer mon espace": "Create my space",
  "Accueil": "Home",
  "Calendrier": "Calendar",
  "Journal": "Journal",
  "Insights": "Insights",
  "Profil": "Profile",
  "Chargement de ton cycle...": "Loading your cycle...",
  "Bonjour 👋": "Hello 👋",
  "Bienvenue sur Naya": "Welcome to Naya",
  "Configure ton cycle pour afficher les estimations adaptées à ton rythme.": "Set up your cycle to see estimates adapted to your rhythm.",
  "Configurer mon cycle": "Set up my cycle",
  "Aujourd'hui": "Today",
  "Jour du cycle": "Cycle day",
  "Cycle en cours": "Cycle in progress",
  "Période fertile estimée": "Estimated fertile window",
  "Prochaine période estimée": "Next estimated period",
  "Tes prochaines règles sont estimées le": "Your next period is estimated for",
  "+ Ajouter mes symptômes": "+ Add my symptoms",
  "Flux": "Flow",
  "Pas encore indiqué": "Not entered yet",
  "Léger": "Light",
  "Moyen": "Medium",
  "Abondant": "Heavy",
  "Humeur": "Mood",
  "Pas encore indiquée": "Not entered yet",
  "Calme": "Calm",
  "Heureuse": "Happy",
  "Triste": "Sad",
  "Irritable": "Irritable",
  "Anxieuse": "Anxious",
  "À savoir": "Good to know",
  "Les informations affichées par Naya sont des estimations basées sur les données que tu renseignes.": "The information shown by Naya is estimated from the data you enter.",
  "Chargement du calendrier...": "Loading calendar...",
  "Ton calendrier": "Your calendar",
  "Configure ton cycle pour afficher les dates estimées dans ton calendrier.": "Set up your cycle to see estimated dates in your calendar.",
  "Mois précédent": "Previous month",
  "Mois suivant": "Next month",
  "Règles estimées": "Estimated period",
  "Fertilité estimée": "Estimated fertility",
  "Ovulation estimée": "Estimated ovulation",
  "Prochaines règles estimées": "Next estimated period",
  "Cette date est une estimation basée sur les informations enregistrées dans Naya.": "This date is an estimate based on the information recorded in Naya.",
  "✏️ Modifier mes dates": "✏️ Edit my dates",
  "Comment te sens-tu ?": "How are you feeling?",
  "Ton suivi est enregistré de façon sécurisée.": "Your tracking data is stored securely.",
  "Douleurs": "Symptoms & pain",
  "Tête": "Head",
  "Ventre": "Abdomen",
  "Bas du dos": "Lower back",
  "Seins sensibles": "Tender breasts",
  "Note personnelle": "Personal note",
  "Écris quelque chose...": "Write something...",
  "Enregistrer": "Save",
  "Enregistrement...": "Saving...",
  "Ton suivi a bien été enregistré dans Naya. 🌸": "Your tracking has been saved in Naya. 🌸",
  "Une erreur est survenue.": "Something went wrong.",
  "Tes données": "Your data",
  "Des tendances simples pour mieux comprendre ton rythme.": "Simple trends to help you understand your rhythm.",
  "Cycle moyen": "Average cycle",
  "Règles moyennes": "Average period",
  "Durée de tes cycles enregistrés": "Length of your recorded cycles",
  "Pas encore assez de cycles enregistrés.": "Not enough recorded cycles yet.",
  "💡 Ce que montrent tes données": "💡 What your data shows",
  "Symptômes récurrents": "Recurring symptoms",
  "Aucun symptôme enregistré pour le moment.": "No symptoms recorded yet.",
  "Humeurs enregistrées": "Recorded moods",
  "Aucune humeur enregistrée pour le moment.": "No moods recorded yet.",
  "fois": "times",
  "enregistré": "recorded",
  "enregistrés": "recorded",
  "Mon espace": "My space",
  "Profil introuvable.": "Profile not found.",
  "Mode discret": "Discreet mode",
  "Exporter mes données": "Export my data",
  "Supprimer mon compte et mes données": "Delete my account and data",
  "Se déconnecter": "Log out",
  "Déconnexion...": "Logging out...",
  "Suppression...": "Deleting...",
  "Notre engagement": "Our commitment",
  "Tes informations personnelles restent associées à ton espace Naya.": "Your personal information remains associated with your Naya account.",
  "Tu peux demander leur export ou supprimer ton compte depuis cette page.": "You can export your data or delete your account from this page.",
  "Prévenir une grossesse": "Prevent pregnancy",
  "Projet de conception": "Trying to conceive",
  "Suivi du cycle": "Cycle tracking",
  "Ces observations sont basées sur les données renseignées dans Naya. Elles ne constituent pas un diagnostic médical.": "These observations are based on the data entered in Naya. They are not a medical diagnosis.",
};

const reverse = new Map<string, string>();
for (const [fr, en] of Object.entries(translations)) reverse.set(en, fr);

function localeFromStorage(): Locale {
  if (typeof window === "undefined") return "fr";
  return window.localStorage.getItem("naya-locale") === "en" ? "en" : "fr";
}

export default function LanguageRuntime() {
  const originals = useRef(new WeakMap<Text, string>());
  const translating = useRef(false);

  useEffect(() => {
    const initial = localeFromStorage();
    document.documentElement.lang = initial;

    const translateTree = (root: Node = document.body) => {
      if (translating.current) return;
      translating.current = true;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        nodes.push(node as Text);
      }

      for (const textNode of nodes) {
        const raw = originals.current.get(textNode) ?? textNode.nodeValue ?? "";
        if (!originals.current.has(textNode)) originals.current.set(textNode, raw);
        const trimmed = raw.trim();
        if (!trimmed || !/[A-Za-zÀ-ÿ]/.test(trimmed)) continue;

        let next = raw;
        if (localeRef.current === "en") {
          const exact = translations[trimmed];
          if (exact) {
            next = raw.replace(trimmed, exact);
          } else {
            for (const [fr, en] of Object.entries(translations)) {
              if (raw.includes(fr)) next = next.split(fr).join(en);
            }
          }
        } else {
          const exact = reverse.get(trimmed);
          if (exact) {
            next = raw.replace(trimmed, exact);
          } else {
            for (const [en, fr] of reverse.entries()) {
              if (raw.includes(en)) next = next.split(en).join(fr);
            }
          }
        }
        if (next !== textNode.nodeValue) textNode.nodeValue = next;
      }

      document.documentElement.lang = localeRef.current;
      document.title = localeRef.current === "en" ? (translations[document.title] ?? document.title) : (reverse.get(document.title) ?? document.title);
      translating.current = false;
    };

    const localeRef = { current: initial as Locale };

    const applyLocale = (next: Locale) => {
      localeRef.current = next;
      window.localStorage.setItem("naya-locale", next);
      translateTree();
    };

    const observer = new MutationObserver(() => translateTree());
    observer.observe(document.body, { subtree: true, childList: true });

    translateTree();

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "Changer de langue");
    button.style.cssText = [
      "position:fixed",
      "top:14px",
      "right:14px",
      "z-index:99999",
      "display:flex",
      "align-items:center",
      "gap:4px",
      "padding:4px",
      "border:1px solid rgba(44,26,22,.12)",
      "border-radius:999px",
      "background:rgba(255,255,255,.92)",
      "box-shadow:0 8px 24px rgba(44,26,22,.12)",
      "backdrop-filter:blur(12px)",
      "cursor:pointer",
      "font:600 11px/1 system-ui,sans-serif",
      "color:#2C1A16",
    ].join(";");

    const renderButton = () => {
      button.innerHTML = `
        <span style="padding:6px 8px;border-radius:999px;background:${localeRef.current === "fr" ? "#D96C5B" : "transparent"};color:${localeRef.current === "fr" ? "#fff" : "#6B2D5C"}">FR</span>
        <span style="padding:6px 8px;border-radius:999px;background:${localeRef.current === "en" ? "#D96C5B" : "transparent"};color:${localeRef.current === "en" ? "#fff" : "#6B2D5C"}">EN</span>`;
    };
    renderButton();
    button.addEventListener("click", () => {
      applyLocale(localeRef.current === "fr" ? "en" : "fr");
      renderButton();
    });
    document.body.appendChild(button);

    return () => {
      observer.disconnect();
      button.remove();
    };
  }, []);

  return null;
}
