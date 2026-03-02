# Silly School - Development Action Plan

This plan tracks what has been completed and what remains to move Silly School from prototype to production-ready.

## Phase 1: Core Product and Stability
Goal: Deliver stable, engaging learning flows with resilient runtime behavior.

- [x] Supabase integration for progress stars (`profiles` upsert/read).
- [x] Safe Supabase fallback mode when env config is missing or placeholder.
- [x] Star milestone overlays (10, 25, 50, 100) and badge progression.
- [x] Alphabet swipe gestures and overlay interactions.
- [x] Confetti and bounce micro-interactions for learning feedback.
- [x] Audio voice selection and TTS fallback behavior.
- [x] Fix top-level page navigation structure (landing/alphabet/math/rhymes as siblings).
- [x] Add DOM null-safety guards across feature initialization paths.
- [x] Prevent invalid `NaN` star states by using safe numeric parsing.
- [x] Improve asset downloader reliability (HTTP status checks, completion tracking, error exit code).

## Phase 2: Testing and Quality Gates
Goal: Make regressions difficult and enforce measurable quality.

- [x] Unit tests for pure logic (`mathLogic`, `speech`).
- [x] Integration tests for navigation and page structure.
- [x] Feature tests for alphabet, math, and rhymes DOM behavior.
- [x] Supabase tests for fallback mode and configured mode.
- [x] Coverage command fixed to native Vitest coverage.
- [x] Coverage thresholds enforced in Vitest config.
- [x] Achieve and verify global coverage target >= 80%.
  - Latest snapshot: Statements 94.36%, Branches 81.45%, Functions 91.66%, Lines 98.65%.
- [ ] End-to-End (E2E) tests with Playwright for full browser flows.
- [ ] Accessibility audit (`axe-core`, keyboard flow, aria labels for non-text controls).

## Phase 3: CI/CD and Operations
Goal: Automate confidence and deployment lifecycle.

- [ ] Create GitHub Actions pipeline:
  - [ ] Lint
  - [ ] Unit/Integration tests
  - [ ] Coverage gate
  - [ ] Build
  - [ ] (Future) E2E tests
- [ ] Add linting setup (ESLint) with unused-import/unused-variable checks.
- [ ] Add backend test harness when backend logic is implemented.
- [ ] Define staging + production promotion strategy.
- [ ] Add runtime monitoring and client error reporting.

## Current Status Summary
- Frontend tests: 44 passing.
- Frontend build: passing.
- Coverage gate: passing with enforced thresholds.
- Backend: placeholder service only (no business logic/tests yet).

## Immediate Next Priorities
1. Add Playwright E2E suite for critical child flows (navigation, quiz, star milestones).
2. Add accessibility checks and fix findings.
3. Add CI workflow to run tests, coverage, and build on every PR.
4. Introduce ESLint and fail PRs on hygiene issues.
