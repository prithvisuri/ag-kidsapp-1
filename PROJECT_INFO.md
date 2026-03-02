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
- Correct-answer celebration (confetti + star award)
- Milestone badges and level-up overlay

### 3. Rhymes
- Embedded YouTube rhyme catalog
- Simple card-based browsing experience

### 4. Progress Tracking
- Stars persisted to Supabase profiles when configured
- Safe local fallback mode when Supabase env config is missing
- Defensive handling for invalid/missing DOM and malformed star values

## Quality and Testing
- Test suite includes unit + feature/integration coverage:
  - Navigation and HTML page-structure tests
  - Alphabet/math/rhymes interaction tests
  - Supabase fallback and configured-mode tests
- Latest validation:
  - `npm test`: 44 tests passing
  - `npm run coverage`: thresholds enforced and passing
  - `npm run build`: passing
- Coverage snapshot:
  - Statements: 94.36%
  - Branches: 81.45%
  - Functions: 91.66%
  - Lines: 98.65%

## Project Structure
```text
.
├── frontend/
│   ├── Dockerfile
│   ├── docker/                  # Nginx config
│   ├── index.html
│   ├── package.json
│   ├── public/
│   │   └── assets/sounds/
│   ├── scripts/
│   │   └── download-assets.js
│   └── src/
│       ├── features/
│       ├── services/
│       ├── styles/
│       └── utils/
├── backend/
│   ├── package.json
│   └── src/index.js             # Placeholder backend entry
├── ACTION_PLAN.md
├── code_review.md
├── PROJECT_INFO.md
└── DEPLOYMENT.md
```

## Local Development
1. Install root dependencies (if needed):
```bash
npm install
```
2. Install frontend dependencies:
```bash
cd frontend && npm install
```
3. Run frontend dev server:
```bash
npm run dev
```
4. Run tests:
```bash
npm test
```
5. Run coverage:
```bash
npm run coverage
```

## Asset Download
From `frontend/`:
```bash
npm run download-assets
```
The script now validates HTTP status codes and exits non-zero on failed downloads.

## Deployment
See `DEPLOYMENT.md` for deployment options and environment details.

## Known Gaps
- No Playwright E2E tests yet
- No completed accessibility audit yet
- Backend business logic and tests are still pending
