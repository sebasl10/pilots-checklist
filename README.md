# C-208B G-1000 Pilot's Checklist

A mobile-first web application for the Colombian Air Force (FAC) pilots flying the **Cessna C-208B Grand Caravan** equipped with the Garmin G-1000 avionics suite, FLIR, and ADS-80 systems.

The app converts the official PDF checklist (Rev. 20 / 30-SEPT-2025, O.D. GACAS XXX) into a fast, readable, offline-capable interface optimized for cockpit use.

---

## Features

- **17 checklist sections** covering the full flight envelope — from Before Starting Engine to Securing
- **Color-coded indicators** for special operation items (FLIR, MEDEVAC, ADS-80, PBN, External Power)
- **Mobile-first design** with large touch targets (≥52px) suitable for gloved hands
- **Offline support** via PWA — installable on iOS and Android, works without internet
- **Read-only** — designed for consultation, not form-filling
- **Dark aviation theme** — high contrast for cockpit lighting conditions

## Tech Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — service worker + offline cache
- [Lucide React](https://lucide.dev/) — icons

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. For mobile testing, use Chrome DevTools in iPhone viewport (390×844).

```bash
# Production build
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```
src/
├── data/
│   └── checklist.json       # All 17 sections and ~150 checklist items
├── components/
│   ├── SectionCard.jsx      # Clickable card on the home screen
│   └── ChecklistItem.jsx    # Single checklist row with color indicator
├── pages/
│   ├── Home.jsx             # Section list grouped by Pre-Vuelo / Vuelo
│   └── SectionDetail.jsx    # Items for a given section + back navigation
├── App.jsx                  # Router setup
├── main.jsx
└── index.css                # Tailwind base + safe-area utilities
```

### Checklist Sections

| # | Section | Group |
|---|---------|-------|
| 01 | Before Starting Engine | Pre-Vuelo |
| 02 | Starting Engine | Pre-Vuelo |
| 03 | After-Starting Engine | Pre-Vuelo |
| 04 | Before Taxiing | Pre-Vuelo |
| 05 | Taxiing | Pre-Vuelo |
| 06 | Systems | Pre-Vuelo |
| 07 | Before Takeoff | Pre-Vuelo |
| 08 | Line-Up | Pre-Vuelo |
| 09 | Climb | Vuelo |
| 10 | Cruise | Vuelo |
| 11 | Target (C-208B FLIR / ADS80) | Vuelo |
| 12 | Exit Target (C-208B FLIR / ADS80) | Vuelo |
| 13 | Descent | Vuelo |
| 14 | Before Landing | Vuelo |
| 15 | After Landing | Vuelo |
| 16 | Shutdown | Vuelo |
| 17 | Securing | Vuelo |

### Color Indicators

Items tagged in the original PDF with a colored square are displayed with a matching indicator:

| Color | Category |
|-------|----------|
| 🟡 Yellow | External PWR Start Items |
| 🟠 Orange | FLIR Items |
| 🔴 Red | MEDEVAC Items |
| 🔵 Blue | ADS-80 Items |
| 🩷 Pink | PBN Operations Items |

## Deployment

The project is configured for **Vercel** with [`vercel.json`](vercel.json) handling client-side routing rewrites.

1. Push to GitHub
2. Import the repository at [vercel.com](https://vercel.com)
3. Set the project name to `pilots-checklist` to get `pilots-checklist.vercel.app`
4. Vercel auto-detects Vite — no additional configuration needed

Every push to `main` triggers an automatic redeploy.

## Aircraft Reference

- **Aircraft:** Cessna C-208B Grand Caravan
- **Avionics:** Garmin G-1000 glass cockpit
- **Special systems:** FLIR (Forward Looking Infrared), ADS-80
- **Operator:** Fuerza Aérea Colombiana (FAC)
- **Checklist revision:** Rev. 20 / 30-SEPT-2025 (O.D. GACAS XXX)
