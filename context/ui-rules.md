# Dorovu — UI Rules & Tokens

Rules the agent must follow when building any UI component or page.

## General
- Background is always `background` (#FAF7F2) — never pure white
- Cards use `card` (#FFF9F3) background with subtle `border` (#EDE6DB) 
- Primary action buttons are `primary` colored (#6B8F71)
- Secondary/Accent elements use `secondary` color (#C4704A)
- Text uses `foreground` color (#1E1A16) and `muted-foreground` for secondary text
- All pages have a max-width of `1280px` centered

## Colors

```css
/* Primary (Sage) */
--color-primary: #6B8F71;

/* Secondary (Clay) */
--color-secondary: #C4704A;

/* Neutrals */
--color-foreground: #1E1A16;   /* primary text */
--color-muted-foreground: #6B5E52;   /* secondary text */
--color-background: #FAF7F2;   /* page background */
--color-card: #FFF9F3;   /* card background */
--color-muted: #EDE6DB;   /* borders, dividers, subtle bg */

/* Semantic */
--color-success: #6B8F71;
--color-error: #C0392B;
--color-warning: #E67E22;
--color-info: #2980B9;
```

## Typography
- **Display/Headings** (`font-display`): `Playfair Display` (Google Fonts)
- **Body/Sans** (`font-sans`): `Inter` (Google Fonts)
- **Monospace** (`font-mono`): `JetBrains Mono` (Google Fonts)

### Type Scale
```css
text-xs: 12px
text-sm: 14px
text-base: 15px ← default body
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-3xl: 30px
text-4xl: 36px
```

## UI Elements

### Buttons
```tsx
// Primary
<Button className="bg-primary text-white hover:bg-primary/90">
  Add to Cart
</Button>

// Secondary
<Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
  Message Crafter
</Button>

// Accent
<Button className="bg-secondary text-white hover:bg-secondary/90">
  Special Action
</Button>

// Ghost
<Button variant="ghost">Cancel</Button>
```

### Cards
```tsx
<div className="bg-card border border-border rounded-xl p-6 shadow-sm">
  ...
</div>
```

### Typography Usage
```tsx
// Page heading
<h1 className="font-display font-bold text-4xl text-foreground">...</h1>

// Section heading
<h2 className="font-display font-semibold text-2xl text-foreground">...</h2>

// Body
<p className="font-sans text-base text-muted-foreground">...</p>

// Label / caption
<span className="font-mono text-xs uppercase tracking-wider text-secondary">...</span>
```

### Craft Type Badges
```tsx
<span className="font-mono text-xs uppercase tracking-wider
                 bg-primary/10 text-primary px-2 py-1 rounded-sm">
  Crochet
</span>
```

## Spacing & Radius
- **Spacing**: Use default tailwind spacing (`p-4` = 16px, `p-6` = 24px)
- **Radius**: `rounded-sm` (4px), `rounded` (6px), `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-full` (9999px)
- **Shadows**: `shadow-sm` for cards, `shadow` for elevated elements.

## Forms
- Always use React Hook Form + Zod resolver
- Show inline error messages below each field
- Labels are always visible — never placeholder-only
- Submit button shows loading spinner during mutation

## Loading & Empty States
- Use skeleton components for page-level loading
- Use spinner inside button for action loading
- Always show a helpful message + action when a list is empty

## Responsive
- Mobile first — all layouts work at 375px minimum
- Grid: 1 col mobile → 2 col tablet → 3-4 col desktop
- Sidebar collapses to bottom sheet on mobile

## Images
- Always use `next/image` — never `<img>` tag
- Product images: aspect-ratio square (1:1)
- Crafter portfolio: aspect-ratio 4:3
- Always provide `alt` text

## Navigation
- Active nav link gets `secondary` color + underline
- Breadcrumbs on all nested pages

## Order Status Colors
```
PENDING_PAYMENT → gray
PAID → blue
ACCEPTED → yellow
IN_PRODUCTION → orange
SHIPPED → purple
DELIVERED → primary/green
COMPLETED → primary/green (darker)
CANCELLED → red
REFUNDED → red (lighter)
```