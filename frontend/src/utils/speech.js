
// helper that chooses the preferred voice from a list, favoring female/kid voices
export function chooseVoice(voices = []) {
    if (!voices || voices.length === 0) return undefined;
    
    const lower = (s) => (s || '').toLowerCase();
    
    // Step 1: Filter out obvious male voices
    let candidates = voices.filter(v => {
        const name = lower(v.name);
        return !name.includes('male') && !name.includes('man') && !name.includes('boy');
    });
    
    // If all voices are male, use original list
    if (candidates.length === 0) candidates = voices;
    
    // Step 2: Look for specific female voice keywords in priority order
    const searchTerms = [
        'google us english female',
        'google us english',
        'zira',
        'victoria',
        'samantha',
        'female',
        'woman',
        'girl',
    ];
    
    for (const term of searchTerms) {
        const found = candidates.find(v => lower(v.name).includes(term));
        if (found) return found;
    }
    
    // Step 3: Fallback to first non-male voice
    return candidates[0] || voices[0];
}

export function speak(text, onEndCallback, options = {}) {
    const { isKid = false, pitch, rate } = options;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        // nothing we can do in non-browser environments
        return;
    }

    const doSpeak = () => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = chooseVoice(voices);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        if (isKid) {
            utterance.pitch = pitch || 1.3; // Higher pitch
            utterance.rate = rate || 0.9;  // Slightly slower
        } else {
            utterance.pitch = pitch || 1.1; // Friendly female pitch
            utterance.rate = rate || 0.85; // Clear enunciation
        }

        if (onEndCallback) {
            utterance.onend = onEndCallback;
        }

        window.speechSynthesis.speak(utterance);
    };

    // voices may not be loaded on first call, so wait for them
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        // add one-time listener
        const handler = () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handler);
            doSpeak();
        };
        window.speechSynthesis.addEventListener('voiceschanged', handler);
    } else {
        doSpeak();
    }
}
