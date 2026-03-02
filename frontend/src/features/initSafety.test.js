import { describe, expect, it } from 'vitest';
import { initAlphabet } from './alphabet.js';
import { initMath } from './math.js';
import { initRhymes } from './rhymes.js';

describe('feature initializers are DOM-safe', () => {
  it('does not throw when alphabet DOM is missing', () => {
    document.body.innerHTML = '<div id="app"></div>';
    expect(() => initAlphabet()).not.toThrow();
  });

  it('does not throw when rhymes DOM is missing', () => {
    document.body.innerHTML = '<div id="app"></div>';
    expect(() => initRhymes()).not.toThrow();
  });

  it('does not throw when math DOM is partially missing', () => {
    document.body.innerHTML = '<div id="numbers-grid"></div><button class="op-btn" data-op="add">Add</button>';
    expect(() => initMath()).not.toThrow();
  });
});
