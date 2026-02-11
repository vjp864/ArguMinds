# ⚖️ ARGUMINDS – Plateforme d'Intelligence Argumentative

**ARGUMINDS** est un outil SaaS conçu pour les avocats et les débatteurs. Il permet de structurer des raisonnements complexes, de mapper des arguments sous forme de graphes logiques et de centraliser les sources juridiques.

---

## 🚀 Stack Technique

- **Framework** : Next.js 16+ (App Router)
- **Authentification** : NextAuth.js
- **Base de données** : PostgreSQL (Neon.tech)
- **ORM** : Prisma
- **UI** : Tailwind CSS + Shadcn/UI
- **Visualisation** : React Flow (pour les graphes d'arguments)
- **Déploiement** : Vercel

---

## 📂 Structure des Dossiers

```
/
├── app/                # Pages et API Routes (App Router)
│   ├── (auth)/         # Connexion / Inscription
│   ├── (dashboard)/    # Interface de gestion des dossiers
│   └── api/            # Endpoints API (Auth, Webhooks)
├── components/         # Composants React (UI & Editor)
├── lib/                # Config Prisma, NextAuth et utilitaires
├── prisma/             # Schéma et migrations de base de données
└── types/              # Interfaces TypeScript
```

---

## 🛠️ Installation et Configuration

### Prérequis

- Node.js 18+
- npm, yarn, pnpm ou bun
- Un compte [Neon.tech](https://neon.tech) pour PostgreSQL

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd arguminds
```

### 2. Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
DATABASE_URL="votre_url_postgresql_neon"
NEXTAUTH_SECRET="votre_secret_genere"
NEXTAUTH_URL="http://localhost:3000"
```

> **Astuce** : Générez un secret avec `openssl rand -base64 32`

### 3. Installation des dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### 4. Configuration de la base de données

```bash
# Génération du client Prisma
npx prisma generate

# Synchronisation de la base de données
npx prisma db push

# (Optionnel) Interface d'administration Prisma
npx prisma studio
```

### 5. Lancer le serveur de développement

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🗺️ Roadmap de Développement

### Phase 1 : Fondations (2-3 semaines)
- [ ] Setup Next.js, Tailwind, Shadcn
- [ ] Configuration Prisma + Base de données Neon
- [ ] Auth avec NextAuth (Email/Password)
- [ ] Pages : Connexion, Inscription, Dashboard basique
- [ ] Modèles : User, Case (CRUD de base)

### Phase 2 : Gestion des Dossiers (2 semaines)
- [ ] CRUD complet des dossiers
- [ ] Filtres, recherche, statuts
- [ ] Interface utilisateur Dashboard
- [ ] Gestion des rôles (Avocat/Débatteur)

### Phase 3 : Graph Engine (4-5 semaines)
- [ ] Intégration de React Flow
- [ ] CRUD des arguments (création, édition, suppression)
- [ ] Relations parent/enfant entre arguments
- [ ] Visualisation du graphe (zoom, pan, layout automatique)
- [ ] Sauvegarde des positions des nœuds

### Phase 4 : Sources Juridiques (2 semaines)
- [ ] CRUD des sources
- [ ] Liaison sources ↔ arguments
- [ ] Bibliothèque centralisée
- [ ] Recherche et filtres

### Phase 5 : Export et Finalisation (2 semaines)
- [ ] Export PDF avec graphe et détails
- [ ] Export Word (.docx)
- [ ] Tests end-to-end
- [ ] Optimisation des performances
- [ ] Déploiement sur Vercel

### Phase 6 : Améliorations Futures (optionnel)
- [ ] Collaboration en temps réel
- [ ] Version mobile (Progressive Web App)
- [ ] IA pour suggérer des contre-arguments
- [ ] Analyse de la solidité des arguments

---

## 🛡️ Sécurité

- Utilisation de **Server Actions** avec validation de session
- Validation des données avec **Zod**
- Protection des routes via le middleware **NextAuth**

---

## 📚 Ressources Next.js

Pour en savoir plus sur Next.js :

- [Documentation Next.js](https://nextjs.org/docs) - fonctionnalités et API
- [Learn Next.js](https://nextjs.org/learn) - tutoriel interactif
- [Dépôt GitHub Next.js](https://github.com/vercel/next.js)

---

## 🚢 Déploiement sur Vercel

Le moyen le plus simple de déployer cette application est d'utiliser la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.

---

## ⚠️ Disclaimer

Ce projet est un outil d'aide à la décision. **L'humain reste au centre de la stratégie argumentative.**