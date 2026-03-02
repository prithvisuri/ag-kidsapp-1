import { describe, it, expect, vi } from 'vitest';
import { generateQuestionData, generateAnswers, isCorrect } from './mathLogic.js';

// helper deterministic random generator
function* seq(values) {
    for (const v of values) {
        yield v;
    }
}

function makeRandom(gen) {
    return () => {
        const next = gen.next();
        if (next.done) return 0;
        return next.value;
    };
}

describe('mathLogic', () => {
    describe('generateQuestionData', () => {
        it('produces addition questions with random numbers', () => {
            const randoms = seq([0.1, 0.2]); // will generate a=2, b=3
            const data = generateQuestionData('add', makeRandom(randoms));
            expect(data).toEqual({ a: 2, b: 3, answer: 5, symbol: '+' });
        });

        it('produces subtraction questions with non-negative result', () => {
            // r() * 10 +5 -> a
            // second r() * a for b
            const randoms = seq([0.9, 0.1]); // a = 14, b = 1
            const data = generateQuestionData('sub', makeRandom(randoms));
            expect(data.answer).toBeGreaterThanOrEqual(0);
            expect(data.symbol).toBe('-');
            expect(data.answer).toEqual(13);
        });

        it('produces multiplication questions', () => {
            const randoms = seq([0.0, 0.5]); // a=1, b=3
            const data = generateQuestionData('mul', makeRandom(randoms));
            expect(data).toEqual({ a: 1, b: 3, answer: 3, symbol: '×' });
        });

        it('produces clean division questions (a multiple of b)', () => {
            const randoms = seq([0.0, 0.5]); // b = 1, answer = 3 => a=3
            const data = generateQuestionData('div', makeRandom(randoms));
            expect(data.a % data.b).toBe(0);
            expect(data.symbol).toBe('÷');
            expect(data.answer).toBe(3);
        });

        it('throws on unknown op', () => {
            expect(() => generateQuestionData('foo')).toThrow(/Unknown operation/);
        });
    });

    describe('generateAnswers', () => {
        it('always includes correct answer and returns 4 items', () => {
            // use a sequence to avoid repeating the same wrong answer forever
            const randoms = seq([0.1, 0.2, 0.3, 0.4, 0.5]);
            const answers = generateAnswers(10, makeRandom(randoms));
            expect(answers).toContain(10);
            expect(answers.length).toBe(4);
        });

        it('does not include negative numbers', () => {
            const randoms = seq([0.0, 0.0, 0.0, 0.0]);
            const answers = generateAnswers(1, makeRandom(randoms));
            expect(answers.every(a => a >= 0)).toBe(true);
        });

        it('shuffles answers using the provided random function', () => {
            // if random returns constant 0.5, sort will not change much
            const answers = generateAnswers(5, () => 0.5);
            expect(answers.length).toBe(4);
        });
    });

    describe('isCorrect', () => {
        it('returns true when selected equals correct', () => {
            expect(isCorrect(3, 3)).toBe(true);
            expect(isCorrect('a', 'a')).toBe(true);
        });

        it('returns false when not equal', () => {
            expect(isCorrect(1, 2)).toBe(false);
            expect(isCorrect('1', 1)).toBe(false);
        });
    });
});
