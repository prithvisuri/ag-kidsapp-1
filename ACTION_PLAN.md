# Silly School - Development Action Plan

This plan outlines the roadmap for taking "Silly School" from a functional prototype to a robust, production-ready educational platform.

## 🛠️ Phase 1: Advanced Development
**Goal**: Enhance engagement and persistence.

- [ ] **Supabase Integration**:
    - [ ] Replace placeholder logic in `src/supabase.js` with real environment variables.
    - [ ] Implement `upsert` in `addStar()` to save progress to a `profiles` table.
    - [ ] Add basic "Continue Learning" functionality using session data.
- [ ] **Gamification**:
    - [ ] Add a "Level Up" animation when a child reaches 50 stars.
    - [ ] Introduce unlockable badges for completing alphabet or math milestones.
- [ ] **UI/UX Revisions**:
    - [ ] Implement kid-safe swipe gestures for the alphabet grid.
    - [ ] Add micro-interactions (bouncing buttons, confetti effects).
    - [ ] Optimize for tablet/touch devices.

## 🧪 Phase 2: Comprehensive Testing
**Goal**: Ensure stability and accessibility.

- [ ] **Unit Testing**:
    - [ ] Setup [Vitest](https://vitest.dev/) for testing math logic (`src/math.js`) and data structures.
    - [ ] Write tests for random question generation to ensure edge cases (like division by zero) are impossible.
- [ ] **End-to-End (E2E) Testing**:
    - [ ] Setup [Playwright](https://playwright.dev/) to test navigation flows and interactive overlays.
- [ ] **Accessibility (a11y) Audit**:
    - [ ] Use `axe-core` to ensure the app is usable by children with various accessibility needs.
    - [ ] Verify ARIA labels for non-text interactive elements (emojis, icons).

## 🚀 Phase 3: CI/CD & Production
**Goal**: Automate deployment and monitor health.

- [ ] **GitHub Actions Workflow**:
    - [ ] Create `.github/workflows/main.yml`.
    - [ ] **Jobs**: Linting -> Testing (Vitest + Playwright) -> Docker Build -> Push to Registry.
- [ ] **Multi-Environment Strategy**:
    - [ ] **Staging**: Auto-deploy on `develop` branch to a temporary URL.
    - [ ] **Production**: Manual approval or tagged release to `sillyschool.com`.
- [ ] **Monitoring & Analytics**:
    - [ ] Enable Supabase Edge Functions for basic usage analytics.
    - [ ] Set up error reporting (e.g., Sentry) to catch client-side bugs.

## 📌 Implementation Timeline (Estimated)
| Week | Focus | Major Milestone |
| :--- | :--- | :--- |
| **Week 1** | Data Persistence | Real Stars saved to Supabase |
| **Week 2** | Polish & Gamification | Badge system & Animations |
| **Week 3** | Automated Testing | CI Pipeline with 80% coverage |
| **Week 4** | Production Launch | Live on custom domain with SSL |
