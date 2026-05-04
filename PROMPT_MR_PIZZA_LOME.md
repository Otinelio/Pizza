# PROMPT COMPLET — MR. PIZZA LOMÉ
## À coller dans Cursor / Antigravity / Lovable pour reproduire le site à l'identique

---

Crée une application web complète pour une pizzeria nommée **Mr. Pizza Lomé** située à Lomé (Togo). Le site doit être un clone fidèle, pixel-près, de la spécification ci-dessous. Aucune différence n'est tolérée : typographie, couleurs, animations, structure de routes, comportement du panier, espace admin et espace cuisine doivent correspondre exactement.

---

## 1. STACK TECHNIQUE OBLIGATOIRE

- **Framework** : TanStack Start v1 (React 19 + Vite 7, SSR activé, target Cloudflare Workers)
- **Routing** : file-based dans `src/routes/` (TanStack Router) — `__root.tsx` est le shell HTML
- **Styling** : Tailwind CSS v4 via `@import "tailwindcss"` dans `src/styles.css` (PAS de tailwind.config.js)
- **UI kit** : shadcn/ui (style "new-york", base "slate", icons lucide-react)
- **State panier** : React Context custom (`src/lib/cart.tsx`)
- **Persistance** : `localStorage` uniquement (clé `mrpizza_data` pour le restaurant, `mrpizza_orders` pour la cuisine)
- **QR code** : librairie `qrcode.react` (installer via `bun add qrcode.react`)
- **Animations** : CSS pur via `@keyframes` (pas de framer-motion)
- **Scroll reveal** : `IntersectionObserver` natif
- **Pas de backend, pas de base de données, pas de paiement en ligne**

---

## 2. DESIGN SYSTEM

### Palette (à définir comme variables CSS dans `src/styles.css` via `@theme inline`)

```
--color-bg:        #0D0D0D   (fond principal noir charbon)
--color-surface:   #1A1A1A   (cartes, inputs)
--color-footer:    #080808   (footer)
--color-fire:      #FF4D1C   (orange "feu" — accent principal)
--color-fire-dark: #E03A0D   (hover)
--color-smoke:     #F8F8F8   (texte clair)
--color-cream:     #F0DEB4   (texte secondaire chaud)
```

Mapper ces tokens vers les variables shadcn (`--color-background`, `--color-primary`, etc.). Radius : `--radius-sm: 2px`, `--radius-md/lg: 4px` (coins quasi nets).

### Typographie

- Import Google Fonts : `Syne` (400, 600, 700, 800) + `DM Sans` (400, 500)
- `--font-display: "Syne", sans-serif` → titres (h1–h4)
- `--font-body: "DM Sans", sans-serif` → corps de texte
- Antialiasing webkit activé sur body
- Sélection texte : fond `#FF4D1C`, texte `#0D0D0D`

### Style général

- Fond noir partout (sauf espace cuisine = blanc)
- Esthétique brutaliste / éditoriale : majuscules, tracking large, contraste fort
- Photos avec filtre `saturate(1.15) contrast(1.08)` + bruit SVG en overlay 4% mix-blend overlay
- Boutons : coins quasi droits (rounded-sm = 2px), hover assombri, classe `.press` qui fait `scale(0.97)` au clic

---

## 3. ANIMATIONS CSS À DÉFINIR DANS `src/styles.css`

