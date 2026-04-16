# 🎨 MISSION : Refonte UI/UX Frontend — Design System Complet

## CONTEXTE
Tu interviens sur un projet Next.js/React **déjà existant**.
Ta mission est de produire un frontend **visuellement parfait**, cohérent, professionnel — au niveau d'un template premium vendu sur ThemeForest ou similaire.
Tu ne touches **pas** à la logique métier, aux appels API, ni à la structure des données.
Tu améliores **uniquement** le visuel, le design et l'expérience utilisateur.

---

## ÉTAPE 1 — AUDIT VISUEL OBLIGATOIRE

Avant de toucher quoi que ce soit, tu DOIS :

1. Scanner **toutes les pages** dans `app/` ou `pages/`
2. Scanner **tous les composants** dans `components/`
3. Lire le CSS global (`globals.css`, `tailwind.config.js`, variables CSS existantes)
4. Identifier les **couleurs actuellement utilisées** dans le projet
5. Identifier les **typographies** utilisées
6. Identifier les **composants UI** existants (boutons, cards, inputs, modals...)
7. Identifier les **incohérences visuelles** entre les pages
8. Produire un **rapport d'audit** listant tous les problèmes visuels trouvés

> ⚠️ Tu ne modifies rien avant d'avoir terminé cet audit et listé les problèmes.

---

## ÉTAPE 2 — DÉFINIR LE DESIGN SYSTEM

Avant de coder, tu définis et documentes le design system complet dans un fichier `DESIGN_SYSTEM.md` à la racine du frontend :

### Palette de couleurs
Choisis une palette **professionnelle et cohérente** :
- `--color-primary` : couleur principale (actions, CTA, liens)
- `--color-primary-hover` : variation hover de la principale
- `--color-secondary` : couleur secondaire (accents, badges)
- `--color-background` : fond général de l'app
- `--color-surface` : fond des cards, modals, panels
- `--color-border` : couleur des bordures
- `--color-text-primary` : texte principal
- `--color-text-secondary` : texte secondaire, descriptions
- `--color-text-muted` : texte désactivé, placeholders
- `--color-success` : vert succès
- `--color-warning` : orange avertissement
- `--color-error` : rouge erreur
- `--color-info` : bleu information

> Toutes ces variables sont définies **une seule fois** dans `globals.css` et utilisées **partout**.
> **Jamais** de couleur hardcodée dans un composant. Toujours les variables CSS ou les tokens Tailwind.

### Typographie
- Font principale définie dans `globals.css` via `next/font`
- Échelle typographique cohérente : `text-xs` → `text-sm` → `text-base` → `text-lg` → `text-xl` → `text-2xl` → `text-3xl` → `text-4xl`
- Usage défini : titres de page, sous-titres, body, labels, captions

### Espacements
- Utiliser **exclusivement** l'échelle Tailwind (4px base)
- Padding/margin cohérents sur toutes les pages
- Gouttières et grilles uniformes

### Border radius
- Une valeur définie pour : boutons, cards, inputs, badges, avatars
- Cohérent sur **tout** le projet

### Ombres
- Maximum 3 niveaux d'ombre (légère, moyenne, forte)
- Utilisées de manière cohérente

---

## ÉTAPE 3 — COMPOSANTS UI DE BASE

Refais ou améliore les composants UI de base pour qu'ils soient **parfaits et réutilisables** :

### Boutons
- Variantes : `primary`, `secondary`, `outline`, `ghost`, `danger`
- États : `default`, `hover`, `active`, `disabled`, `loading`
- Tailles : `sm`, `md`, `lg`
- Transitions fluides sur tous les états

### Inputs & Formulaires
- Style cohérent pour : `input`, `textarea`, `select`, `checkbox`, `radio`
- États : `default`, `focus`, `error`, `disabled`
- Labels flottants ou fixes — mais **cohérents partout**
- Messages d'erreur avec icône et couleur définie

### Cards
- Style uniforme pour toutes les cards du projet
- Ombre, border-radius, padding cohérents
- Hover state si la card est cliquable

### Navigation
- Header/Navbar : propre, responsive, avec états actifs visibles
- Sidebar si présente : même traitement
- Breadcrumbs si présents : cohérents

### Feedback UI
- Toast/notifications : position fixe, animations d'entrée/sortie
- Modals : overlay sombre, centré, responsive
- Loaders/Skeletons : cohérents avec le design
- États vides (empty states) : illustrés et utiles

---

## ÉTAPE 4 — APPLIQUER SUR TOUTES LES PAGES

Pour **chaque page** du projet :

1. Appliquer le design system défini
2. Vérifier la **hiérarchie visuelle** (ce qui est important doit se voir)
3. Vérifier l'**alignement** et les **espacements**
4. Vérifier la **cohérence** avec les autres pages
5. S'assurer que la page est **responsive** (mobile / tablette / desktop)
6. Gérer les 4 états : loading (skeleton), error, empty, success

---

## ÉTAPE 5 — COHÉRENCE GLOBALE (RÈGLE D'OR)

> 🔑 **La règle absolue : une couleur changée = changée partout automatiquement.**

Pour garantir cela :

- **Tailwind** : toutes les couleurs custom déclarées dans `tailwind.config.js` sous `theme.extend.colors`
- **CSS Variables** : déclarées dans `:root {}` dans `globals.css`
- **Jamais** de valeur hexadécimale directe dans un composant (ex: `text-[#3B82F6]` → interdit)
- Utiliser les classes Tailwind sémantiques : `text-primary`, `bg-surface`, `border-border`...

Exemple dans `tailwind.config.js` :
```js
colors: {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  border: 'var(--color-border)',
  // etc.
}
```

---

## STANDARDS DE QUALITÉ ATTENDUS

Le résultat final doit ressembler à un **template premium** avec :

- ✅ Cohérence visuelle parfaite sur toutes les pages
- ✅ Design moderne, épuré, professionnel
- ✅ Animations et transitions fluides (pas excessives)
- ✅ Responsive parfait sur mobile, tablette et desktop
- ✅ États interactifs soignés (hover, focus, active)
- ✅ Hiérarchie visuelle claire sur chaque page
- ✅ Accessibilité respectée (contrastes, focus visible)
- ✅ Chargement perçu rapide (skeletons plutôt que spinners)
- ✅ Zéro couleur hardcodée dans les composants
- ✅ Design system documenté dans `DESIGN_SYSTEM.md`

---

## CE QUI EST INTERDIT

- ❌ Toucher à la logique métier ou aux appels API
- ❌ Changer la structure des données ou les props des composants
- ❌ Hardcoder des couleurs hex dans les composants
- ❌ Appliquer un style différent sur une page vs une autre sans raison
- ❌ Laisser une page sans gestion des états loading/error/empty
- ❌ Casser le responsive existant
- ❌ Utiliser des animations lourdes qui dégradent les performances

---

## LIVRAISON ATTENDUE

1. `DESIGN_SYSTEM.md` — documentation complète des tokens et composants
2. `globals.css` mis à jour avec toutes les variables CSS
3. `tailwind.config.js` mis à jour avec les tokens sémantiques
4. Tous les composants UI refaits / améliorés
5. Toutes les pages appliquant le design system
6. Un résumé des changements effectués page par page
