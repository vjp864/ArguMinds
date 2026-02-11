# 📋 Cahier des Charges – ARGUMINDS

## 1. Présentation du Projet

### 1.1 Contexte
**ARGUMINDS** est une plateforme SaaS destinée aux professionnels du droit et aux débatteurs. Elle répond au besoin de structurer des raisonnements complexes, de visualiser les liens logiques entre arguments et de centraliser les sources juridiques dans un environnement collaboratif.

### 1.2 Objectifs
- Faciliter la construction d'argumentaires solides et cohérents
- Visualiser graphiquement les relations entre arguments (support, réfutation, objection)
- Centraliser les sources juridiques (jurisprudence, doctrine, textes de loi)
- Permettre l'export des structures argumentatives vers des formats exploitables (PDF, Word)
- Offrir une expérience utilisateur fluide et intuitive

### 1.3 Public Cible
- **Avocats** : Préparation de plaidoiries, analyse de dossiers complexes
- **Débatteurs** : Structuration d'arguments pour compétitions ou formations
- **Étudiants en droit** : Apprentissage de la construction argumentative
- **Juristes d'entreprise** : Analyse de risques juridiques

---

## 2. Fonctionnalités

### 2.1 Authentification et Gestion des Utilisateurs

#### 2.1.1 Inscription / Connexion
- **Inscription** par email et mot de passe
- **Connexion** via NextAuth.js
- Validation des emails (optionnel en Phase 1)
- Récupération de mot de passe

#### 2.1.2 Profils Utilisateurs
- Champs : Nom, Prénom, Email, Rôle (Avocat / Débatteur)
- Photo de profil (optionnel)
- Paramètres de compte

#### 2.1.3 Gestion des Rôles
- **Avocat** : Accès aux fonctionnalités juridiques avancées
- **Débatteur** : Fonctionnalités orientées argumentation logique
- Possibilité d'évolution vers un système de permissions plus granulaire

---

### 2.2 Gestion des Dossiers (Cases)

#### 2.2.1 CRUD des Dossiers
- **Créer** un nouveau dossier avec :
  - Titre
  - Description
  - Type (Civil, Pénal, Commercial, Débat, etc.)
  - Date de création / modification
- **Lire** : Liste des dossiers avec filtres et recherche
- **Mettre à jour** : Modification des informations du dossier
- **Supprimer** : Suppression avec confirmation

#### 2.2.2 Organisation
- Tags / Catégories pour classifier les dossiers
- Statut (En cours, Terminé, Archivé)
- Favoris pour un accès rapide

---

### 2.3 Éditeur d'Arguments (Graph Engine)

#### 2.3.1 Visualisation Graphique
- Utilisation de **React Flow** pour afficher les arguments sous forme de nœuds
- Types de nœuds :
  - **Argument principal** (thèse)
  - **Argument de support** (prémisses)
  - **Contre-argument** (objection)
  - **Réfutation**
- Liens directionnels entre nœuds (flèches)

#### 2.3.2 CRUD des Arguments
- **Créer** un argument avec :
  - Titre
  - Contenu (texte enrichi)
  - Type (Support, Objection, Réfutation)
  - Poids / Force argumentative (optionnel)
- **Modifier** : Édition en ligne ou via panneau latéral
- **Supprimer** : Avec confirmation et gestion des dépendances
- **Réorganiser** : Drag & drop pour restructurer le graphe

#### 2.3.3 Relations entre Arguments
- Définition de relations parent/enfant
- Support logique : A → B (A soutient B)
- Objection : A ⊥ B (A contredit B)
- Visualisation des chaînes d'arguments

---

### 2.4 Gestion des Sources

#### 2.4.1 Ajout de Sources
- URL (lien vers jurisprudence, article de loi, doctrine)
- Texte brut (citation, extrait)
- Fichiers PDF (optionnel en Phase 2)
- Métadonnées : Titre, Auteur, Date, Juridiction

#### 2.4.2 Liaison Sources ↔ Arguments
- Associer une ou plusieurs sources à un argument
- Affichage des sources dans le panneau de détail de l'argument
- Navigation rapide vers les sources

#### 2.4.3 Bibliothèque de Sources
- Liste centralisée de toutes les sources du dossier
- Recherche et filtres
- Réutilisation des sources dans plusieurs arguments

---

### 2.5 Export et Partage

