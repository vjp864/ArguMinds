# ARGUMINDS — Plateforme d'Intelligence Argumentative

**ARGUMINDS** est un outil SaaS conçu pour les avocats et les débatteurs. Il permet de structurer des raisonnements complexes, de mapper des arguments sous forme de graphes logiques, de centraliser les sources juridiques et d'exploiter l'IA pour renforcer chaque argument.

---

## Stack Technique

| Couche | Technologie |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Authentification** | Auth.js v5 (NextAuth beta) — Credentials, JWT |
| **Base de données** | PostgreSQL (Neon.tech) |
| **ORM** | Prisma 7 (adapter Neon) |
| **UI** | Tailwind CSS 4 + Shadcn/UI (New York) |
| **Graphes** | React Flow (@xyflow/react) + dagre |
| **IA** | Groq API (Llama 3.3 70B) |
| **Export** | jsPDF + html2canvas (PDF), docx (Word) |
| **Tests** | Playwright (e2e) |
| **Déploiement** | Vercel (région cdg1) |
| **Package manager** | Bun |

---

## Fonctionnalités

### Gestion des dossiers
- Création, modification, suppression de dossiers juridiques
- Filtres par statut (OUVERT / FERME / ARCHIVE)
- Recherche par titre

### Graphe d'arguments
- Visualisation interactive des arguments sous forme de graphe (React Flow)
- 4 types d'arguments : Principal, Support, Objection, Réfutation
- Relations parent/enfant avec connexion drag & drop
- Layout automatique (dagre) et sauvegarde des positions
- Panneau latéral avec détails, sources liées et analyse IA

### Sources juridiques
- Bibliothèque centralisée de sources par dossier
- Liaison sources ↔ arguments
- URLs externes avec liens directs

### Intelligence Artificielle (Groq)
- **Analyse** — Score de solidité /100, raisonnement, points forts et faiblesses
- **Suggestions** — Propositions concrètes d'amélioration
- **Reformulation** — Réécriture plus percutante avec application en un clic
- Bouton IA directement sur chaque noeud du graphe

### Export
- **PDF** — Document complet avec graphe, arguments hiérarchisés et sources
- **Word (.docx)** — Export serveur avec tableau des sources

### Autres
- Authentification email/mot de passe avec hachage bcrypt
- Thème clair/sombre (next-themes)
- Landing page responsive
- Headers de sécurité (Vercel)

---

## Structure du projet

```
/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── login/                  # Connexion
│   │   └── register/               # Inscription
│   ├── (dashboard)/
│   │   └── dashboard/              # Liste des dossiers + détail
│   └── api/
│       ├── ai/analyze/             # Endpoint IA (analyze, suggest, reformulate)
│       ├── auth/[...nextauth]/     # Auth.js
│       └── export/docx/[caseId]/   # Export Word
├── components/
│   ├── graph/                      # ArgumentGraph, ArgumentNode, ArgumentPanel,
│   │                               # AiAnalysisPanel, Dialogs (Add, Edit, Delete, Link)
│   ├── sources/                    # SourcesManager, Dialogs
│   ├── export/                     # ExportButtons (PDF/Word)
│   └── ui/                         # Shadcn/UI (Button, Dialog, Sheet, etc.)
├── lib/
│   ├── actions/                    # Server Actions (arguments, cases, sources)
│   ├── ai/groq.ts                  # Client Groq SDK
│   ├── export/                     # generate-pdf.ts, format-arguments.ts
│   ├── queries/                    # Requêtes Prisma
│   ├── prisma.ts                   # Instance Prisma (adapter Neon)
│   └── zod.ts                      # Schémas de validation (Zod 4)
├── prisma/
│   ├── schema.prisma               # Modèles : User, Case, Argument, Source
│   └── migrations/
├── e2e/                            # Tests Playwright
│   ├── auth.spec.ts
│   ├── landing.spec.ts
│   └── dashboard.spec.ts
└── vercel.json                     # Config déploiement
```

---

## Installation

### Prérequis

- Node.js 18+
- Bun (recommandé) ou npm/yarn/pnpm
- Un compte [Neon.tech](https://neon.tech) pour PostgreSQL
- Une clé API [Groq](https://console.groq.com) (gratuite)

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd arguminds
```

### 2. Variables d'environnement

Créez un fichier `.env.local` :

```env
DATABASE_URL="votre_url_postgresql_neon"
AUTH_SECRET="votre_secret_genere"
GROQ_API_KEY="votre_cle_groq"
```

> Générez un secret avec `npx auth secret` ou `openssl rand -base64 32`

### 3. Installation des dépendances

```bash
bun install
```

### 4. Base de données

```bash
# Génération du client Prisma
bunx prisma generate

# Synchronisation du schéma
bunx prisma db push

# (Optionnel) Interface Prisma Studio
bunx prisma studio
```

### 5. Lancer le serveur

```bash
bun run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

---

## Tests

```bash
# Tests e2e (Playwright — Chromium)
bun run test:e2e

# Tests e2e avec interface
bun run test:e2e:ui
```

---

## Déploiement (Vercel)

### Variables d'environnement requises

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL PostgreSQL Neon |
| `AUTH_SECRET` | Secret Auth.js |
| `GROQ_API_KEY` | Clé API Groq |

La configuration Vercel (`vercel.json`) inclut :
- Région : `cdg1` (Paris)
- Headers de sécurité : `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`

---

## Roadmap

- [x] Phase 1 — Fondations (Next.js, Prisma, Auth, Dashboard)
- [x] Phase 2 — Gestion des dossiers (CRUD, filtres, statuts)
- [x] Phase 3 — Graphe d'arguments (React Flow, dagre, relations)
- [x] Phase 4 — Sources juridiques (CRUD, liaison arguments)
- [x] Phase 5 — Export PDF/Word, tests e2e, optimisation, déploiement
- [x] Phase 6 — Intelligence Artificielle (Groq : analyse, suggestions, reformulation)
- [ ] Collaboration en temps réel
- [ ] Version mobile (PWA)

---

## Sécurité

- **Server Actions** avec validation de session sur chaque opération
- Validation des données avec **Zod 4**
- Protection des routes via **proxy.ts** (Auth.js v5)
- Hachage des mots de passe avec **bcrypt**
- Headers de sécurité configurés sur Vercel

---

## Disclaimer

Ce projet est un outil d'aide à la décision. **L'humain reste au centre de la stratégie argumentative.**
