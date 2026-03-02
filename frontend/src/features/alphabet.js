import { speak } from '../utils/speech.js'

const alphabet = [
    // ... (rest of alphabet array)
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

let currentIdx = 0;

export function initAlphabet() {
    const grid = document.getElementById('alphabet-grid');
    const overlay = document.getElementById('alphabet-overlay');
    const closeBtn = document.getElementById('close-overlay');

    // Clear grid
    grid.innerHTML = '';

    alphabet.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.innerText = item.letter;
        card.onclick = (e) => {
            e.currentTarget.classList.add('bouncing');
            setTimeout(() => e.currentTarget.classList.remove('bouncing'), 500);
            showLetter(item, index);
        };
        grid.appendChild(card);
    });

    closeBtn.onclick = () => {
        overlay.classList.add('hidden');
    };

    // Swipe Support for Overlay
    let touchStartX = 0;
    let touchEndX = 0;

    overlay.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    overlay.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            // Swipe Left -> Next Letter
            currentIdx = (currentIdx + 1) % alphabet.length;
            showLetter(alphabet[currentIdx], currentIdx);
        }
        if (touchEndX > touchStartX + threshold) {
            // Swipe Right -> Prev Letter
            currentIdx = (currentIdx - 1 + alphabet.length) % alphabet.length;
            showLetter(alphabet[currentIdx], currentIdx);
        }
    }
}


function showLetter(item, index) {
    currentIdx = index;
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

