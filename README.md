# Kiddo — Server Driven UI Quick-Commerce App

A production-grade React Native (Expo) quick-commerce application for baby & kids products, architected around a **Server Driven UI (SDUI)** engine. The entire homepage, categories, campaigns, themes, and user interactions are driven by a JSON payload — no hardcoded layouts, no app-store updates required to change the UI.

Built to match the UX quality of **Blinkit**, **Zepto**, and **Swiggy Instamart** — with glassmorphism design, dark mode, campaign-driven personalisation, and polished micro-interactions throughout.

---

## Table of Contents

- [What is SDUI?](#what-is-sdui)
- [Screens & Flow](#screens--flow)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Testing & Validation](#testing--validation)
- [How to Extend](#how-to-extend)

---

## What is SDUI?

Server Driven UI means the **server (or a mock JSON payload) describes what the screen should look like**. The client receives a list of component objects — each with a `type`, `id`, and `data` — and renders them through a registry. This enables:

- **Instant UI changes** without app store approval
- **A/B testing** different layouts per user
- **Campaign-specific content** injected into the feed at runtime
- **Personalised homepages** per user segment
- **Feature flags** controlled server-side

In this project, the payload lives in `src/mockData.ts`. In production, it would be fetched from a backend API.

---

## Screens & Flow

```
Intro (animated splash)
    ↓ auto
Homepage (FlashList feed)
    ├── → CategoryScreen (7 themed pages)
    ├── → CampaignPage (3 campaigns)
    ├── → CartScreen (full cart with checkout)
    ├── → ProfileScreen (user info + settings)
    └── → DemoHub (developer tools, 5-tap hidden)
```

### Screen Details

| Screen | Purpose |
|---|---|
| **IntroScreen** | Animated Kiddo brand splash with spring logo, fade tagline, auto-transition after 2.5s |
| **HomepageScreen** | Main feed: delivery info bar, search, category chips, campaign strip, FlashList of banners/grids/collections, floating cart pill, search overlay |
| **CategoryScreen** | 7 unique themed pages (Baby Care → pink + clouds, Toys → orange + balloons, School → green + stationery, etc.) with 2-column product grid, floating emoji, animated cards |
| **CampaignPage** | Campaign landing: gradient header, hero banner, floating campaign emoji (pencils for school, water for summer, confetti for mystery), 2-column product grid |
| **CartScreen** | Full cart: item list with +/- quantity controls, remove, subtotal, delivery fee (free above ₹499), checkout flow with order processing animation |
| **ProfileScreen** | User avatar, name, email, phone, menu items (Orders, Wishlist, Addresses, Gift Cards, Dark Mode toggle, Settings, Help), Sign Out |
| **SearchOverlay** | Full-screen overlay: recent searches, popular searches, browse categories, live text suggestions that surface both categories and campaigns |
| **DemoHub** | Developer console: campaign switcher, component payload stats, cart inspector, quick actions — hidden from users |

---

## Features

### Server Driven UI Engine
- Homepage layout entirely driven by `mockPayload.components` array
- Category pages load products from `categoryProductIds` mapping
- Campaigns inject themed components into the homepage feed at runtime
- Actions (`DEEP_LINK`, `OPEN_CATEGORY`, etc.) configured per-component in JSON
- No hardcoded homepage structure — the JSON payload is the single source of truth

### Component Registry (Factory Pattern)
- Components registered by `type` string → renderer function in a `Map`
- Adding a new type = one `register()` call + one component file
- No giant `switch` blocks — clean, scalable, testable
- Unknown types (`UNKNOWN`, `NEW_COMPONENT_V2`) silently dropped with dev-only console warning
- Never crashes the app on unrecognised payload

### Action Dispatcher
- Every clickable element routes through `actionDispatcher.handleAction(action)`
- Supported actions: `ADD_TO_CART`, `REMOVE_FROM_CART`, `DEEP_LINK`, `OPEN_CATEGORY`, `OPEN_CAMPAIGN`, `APPLY_MYSTERY_GIFT_COUPON`, `TOGGLE_WISHLIST`, `NONE`
- Leaf components stay "dumb" — no imports of navigation, cart, or business logic
- Centralised error handling (try/catch around every handler)
- `setNavigateFn` callback keeps the dispatcher decoupled from React Navigation

### Glassmorphism UI
- Every card, header, button, and panel uses `backdrop-filter: blur()` with semi-transparent backgrounds
- Three intensity levels: `light` (30% opacity, 6px blur), `medium` (55%, 12px), `heavy` (75%, 20px)
- Subtle border with matching opacity
- Consistent frosted-glass aesthetic across light and dark modes
- Reusable `GlassContainer` component with configurable `borderRadius` and `intensity`

### Dark / Light Mode
- Toggle from the header icon (🌙/☀️) or Profile → Settings → Dark Mode
- Complete dark colour palette: backgrounds `#0D1117`, cards frosted dark, text `#E6EDF3`/`#8B949E`, borders `#30363D`
- Campaign and category theme overrides merge on top of the base palette
- Components consume `theme.textPrimary`, `theme.secondary`, `theme.primary`, etc. — zero hardcoded colours

### Campaign Engine
| Campaign | Theme | Special Content |
|---|---|---|
| **Back to School Mega-Sale** | Yellow + navy blue | Floating school emoji, Lunchboxes & Bags collection injected after hero |
| **Summer Playhouse Festival** | Ocean blue + cyan | Floating beach emoji, Petting Zoo banner, Summer Must-Haves grid |
| **Mystery Gift Carnival** | Red carnival | Confetti overlay, mystery deals grid with coupon actions |

Campaigns switch at runtime via DemoHub — no app reload needed.

### Themed Category Pages (No White Backgrounds)

| Category | Page Colour | Gradient | Floating Emoji |
|---|---|---|---|
| Baby Care | `#FFF5F8` | Pink | ⭐☁️🌙🌸🦋 |
| Toys | `#FFFBEA` | Orange | 🎈🎠🌈🎪🤹 |
| School | `#F3F8FF` | Green | ✏️📐🎒📏📓 |
| Feeding | `#FFF8F0` | Warm peach | 🥣🍎🍼🥄🍚 |
| Snacks | `#FFF8E1` | Gold | 🍪🍿🧃🍇🥨 |
| Hygiene | `#E1F5FE` | Light blue | 🧼🫧🌊💧🌸 |
| Nursery | `#F3E5F5` | Lavender | 🌙⭐🦉🌈☁️ |

### Product Image Fallbacks
- Every product ID has a mapped emoji fallback
- If the remote image URL fails to load, the component shows the emoji (e.g., `p10` → 🧴, `p31` → 🎒, `p70` → 🧱)
- Never renders a blank white box

### Floating Cart
- Hidden when cart is empty
- Animates in with spring effect when first item is added
- Shows up to 3 product thumbnails with overlapping stack effect
- Displays item count and total amount
- "View Cart" CTA opens the full CartScreen
- Positioned above the bottom edge with elevation shadow

### Search Overlay
- Full-screen modal triggered by tapping the search bar
- Shows recent searches (🕐) and popular searches (🔥) as tappable chips
- Browse categories list with icons
- As user types: live suggestions surfacing matching categories and campaigns
- Empty state with "Try searching diapers, toys, or school supplies" hint

### Performance
- **FlashList** for the main vertical feed — recycler-based, minimal JS allocations
- **React.memo** with custom comparison functions on all list items and product cards
- **Stable keyExtractor** (`item.id`) prevents unnecessary remounts
- **CartStore** uses `useMemo`/`useCallback` — cart updates don't cascade to the feed
- **`removeClippedSubviews`** on horizontal FlatLists
- **`windowSize={3}`** and **`maxToRenderPerBatch={4}`** tuned for scroll smoothness

### Developer Tools (Hidden)
- 5-tap gesture on the top-left zone toggles dev mode
- DevFab gear icon (⚙️) appears only when dev mode is active
- DemoHub shows: campaign switcher, payload stats (component count by type), cart state inspector, quick actions
- Regular users never see or access developer tooling

### Resilience & Error Handling
- `ErrorBoundary` at the root — catches unhandled render errors
- `try/catch` around every action handler — corrupt payloads never crash
- Unknown component types gracefully return `null` with a dev warning
- Null-safe guards throughout (`??`, `?.filter(Boolean)`, etc.)
- Two resilience test components in the payload (`UNKNOWN` and `NEW_COMPONENT_V2`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript (strict mode) |
| Virtual List | `@shopify/flash-list` 2.x |
| Navigation | State machine (no router dependency) |
| Animations | React Native `Animated` API (spring, timing, sequence) |
| Theming | React Context (`ThemeProvider`) |
| Architecture | SDUI Engine + Component Registry (Factory Pattern) |
| Cart State | React Context (`CartStore`) |
| Actions | Singleton `ActionDispatcher` with handler Map |

---

## Project Structure

```
kiddo-sdui/
├── App.tsx                    # Root: providers, state machine, 7-screen nav
├── app.json                   # Expo configuration
├── babel.config.js            # Babel config
├── tsconfig.json              # TypeScript strict config
├── package.json               # Dependencies
├── .gitignore                 # Excludes node_modules, .expo, dist, etc.
├── README.md                  # This file
├── ARCHITECTURE.md            # Detailed architecture documentation
└── src/
    ├── types/
    │   └── sdui.ts            # All TS interfaces: ComponentType, ActionType, ThemeConfig, etc.
    ├── context/
    │   ├── ThemeProvider.tsx   # Dark mode, campaign/category themes, glass() helper
    │   └── CartStore.tsx       # Cart state: addToCart, decrementFromCart, removeFromCart, clearCart
    ├── utils/
    │   └── ActionDispatcher.ts # Centralised action handler (singleton Map)
    ├── registry/
    │   └── ComponentRegistry.tsx # Factory pattern: type → renderer mapping
    ├── components/
    │   ├── HomepageScreen.tsx     # Main feed (FlashList, header, chips, campaign strip, search overlay)
    │   ├── CategoryScreen.tsx     # 7 themed category pages (unique gradients, floating emoji)
    │   ├── CampaignPage.tsx       # Campaign landing (floating emoji, products)
    │   ├── CartScreen.tsx         # Full cart (qty controls, checkout flow)
    │   ├── ProfileScreen.tsx      # Profile + settings (dark mode toggle)
    │   ├── IntroScreen.tsx        # Animated brand splash
    │   ├── SearchOverlay.tsx      # Full-screen search (suggestions, recent, popular)
    │   ├── FloatingCart.tsx       # Animated bottom cart pill
    │   ├── BannerHero.tsx         # Campaign-themed hero banner
    │   ├── ProductGrid2x2.tsx     # 2x2 product grid (animated add, wishlist)
    │   ├── DynamicCollection.tsx  # Horizontal carousel (animated add)
    │   ├── ProductImage.tsx       # Image with emoji fallback per product ID
    │   ├── GlassContainer.tsx     # Reusable glassmorphism wrapper
    │   ├── CategoryChips.tsx      # Horizontal category selector
    │   ├── SearchBar.tsx          # Search input trigger
    │   ├── SearchOverlay.tsx      # Full-screen search UI
    │   ├── FullScreenOverlay.tsx  # Campaign emoji overlay (pointerEvents: none)
    │   ├── ScreenTransition.tsx   # Fade-in wrapper between screens
    │   ├── DemoHub.tsx            # Developer console (5-tap hidden)
    │   └── ErrorBoundary.tsx      # Root error boundary
    └── mockData.ts            # JSON payload, 82 products, 8 categories, 3 campaigns, 12 components
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

This opens the Expo dev tools. Press:
- `w` to open in web browser
- `a` to open on Android emulator
- `i` to open on iOS simulator

### Type Check

```bash
npx tsc --noEmit
```

Should output zero errors.

### Production Build

```bash
# Web export (builds to dist/)
npx expo export --platform web

# Native builds
npx eas build --platform android
npx eas build --platform ios
```

---

## Usage Guide

### Adding Items to Cart
1. Scroll through the homepage
2. Tap the **+** button on any product card (spring animation confirms the tap)
3. The **Floating Cart** pill slides up from the bottom
4. Tap **View Cart** to see the full CartScreen
5. Adjust quantities with **+** / **−** buttons (trash icon removes item)
6. Proceed to Checkout to see the order processing animation

### Browsing Categories
1. Tap any **Category Chip** (Baby Care, Toys, School, etc.)
2. The CategoryScreen opens with the category's unique theme, gradient, and floating emoji
3. Products display in a 2-column grid with discount badges
4. Tap **+** to add items to cart
5. Tap **←** to go back to the homepage

### Campaign Navigation
1. Tap any **Banner Hero** (Summer Mega Sale, Snack Time, Back to School)
2. The CampaignPage opens with the campaign's theme, floating emoji, and featured products
3. The active campaign also injects special components into the homepage (Lunchboxes & Bags for Back to School, Petting Zoo for Summer, Mystery Deals for Carnival)
4. A campaign strip appears below the category chips showing the active campaign tagline

### Using Search
1. Tap the **search bar** at the top
2. Browse **Recent Searches**, **Popular Searches**, or **Categories**
3. Type to see live suggestions (matches both categories and campaigns)
4. Tap a suggestion to navigate directly

### Dark Mode
1. Tap the **🌙** icon in the top-right header to toggle dark mode
2. Or go to **Profile** → **Settings** → **Dark Mode**
3. All screens immediately update with dark backgrounds, frosted glass cards, and light text

### Developer Console
1. Tap the **top-left corner** of the homepage **5 times rapidly**
2. A **⚙️ gear icon** appears at the bottom-right
3. Tap the gear to open the **DemoHub**
4. In DemoHub: switch campaigns, view payload stats, inspect cart state, trigger quick actions

---

## Testing & Validation

### Type Safety
```bash
npx tsc --noEmit     # Should output zero errors
```

### Build
```bash
npx expo export --platform web
```
Expected output: `358 modules, ~759 kB, zero errors`

### Resilience Test
The payload includes two test components:
- `id: "unknown-test"` with `type: "UNKNOWN"` → silently dropped
- `id: "corrupt-test"` with `type: "NEW_COMPONENT_V2"` → silently dropped

Expected console output (dev mode only):
```
WARN  ComponentRegistry: Silently dropping unknown component "UNKNOWN" (id: unknown-test)
WARN  ComponentRegistry: Silently dropping unknown component "NEW_COMPONENT_V2" (id: corrupt-test)
```

---

## How to Extend

### Add a New Component Type
1. Add the type string to `ComponentType` in `src/types/sdui.ts`
2. Create the component's data interface (extend `BaseComponent`)
3. Add the interface to the `UIComponent` union type
4. Create the UI component in `src/components/`
5. Register it in `ComponentRegistry.tsx`:
   ```ts
   this.register('MY_NEW_TYPE', (comp, onAction) => (
     <MyNewRenderer key={comp.id} component={comp} onAction={onAction} />
   ));
   ```
6. Add a component instance to `mockPayload.components` in `mockData.ts`

### Add a New Action
1. Add the action string to `ActionType` in `src/types/sdui.ts`
2. Create a handler method in `ActionDispatcher.ts`
3. Register it in the constructor:
   ```ts
   this.handlers.set('MY_ACTION', this.handleMyAction.bind(this));
   ```

### Add a New Campaign
1. Add a `CampaignConfig` object to the `campaigns` record in `mockData.ts`
2. Define the theme, injected components, and overlay animation URL
3. The campaign is now switchable at runtime via DemoHub

### Add a New Category
1. Add a `CategoryTheme` entry in `categoryThemes` in `mockData.ts`
2. Add a `CATEGORY_MOOD` entry in `CategoryScreen.tsx`
3. Add product IDs to `categoryProductIds`
4. Add the category to the `categories` array

### Localisation
- All user-facing strings live in `mockData.ts` (product names, banner text, etc.)
- To localise, replace strings in the payload with locale-specific values
- Search overlay recent/popular searches are defined as constants in `SearchOverlay.tsx`