```css
/* Ticker marquee horizontal infini */
@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
.marquee-track { animation: marquee 40s linear infinite; }

/* Lettres du hero qui tombent une par une */
@keyframes lettersDrop { 0%{transform:translateY(100%)} 100%{transform:translateY(0)} }
.letter-mask { display:inline-block; overflow:hidden; vertical-align:bottom; }
.letter-inner { display:inline-block; transform:translateY(100%); animation: lettersDrop 600ms cubic-bezier(0.16,1,0.3,1) forwards; }

/* Scroll reveal */
.reveal { opacity:0; transform:translateY(24px); transition: opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1); }
.reveal.in { opacity:1; transform:translateY(0); }

/* Flèche scroll bobbing */
@keyframes arrowBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
.arrow-bob { animation: arrowBob 1.5s ease-in-out infinite; }

/* Cart badge pop spring */
@keyframes badgePop { 0%{transform:scale(0.5)} 60%{transform:scale(1.3)} 100%{transform:scale(1)} }
.badge-pop { animation: badgePop 400ms ease; }

/* Loader d'intro 1.5s puis fade out */
@keyframes loaderUp { from{transform:translateY(20px); opacity:0} to{transform:translateY(0); opacity:1} }
@keyframes loaderLine { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes loaderOut { to{opacity:0; visibility:hidden} }
.loader-screen { animation: loaderOut 500ms ease-in 1500ms forwards; }
.loader-mr     { animation: loaderUp 400ms cubic-bezier(0.16,1,0.3,1) 200ms both; }
.loader-pizza  { animation: loaderUp 400ms cubic-bezier(0.16,1,0.3,1) 600ms both; }
.loader-line   { transform-origin:left; transform:scaleX(0); animation: loaderLine 300ms ease-out 1100ms forwards; }

/* Drawer panier (right desktop, bottom mobile) */
@keyframes drawerInRight  { from{transform:translateX(100%)} to{transform:translateX(0)} }
@keyframes drawerInBottom { from{transform:translateY(100%)} to{transform:translateY(0)} }
.drawer-right  { animation: drawerInRight 350ms cubic-bezier(0.16,1,0.3,1); }
.drawer-bottom { animation: drawerInBottom 380ms cubic-bezier(0.32,0.72,0,1); }

/* Modal */
@keyframes modalIn { from{opacity:0; transform:scale(0.95)} to{opacity:1; transform:scale(1)} }
.modal-in { animation: modalIn 300ms ease-out; }

/* Press feedback */
.press:active { transform: scale(0.97); transition: transform 100ms ease-out; }

/* Photo treatment */
.photo { filter: saturate(1.15) contrast(1.08); }
.photo-wrap { position:relative; overflow:hidden; }
.photo-wrap::after {
  content:''; position:absolute; inset:0; pointer-events:none; opacity:0.04; mix-blend-mode:overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
```

---

## 4. DONNÉES RESTAURANT (`src/lib/data.ts`)

Exporter :

- `MenuItem` type : `{ id, name, description, price, category, image, available }`
- `RestaurantData` type complet
- Constante `DEFAULT_DATA` avec :
  - **name** : "Mr. Pizza Lomé"
  - **tagline** : "Le meilleur goût à Lomé — Toujours chaude"
  - **whatsapp** : "+22891599999"
  - **address** : "Novissi, entre la station MRS et Jemima's Kitchen, Lomé, Togo"
  - **hours** : "Mar–Ven : 12h–22h / Sam–Dim : 12h–23h"
  - **instagram** : "https://instagram.com/mr.pizzatogo"
  - **facebook** : "https://facebook.com/mr.pizzatg"
  - **heroMessage** : "La meilleure pizza de la capitale — sans compromis, sans additifs."
  - **status** : "open"
  - **categories** : `["PIZZAS","POULET","COMBOS","FRITES & SALADES","BOISSONS"]`
  - **items** : 15 plats (5 pizzas, 3 poulet, 3 combos, 2 frites/salades, 2 boissons) avec photos Unsplash :
    - Pizza Classique Margherita — 3500 FCFA — "Tomate, mozzarella, basilic frais"
    - Pizza Péri Péri Chicken — 4500 — "Sauce pimentée, poulet grillé, oignons rouges"
    - Pizza Végétarienne — 3800 — "Légumes frais de saison, sauce tomate"
    - Pizza Signature MR. — 5000 — "Recette maison, épices locales"
    - Pizza Customisée — 3000 — "Vous choisissez vos garnitures"
    - Péri Péri Chicken — 3500 — "Poulet grillé sauce pimentée togolaise"
    - Chicken Wings x6 — 2500 — "Ailes croustillantes, sauce maison"
    - Nuggets x8 — 2000 — "Croustillants, sauce au choix"
    - Combo Étudiant — 4000 — "1 pizza 25cm + 1 boisson"
    - Combo Famille — 12000 — "2 pizzas 30cm + 4 boissons + frites"
    - Combo Solo — 3000 — "1 burger + frites + boisson"
    - Frites Maison — 1000 — "Dorées, croustillantes"
    - Salade Fraîche — 1500 — "Légumes, vinaigrette maison"
    - Coca-Cola / Fanta / Sprite — 500 — "Boisson fraîche 33cl"
    - Jus local — 700 — "Jus de fruits frais 33cl"

- `getRestaurantData()` : lit localStorage (clé `mrpizza_data`), fallback `DEFAULT_DATA`
- `saveRestaurantData(data)` : écrit + dispatch un `CustomEvent("mrpizza_data_changed")`
- `resetRestaurantData()` : remove + dispatch
- `formatFCFA(n)` : `n.toLocaleString("fr-FR") + " FCFA"`
- `ADMIN_PASSWORD = "mrpizza2025"`
- `KITCHEN_PASSWORD = "cuisine2025"`

---

## 5. PANIER (`src/lib/cart.tsx`)

