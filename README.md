# Kiddo — Server Driven UI Quick-Commerce App

A production-grade React Native (Expo) quick-commerce application for baby & kids products, architected around a **Server Driven UI (SDUI)** engine. The entire homepage, category pages, campaigns, themes, and actions are driven by JSON payloads — no hardcoded layouts.

Built for **Blinkit/Zepto/Instamart**-level UX with glassmorphism design, dark mode, and campaign-driven personalisation.

## Features

- **SDUI Engine** — JSON drives every screen: homepage, categories, campaigns, banners, collections, themes
- **Component Registry** — Factory pattern; components registered by type, unknown types safely dropped
- **Action Dispatcher** — Centralised action routing (ADD_TO_CART, DEEP_LINK, OPEN_CATEGORY, TOGGLE_WISHLIST, etc.)
- **Glassmorphism UI** — Frosted glass (`backdrop-filter: blur`) on all cards, headers, buttons, and panels
- **Dark / Light Mode** — Toggle from header or profile; persists across all screens
- **3 Campaigns** — Back to School, Summer Playhouse, Mystery Gift Carnival; switchable at runtime without app update
- **7 Themed Category Pages** — Each category has its own gradient, page background, floating emoji, and mood (no white pages)
- **Campaign Engine** — Injected components, animated overlays, coupon actions, themed product grids
- **Floating Cart** — Animated bottom pill with thumbnails, count, total, and View Cart CTA
- **Search Overlay** — Full-screen search with recent/popular searches, live category/campaign suggestions
- **Resilience** — Unknown component types silently dropped; ErrorBoundary at root; try/catch in dispatcher
- **Performance** — FlashList for main feed, React.memo boundaries, stable keyExtractor
- **Developer Tools** — Hidden behind 5-tap gesture; campaign switcher, payload stats, cart inspector

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript (strict) |
| Virtual List | `@shopify/flash-list` |
| Navigation | State machine (no router dependency) |
| Animations | React Native `Animated` API |
| Theming | React Context + JSON-driven |

## Getting Started

```bash
npm install
npx expo start
```

Web export:

```bash
npx expo export --platform web
```

Type check:

```bash
npx tsc --noEmit
```

## Usage

- **Homepage** — Scroll through banners, product grids, and collections driven by `mockData.ts`
- **Category Chips** — Tap a category to open its themed page with unique colors and emoji
- **Banners** — Tap to navigate to the corresponding campaign page
- **Add to Cart** — Tap the `+` button on any product card (animated spring effect)
- **Floating Cart** — Appears when items are in cart; tap to view full cart with quantity controls
- **Search** — Tap the search bar to open the full-screen overlay
- **Dark Mode** — Tap the 🌙/☀️ icon in the header or toggle in Profile → Settings
- **Developer Console** — Tap the top-left area 5 times to reveal the ⚙️ DevFab; tap to open DemoHub
- **Campaign Switching** — In DemoHub, tap any campaign card to inject its components and theme
