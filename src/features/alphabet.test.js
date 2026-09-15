import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initAlphabet } from './alphabet.js';
import { speak } from '../utils/speech.js';

vi.mock('../utils/speech.js', () => ({ speak: vi.fn() }));

class FakeAudio {
  static instances = [];
  static rejectPlay = false;

  constructor(src) {
    this.src = src;
    this.onended = null;
    FakeAudio.instances.push(this);
  }

  play() {
    if (FakeAudio.rejectPlay) {
      return Promise.reject(new Error('missing'));
    }
    return Promise.resolve();
  }
}

describe('alphabet feature', () => {
  beforeEach(() => {
    speak.mockReset();
    FakeAudio.instances = [];
    FakeAudio.rejectPlay = false;
    global.Audio = FakeAudio;

    document.body.innerHTML = `
      <div id="alphabet-grid"></div>
      <div id="alphabet-overlay" class="overlay hidden">
        <span id="overlay-letter"></span>
        <p id="overlay-word"></p>
        <button id="close-overlay">x</button>
      </div>
    `;
  });

  it('renders cards and shows selected letter overlay', () => {
    initAlphabet();
    const cards = document.querySelectorAll('.letter-card');
    expect(cards.length).toBe(26);

    cards[10].click(); // K

    expect(document.getElementById('alphabet-overlay').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('overlay-letter').innerText).toBe('K');
    expect(document.getElementById('overlay-word').innerText).toContain('K for Kite 🪁');
    expect(FakeAudio.instances[0].src).toContain('/assets/sounds/K.mp3');

    FakeAudio.instances[0].onended();
    expect(speak).toHaveBeenCalledWith('K for Kite');
  });

  it('falls back to TTS when audio play fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    FakeAudio.rejectPlay = true;
    initAlphabet();

    const first = document.querySelector('.letter-card');
    first.click();

    await Promise.resolve();

    expect(speak).toHaveBeenCalled();
    const firstCall = speak.mock.calls[0];
    expect(firstCall[0]).toBe('A');
    expect(typeof firstCall[1]).toBe('function');
  });

  it('supports swipe navigation in overlay', () => {
    initAlphabet();
    const first = document.querySelector('.letter-card');
    first.click();

    const overlay = document.getElementById('alphabet-overlay');
    const start = new Event('touchstart');
    Object.defineProperty(start, 'changedTouches', { value: [{ screenX: 200 }] });
    const end = new Event('touchend');
    Object.defineProperty(end, 'changedTouches', { value: [{ screenX: 100 }] });

    overlay.dispatchEvent(start);
    overlay.dispatchEvent(end);

    expect(document.getElementById('overlay-letter').innerText).toBe('B');

    const rightStart = new Event('touchstart');
    Object.defineProperty(rightStart, 'changedTouches', { value: [{ screenX: 100 }] });
    const rightEnd = new Event('touchend');
    Object.defineProperty(rightEnd, 'changedTouches', { value: [{ screenX: 200 }] });

    overlay.dispatchEvent(rightStart);
    overlay.dispatchEvent(rightEnd);

    expect(document.getElementById('overlay-letter').innerText).toBe('A');
  });

  it('closes overlay when close button is clicked', () => {
    initAlphabet();
    document.querySelector('.letter-card').click();
    document.getElementById('close-overlay').click();
    expect(document.getElementById('alphabet-overlay').classList.contains('hidden')).toBe(true);
  });
});
