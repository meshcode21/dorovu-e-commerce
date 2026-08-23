# Dorovu — UI Rules

Rules the agent must follow when building any UI component or page.

## General
- Background is always `cream` (#FAF7F2) — never pure white
- Cards use `warm-white` (#FFF9F3) background with `linen` border
- Primary action buttons are `clay` colored
- Success/confirmation states use `sage` color
- All pages have a max-width of `1280px` centered

## Fonts
- **Display/Headings** (`--font-display`): `DM Sans` (used as our Google Sans alternative)
- **Body/Sans** (`--font-sans`): `Inter`
- **Monospace** (`--font-mono`): `JetBrains Mono`

## Buttons
```tsx
// Primary — clay filled
<Button className="bg-clay text-white hover:bg-clay/90">
  Add to Cart
</Button>

// Secondary — outline
<Button variant="outline" className="border-clay text-clay hover:bg-clay-subtle">
  Message Crafter
</Button>

// Ghost
<Button variant="ghost">Cancel</Button>
```

## Cards
```tsx
<div className="bg-warm-white border border-linen rounded-xl p-6">
  ...
</div>
```

## Typography Usage
```tsx
// Page heading
<h1 className="font-display font-bold text-4xl text-ink">...</h1>

// Section heading
<h2 className="font-display font-semibold text-2xl text-ink">...</h2>

// Body
<p className="font-sans text-base text-ink-60">...</p>

// Label / caption
<span className="font-mono text-xs uppercase tracking-wider text-clay">...</span>
```

## Forms
- Always use React Hook Form + Zod resolver
- Show inline error messages below each field
- Labels are always visible — never placeholder-only
- Submit button shows loading spinner during mutation

## Loading States
- Use skeleton components for page-level loading
- Use spinner inside button for action loading
- Never show empty UI without a loading or empty state

## Empty States
- Always show a helpful message + action when a list is empty
- Example: "No products yet. Create your first listing →"

## Responsive
- Mobile first — all layouts work at 375px minimum
- Grid: 1 col mobile → 2 col tablet → 3-4 col desktop
- Sidebar collapses to bottom sheet on mobile

## Images
- Always use `next/image` — never `<img>` tag
- Product images: aspect-ratio square (1:1)
- Crafter portfolio: aspect-ratio 4:3
- Always provide `alt` text

## Error States
- Form errors: red text below field, red border on input
- Page-level errors: centered message with retry button
- Toast notifications for async action results (success/error)

## Navigation
- Active nav link gets `clay` color + underline
- Breadcrumbs on all nested pages
- Back button on mobile detail pages

## Craft Type Badges
```tsx
<span className="font-mono text-xs uppercase tracking-wider
                 bg-clay-subtle text-clay px-2 py-1 rounded-sm">
  Crochet
</span>
```

## Order Status Colors
```
PENDING_PAYMENT → gray
PAID → blue
ACCEPTED → yellow
IN_PRODUCTION → orange
SHIPPED → purple
DELIVERED → sage/green
COMPLETED → sage/green (darker)
CANCELLED → red
REFUNDED → red (lighter)
```