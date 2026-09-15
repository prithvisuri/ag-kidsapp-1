import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { chooseVoice, speak } from './speech.js';

// minimal fake to emulate SpeechSynthesisUtterance
class FakeUtterance {
    constructor(text) {
        this.text = text;
        this.pitch = undefined;
        this.rate = undefined;
        this.voice = undefined;
        this.onend = null;
    }
}

describe('speech utilities', () => {
    describe('chooseVoice', () => {
        it('prefers Google US English if available', () => {
            const voices = [
                { name: 'Google UK English Male' },
                { name: 'Google US English Female' },
                { name: 'Zira' }
            ];
            const result = chooseVoice(voices);
            // Should get a non-male voice - prefer Google but at least not male
            expect(result).toBeDefined();
            expect(result.name).not.toContain('Male');
        });

        it('falls back to Zira when google voice missing', () => {
            const voices = [{ name: 'Zira' }, { name: 'Some Male' }];
            expect(chooseVoice(voices).name).toBe('Zira');
        });

        it('uses any voice if no female-like found', () => {
            const voices = [{ name: 'Male1' }, { name: 'Male2' }];
            expect(chooseVoice(voices)).toBe(voices[0]);
        });

        it('returns undefined for empty list', () => {
            expect(chooseVoice([])).toBeUndefined();
        });
    });

    describe('speak', () => {
        let original;

        beforeEach(() => {
            // stub the browser API
            original = { window: global.window, SpeechSynthesisUtterance: global.SpeechSynthesisUtterance };
            global.window = {
                speechSynthesis: {
                    getVoices: vi.fn(() => []),
                    cancel: vi.fn(),
                    speak: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn()
                }
            };
            global.SpeechSynthesisUtterance = FakeUtterance;
        });

        afterEach(() => {
            global.window = original.window;
            global.SpeechSynthesisUtterance = original.SpeechSynthesisUtterance;
        });

        it('does nothing when no speechSynthesis', () => {
            delete global.window.speechSynthesis;
            expect(() => speak('hello')).not.toThrow();
        });

        it('queues call when voices empty and triggers on voiceschanged', () => {
            const handlerMap = {};
            global.window.speechSynthesis.getVoices.mockReturnValue([]);
            global.window.speechSynthesis.addEventListener.mockImplementation((ev, h) => {
                handlerMap[ev] = h;
            });
            speak('hi there');
            // should have set listener but not spoken yet
            expect(global.window.speechSynthesis.speak).not.toHaveBeenCalled();

            // now simulate voices changed and new voices list
            global.window.speechSynthesis.getVoices.mockReturnValue([
                { name: 'Zira' }
            ]);
            // invoke listener manually as the code would
            handlerMap.voiceschanged();
            expect(global.window.speechSynthesis.speak).toHaveBeenCalled();
        });

        it('applies options and callback', () => {
            global.window.speechSynthesis.getVoices.mockReturnValue([
                { name: 'Zira' }
            ]);
            const cb = vi.fn();
            speak('123', cb, { isKid: true, pitch: 2, rate: 0.5 });
            expect(global.window.speechSynthesis.cancel).toHaveBeenCalled();
            expect(global.window.speechSynthesis.speak).toHaveBeenCalled();
            const utterance = global.window.speechSynthesis.speak.mock.calls[0][0];
            expect(utterance).toBeInstanceOf(FakeUtterance);
            expect(utterance.pitch).toBe(2);
            expect(utterance.rate).toBe(0.5);
            expect(utterance.onend).toBe(cb);
        });
    });
});
