# Silly School - Project Documentation

Silly School is an interactive learning web app for kids, focused on alphabets, early math, and nursery rhymes with playful visuals and guided audio feedback.

## Tech Stack
- Frontend: Vite + Vanilla JavaScript (ES modules)
- Styling: Vanilla CSS
- Data/Auth: Supabase (`@supabase/supabase-js`)
- Testing: Vitest + jsdom + V8 coverage
- Container/Web Serve: Docker + Nginx (frontend)

## Core Features

### 1. Alphabet Zoo
- Interactive alphabet cards (A-Z)
- Overlay with letter, word, and emoji mapping
- MP3 playback with TTS fallback
- Swipe navigation in overlay

### 2. Math Magic
- Number cards 1-20 with spoken feedback
- Quiz operations: add, subtract, multiply, divide
├── Dockerfile
├── docker/                      # Nginx config
├── index.html
├── package.json
├── public/
│   └── assets/sounds/
├── scripts/
│   └── download-assets.js
└── src/
  ├── features/
  ├── services/
  ├── styles/
  └── utils/
- Latest validation:
1. Install dependencies:
  - `npm run coverage`: thresholds enforced and passing
  - `npm run build`: passing
## Project Structure
```text
├── Dockerfile
├── docker/                      # Nginx config
├── index.html
├── package.json
├── public/
│   └── assets/sounds/
├── scripts/
│   └── download-assets.js
└── src/
  ├── features/
  ├── services/
  ├── styles/
  └── utils/
├── ACTION_PLAN.md
├── code_review.md
├── PROJECT_INFO.md
└── DEPLOYMENT.md
```

## Local Development
1. Install dependencies:
```bash
npm install
```
2. Run the development server:
```bash
npm run dev
```
3. Run tests:
```bash
npm test
```
4. Run coverage:
```bash
npm run coverage
```

## Asset Download
From the repository root:
```bash
npm run download-assets
```
The script now validates HTTP status codes and exits non-zero on failed downloads.

## Deployment
See `DEPLOYMENT.md` for deployment options and environment details.

## Known Gaps
- No Playwright E2E tests yet
- No completed accessibility audit yet
