import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initMath } from './math.js';
import { addStar } from '../services/supabase.js';
import { speak } from '../utils/speech.js';

vi.mock('../services/supabase.js', () => ({ addStar: vi.fn() }));
vi.mock('../utils/speech.js', () => ({ speak: vi.fn() }));

function parseQuestion(text) {
  const match = text.match(/^(\d+)\s([+\-×÷])\s(\d+)\s=\s\?$/);
  const a = Number(match[1]);
  const op = match[2];
  const b = Number(match[3]);

  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '×') return a * b;
  return a / b;
}

describe('math feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = `
      <div id="app"></div>
      <div id="numbers-grid"></div>
      <button class="op-btn" data-op="add">Add</button>
      <button class="op-btn" data-op="sub">Sub</button>
      <button class="op-btn" data-op="mul">Mul</button>
      <button class="op-btn" data-op="div">Div</button>
      <div id="math-quiz" class="hidden">
        <span id="question-text"></span>
        <div id="answers-grid"></div>
        <div id="feedback-msg"></div>
      </div>
    `;

    Element.prototype.animate = vi.fn(() => ({ onfinish: null }));
  });

  it('renders numbers and speaks on number click', () => {
    initMath();

    const cards = document.querySelectorAll('.number-card');
    expect(cards.length).toBe(20);

    cards[0].click();
    expect(speak).toHaveBeenCalledWith('1', null, { isKid: false, pitch: 1.2, rate: 0.8 });
  });

  it('starts quiz and handles correct answer', () => {
    initMath();
    document.querySelector('[data-op="add"]').click();

    const quiz = document.getElementById('math-quiz');
    expect(quiz.classList.contains('hidden')).toBe(false);

    const correct = parseQuestion(document.getElementById('question-text').innerText);
    const buttons = Array.from(document.querySelectorAll('.answer-btn'));
    const correctBtn = buttons.find((btn) => Number(btn.innerText) === correct);
    correctBtn.click();

    expect(document.getElementById('feedback-msg').innerText).toContain('Correct');
    expect(addStar).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('.confetti').length).toBe(20);
  });

  it('handles wrong answer without adding stars', () => {
    initMath();
    document.querySelector('[data-op="add"]').click();

    const correct = parseQuestion(document.getElementById('question-text').innerText);
    const buttons = Array.from(document.querySelectorAll('.answer-btn'));
    const wrongBtn = buttons.find((btn) => Number(btn.innerText) !== correct);
    wrongBtn.click();

    expect(document.getElementById('feedback-msg').innerText).toContain('Try again');
    expect(addStar).not.toHaveBeenCalled();
  });

  it('does nothing when quiz container is missing', () => {
    document.body.innerHTML = `
      <div id="numbers-grid"></div>
      <button class="op-btn" data-op="add">Add</button>
    `;
    initMath();
    expect(() => document.querySelector('[data-op="add"]').click()).not.toThrow();
  });

  it('handles correct answers when app container is missing', () => {
    document.body.innerHTML = `
      <div id="numbers-grid"></div>
      <button class="op-btn" data-op="add">Add</button>
      <div id="math-quiz" class="hidden">
        <span id="question-text"></span>
        <div id="answers-grid"></div>
        <div id="feedback-msg"></div>
      </div>
    `;
    initMath();
    document.querySelector('[data-op="add"]').click();
    const correct = parseQuestion(document.getElementById('question-text').innerText);
    const correctBtn = Array.from(document.querySelectorAll('.answer-btn')).find((btn) => Number(btn.innerText) === correct);
    correctBtn.click();
    expect(addStar).toHaveBeenCalled();
  });
});