Context Provider exposant via `useCart()` :
- `lines: { item, qty }[]`, `count`, `total`
- `add(item)`, `inc(id)`, `dec(id)`, `remove(id)`, `clear()`
- `open: boolean`, `setOpen(b)`
- `note: string`, `setNote(s)`

Le panier est **éphémère** (state React, pas persistant).

---

## 6. STRUCTURE DES ROUTES

```
/           → Accueil (hero + sections)
/menu       → Menu complet public
/about      → À propos
/contact    → Contact
/admin      → Dashboard admin (protégé, mot de passe "mrpizza2025")
/menu/scan  → Menu sur place avec sélection table (URL directe, pas de lien public)
/kitchen    → Espace cuisine Kanban (protégé, mot de passe "cuisine2025")
```

**Aucun lien** vers `/admin`, `/menu/scan`, `/kitchen` dans la navigation publique. Accessibles uniquement par URL directe.

---

## 7. SHELL (`src/routes/__root.tsx`)

- `<head>` : meta SEO en français, titre "Mr. Pizza Lomé — La meilleure pizza à Lomé, toujours chaude", og tags
- `RootComponent` :
  - Si pathname commence par `/admin` → render `<Outlet/>` seul (pas de chrome public)
  - Si `/menu/scan` → cache Navbar, Footer, BottomNav (mais garde Ticker, Loader, CartFab)
  - Sinon : `<CartProvider><Loader/><Ticker/><ClosedBanner/><Navbar/><Outlet/><CartFab/><Footer/><BottomNav/></CartProvider>`
- `ClosedBanner` : si `status === "closed"`, bandeau orange "Actuellement fermé — nous revenons bientôt"
- `notFoundComponent` : 404 centré, gros chiffre Syne, bouton orange "Retour à l'accueil"

---

## 8. COMPOSANTS SITE (`src/components/site/`)

### `Loader.tsx`
Splash plein écran noir 1.5s : "MR." (Syne extrabold énorme) apparaît, puis "PIZZA" en orange #FF4D1C, puis une ligne orange qui se trace de gauche à droite, puis fade out. N'apparaît qu'une fois par session (sessionStorage).

### `Ticker.tsx`
Bandeau sticky top, h-8, bg #FF4D1C, texte noir DM Sans 11px uppercase tracking 0.1em, défilement marquee 40s linéaire infini :
`"TOUJOURS CHAUDE · SANS ADDITIFS · PERSONNALISEZ VOTRE PIZZA · +228 91 59 99 99 · LOMÉ, TOGO · COMMANDEZ SUR WHATSAPP · "` (répété 2× × 2 spans pour boucle propre).

### `Navbar.tsx`
- Desktop only (cachée < md)
- Sticky top sous le ticker, fond `#0D0D0D`, padding x-8 y-5
- Logo "MR. PIZZA" en Syne extrabold à gauche (link vers /)
- Liens : Accueil / Menu / À propos / Contact, uppercase tracking-wider, lien actif orange #FF4D1C
- Bouton "Commander" à droite : background orange, texte noir, lien `wa.me`

### `BottomNav.tsx`
- Mobile only (md:hidden)
- Fixed bottom, h-14, bg `#0D0D0D`, border-top white/5
- 4 icônes lucide : Home, UtensilsCrossed, Info, MapPin
- Lien actif : icône + label orange opacity 1, sinon #F8F8F8 opacity 0.4
- Label 10px uppercase tracking-wider

### `Footer.tsx`
Fond `#080808`, padding généreux. Colonnes : Logo + tagline / Adresse + horaires / Réseaux sociaux (Instagram, Facebook). Copyright `© Mr. Pizza Lomé`. Mention "Le feu sous la croûte".

### `Reveal.tsx`
Wrapper qui ajoute `.reveal` puis `.in` quand l'élément entre dans le viewport (IntersectionObserver, threshold 0.1, unobserve après).

### `Cart.tsx`
**`<CartFab/>`** : bouton flottant rond 56px, bg orange, icône ShoppingCart, badge count en haut-droite (rond crème, texte noir Syne extrabold) avec animation `badge-pop` à chaque ajout. Position : `right-4 bottom-[72px]` mobile (au-dessus du BottomNav), `right-6 bottom-6` desktop. N'apparaît que si count > 0.

