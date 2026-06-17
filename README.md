# KulturKlima

**The Cultural Pulse of Denmark** — a single-page dashboard exploring library loans, museum visits, and cultural consumption across all 98 Danish municipalities.

Built for cultural institutions, creative professionals, and municipal planners.

## Live data

KulturKlima fetches **live data from [Danmarks Statistik](https://www.dst.dk/)** via the public Statbank API. No static mock datasets are bundled in production.

| Table   | Use in app                                      |
|---------|-------------------------------------------------|
| `BIB1`  | Physical and digital library loans per kommune  |
| `MUS3`  | Regional museum visits (scaled to municipality) |
| `FOLK1A`| Population for per-capita metrics               |

### Production proxy

Browser requests go to `/api/statbank/*` on the same origin. In production (Vercel), `vercel.json` rewrites these to `https://api.statbank.dk/*`, avoiding CORS issues. Local development uses the Vite dev-server proxy with the same path.

Optional override: set `VITE_DST_API_BASE` in `.env` (see `.env.example`). **Only point this at your own trusted same-origin proxy.**

### Museum metrics & tourism skew

Kommune-level museum data is not available directly in Statbank. The app uses **MUS3 regional visit totals**, scaled by each municipality's share of regional population. The data layer also applies **tourism skew corrections**:

- **Hub detection** — capital-region and high per-capita visit municipalities are flagged when museum traffic likely reflects tourism.
- **Commuter adjustment** — low museum registration municipalities note that residents may use institutions across the wider region.
- **Culture index cap** — when museum visits exceed 3 per resident, the culture index weights museum contribution at 3 to reduce outlier distortion.

### Seasonal Pulse (voluntary view mode)

The default **Annual View** shows multi-year library trends and annual museum mix charts. **Seasonal Pulse** is an optional toggle that models quarterly library and museum patterns (winter vs. summer) from annual totals, with dynamic seasonal insights. It is illustrative — not official quarterly Statbank tables.

## Tech stack

- **Vite + React** (TypeScript)
- **Tailwind CSS v4** — warm Nordic design system
- **Recharts** — data visualizations
- **Lucide React** — icons

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Local development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev server proxies `/api/statbank` to Danmarks Statistik automatically.

### Production build

```bash
npm run build
```

Output is written to `dist/`. Preview locally with:

```bash
npm run preview
```

### Quality checks

```bash
npm run ci
```

Runs ESLint, TypeScript build, and a production dependency audit.

## Deploying to Vercel

1. Import the GitHub repository in [Vercel](https://vercel.com).
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. `vercel.json` is included — it configures the Statbank proxy and security headers (HSTS, CSP, frame options).

## Project structure

```
src/
├── components/
│   ├── charts/       # BookwormChart, MuseumProfile, seasonal axis
│   ├── dashboard/    # Main display, seasonal insights, layout shell
│   ├── layout/       # Header, Footer, Sidebar
│   └── ui/           # StatCard, toggles, export, tooltips
├── context/          # Municipality, cultural data, view mode
├── data/             # Statbank service, metrics, municipalities
├── i18n/             # Danish / English (default: Danish)
├── theme/            # Chart and design tokens
└── utils/            # API client, cache, CSV export, seasonal insights
```

## Data attribution

Source: Own calculations and visualizations based on API data from Statistics Denmark (Tables: BIB1, MUS3, FOLK1A). Distributed under the [Creative Commons Attribution 4.0 International license (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

## License

Application code is private unless otherwise specified. Statbank data is subject to Danmarks Statistik's CC BY 4.0 terms.
