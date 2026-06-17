# KulturKlima

**The Cultural Pulse of Denmark** — a minimal single-page dashboard tracking cultural consumption across Danish municipalities.

## Tech Stack

- **Vite + React** (TypeScript)
- **Tailwind CSS v4** — dark Nordic design system
- **Lucide React** — icons
- **Recharts** — data visualizations

## Data Architecture

No live HTTP calls to [Danmarks Statistik](https://api.statbank.dk) on page load. Data is served from static cached JSON mocks in `src/data/mock/`:

| Table   | Description                          |
|---------|--------------------------------------|
| `BIB1`  | Library loans per municipality       |
| `MUS01` | Museum visits per municipality       |
| `FOLK1A`| Population (for per-capita metrics)  |

Replace these files with real Statbank exports when ready.

## Project Structure

```
src/
├── components/
│   ├── charts/          # Recharts visualizations
│   ├── dashboard/       # Main dashboard layout
│   ├── layout/          # Header, Footer
│   └── ui/              # StatCard, SectionCard, selects
├── data/
│   ├── mock/            # BIB1, MUS01, FOLK1A JSON caches
│   ├── index.ts         # Data merging & per-capita helpers
│   └── types.ts         # Statbank table types
└── hooks/
    └── useCulturalData.ts
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