**`<CartDrawer tableNumber?/>`** : drawer plein écran noir, depuis la droite (desktop, 400px) ou bas (mobile, 90vh).
- Header : "Mon panier" + bouton X
- Liste des lignes avec quantité (− / +), prix, suppression
- Textarea "Note pour la cuisine"
- Footer : Sous-total Syne extrabold 2xl + bouton "Envoyer ma commande" orange h-14 avec icône MessageCircle
- Bouton secondaire "Vider le panier"
- Vide : icône ShoppingCart cream/15 + "Votre panier est vide."
- **Action envoyer** : ouvre `https://wa.me/22891599999?text=...` avec message formaté :
  - Si `tableNumber` → entête "Commande — Table {n} :"
  - Sinon → "Bonjour Mr. Pizza Lomé !\n\nNOUVELLE COMMANDE :"
  - Liste : `{name} x{qty} — {prix formaté}`
  - Footer : `TOTAL : {total}\nNote : {note ou "Aucune note"}`

### `MenuPage.tsx`
Composant partagé entre `/menu` et `/menu/scan`.
- Props : `scanMode?: boolean`
- Hero du menu : titre Syne énorme "NOTRE MENU", sous-titre cream
- Si `scanMode` → afficher TableModal au montage : modal centrée demandant "N° de table" (input number), bouton "Valider", stockage local du numéro pour la session
- Filtres catégories : pills horizontales scrollables, active = orange
- Grille items : cards bg-surface, photo-wrap top, nom Syne, description cream/60, prix orange Syne, bouton "Ajouter +" qui appelle `cart.add()`
- Items `available: false` → grisés, badge "Indisponible"

### `Hero` (dans `src/routes/index.tsx`)
- Plein écran noir
- Surtitre cream "LOMÉ A FAIM."
- Titre principal : "LE FEU\nSOUS LA\nCROÛTE." en Syne extrabold ~clamp(4rem, 12vw, 12rem), animation lettre-par-lettre `lettersDrop`
- Tagline DM Sans
- 2 CTAs : "Voir le menu" (orange) + "Commander WhatsApp" (outline)
- Flèche bas avec `arrow-bob`
- Sections suivantes (avec `Reveal`) : "Nos signatures" (3 pizzas vedettes), "Comment ça marche" (3 étapes : Choisir → WhatsApp → Récupérer/Livré), "Pourquoi Mr. Pizza" (sans additifs, ingrédients frais, cuisine ouverte), CTA final

---

## 9. PAGE `/about`
Histoire courte : "La première vraie pizzeria populaire du Togo. Cuisine ouverte, ingrédients frais, sans additifs." Photo équipe, valeurs (3 cards), citation. Style éditorial, beaucoup d'espace blanc (négatif noir).

## 10. PAGE `/contact`
- Adresse, horaires, téléphone WhatsApp cliquable
- Boutons : "Itinéraire Google Maps" + "WhatsApp"
- Liens Instagram + Facebook
- Carte : iframe Google Maps embed pointant Novissi Lomé (ou placeholder)

---

## 11. ESPACE ADMIN (`/admin`)

