# Djidah Electrique — Site E-Commerce

Boutique en ligne premium pour iPhones et gadgets high-tech à Dakar, Sénégal.

## 🛠️ Stack Technique

| Techno | Usage |
|--------|-------|
| **Next.js 16** (App Router) | Framework React fullstack |
| **TypeScript** | Typage statique |
| **Tailwind CSS v4** | Styling utilitaire |
| **Shadcn/ui** | Composants UI |
| **Framer Motion** | Animations |
| **Prisma ORM** | Base de données |
| **Supabase** | PostgreSQL + Storage |
| **NextAuth v4** | Authentification JWT |
| **Vercel** | Déploiement |

## 📁 Structure du Projet

```
├── prisma/
│   ├── schema.prisma              # Modèles DB (Product, HeroSlide, AdminUser, AnalyticsEvent)
│   ├── seed.ts                    # Données initiales (produits + admin)
│   └── seed-hero.ts               # Slides du carrousel par défaut
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/products/           # Images produits (12 PNG)
├── src/
│   ├── middleware.ts              # Protection JWT routes admin
│   ├── app/
│   │   ├── layout.tsx            # Layout racine (Inter font + Toaster)
│   │   ├── globals.css           # Styles globaux
│   │   ├── (shop)/               # Pages client
│   │   │   ├── layout.tsx        # Navbar + Footer + Cart + Favorites + WhatsApp
│   │   │   ├── page.tsx          # Accueil (Hero + Catégories + Vedettes + Réparation)
│   │   │   ├── shop/page.tsx     # Boutique avec filtres avancés
│   │   │   └── product/[id]/page.tsx  # Détail produit
│   │   ├── admin-dashboard/      # Panel admin
│   │   │   ├── layout.tsx        # SessionProvider + Suspense
│   │   │   ├── page.tsx          # Dashboard (5 onglets)
│   │   │   └── login/page.tsx    # Page de connexion
│   │   └── api/                  # Routes API
│   │       ├── products/         # CRUD produits
│   │       ├── hero-slides/      # CRUD carrousel
│   │       ├── upload/           # Upload images (Supabase Storage)
│   │       ├── analytics/        # Tracking événements
│   │       ├── auth/             # NextAuth
│   │       └── admin/            # Change password
│   ├── components/
│   │   ├── client/               # Composants métier
│   │   │   ├── hero-section.tsx       # Carrousel hero (Framer Motion)
│   │   │   ├── product-card.tsx       # Carte produit avec promo
│   │   │   ├── featured-products.tsx  # Grille produits vedettes
│   │   │   ├── category-grid.tsx      # Grille catégories
│   │   │   ├── navbar.tsx             # Barre de navigation
│   │   │   ├── footer.tsx             # Pied de page
│   │   │   ├── cart-panel.tsx         # Panneau panier
│   │   │   ├── favorites-panel.tsx    # Panneau favoris
│   │   │   ├── whatsapp-float.tsx     # Bouton WhatsApp flottant
│   │   │   └── repair-section.tsx     # Section réparation
│   │   └── ui/                   # 40+ composants Shadcn/ui
│   ├── contexts/
│   │   ├── cart-context.tsx      # Panier (useSyncExternalStore + localStorage)
│   │   └── favorites-context.tsx # Favoris (useSyncExternalStore + localStorage)
│   ├── hooks/
│   │   ├── use-mobile.ts        # Détection mobile
│   │   └── use-toast.ts         # Notifications toast
│   └── lib/
│       ├── db.ts                 # Prisma Client singleton
│       ├── auth.ts               # NextAuth config (Credentials + bcrypt)
│       ├── supabase.ts           # Client Supabase (lazy init)
│       ├── analytics.ts          # Tracking helper
│       └── utils.ts              # Utilitaires (cn, etc.)
├── .env                          # Variables d'environnement (À REMPLIR)
├── .env.example                  # Template des variables
├── next.config.ts                # Config Next.js (images Supabase)
├── tailwind.config.ts            # Config Tailwind
├── tsconfig.json                 # Config TypeScript
├── package.json                  # Dépendances
└── components.json               # Config Shadcn/ui
```

