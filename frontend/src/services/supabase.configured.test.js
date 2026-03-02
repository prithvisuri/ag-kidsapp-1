import { beforeEach, describe, expect, it, vi } from 'vitest';

function setupDom(stars = '0') {
  document.body.innerHTML = `
    <div id="user-progress" class="hidden">⭐ <span id="stars-count">${stars}</span></div>
    <div id="level-up-overlay" class="overlay hidden"></div>
    <span id="milestone-stars"></span>
    <span id="badge-display"></span>
    <button id="close-level-up"></button>
  `;
  document.getElementById('stars-count').innerText = stars;
}

function makeClient({ session, getSessionError = null, profileData = null, profileError = null, upsertError = null }) {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session }, error: getSessionError }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: profileData, error: profileError }),
        })),
      })),
      upsert: vi.fn().mockResolvedValue({ error: upsertError }),
    })),
  };
}

describe('supabase service configured behavior', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    setupDom();
  });

  it('loads and displays user stars from profile when session exists', async () => {
    const fakeClient = makeClient({
      session: { user: { id: 'u1', email: 'kid@example.com' } },
      profileData: { stars: 7 },
    });

    vi.stubEnv('VITE_SUPABASE_URL', 'https://kids.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'real-anon-key');
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: vi.fn(() => fakeClient),
    }));

    const { initSupabase } = await import('./supabase.js');
    await initSupabase();

    expect(document.getElementById('stars-count').innerText).toBe(7);
    expect(document.getElementById('user-progress').classList.contains('hidden')).toBe(false);
  });

  it('adds star and persists to profile when session exists', async () => {
    setupDom('9');
    const fakeClient = makeClient({
      session: { user: { id: 'u1', email: 'kid@example.com' } },
      profileData: { stars: 9 },
      upsertError: null,
    });

    vi.stubEnv('VITE_SUPABASE_URL', 'https://kids.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'real-anon-key');
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: vi.fn(() => fakeClient),
    }));

    const { addStar } = await import('./supabase.js');
    await addStar();

    expect(Number(document.getElementById('stars-count').innerText)).toBe(10);
    expect(document.getElementById('level-up-overlay').classList.contains('hidden')).toBe(false);

    const fromCall = fakeClient.from.mock.results[0].value;
    expect(fromCall.upsert).toHaveBeenCalled();

    document.getElementById('close-level-up').click();
    expect(document.getElementById('level-up-overlay').classList.contains('hidden')).toBe(true);
  });

  it('handles session errors from auth call', async () => {
    const fakeClient = makeClient({
      session: null,
      getSessionError: new Error('auth failed'),
    });

    vi.stubEnv('VITE_SUPABASE_URL', 'https://kids.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'real-anon-key');
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: vi.fn(() => fakeClient),
    }));

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { initSupabase } = await import('./supabase.js');

    await expect(initSupabase()).resolves.toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('handles profile fetch errors without crashing', async () => {
    const fakeClient = makeClient({
      session: { user: { id: 'u1', email: 'kid@example.com' } },
      profileError: new Error('profile failed'),
    });

    vi.stubEnv('VITE_SUPABASE_URL', 'https://kids.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'real-anon-key');
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: vi.fn(() => fakeClient),
    }));

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { initSupabase } = await import('./supabase.js');
    await initSupabase();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('handles upsert failures when persisting stars', async () => {
    setupDom('4');
    const fakeClient = makeClient({
      session: { user: { id: 'u1', email: 'kid@example.com' } },
      upsertError: new Error('save failed'),
    });

    vi.stubEnv('VITE_SUPABASE_URL', 'https://kids.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'real-anon-key');
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: vi.fn(() => fakeClient),
    }));

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { addStar } = await import('./supabase.js');
    await addStar();
    expect(errorSpy).toHaveBeenCalled();
    expect(document.getElementById('level-up-overlay').classList.contains('hidden')).toBe(true);
  });

  it('adds local stars when configured client has no active session', async () => {
    setupDom('24');
    const fakeClient = makeClient({ session: null });

    vi.stubEnv('VITE_SUPABASE_URL', 'https://kids.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'real-anon-key');
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: vi.fn(() => fakeClient),
    }));

    const { addStar } = await import('./supabase.js');
    await addStar();

    expect(Number(document.getElementById('stars-count').innerText)).toBe(25);
    expect(document.getElementById('level-up-overlay').classList.contains('hidden')).toBe(false);
  });
});
