
const alphabet = [
    { letter: 'A', word: 'Apple', emoji: '🍎' },
    { letter: 'B', word: 'Ball', emoji: '⚽' },
    { letter: 'C', word: 'Cat', emoji: '🐱' },
    { letter: 'D', word: 'Dog', emoji: '🐶' },
    { letter: 'E', word: 'Elephant', emoji: '🐘' },
    { letter: 'F', word: 'Fish', emoji: '🐟' },
    { letter: 'G', word: 'Grape', emoji: '🍇' },
    { letter: 'H', word: 'House', emoji: '🏠' },
    { letter: 'I', word: 'Ice Cream', emoji: '🍦' },
    { letter: 'J', word: 'Jelly', emoji: '🍮' },
    { letter: 'K', word: 'Kite', emoji: 'Vk' },
    { letter: 'L', word: 'Lion', emoji: '🦁' },
    { letter: 'M', word: 'Monkey', emoji: '🐵' },
    { letter: 'N', word: 'Nest', emoji: '🪺' },
    { letter: 'O', word: 'Orange', emoji: '🍊' },
    { letter: 'P', word: 'Parrot', emoji: '🦜' },
    { letter: 'Q', word: 'Queen', emoji: '👑' },
    { letter: 'R', word: 'Rainbow', emoji: '🌈' },
    { letter: 'S', word: 'Sun', emoji: '☀️' },
    { letter: 'T', word: 'Tiger', emoji: '🐯' },
    { letter: 'U', word: 'Umbrella', emoji: '☔' },
    { letter: 'V', word: 'Violin', emoji: '🎻' },
    { letter: 'W', word: 'Watch', emoji: '⌚' },
    { letter: 'X', word: 'Xylophone', emoji: '🎼' },
    { letter: 'Y', word: 'Yak', emoji: '🐂' },
    { letter: 'Z', word: 'Zebra', emoji: '🦓' }
];

export function initAlphabet() {
    const grid = document.getElementById('alphabet-grid');
    const overlay = document.getElementById('alphabet-overlay');
    const closeBtn = document.getElementById('close-overlay');

    // Clear grid
    grid.innerHTML = '';

    alphabet.forEach(item => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.innerText = item.letter;
        card.onclick = () => showLetter(item);
        grid.appendChild(card);
    });

    closeBtn.onclick = () => {
        overlay.classList.add('hidden');
    };
}


function showLetter(item) {
    const overlay = document.getElementById('alphabet-overlay');
    document.getElementById('overlay-letter').innerText = item.letter;
    document.getElementById('overlay-word').innerText = `${item.letter} for ${item.word} ${item.emoji}`;

    overlay.classList.remove('hidden');

    playAudio(item);
}

function playAudio(item) {
    // 1. Play Letter Sound (MP3 or TTS)
    // 2. Then Play "A for Apple" (TTS)

    const phrase = `${item.letter} for ${item.word}`;

    const playPhrase = () => {
        speak(phrase);
    };

    // Try to play MP3 first
    const audio = new Audio(`/assets/sounds/${item.letter.toUpperCase()}.mp3`);

    audio.onended = playPhrase;

    audio.play().catch(e => {
        console.warn('Audio file not found, falling back to TTS', e);
        // Fallback: Speak letter, then speak phrase
        speak(item.letter, playPhrase);
    });
}


function speak(text, onEndCallback, isKid = false) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Voice Selection Logic
        const voices = window.speechSynthesis.getVoices();

        // Try to find a clear female voice or kid-sounding voice
        // "Google US English" is usually good. "Microsoft Zira" is also clear female.
        let selectedVoice = voices.find(v => v.name.includes('Google US English'));
        if (!selectedVoice) selectedVoice = voices.find(v => v.name.includes('Zira')); // Windows
        if (!selectedVoice) selectedVoice = voices.find(v => v.name.includes('Female'));

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        if (isKid) {
            utterance.pitch = 1.3; // Higher pitch
            utterance.rate = 0.9;  // Slightly slower
        } else {
            utterance.pitch = 1.1; // Friendly female pitch
            utterance.rate = 0.85; // Clear enunciation
        }

        if (onEndCallback) {
            utterance.onend = onEndCallback;
        }

        window.speechSynthesis.speak(utterance);
    }
}