### Auth
- Écran login fond `#0D0D0D` : titre Syne "ADMIN MR. PIZZA", input password (focus border orange), bouton "Se connecter" orange.
- Form `onSubmit` avec `e.preventDefault()`, comparaison `pw.trim() === ADMIN_PASSWORD`, message d'erreur si faux.
- État auth en React state simple (PAS de localStorage pour l'auth).

### Dashboard
Layout 2 colonnes : sidebar gauche fixe (240px) + contenu droite.

**Sidebar** : logo MR. PIZZA, liste tabs verticale uppercase Syne :
1. **Tableau de bord**
2. **Cuisine** (gestion du menu)
3. **Infos restaurant**
4. **Tables QR**
5. **Statut**

Bouton "Déconnexion" en bas.

**Tab Tableau de bord** : statistiques fictives (nb plats actifs, nb catégories, statut), aperçu rapide.

**Tab Cuisine** ("Gestion de la cuisine") :
- Bouton "+ Ajouter un plat"
- Liste éditable par catégorie : pour chaque item, photo + nom + prix + toggle "Disponible" + boutons "Modifier" / "Supprimer"
- Modal d'édition : nom, description, prix, catégorie (select), URL image, available

**Tab Infos restaurant** : formulaire pour name, tagline, whatsapp, address, hours, instagram, facebook, heroMessage. Sauvegarde via `saveRestaurantData()`.

**Tab Tables QR** :
- Input "Nombre de tables" (1–50)
- Génère N cards, chacune avec un QR code (`qrcode.react`) pointant vers `{origin}/menu/scan?table={n}`
- Bouton "Imprimer" (window.print)

**Tab Statut** : toggle Ouvert / Fermé qui change `data.status`.

---

## 12. ESPACE CUISINE (`/kitchen`)

### Auth
- Login plein écran fond `#0D0D0D`, logo Syne "MR. PIZZA — CUISINE"
- Input password border focus orange, bouton orange "Accéder à la cuisine"
- Mot de passe `KITCHEN_PASSWORD = "cuisine2025"`

### Dashboard Kanban
**Conçu pour tablette** — fond BLANC, grands éléments, très lisible.

**Topbar** : titre "ESPACE CUISINE", date du jour, bouton "+ NOUVELLE COMMANDE" orange grand, bouton déconnexion discret.

**Kanban** : 4 colonnes en grid `repeat(4, minmax(260px, 1fr))`, séparateurs verticaux `#E5E7EB`, fond colonnes `#F9FAFB` :

| Colonne | Header bg | Statut |
|---|---|---|
| EN ATTENTE | `#FEF3C7` | pending |
| EN PRÉPARATION | `#DBEAFE` | preparing |
| PRÊT | `#D1FAE5` | ready |
| SERVI | `#F3F4F6` | served |

Header de colonne : titre Syne uppercase + compteur (badge).

**OrderCard** :
- Fond blanc, ombre légère, border-left 4px `#FF4D1C`
- En-tête : "Table N" (Syne grand) + temps écoulé (mm:ss) avec couleur dynamique :
  - 0–10 min : noir
  - 10–20 min : orange `#FF4D1C`
  - > 20 min : rouge + animation pulse `kpulse`
- Liste des items : "qty × nom"
- Note (si présente) : box `#FFF7ED` italic
- Footer : total FCFA + bouton d'action selon statut :
  - pending → "DÉMARRER" (passe à preparing)
  - preparing → "MARQUER PRÊT"
  - ready → "MARQUER SERVI"
  - served → bouton "Archiver" (supprime)
- Drag & drop HTML5 natif (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) entre colonnes pour changer le statut

**NewOrderModal** :
- Modal plein écran semi-transparent, panneau central blanc
- Champ "N° de table"
- Liste plats groupés par catégorie avec checkbox + champ quantité
- Champ "Note pour la cuisine" (textarea)
- Total dynamique en bas (Syne 2xl orange)
- Bouton "Créer la commande" orange grand

**Bottom bar** fixe :
- 3 stats côte à côte : "Commandes actives : N" / "En préparation : N" / "Total session : {FCFA}"

**Persistance** : `localStorage` clé `mrpizza_orders`, array de `{ id, table, items[], note, total, status, createdAt }`.

**Animation `kpulse`** :
```css
@keyframes kpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,77,28,0.4)} 50%{box-shadow:0 0 0 8px rgba(255,77,28,0)} }
```

**Tap targets** : minimum 48px sur tous les boutons (tablette).

---

## 13. RESPONSIVE

- Breakpoint principal : `md` (768px)
- Mobile : Navbar cachée, BottomNav visible, drawer panier depuis le bas, hero typo réduite
- Desktop : Navbar visible, BottomNav cachée, drawer panier depuis la droite (400px)
- Espace cuisine optimisé tablette landscape (≥ 1024px) — sur mobile, colonnes scrollables horizontalement

---

## 14. SEO & META

- `<html lang="fr">`
- Title : "Mr. Pizza Lomé — La meilleure pizza à Lomé, toujours chaude"
- Description : "Mr. Pizza Lomé — pizzas croûte fine, péri péri chicken, burgers. Sans additifs. Commandez sur WhatsApp."
- og:title, og:description, og:type=website
- Chaque route (about, contact, menu) a son propre `head()` avec title/description spécifiques

---

## 15. CHECKLIST FINALE

- [ ] `bun add qrcode.react`
- [ ] Polices Syne + DM Sans importées dans `src/styles.css`
- [ ] Toutes les couleurs via tokens CSS (jamais hardcodées dans Tailwind)
- [ ] Loader joue 1× par session
- [ ] Ticker défile sans interruption
- [ ] Hero anime les lettres au mount
- [ ] Reveal anime les sections au scroll
- [ ] Panier ajoute/incrémente/décrémente/supprime, badge pop, drawer s'ouvre, message WhatsApp formaté
- [ ] `/admin` accessible avec `mrpizza2025`, 5 tabs fonctionnels, QR codes générés
- [ ] `/menu/scan?table=X` ouvre le menu avec table préremplie
- [ ] `/kitchen` accessible avec `cuisine2025`, Kanban drag & drop, persistance localStorage, timer avec couleurs, NewOrderModal fonctionnelle
- [ ] Aucun lien public vers `/admin`, `/menu/scan`, `/kitchen`
- [ ] Build SSR réussit sans erreur

---

**Livre exactement ce qui est décrit ci-dessus, sans ajouter ni retirer de fonctionnalités. Respect strict de la palette, des polices, des animations et des routes.**
