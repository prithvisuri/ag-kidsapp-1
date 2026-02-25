
export function speak(text, onEndCallback, options = {}) {
    const { isKid = false, pitch, rate } = options;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Voice Selection Logic
        const voices = window.speechSynthesis.getVoices();

        // Try to find a clear female voice or kid-sounding voice
        let selectedVoice = voices.find(v => v.name.includes('Google US English'));
        if (!selectedVoice) selectedVoice = voices.find(v => v.name.includes('Zira')); // Windows
        if (!selectedVoice) selectedVoice = voices.find(v => v.name.includes('Female'));

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
    }
}
