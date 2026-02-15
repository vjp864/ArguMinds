# Cahier des Charges — ARGUMINDS

## 1. Presentation du Projet

### 1.1 Contexte
**ARGUMINDS** est une plateforme SaaS destinee aux professionnels du droit et aux debatteurs. Elle repond au besoin de structurer des raisonnements complexes, de visualiser les liens logiques entre arguments, de centraliser les sources juridiques et d'exploiter l'intelligence artificielle pour renforcer chaque argument.

### 1.2 Objectifs
- Faciliter la construction d'argumentaires solides et coherents
- Visualiser graphiquement les relations entre arguments (support, refutation, objection)
- Centraliser les sources juridiques (jurisprudence, doctrine, textes de loi)
- Analyser la solidite des arguments via l'IA (score, suggestions, reformulation)
- Permettre l'export des structures argumentatives vers des formats exploitables (PDF, Word)
- Offrir une experience utilisateur fluide et intuitive

### 1.3 Public Cible
- **Avocats** : Preparation de plaidoiries, analyse de dossiers complexes
- **Debatteurs** : Structuration d'arguments pour competitions ou formations
- **Etudiants en droit** : Apprentissage de la construction argumentative
- **Juristes d'entreprise** : Analyse de risques juridiques

---

## 2. Fonctionnalites

### 2.1 Authentification et Gestion des Utilisateurs

#### 2.1.1 Inscription / Connexion
- [x] **Inscription** par email et mot de passe avec hachage bcrypt
- [x] **Connexion** via Auth.js v5 (NextAuth beta) avec strategie JWT
- [ ] Validation des emails (optionnel)
- [ ] Recuperation de mot de passe (optionnel)

