# 🌸 Naya — Ton cycle, ton rythme

Application de suivi du cycle menstruel pensée pour la Côte d'Ivoire et l'Afrique francophone.

## Vision

Un outil simple, discret et respectueux de la vie privée.

## MVP

- Accueil
- Calendrier
- Journal
- Insights
- Profil et confidentialité

## Authentification

Naya utilise désormais une authentification par email + mot de passe avec une session serveur.

### Flux de connexion

```text
Inscription / connexion
        ↓
POST /api/auth/register ou /api/auth/login
        ↓
mot de passe vérifié / hashé avec scrypt
        ↓
création d'un token de session aléatoire
        ↓
seul le hash SHA-256 du token est stocké en base
        ↓
cookie HttpOnly + Secure (production) + SameSite=Lax
        ↓
GET /api/auth/me et routes protégées
        ↓
session → user.id → données utilisateur
```

Le token brut de session n'est jamais renvoyé au JavaScript de la page et n'est jamais stocké dans `localStorage`.

### Séparation des données

Les routes `/api/cycle`, `/api/logs`, `/api/insights` et `/api/profile` récupèrent l'utilisateur depuis la session avant toute lecture ou écriture Prisma. Il n'y a plus de `DEMO_USER_ID` partagé entre les utilisateurs.

Les suppressions utilisent la relation `User → Session/Cycle/DailyLog` avec suppression en cascade côté base de données.

### Migration

Après récupération de la branche :

```bash
npx prisma migrate deploy
npm run build
```

La migration `20260930000000_add_auth` ajoute `User.passwordHash` et la table `Session`.

### Durcissement actuel

Les écritures sensibles vérifient aussi l'origine de la requête. Les échecs de connexion sont ralentis par une limitation de tentatives en mémoire, utile comme protection de premier niveau mais non distribuée entre plusieurs instances Vercel.

Avant un déploiement à grande échelle, il reste à prévoir une vérification d'email, une récupération de mot de passe et une limitation distribuée via un stockage partagé.
