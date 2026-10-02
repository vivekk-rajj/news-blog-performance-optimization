# News Blog Performance Optimization

A production-ready React + Vite dashboard for inspecting and optimizing news content performance records.

## Features

- Monochromatic, responsive corporate interface
- Interactive workflow to search records and run a simulated optimization action
- Friendly empty state: **No data found**
- Slow-network simulation with visible loading status
- Form validation with accessible inline errors and red invalid fields
- Input sanitization before state updates (dependency-free)
- Telemetry simulation on primary action:
  - Logs `[Analytics] User interacted with Performance Optimization`
- React performance optimizations with `useMemo` and `useCallback`
- Accessibility-focused semantic landmarks, labels, keyboard support, focus states, and live regions

## Tech Stack

- React 19
- Vite 8
- Vitest + React Testing Library
- OXLint

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Quality checks

```bash
npm test
npm run lint
npm run build
```

## Preview production build

```bash
npm run preview
```

## Deployment

This app is static and can be deployed to services like Vercel, Netlify, or GitHub Pages.

1. Run `npm run build`
2. Deploy the generated `dist/` directory
