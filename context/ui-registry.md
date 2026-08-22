# Dorovu — UI Component Registry

Track all components that exist in the project.
Update this file every time a new component is created.

---

## shadcn/ui (installed)
These are in `apps/web/src/components/ui/` — do not modify.
- [ ] button
- [ ] input
- [ ] card
- [ ] dialog
- [ ] form
- [ ] badge
- [ ] avatar
- [ ] skeleton
- [ ] toast
- [ ] dropdown-menu
- [ ] tabs
- [ ] separator

Install with: `pnpm dlx shadcn@latest add <name>`

---

## Shared Components
`apps/web/src/components/shared/`

| Component | File | Status | Description |
|---|---|---|---|
| Navbar | `Navbar.tsx` | ⬜ | Top navigation with auth state |
| Footer | `Footer.tsx` | ⬜ | Site footer |
| PageWrapper | `PageWrapper.tsx` | ⬜ | Max-width centered container |
| LoadingSpinner | `LoadingSpinner.tsx` | ⬜ | Reusable spinner |
| EmptyState | `EmptyState.tsx` | ⬜ | Empty list message + CTA |
| ErrorMessage | `ErrorMessage.tsx` | ⬜ | Error display with retry |

---

## Product Components
`apps/web/src/components/product/`

| Component | File | Status | Description |
|---|---|---|---|
| ProductCard | `ProductCard.tsx` | ⬜ | Card shown in grid/search results |
| ProductGrid | `ProductGrid.tsx` | ⬜ | Responsive grid of ProductCards |
| ProductImages | `ProductImages.tsx` | ⬜ | Image carousel on detail page |
| ProductForm | `ProductForm.tsx` | ⬜ | Create/edit product form |
| VariantSelector | `VariantSelector.tsx` | ⬜ | Colour/size picker on detail page |
| PriceTag | `PriceTag.tsx` | ⬜ | Formatted price with NPR currency |

---

## Crafter Components
`apps/web/src/components/crafter/`

| Component | File | Status | Description |
|---|---|---|---|
| CrafterCard | `CrafterCard.tsx` | ⬜ | Crafter summary card for directory |
| ShopBanner | `ShopBanner.tsx` | ⬜ | Hero banner on crafter shop page |
| CraftTypeBadge | `CraftTypeBadge.tsx` | ⬜ | Clay-colored craft type tag |
| CrafterMiniCard | `CrafterMiniCard.tsx` | ⬜ | Small crafter info on product page |
| PortfolioGrid | `PortfolioGrid.tsx` | ⬜ | Portfolio image grid |

---

## Order Components
`apps/web/src/components/order/`

| Component | File | Status | Description |
|---|---|---|---|
| OrderCard | `OrderCard.tsx` | ⬜ | Single order summary card |
| OrderTimeline | `OrderTimeline.tsx` | ⬜ | Status history timeline |
| OrderStatusBadge | `OrderStatusBadge.tsx` | ⬜ | Colored status badge |
| OrderItemRow | `OrderItemRow.tsx` | ⬜ | Single item within an order |

---

## Update this file when you create a new component.
Change ⬜ to ✅ when the component is built.