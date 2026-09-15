import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addStar, initSupabase, supabase } from './supabase.js';

describe('supabase service fallback behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = `
      <div id="user-progress" class="hidden">⭐ <span id="stars-count">0</span></div>
      <div id="level-up-overlay" class="overlay hidden"></div>
      <span id="milestone-stars"></span>
      <span id="badge-display"></span>
      <button id="close-level-up"></button>
    `;
  });

  it('exports null supabase client when env config is missing', () => {
    expect(supabase).toBeNull();
  });

  it('returns null from initSupabase when supabase is disabled', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(initSupabase()).resolves.toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('increments stars safely when existing value is invalid', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const starsEl = document.getElementById('stars-count');
    starsEl.innerText = 'abc';

    await addStar();

    expect(Number(starsEl.innerText)).toBe(1);
    expect(document.getElementById('user-progress').classList.contains('hidden')).toBe(false);
  });

  it('opens level-up overlay on milestone in fallback mode', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const starsEl = document.getElementById('stars-count');
    starsEl.innerText = '9';

    await addStar();

    expect(Number(starsEl.innerText)).toBe(10);
    expect(document.getElementById('level-up-overlay').classList.contains('hidden')).toBe(false);
    expect(Number(document.getElementById('milestone-stars').innerText)).toBe(10);
  });
});
