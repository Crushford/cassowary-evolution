# Cassowary Queen — Color System v1

Goal: keep the UI cohesive and accessible using 3 backgrounds and 3 text tokens, plus a small set of semantic accents. Do not introduce ad-hoc colors.

## Tokens

### Backgrounds
- `bg-app-0` #071411 — page/base
- `bg-app-1` #0B1F1A — surfaces/cards
- `bg-app-2` #133129 — popovers/menus

### Ink (text)
- `text-ink-primary`   #E6F4F1
- `text-ink-secondary` #B6D4CD
- `text-ink-muted`     #7CA39A

### Semantics
- `accent`  #F6B94B (600 #DFA640, 700 #C89338)
- `success` #30B27A
- `warning` #C4A46D
- `danger`  #C2452D
- `border`  #21463C
- `ring`    #F6B94B (focus)

## Usage rules

1. App backgrounds/text must use only the tokens above.
2. Prefer `app-surface`/`app-surface-2` helpers for containers.
3. For focus, always use `ring-ring ring-offset-app-0`.
4. For new components, choose the lowest surface that still separates layers.
5. Do not import Tailwind default color scales in components.

## Accessibility

- Default text on `bg-app-0` and `bg-app-1` uses `text-ink-primary` (meets contrast).
- Secondary & muted text maintain readable contrast; avoid using them on `bg-app-2` for long paragraphs.
- Respect `prefers-reduced-motion` for animated color transitions.

## Theming

If colors change in the future, update only:
- `tailwind.config.ts` color tokens
- `/src/styles/colors.ts` exports

Do not hardcode hex values in components.

## Sanity check (manual)

- Pages should show ≤3 background shades at a glance.
- Inspect computed styles: no `gray-*`, `slate-*`, or arbitrary hexes in app code.

## Examples

### Card
```jsx
<div className="app-surface rounded-2xl p-4">
  <h3 className="text-ink-primary text-lg">Season Summary</h3>
  <p className="text-ink-secondary">You picked 3 nests.</p>
  <p className="text-ink-muted">Two found fruit. One was barren.</p>
</div>
```

### Primary Button
```jsx
<button
  className="inline-flex items-center gap-2 rounded-xl px-4 py-2
             bg-accent text-app-0 font-medium shadow-soft
             hover:bg-accent-600 active:bg-accent-700
             focus-visible:ring-2 focus-visible:ring-ring">
  Deal Next Season
</button>
```

### Tile (unselected vs selected)
```jsx
<div className="rounded-xl bg-app-1 border border-border/60 hover:border-border/90
                transition-colors">
  <div className="p-4 text-ink-secondary">Nest</div>
</div>

<div className="rounded-xl bg-app-2 border border-border ring-2 ring-ring">
  <div className="p-4 text-ink-primary">Selected</div>
</div>
```

### Badge
```jsx
<span className="inline-flex items-center rounded-md px-2 py-0.5
                 border border-border/50 text-ink-secondary">
  Barren
</span>

<span className="inline-flex items-center rounded-md px-2 py-0.5
                 bg-success/15 text-success border border-success/30">
  Food
</span>

<span className="inline-flex items-center rounded-md px-2 py-0.5
                 bg-danger/15 text-danger border border-danger/30">
  Predator
</span>
```
