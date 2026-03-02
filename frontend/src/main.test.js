import { beforeEach, describe, expect, it, vi } from 'vitest';

const initAlphabet = vi.fn();
const initMath = vi.fn();
const initRhymes = vi.fn();
const initSupabase = vi.fn();

vi.mock('./features/alphabet.js', () => ({ initAlphabet }));
vi.mock('./features/math.js', () => ({ initMath }));
vi.mock('./features/rhymes.js', () => ({ initRhymes }));
vi.mock('./services/supabase.js', () => ({ initSupabase }));

function setupDom() {
  document.body.innerHTML = `
    <div id="app">
      <main id="main-content">
        <div id="landing-page" class="page active">
          <div class="card" data-target="alphabet"></div>
          <div class="card" data-target="math"></div>
          <div class="card" data-target="rhymes"></div>
          <div class="card" data-target="missing"></div>
        </div>
        <div id="alphabet-page" class="page hidden"><button class="back-btn">Back</button></div>
        <div id="math-page" class="page hidden"><button class="back-btn">Back</button></div>
        <div id="rhymes-page" class="page hidden"><button class="back-btn">Back</button></div>
      </main>
    </div>
  `;
}

describe('main navigation', () => {
  beforeEach(async () => {
    vi.resetModules();
    initAlphabet.mockReset();
    initMath.mockReset();
    initRhymes.mockReset();
    initSupabase.mockReset();
    setupDom();
    await import('./main.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('initializes feature modules on DOMContentLoaded', () => {
    expect(initAlphabet).toHaveBeenCalledTimes(1);
    expect(initMath).toHaveBeenCalledTimes(1);
    expect(initRhymes).toHaveBeenCalledTimes(1);
    expect(initSupabase).toHaveBeenCalledTimes(1);
  });

  it('navigates to rhymes page and back to landing', () => {
    const rhymesCard = document.querySelector('[data-target="rhymes"]');
    rhymesCard.click();

    expect(document.getElementById('rhymes-page').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('math-page').classList.contains('hidden')).toBe(true);

    const backBtns = document.querySelectorAll('.back-btn');
    backBtns[0].click();
    expect(document.getElementById('landing-page').classList.contains('hidden')).toBe(false);
  });

  it('handles unknown target without throwing', () => {
    const missingCard = document.querySelector('[data-target="missing"]');
    expect(() => missingCard.click()).not.toThrow();
  });
});