#### 2.1.2 Profils Utilisateurs
- [x] Champs : Nom, Email, Role (Avocat / Debatteur)
- [x] Page de profil dediee (`/profile`) avec avatar, infos, statistiques
- [x] Modification du nom et de l'email avec validation Zod
- [x] Changement de mot de passe securise (verification de l'ancien avec bcrypt)
- [x] Suppression de compte avec confirmation (AlertDialog) et cascade des donnees
- [x] Lien "Mon Profil" dans le menu dropdown de l'avatar
- [ ] Photo de profil (optionnel)

#### 2.1.3 Gestion des Roles
- [x] **Avocat** : Acces aux fonctionnalites juridiques
- [x] **Debatteur** : Fonctionnalites orientees argumentation logique
- [x] Role defini a l'inscription, stocke en base

---

### 2.2 Gestion des Dossiers (Cases)

#### 2.2.1 CRUD des Dossiers
- [x] **Creer** un nouveau dossier (titre, description, type)
- [x] **Lire** : Liste des dossiers avec recherche par titre
- [x] **Mettre a jour** : Modification des informations
- [x] **Supprimer** : Suppression avec confirmation (dialog)

#### 2.2.2 Organisation
- [x] Statut (OUVERT / FERME / ARCHIVE) avec filtres
- [x] Recherche par titre
- [x] Compteur d'arguments par dossier

---

### 2.3 Editeur d'Arguments (Graph Engine)

#### 2.3.1 Visualisation Graphique
- [x] Utilisation de **React Flow** (@xyflow/react) pour afficher les arguments sous forme de noeuds
- [x] Layout automatique avec **dagre** (direction top-bottom)
- [x] Types de noeuds avec styles distincts :
  - **Principal** (these) — bleu
  - **Support** (premisses) — vert
  - **Objection** (contre-argument) — rouge
  - **Refutation** — gris
- [x] Liens directionnels animes entre noeuds (fleches)
- [x] Controles interactifs (zoom, pan, minimap)

#### 2.3.2 CRUD des Arguments
- [x] **Creer** un argument (titre, contenu, type, parent optionnel) via dialog
- [x] **Modifier** : Edition via dialog avec pre-remplissage
- [x] **Supprimer** : Avec confirmation dialog
- [x] **Reorganiser** : Drag & drop pour repositionner les noeuds
- [x] Sauvegarde automatique des positions (JSON en base)
- [x] **Editeur de texte riche** (TipTap/ProseMirror) pour le contenu des arguments :
  - Gras, Italique, Souligne, Surligne
  - Titres (H2, H3)
  - Listes a puces et numerotees
  - Citations (blockquote)
  - Indentation (augmenter/reduire)
  - Alignement (gauche, centre, droite, justifie)
  - Annuler/Retablir (undo/redo)
- [x] Affichage du contenu formate dans le panneau lateral et les noeuds du graphe

#### 2.3.3 Relations entre Arguments
- [x] Definition de relations parent/enfant a la creation
- [x] Connexion drag & drop entre noeuds dans le graphe
- [x] Visualisation hierarchique des chaines d'arguments

#### 2.3.4 Panneau lateral
- [x] Clic sur un noeud ouvre un panneau de detail (Sheet)
- [x] Affichage : titre, type (badge), contenu, date de creation
- [x] Sources liees avec possibilite de lier/detacher
- [x] Section Intelligence Artificielle integree
- [x] Actions rapides : Modifier, Supprimer

---

### 2.4 Gestion des Sources

#### 2.4.1 Ajout de Sources
- [x] Titre obligatoire
- [x] URL optionnelle (lien vers jurisprudence, article de loi, doctrine)
- [x] Contenu optionnel (citation, extrait)

#### 2.4.2 Liaison Sources <-> Arguments
- [x] Associer une ou plusieurs sources a un argument depuis le panneau lateral
- [x] Detacher une source d'un argument
- [x] Affichage des sources liees dans le panneau de detail
- [x] Liens cliquables vers les URLs externes

#### 2.4.3 Bibliotheque de Sources
- [x] Liste centralisee de toutes les sources du dossier (SourcesManager)
- [x] CRUD complet des sources
- [x] Reutilisation des sources dans plusieurs arguments

---

### 2.5 Intelligence Artificielle

#### 2.5.1 Analyse des Arguments
- [x] **Score de solidite** : Note de 0 a 100 avec barre de progression coloree
  - Vert (>= 75), Bleu (>= 50), Jaune (>= 25), Rouge (< 25)
- [x] **Raisonnement** : Explication concise de l'evaluation par l'IA
- [x] **Points forts** : Liste des forces de l'argument
- [x] **Faiblesses** : Liste des faiblesses identifiees

#### 2.5.2 Suggestions d'Amelioration
- [x] 3 suggestions detaillees et concretes pour renforcer l'argument
- [x] Prise en compte du contexte (sources liees, argument parent)

#### 2.5.3 Reformulation
- [x] Proposition de reformulation plus percutante et structuree
- [x] Conservation du sens et de l'intention originale
- [x] Bouton "Appliquer" pour mettre a jour l'argument en un clic

#### 2.5.4 Integration UI
- [x] Bouton Sparkles sur chaque noeud du graphe (acces rapide)
- [x] Section "Intelligence Artificielle" dans le panneau lateral
- [x] 3 boutons d'action : Analyser, Suggestions, Reformuler
- [x] Etats de chargement (spinner) pendant l'appel API
- [x] Notifications toast (succes / erreur)

#### 2.5.5 Specifications Techniques IA
- **Modele** : Llama 3.3 70B via Groq API (gratuit, rapide)
- **SDK** : groq-sdk (format OpenAI-compatible)
- **Endpoint** : `/api/ai/analyze` (POST, authentifie)
- **Parametres** : temperature 0.4, max_tokens 2048
- **Format** : Reponses en JSON structure, parsing avec regex
- **Prompts** : Expert en argumentation juridique, rhetorique et logique formelle
- **Contexte** : Titre, contenu, type, sources liees, argument parent

---

### 2.6 Export et Partage

#### 2.6.1 Export en PDF
- [x] Generation cote client avec **jsPDF** + **html2canvas**
- [x] Contenu du document :
  - Informations du dossier (titre, description, type, statut, date)
  - Capture du graphe d'arguments (optionnelle, si visible)
  - Liste hierarchique des arguments (indentation par niveau)
  - Tableau des sources
- [x] Pagination automatique avec numeros de page
- [x] Gestion des caracteres Unicode (sanitisation)

#### 2.6.2 Export en Word (.docx)
- [x] Generation cote serveur via l'API (`/api/export/docx/[caseId]`)
- [x] Utilisation du package **docx**
- [x] Structure hierarchique des arguments
- [x] Tableau des sources avec mise en forme
- [x] Verification d'authentification et de propriete du dossier

#### 2.6.3 Partage de Dossiers (futur)
- [ ] Lien de partage en lecture seule
- [ ] Collaboration en temps reel

---

## 3. Specifications Techniques

### 3.1 Architecture

#### 3.1.1 Frontend
- **Framework** : Next.js 16.1.6 (App Router, Turbopack)
- **UI** : Tailwind CSS 4 + Shadcn/UI (style New York) + @tailwindcss/typography
- **Visualisation** : React Flow (@xyflow/react v12.10) + dagre
- **Editeur riche** : TipTap 3 (@tiptap/react, starter-kit, extensions underline/highlight/text-align/placeholder)
- **Theming** : next-themes (clair/sombre)
- **Notifications** : Sonner (toasts)
- **Icones** : lucide-react
- **Formulaires** : useActionState + Server Actions

#### 3.1.2 Backend
- **API Routes** : Next.js App Router (Route Handlers)
- **Server Actions** : Pour toutes les operations CRUD
- **Authentification** : Auth.js v5 (next-auth@beta) — Credentials, JWT
- **Validation** : Zod 4 (`.issues` pour les erreurs)
- **Protection des routes** : proxy.ts (remplace middleware dans Next.js 16)

#### 3.1.3 Base de Donnees
- **SGBD** : PostgreSQL (heberge sur Neon.tech)
- **ORM** : Prisma 7 avec `prisma-client` provider et `@prisma/adapter-neon`
- **Schema** :
  ```prisma
  model User {
    id            String    @id @default(cuid())
    email         String    @unique
    name          String?
    password      String?
    role          Role      @default(AVOCAT)
    cases         Case[]
    // + champs Auth.js (accounts, sessions)
  }

  model Case {
    id          String     @id @default(cuid())
    title       String
    description String?
    type        String?
    status      Status     @default(OUVERT)
    userId      String
    user        User       @relation(fields: [userId], references: [id])
    arguments   Argument[]
    sources     Source[]
  }

  model Argument {
    id          String     @id @default(cuid())
    title       String
    content     String
    type        ArgType    @default(SUPPORT)
    caseId      String
    case        Case       @relation(fields: [caseId], references: [id], onDelete: Cascade)
    parentId    String?
    parent      Argument?  @relation("ArgumentHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
    children    Argument[] @relation("ArgumentHierarchy")
    sources     Source[]
    position    Json?
  }

  model Source {
    id          String     @id @default(cuid())
    title       String
    url         String?
    content     String?
    caseId      String
    case        Case       @relation(fields: [caseId], references: [id], onDelete: Cascade)
    arguments   Argument[]
  }

  enum Role      { AVOCAT, DEBATTEUR }
  enum Status    { OUVERT, FERME, ARCHIVE }
  enum ArgType   { PRINCIPAL, SUPPORT, OBJECTION, REFUTATION }
  ```

#### 3.1.4 Intelligence Artificielle
- **Fournisseur** : Groq (API gratuite, basse latence)
- **Modele** : Llama 3.3 70B Versatile
- **SDK** : groq-sdk (format OpenAI-compatible)
- **Client** : `lib/ai/groq.ts` — fonction `callGroq(systemPrompt, userPrompt)`
- **API Route** : `app/api/ai/analyze/route.ts` — 3 actions (analyze, suggest, reformulate)

### 3.2 Securite

#### 3.2.1 Authentification
- [x] Sessions securisees via Auth.js v5 (strategie JWT)
- [x] Hachage des mots de passe avec bcrypt
- [x] Protection CSRF integree

#### 3.2.2 Autorisation
- [x] Verification de session sur chaque Server Action et API Route
- [x] Verification de propriete du dossier (userId) avant toute operation
- [x] Protection des routes via proxy.ts (redirection vers /login)
- [x] Principe de moindre privilege (acces uniquement aux propres dossiers)

#### 3.2.3 Validation des Donnees
- [x] Schemas Zod 4 pour toutes les entrees utilisateur
- [x] Validation cote serveur systematique (Server Actions)

#### 3.2.4 Headers de Securite (Vercel)
- [x] `X-Content-Type-Options: nosniff`
- [x] `X-Frame-Options: DENY`
- [x] `Referrer-Policy: strict-origin-when-cross-origin`

### 3.3 Performance
- [x] **Dynamic imports** : jsPDF, html2canvas, file-saver charges uniquement au clic
- [x] **optimizePackageImports** : lucide-react, @xyflow/react, docx (tree-shaking)
- [x] **Compression** activee (`compress: true` dans next.config.ts)
- [x] **Images** : Formats AVIF et WebP
- [x] `poweredByHeader: false` pour securite
- [x] `reactStrictMode: true`

---

## 4. Design et Interface

### 4.1 Charte Graphique
- **Systeme de couleurs** : oklch (Tailwind CSS 4)
- **Theme** : Clair et sombre (next-themes)
- **Typographie** : Geist Sans / Geist Mono (Vercel)
- **Style** : Minimaliste, professionnel, Shadcn/UI New York

### 4.2 Pages
1. **Landing page** : Hero, 3 fonctionnalites, 3 etapes, CTA, footer
2. **Connexion / Inscription** : Formulaires centres, branding sobre
3. **Dashboard** : Grille de cartes dossiers, filtres, recherche, boutons export
4. **Detail dossier** : Canvas React Flow, panneau lateral, sources, IA, editeur riche
5. **Profil** : Avatar, informations personnelles, securite, zone dangereuse

### 4.3 Composants UI (Shadcn/UI)
- Button, Input, Textarea, Select, Label
- Dialog, Sheet (panneau lateral), AlertDialog, Separator
- Badge, Card, Avatar, Skeleton
- Toasts (Sonner)
- RichTextEditor (TipTap), RichTextDisplay (rendu HTML prose)

---

## 5. Tests

### 5.1 Tests End-to-End (Playwright)
- [x] **Tests d'authentification** (6 tests) : Boutons landing, rendu login/register, login invalide, redirection, validation
- [x] **Tests landing page** (6 tests) : Hero, fonctionnalites, etapes, CTA, navbar, footer
- [x] **Tests dashboard** : Navigation, operations (necessite utilisateur de test)
- **Navigateur** : Chromium
- **Configuration** : `playwright.config.ts`

### 5.2 Tests unitaires
- [ ] Tests unitaires (optionnel, a definir selon besoins)

---

## 6. Plan de Developpement (Roadmap)

### Phase 1 : Fondations — TERMINE
- [x] Setup Next.js 16, Tailwind CSS 4, Shadcn/UI
- [x] Configuration Prisma 7 + Base de donnees Neon
- [x] Authentification Auth.js v5 (Email/Password, JWT)
- [x] Pages : Connexion, Inscription, Dashboard
- [x] Modeles : User, Case (CRUD)

### Phase 2 : Gestion des Dossiers — TERMINE
- [x] CRUD complet des dossiers
- [x] Filtres par statut, recherche par titre
- [x] Interface Dashboard (grille de cartes)
- [x] Gestion des roles (Avocat/Debatteur)

### Phase 3 : Graph Engine — TERMINE
- [x] Integration de React Flow (@xyflow/react)
- [x] CRUD des arguments (creation, edition, suppression)
- [x] Relations parent/enfant entre arguments
- [x] Visualisation du graphe (zoom, pan, layout automatique dagre)
- [x] Sauvegarde des positions des noeuds
- [x] Panneau lateral de detail

### Phase 4 : Sources Juridiques — TERMINE
- [x] CRUD des sources
- [x] Liaison sources <-> arguments
- [x] Bibliotheque centralisee (SourcesManager)

### Phase 5 : Export et Finalisation — TERMINE
- [x] Export PDF avec graphe et details (jsPDF + html2canvas)
- [x] Export Word .docx (package docx, cote serveur)
- [x] Tests end-to-end (Playwright, 12 tests)
- [x] Optimisation des performances (dynamic imports, tree-shaking)
- [x] Deploiement sur Vercel (region cdg1, headers securite)
- [x] Landing page

### Phase 6 : Intelligence Artificielle — TERMINE
- [x] Integration Groq API (Llama 3.3 70B)
- [x] Analyse de la solidite des arguments (score /100)
- [x] Suggestions d'amelioration (3 propositions concretes)
- [x] Reformulation avec application en un clic
- [x] Bouton IA sur chaque noeud du graphe
- [x] Section IA dans le panneau lateral

### Phase 7 : Profil Utilisateur — TERMINE
- [x] Page de profil (`/profile`) avec avatar, infos, statistiques
- [x] Modification du nom et de l'email
- [x] Changement de mot de passe securise
- [x] Suppression de compte avec cascade des donnees
- [x] Server actions dediees (`lib/actions/profile.ts`)
- [x] Schemas de validation Zod (`updateProfileSchema`, `changePasswordSchema`)

### Phase 8 : Editeur de Texte Riche — TERMINE
- [x] Integration de TipTap 3 (ProseMirror) dans les dialogs d'arguments
- [x] Barre d'outils WYSIWYG : Gras, Italique, Souligne, Surligne, Titres, Listes, Citations, Indentation, Alignement, Undo/Redo
- [x] Composant reutilisable `RichTextEditor` (`components/ui/rich-text-editor.tsx`)
- [x] Composant d'affichage `RichTextDisplay` (`components/ui/rich-text-display.tsx`)
- [x] Affichage formate dans le panneau lateral et les reformulations IA
- [x] Apercu texte brut dans les noeuds du graphe (strip HTML)
- [x] Compatibilite export PDF (strip HTML pour @react-pdf/renderer)
- [x] Plugin `@tailwindcss/typography` pour les styles prose

### Ameliorations Futures (optionnel)
- [ ] Collaboration en temps reel
- [ ] Version mobile (Progressive Web App)
- [ ] Export PDF ameliore (Puppeteer cote serveur)
- [ ] Historique des analyses IA par argument

---

## 7. Contraintes et Risques

### 7.1 Contraintes Techniques
- **Complexite du graphe** : React Flow peut ralentir avec 100+ noeuds — optimisation par lazy loading et virtualisation
- **Export PDF** : jsPDF ne supporte pas toutes les polices/styles — sanitisation des caracteres Unicode implementee
- **IA** : Dependance a l'API Groq (gratuite mais avec limites de debit) — gestion d'erreurs et fallback implementes
- **Securite des donnees** : Conformite RGPD pour les donnees juridiques sensibles

### 7.2 Risques Identifies
| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Performances degradees avec graphes complexes | Moyenne | Eleve | Dynamic imports, optimizePackageImports, dagre |
| Indisponibilite API Groq | Faible | Moyen | Gestion d'erreurs, toast utilisateur, fonctionnement sans IA |
| Qualite variable des reponses IA | Moyenne | Faible | Prompts structures, temperature basse (0.4), format JSON impose |
| Problemes de deploiement Vercel | Faible | Moyen | Build `prisma generate && next build`, dotenv configure |

---

## 8. Criteres de Succes

### 8.1 Criteres Fonctionnels
- [x] Un utilisateur peut creer un compte et se connecter
- [x] Un utilisateur peut gerer son profil (modifier, changer mdp, supprimer)
- [x] Un utilisateur peut creer, modifier et supprimer des dossiers
- [x] Un utilisateur peut construire un graphe d'arguments avec relations
- [x] Le contenu des arguments peut etre formate (gras, italique, listes, etc.)
- [x] Les sources peuvent etre associees aux arguments
- [x] L'IA analyse les arguments et propose des ameliorations
- [x] L'export PDF et Word genere des documents exploitables

### 8.2 Criteres Non-Fonctionnels
- [x] Application deployee et fonctionnelle sur Vercel
- [x] 12 tests e2e passent (Playwright)
- [x] Build Next.js sans erreur
- [ ] Score Lighthouse > 90 (a mesurer)

---

## 9. Livrables

### 9.1 Documentation
- [x] README.md (installation, configuration, fonctionnalites)
- [x] Cahier des charges (ce document)
- [ ] Guide utilisateur (optionnel)

### 9.2 Code Source
- [x] Repository GitHub
- [x] Tests e2e avec Playwright (12 tests)
- [ ] CI/CD avec GitHub Actions (optionnel)

### 9.3 Deploiement
- [x] Application deployee sur Vercel (region cdg1)
- [x] Base de donnees sur Neon.tech
- [x] Variables d'environnement configurees (DATABASE_URL, AUTH_SECRET, GROQ_API_KEY)
- [ ] Nom de domaine personnalise (optionnel)

---

## 10. Budget et Ressources

### 10.1 Ressources Humaines
- **1 Developpeur Full-Stack** : Next.js, React, Prisma, PostgreSQL

### 10.2 Couts
| Service | Cout |
|---------|------|
| Vercel (Hobby) | Gratuit |
| Neon.tech (Free tier) | Gratuit (jusqu'a 0.5 Go) |
| Groq API | Gratuit (limites de debit) |
| Domaine (optionnel) | ~15$/an |

### 10.3 Duree
- **Phases 1-6** : Completees
- **Ameliorations futures** : A definir selon retours utilisateurs

---

## 11. Annexes

### 11.1 Glossaire
- **Argument** : Unite logique de raisonnement (premisse ou conclusion)
- **Graphe** : Representation visuelle des relations entre arguments
- **Source** : Reference juridique ou documentaire soutenant un argument
- **Dossier (Case)** : Conteneur regroupant arguments et sources sur un sujet donne
- **Groq** : Plateforme d'inference IA ultra-rapide (LPU)
- **Llama 3.3 70B** : Modele de langage open-source de Meta utilise pour l'analyse

### 11.2 References Techniques
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React Flow Documentation](https://reactflow.dev)
- [Prisma 7 Documentation](https://www.prisma.io/docs)
- [Shadcn/UI](https://ui.shadcn.com)
- [Auth.js v5 Documentation](https://authjs.dev)
- [Groq API Documentation](https://console.groq.com/docs)
- [Playwright Documentation](https://playwright.dev)

### 11.3 Variables d'Environnement
| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DATABASE_URL` | URL de connexion PostgreSQL Neon | Oui |
| `AUTH_SECRET` | Secret pour Auth.js (JWT) | Oui |
| `GROQ_API_KEY` | Cle API Groq pour l'IA | Oui |

---

**Date de creation** : 11 fevrier 2026
**Derniere mise a jour** : 15 fevrier 2026
**Version** : 3.0
**Auteur** : Equipe ARGUMINDS
