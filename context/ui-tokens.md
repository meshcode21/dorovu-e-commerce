# Dorovu — UI Design Tokens

## Colors

```css
/* Primary — Clay */
--clay:         #C4704A;
--clay-light:   #E8A882;
--clay-subtle:  #F5E9E2;

/* Secondary — Sage */
--sage:         #6B8F71;
--sage-light:   #A8C5AC;
--sage-subtle:  #EBF3EC;

/* Neutrals */
--ink:          #1E1A16;   /* primary text */
--ink-60:       #6B5E52;   /* secondary text */
--ink-30:       #B8ADA4;   /* placeholder / disabled */
--cream:        #FAF7F2;   /* page background */
--warm-white:   #FFF9F3;   /* card background */
--linen:        #EDE6DB;   /* borders, dividers */

/* Semantic */
--success:      #6B8F71;   /* same as sage */
--error:        #C0392B;
--warning:      #E67E22;
--info:         #2980B9;
```

## Typography
Display / Headings: Playfair Display (Google Fonts)
Body / UI: Inter (Google Fonts)
Code / Mono: JetBrains Mono (Google Fonts)


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

### Font Weights
```css
font-light: 300 ← subheadings, captions
font-normal: 400 ← body text
font-medium: 500 ← labels, UI elements
font-semibold: 600 ← card titles
font-bold: 700 ← page headings
```

## Spacing Scale (Tailwind defaults)

```css
4px → p-1, m-1
8px → p-2, m-2
12px → p-3, m-3
16px → p-4, m-4
24px → p-6, m-6
32px → p-8, m-8
48px → p-12, m-12
64px → p-16, m-16
```

## Border Radius

```css
rounded-sm: 4px ← tags, badges
rounded: 6px ← buttons, inputs
rounded-lg: 8px ← small cards
rounded-xl: 12px ← main cards
rounded-2xl: 16px ← hero sections, large containers
rounded-full: 9999px ← avatars, pills
```


## Shadows

```css
shadow-sm ← subtle card lift
shadow ← default card
shadow-md ← dropdown, popover
shadow-lg ← modal, drawer
```

## Tailwind Config Additions
Add these to `tailwind.config.ts` in `apps/web`:

```ts
theme: {
  extend: {
    colors: {
      clay: {
        DEFAULT: '#C4704A',
        light: '#E8A882',
        subtle: '#F5E9E2',
      },
      sage: {
        DEFAULT: '#6B8F71',
        light: '#A8C5AC',
        subtle: '#EBF3EC',
      },
      ink: {
        DEFAULT: '#1E1A16',
        60: '#6B5E52',
        30: '#B8ADA4',
      },
      cream: '#FAF7F2',
      linen: '#EDE6DB',
    },
    fontFamily: {
      display: ['Playfair Display', 'serif'],
      sans: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
  },
}
```