# Design System — WeHR

## Palette de couleurs

Toutes les couleurs sont definies dans `src/index.css` via `@theme` (Tailwind v4).
Aucune couleur hexadecimale directe dans les composants.

### Primary (Brand)
| Token | Valeur | Usage |
|-------|--------|-------|
| `primary-50` | `#fef2f2` | Background badges, highlights |
| `primary-100` | `#fee2e2` | Avatar backgrounds, light accents |
| `primary-200` | `#fecaca` | Borders, rings |
| `primary-500` | `#ef4444` | Icons, notification dots |
| `primary-600` | `#dc2626` | Buttons CTA, liens actifs |
| `primary-700` | `#b91c1c` | Hover buttons, texte actif sidebar |
| `primary-900` | `#7f1d1d` | Backgrounds sombres |

### Neutral (Gris)
| Token | Valeur | Usage |
|-------|--------|-------|
| `neutral-50` | `#f9fafb` | Background pages |
| `neutral-100` | `#f3f4f6` | Background secondaire, inputs rest |
| `neutral-200` | `#e5e7eb` | Borders, dividers |
| `neutral-300` | `#d1d5db` | Borders inputs, scrollbar |
| `neutral-400` | `#9ca3af` | Icones inactives, placeholders |
| `neutral-500` | `#6b7280` | Texte secondaire |
| `neutral-600` | `#4b5563` | Texte body |
| `neutral-700` | `#374151` | Texte labels |
| `neutral-800` | `#1f2937` | Texte titres secondaires |
| `neutral-900` | `#111827` | Texte titres principaux |

### Semantic
| Token | Usage |
|-------|-------|
| `success-50/100/500/600/700` | Statut actif, validation, confirmation |
| `warning-50/100/500/600/700` | Statut en conge, alertes |
| `error-50/100/500/600/700` | Statut inactif, erreurs, suppression |
| `info-50/100/500/600/700` | Information, badges, stats |

### Surfaces
| Token | Usage |
|-------|-------|
| `surface` (`#ffffff`) | Cards, modals, panels |
| `surface-secondary` (`neutral-50`) | Background pages |
| `surface-dark` (`#1e293b`) | Cards sombres (activity) |

---

## Typographie

**Font** : Inter (Google Fonts), definie dans `index.css` via `--font-sans`.

| Usage | Classe | Poids |
|-------|--------|-------|
| Titre page | `text-3xl font-bold` | 700 |
| Sous-titre | `text-lg font-semibold` | 600 |
| Label | `text-sm font-medium` | 500 |
| Body | `text-sm text-neutral-600` | 400 |
| Caption | `text-xs text-neutral-500` | 400 |
| Muted | `text-xs text-neutral-400` | 400 |

---

## Espacements

Echelle Tailwind 4px base :
- Padding pages : `p-4 lg:p-8`
- Gap cards grid : `gap-4` ou `gap-6`
- Gap interne card : `space-y-4`
- Marge section : `mb-6` ou `mb-8`

---

## Border Radius

| Element | Classe |
|---------|--------|
| Cards, Modals | `rounded-xl` (12px) |
| Boutons, Inputs | `rounded-lg` (8px) |
| Badges | `rounded-full` |
| Avatars | `rounded-full` |
| Icone container | `rounded-lg` ou `rounded-xl` |

---

## Ombres

| Niveau | Token | Usage |
|--------|-------|-------|
| Subtile | `shadow-xs` | Cards par defaut |
| Legere | `shadow-sm` | Buttons primary, hover cards |
| Moyenne | `shadow-md` | Cards hover |
| Forte | `shadow-lg` | Modals, dropdowns |
| Extra | `shadow-xl` | Modals principales |

---

## Composants UI (`src/components/ui/`)

### Button
```tsx
<Button variant="primary|secondary|outline|ghost|danger" size="sm|md|lg" loading icon={...}>
```
- Etats : default, hover, active, disabled, loading
- Transitions fluides (150ms)

### Input
```tsx
<Input label="..." error="..." icon={...} id="..." />
```
- Etats : default, focus (ring primary), error (ring error), disabled

### Select
```tsx
<Select label="..." error="..."> <option>...</option> </Select>
```

### Badge
```tsx
<Badge variant="success|warning|error|info|primary|default" dot>...</Badge>
```

### Card
```tsx
<Card hover padding="none|sm|md|lg">...</Card>
```
- `rounded-xl`, `border-neutral-200`, `shadow-xs`
- Hover optionnel : `shadow-md`, `border-neutral-300`

### Modal
```tsx
<Modal isOpen onClose title="..." footer={...} size="sm|md|lg">...</Modal>
```
- Overlay avec backdrop-blur
- Animations fade-in + slide-up

### Skeleton / PageSkeleton / TableSkeleton
```tsx
<PageSkeleton />
<TableSkeleton rows={5} />
<Skeleton className="h-8 w-48" />
```

### EmptyState
```tsx
<EmptyState icon={...} title="..." description="..." action={...} />
```

### ErrorState
```tsx
<ErrorState message="..." onRetry={...} />
```

---

## Animations

| Token | Duree | Usage |
|-------|-------|-------|
| `animate-fade-in` | 200ms | Entree pages |
| `animate-slide-up` | 250ms | Modals, cards |
| `animate-slide-down` | 200ms | Dropdowns |
| `transition-all duration-150` | 150ms | Hover tous elements |
| `.skeleton` (shimmer) | 1.5s loop | Loading states |

---

## Regles

1. **Zero couleur hardcodee** — toujours utiliser les tokens design system
2. **4 etats UI** sur chaque section avec data : loading (skeleton), error, empty, success
3. **Responsive** mobile-first : `sm:` / `md:` / `lg:`
4. **Accessibilite** : focus-visible, aria-labels, contraste WCAG AA
5. **Logique metier intouchee** — seul le visuel utilise le design system
