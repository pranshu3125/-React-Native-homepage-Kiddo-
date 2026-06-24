# Architecture

## Overview

Kiddo is a **Server Driven UI (SDUI)** application. The client renders UI components based on a JSON payload received from the server (currently mocked in `mockData.ts`). This architecture allows the entire homepage, category pages, campaigns, themes, and user interactions to be modified without app store updates.

```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                          │
│  ErrorBoundary → SafeAreaProvider → ThemeProvider →     │
│  CartProvider → CartInitializer → AppNavigation         │
│                                                         │
│  Screen state machine:                                  │
│  intro → homepage ↔ category ↔ campaign ↔ cart ↔       │
│          profile ↔ demo                                 │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
kiddo-sdui/
├── App.tsx                    # Root — providers, state machine, navigation
├── src/
│   ├── types/
│   │   └── sdui.ts           # All TypeScript types (ComponentType, ActionType, ThemeConfig, etc.)
│   ├── context/
│   │   ├── ThemeProvider.tsx  # Campaign/category theme, dark mode, glass helpers
│   │   └── CartStore.tsx      # Cart state (add, remove, decrement, clear)
│   ├── utils/
│   │   └── ActionDispatcher.ts # Centralised action handler (singleton)
│   ├── registry/
│   │   └── ComponentRegistry.tsx # Factory pattern — maps type → renderer
│   ├── components/
│   │   ├── HomepageScreen.tsx     # Main feed (FlashList) with header, chips, search
│   │   ├── CategoryScreen.tsx     # Themed category product grid (2-col)
│   │   ├── CampaignPage.tsx       # Campaign landing with floating emoji & products
│   │   ├── CartScreen.tsx         # Full cart with qty controls & checkout flow
│   │   ├── ProfileScreen.tsx      # User profile & settings (incl. dark mode toggle)
│   │   ├── IntroScreen.tsx        # Animated brand splash
│   │   ├── SearchOverlay.tsx      # Full-screen search with suggestions
│   │   ├── FloatingCart.tsx       # Animated bottom cart pill
│   │   ├── BannerHero.tsx         # Campaign-themed hero banner
│   │   ├── ProductGrid2x2.tsx     # 2×2 grid with animated add + wishlist
│   │   ├── DynamicCollection.tsx  # Horizontal carousel with animated add
│   │   ├── ProductImage.tsx       # Image with emoji fallback
│   │   ├── GlassContainer.tsx     # Reusable glassmorphism wrapper
│   │   ├── CategoryChips.tsx      # Horizontal category selector
│   │   ├── SearchBar.tsx          # Search input (triggers SearchOverlay)
│   │   ├── FullScreenOverlay.tsx  # Campaign-themed floating emoji overlay
│   │   ├── ScreenTransition.tsx   # Animated fade-in wrapper
│   │   └── DemoHub.tsx            # Developer console (hidden behind 5-tap)
│   └── mockData.ts           # JSON payload, product catalog, campaigns, categories
```

## SDUI Engine

### Data Flow

```
mockData.ts (HomepagePayload)
  → App.tsx passes components[] to HomepageScreen
    → FlashList renders each component
      → ComponentRegistry.render(type, component, onAction)
        → Factory creates the correct renderer component
          → Renderer passes data + onAction callback to leaf UI component
```

### Component Types

| Type | Description |
|---|---|
| `BANNER_HERO` | Full-width hero with gradient overlay, CTA, discount badge |
| `PRODUCT_GRID_2X2` | 2×2 product cards with animated add + wishlist |
| `DYNAMIC_COLLECTION` | Horizontal carousel with snap-to-item |
| `FULL_SCREEN_OVERLAY` | Campaign-themed floating emoji (pointer-events: none) |
| `UNKNOWN` | Silently dropped with dev warning |

### Adding a New Component Type

1. Add the type string to `ComponentType` in `src/types/sdui.ts`
2. Create the component's data interface
3. Create the UI component in `src/components/`
4. Register it in `ComponentRegistry.tsx`:
   ```ts
   this.register('NEW_TYPE', (comp, onAction) => <NewRenderer ... />);
   ```

## Action Dispatcher

All user interactions route through `actionDispatcher.handleAction(actionObj)`:

| Action | Payload | Behaviour |
|---|---|---|
| `ADD_TO_CART` | `{ id: string }` | Increments cart quantity |
| `REMOVE_FROM_CART` | `{ id: string }` | Removes item from cart |
| `DEEP_LINK` | `{ url: string }` | Navigates via registered callback |
| `OPEN_CATEGORY` | `{ id: string }` | Opens category page |
| `OPEN_CAMPAIGN` | `{ id: string }` | Opens campaign page |
| `APPLY_MYSTERY_GIFT_COUPON` | `{ code: string }` | Shows coupon alert |
| `TOGGLE_WISHLIST` | `{ id: string }` | Toggles wishlist state |
| `NONE` | — | No-op |

Components remain "dumb" — they never import navigation or business logic; they call `onAction(action)` which bubbles up to the dispatcher.

## Theming

### Theme Context (`ThemeProvider.tsx`)

Provides:
- `theme` — merged `ThemeConfig` (campaign → category → default)
- `isDark` / `toggleDark` — dark mode toggle
- `glass(opacity)` — returns glassmorphism `ViewStyle` with `backdrop-filter: blur()`
- `campaign` / `setCampaign` — active campaign
- `categoryTheme` / `setCategoryTheme` — active category theme

### Theme Resolution Order

1. Active campaign theme (if set)
2. Active category theme (if set)
3. Base light/dark palette

### Dark Mode

- `lightPalette` / `darkPalette` define complete color schemes
- All components consume `theme.textPrimary`, `theme.textSecondary`, `theme.primary`, etc. instead of hardcoded colors
- Campaign & category theme overrides merge on top of the base palette

## Glassmorphism

`GlassContainer.tsx` provides a reusable wrapper:

```tsx
<GlassContainer intensity="medium" borderRadius={16}>
  {children}
</GlassContainer>
```

Intensities: `light` (30% opacity, 6px blur), `medium` (55%, 12px), `heavy` (75%, 20px).

Uses `backdrop-filter: blur()` on web; falls back to semi-transparent backgrounds on native.

## Campaign Engine

Campaigns are defined in `mockData.ts` as `CampaignConfig` objects with:
- `theme` — full `ThemeConfig` override
- `injectedComponents` — `UIComponent[]` injected into the homepage feed
- `overlayAnimationUrl` — triggers `FullScreenOverlay` with themed floating emoji

Campaign switching is instantaneous — no app update required.

## Performance

- **FlashList** for the main vertical feed (recycler-based, minimal allocations)
- **React.memo** with custom comparison functions on all list items and cards
- **Stable keyExtractor** (`item.id`) avoids unnecessary remounts
- **CartStore** uses `useMemo`/`useCallback` to prevent cascading re-renders
- **`removeClippedSubviews`** on horizontal FlatLists
- **`windowSize`** and **`maxToRenderPerBatch`** tuned for scroll smoothness