## 🚀 Installation & Lancement

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copiez `.env.example` en `.env` et remplissez avec vos valeurs Supabase :

```env
# Supabase / PostgreSQL
DATABASE_URL=postgresql://postgres.VOTRE_REF:VOTRE_MDP@aws-0-REGION.pooler.supabase.com:6543/postgres

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# NextAuth
NEXTAUTH_SECRET=une_cle_secrete_aleatoire
NEXTAUTH_URL=http://localhost:3000
```

### 3. Créer le bucket Supabase Storage

Dans le dashboard Supabase :
1. Allez dans **Storage**
2. Créez un bucket nommé **`products`**
3. Rendez-le **Public** (cochez "Public bucket")

### 4. Initialiser la base de données

```bash
npx prisma db push
npx prisma generate
```

### 5. Seeder les données initiales

```bash
npx tsx prisma/seed.ts
npx tsx prisma/seed-hero.ts
```

### 6. Lancer en développement

```bash
npm run dev
```

Le site est accessible sur `http://localhost:3000`

### 7. Build pour production

```bash
npm run build
npm start
```

## 🔐 Accès Admin

| | Valeur |
|---|--------|
| **URL** | `/admin-dashboard` |
| **Login** | `/admin-dashboard/login` |
| **Email** | `admin@djidahelectrique.com` |
| **Mot de passe** | `admin123` |

> ⚠️ Changez le mot de passe après la première connexion via l'onglet **Paramètres**.

## ✅ Fonctionnalités

### Côté Client (Boutique)

- **Page d'accueil** : Carrousel hero animé, grille catégories, produits vedettes, section réparation
- **Boutique** : Catalogue complet avec filtres (catégorie, sous-catégorie, stockage, état, couleur, recherche)
- **Fiche produit** : Galerie d'images, specs détaillées, prix barré si promo, ajout panier/favoris
- **Panier** : Ajout/suppression, quantités, total dynamique, bouton WhatsApp
- **Favoris** : Ajout/retrait, panneau latéral
- **Promo/Discount** : Badges promo, prix barré, pourcentage de réduction visible sur les cartes
- **WhatsApp** : Bouton flottant + bouton "Acheter via WhatsApp" sur chaque produit
- **Responsive** : Mobile-first, adapté tous écrans

### Côté Admin (Dashboard)

- **Tableau de bord** : Stats (total, iPhones, gadgets, vedettes), produits récents
- **Produits** : CRUD complet, upload images, promo/réduction, catégories, spécifications iPhone
- **Hero Section** : CRUD slides du carrousel, réorganiser (monter/descendre), activer/désactiver
- **Analytics** : Pages vues, vues produits, clicks WhatsApp, ajouts panier, graphique 7 jours
- **Paramètres** : Changement mot de passe

### Technique

- **Auth** : NextAuth Credentials + JWT, bcrypt, middleware protection
- **Upload** : Supabase Storage, auth-protected, URL publique automatique
- **SSR-safe** : useSyncExternalStore pour localStorage (cart + favorites)
- **SEO** : Metadata, alt text, images optimisées (next/image)
- **Couleurs** : Rouge accent #E30613, Vert WhatsApp #25D366

## 📱 WhatsApp

Deux numéros configurés :
- **+221 78 113 13 40** — Bouton produit + bouton flottant
- **+221 78 705 05 05** — Section réparation

## 🚢 Déploiement sur Vercel

1. Poussez le code sur GitHub
2. Connectez le repo dans [vercel.com](https://vercel.com)
3. Ajoutez les variables d'environnement dans Settings > Environment Variables
4. Déployez automatiquement à chaque push

## 📋 Commandes Utiles

```bash
npm run dev          # Serveur développement
npm run build        # Build production
npm start            # Lancer en production
npx prisma studio    # Interface visuelle de la DB
npx prisma db push   # Synchroniser le schéma Prisma
npx prisma generate  # Régénérer le client Prisma
```

---

**Djidah Electrique** — Votre destination premium pour les iPhones et gadgets high-tech au Sénégal 🇸🇳