#### 2.5.1 Export en PDF
- Génération d'un document structuré avec :
  - Graphe des arguments (image ou schéma)
  - Liste détaillée des arguments
  - Sources associées
- Format professionnel (en-tête, pagination)

#### 2.5.2 Export en Word (.docx)
- Document éditable pour intégration dans des plaidoiries
- Structure hiérarchique des arguments

#### 2.5.3 Partage de Dossiers (Phase 3+)
- Lien de partage en lecture seule
- Collaboration en temps réel (optionnel)

---

## 3. Spécifications Techniques

### 3.1 Architecture

#### 3.1.1 Frontend
- **Framework** : Next.js 16+ avec App Router
- **UI** : Tailwind CSS + Shadcn/UI
- **Visualisation** : React Flow pour les graphes
- **Gestion d'état** : Zustand ou React Context (selon complexité)

#### 3.1.2 Backend
- **API** : Next.js API Routes (App Router)
- **Authentification** : NextAuth.js (Email/Password, OAuth optionnel)
- **Validation** : Zod pour la validation des données

#### 3.1.3 Base de Données
- **SGBD** : PostgreSQL (hébergé sur Neon.tech)
- **ORM** : Prisma
- **Schéma** (simplifié) :
  ```prisma
  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    name      String?
    role      Role     @default(AVOCAT)
    cases     Case[]
    createdAt DateTime @default(now())
  }

  model Case {
    id          String     @id @default(cuid())
    title       String
    description String?
    type        String?
    status      Status     @default(EN_COURS)
    userId      String
    user        User       @relation(fields: [userId], references: [id])
    arguments   Argument[]
    sources     Source[]
    createdAt   DateTime   @default(now())
    updatedAt   DateTime   @updatedAt
  }

  model Argument {
    id          String     @id @default(cuid())
    title       String
    content     String
    type        ArgType    @default(SUPPORT)
    caseId      String
    case        Case       @relation(fields: [caseId], references: [id])
    parentId    String?
    parent      Argument?  @relation("ArgumentHierarchy", fields: [parentId], references: [id])
    children    Argument[] @relation("ArgumentHierarchy")
    sources     Source[]
    position    Json?      // Pour React Flow (x, y)
    createdAt   DateTime   @default(now())
  }

  model Source {
    id          String     @id @default(cuid())
    title       String
    url         String?
    content     String?
    caseId      String
    case        Case       @relation(fields: [caseId], references: [id])
    arguments   Argument[]
    createdAt   DateTime   @default(now())
  }

  enum Role {
    AVOCAT
    DEBATTEUR
  }

  enum Status {
    EN_COURS
    TERMINE
    ARCHIVE
  }

  enum ArgType {
    PRINCIPAL
    SUPPORT
    OBJECTION
    REFUTATION
  }
  ```

### 3.2 Sécurité

#### 3.2.1 Authentification
- Sessions sécurisées via NextAuth.js
- Tokens JWT pour l'API
- Protection CSRF

