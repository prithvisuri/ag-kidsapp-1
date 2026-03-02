import { describe, expect, it } from 'vitest';
import { initRhymes } from './rhymes.js';

describe('rhymes feature', () => {
  it('renders embedded rhyme videos', () => {
    document.body.innerHTML = '<div id="video-list"></div>';

    initRhymes();

    const cards = document.querySelectorAll('.video-card');
    expect(cards.length).toBe(13);

    const iframe = cards[0].querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toContain('youtube.com/embed/');
  });
});
