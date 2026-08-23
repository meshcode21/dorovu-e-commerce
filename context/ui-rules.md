# Dorovu — UI Rules

Rules the agent must follow when building any UI component or page.

## General
- Background is always `cream` (#F8F5EF) — never pure white
- Cards use `sand` (#EAD6C8) or `cream` background with subtle borders
- Primary action buttons are `forest` colored (#2E4A3F)
- Secondary/Accent elements use `rose` color (#D98B7B)
- Text uses `ink` color (#3E2E2A)
- All pages have a max-width of `1280px` centered

## Fonts
- **Display/Headings** (`--font-display`): `DM Sans` (used as our Google Sans alternative)
- **Body/Sans** (`--font-sans`): `Inter`
- **Monospace** (`--font-mono`): `JetBrains Mono`

## Buttons
```tsx
// Primary — forest filled
<Button className="bg-forest text-white hover:bg-forest/90">
  Add to Cart
</Button>

// Secondary — outline
<Button variant="outline" className="border-forest text-forest hover:bg-forest-subtle">
  Message Crafter
</Button>

// Accent — rose filled
<Button className="bg-rose text-white hover:bg-rose/90">
  Special Action
</Button>

// Ghost
<Button variant="ghost">Cancel</Button>
```

## Cards
```tsx
<div className="bg-white border border-sand rounded-xl p-6">
  ...
</div>
```

## Typography Usage
```tsx
// Page heading
<h1 className="font-display font-bold text-4xl text-forest">...</h1>

// Section heading
<h2 className="font-display font-semibold text-2xl text-ink">...</h2>

// Body
<p className="font-sans text-base text-ink/80">...</p>

// Label / caption
<span className="font-mono text-xs uppercase tracking-wider text-rose">...</span>
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
                 bg-forest-subtle text-forest px-2 py-1 rounded-sm">
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