#### 3.2.2 Autorisation
- Middleware de vérification de session sur toutes les routes protégées
- Validation côté serveur (Server Actions)
- Principe de moindre privilège (utilisateur ne peut accéder qu'à ses propres dossiers)

#### 3.2.3 Validation des Données
- Schémas Zod pour toutes les entrées utilisateur
- Sanitisation des données pour éviter XSS
- Rate limiting sur les endpoints sensibles (optionnel Phase 2)

### 3.3 Performance
- **Lazy loading** des graphes complexes
- **Pagination** des listes de dossiers et arguments
- **Caching** avec React Query ou SWR (optionnel)
- **Optimisation des images** via next/image

### 3.4 Accessibilité
- Respect des standards WCAG 2.1 (niveau AA minimum)
- Navigation au clavier
- Labels ARIA sur les composants interactifs

---

## 4. Maquettes et Design

### 4.1 Charte Graphique
- **Couleurs principales** :
  - Primaire : Bleu professionnel (#1E40AF)
  - Secondaire : Gris neutre (#6B7280)
  - Accent : Vert validation (#10B981)
  - Erreur : Rouge (#EF4444)
- **Typographie** : Inter ou Geist (Vercel Font)
- **Style** : Minimaliste, professionnel, focus sur la lisibilité

### 4.2 Pages Clés
1. **Page de connexion** : Formulaire centré, branding sobre
2. **Dashboard** : Grille de cartes pour les dossiers, sidebar de navigation
3. **Éditeur de dossier** : Canvas principal pour le graphe, panneau latéral pour les détails
4. **Bibliothèque de sources** : Table avec recherche et filtres

### 4.3 Composants UI (Shadcn/UI)
- Boutons, inputs, modals
- Data tables avec tri et pagination
- Toasts pour les notifications
- Skeleton loaders

---

## 5. Plan de Développement (Roadmap)

### Phase 1 : Fondations (2-3 semaines)
- [ ] Setup du projet (Next.js, Tailwind, Shadcn)
- [ ] Configuration Prisma + Base de données Neon
- [ ] Authentification NextAuth (Email/Password)
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

## 6. Contraintes et Risques

### 6.1 Contraintes Techniques
- **Complexité du graphe** : React Flow peut être lourd pour des graphes avec 100+ nœuds → optimisation nécessaire
- **Export PDF** : Qualité du rendu graphique → utiliser Puppeteer ou jsPDF avec canvas
- **Sécurité des données** : Conformité RGPD pour les données juridiques sensibles

### 6.2 Risques Identifiés
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Performances dégradées avec graphes complexes | Moyenne | Élevé | Lazy loading, pagination, virtualisation |
| Complexité de l'UX pour les utilisateurs non techniques | Faible | Moyen | Tutoriels intégrés, tooltips |
| Problèmes de déploiement sur Vercel | Faible | Moyen | Tests en environnement de staging |

---

## 7. Critères de Succès

### 7.1 Critères Fonctionnels
- [ ] Un utilisateur peut créer un compte et se connecter
- [ ] Un utilisateur peut créer, modifier et supprimer des dossiers
- [ ] Un utilisateur peut construire un graphe d'arguments avec au moins 20 nœuds
- [ ] Les sources peuvent être associées aux arguments
- [ ] L'export PDF génère un document exploitable

### 7.2 Critères Non-Fonctionnels
- [ ] Temps de chargement du dashboard < 2 secondes
- [ ] Temps de rendu d'un graphe de 50 nœuds < 3 secondes
- [ ] Taux de disponibilité > 99% (après déploiement)
- [ ] Score Lighthouse > 90 (Performance, Accessibilité)

---

## 8. Livrables

### 8.1 Documentation
- [ ] README.md (installation, configuration)
- [ ] Guide utilisateur (PDF ou page web)
- [ ] Documentation technique (architecture, API)

### 8.2 Code Source
- [ ] Repository GitHub avec branches (dev, staging, main)
- [ ] Tests unitaires et d'intégration (optionnel Phase 1)
- [ ] CI/CD avec GitHub Actions (optionnel)

### 8.3 Déploiement
- [ ] Application déployée sur Vercel
- [ ] Base de données sur Neon.tech
- [ ] Nom de domaine personnalisé (optionnel)

---

## 9. Budget et Ressources

### 9.1 Ressources Humaines
- **1 Développeur Full-Stack** : Next.js, React, Prisma, PostgreSQL
- **1 Designer UI/UX** (optionnel pour Phase 2+)

### 9.2 Coûts Estimés
- **Hébergement** : Vercel (Gratuit pour hobby projects, ~20$/mois pour Pro)
- **Base de données** : Neon.tech (Gratuit jusqu'à 3 Go, puis ~19$/mois)
- **Domaine** : ~15$/an (optionnel)
- **Total Phase 1-5** : ~50-100$ (si déploiement production)

### 9.3 Durée Totale Estimée
- **Phase 1-5** : 12-15 semaines (3-4 mois)
- **Phase 6** (améliorations) : À définir selon les retours utilisateurs

---

## 10. Annexes

### 10.1 Glossaire
- **Argument** : Unité logique de raisonnement (prémisse ou conclusion)
- **Graphe** : Représentation visuelle des relations entre arguments
- **Source** : Référence juridique ou documentaire soutenant un argument
- **Dossier (Case)** : Conteneur regroupant arguments et sources sur un sujet donné

### 10.2 Références
- [Next.js Documentation](https://nextjs.org/docs)
- [React Flow Documentation](https://reactflow.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/UI](https://ui.shadcn.com)

---

**Date de création** : 11 février 2026  
**Version** : 1.0  
**Auteur** : Équipe ARGUMINDS