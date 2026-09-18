
// Helper that chooses a clean, neat female teacher voice in English, strictly excluding male and non-English voices
export function chooseVoice(voices = []) {
    if (!voices || voices.length === 0) return undefined;
    
    const lower = (s) => (s || '').toLowerCase();
    
    const isExplicitlyMale = (name) => {
        const n = lower(name);
        // If explicitly labelled female, woman, or girl, it is not male
        if (n.includes('female') || n.includes('woman') || n.includes('girl')) {
            return false;
        }
        
        // Obvious male names and keywords across Chrome, macOS, Windows, Android
        const maleKeywords = [
            'male', ' man', '(man)', 'boy', 'guy',
            'alex', 'fred', 'daniel', 'david', 'mark', 'george', 'oliver',
            'james', 'tom', 'bruce', 'lee', 'aaron', 'albert', 'ralph',
            'junior', 'zarvox', 'whisper', 'trinoids', 'deranged', 'bad news', 'good news',
            'bells', 'cellos', 'pipe organ'
        ];
        
        if (maleKeywords.some(keyword => n.includes(keyword))) {
            return true;
        }

        // In Google Chrome, "Google US English" without "Female" is a male voice
        if (n === 'google us english' || n.startsWith('google us english (')) {
            return true;
        }

        return false;
    };

    const isNonEnglish = (v) => {
        const lang = lower(v.lang);
        // If language code is present, it must be English (en, en-US, en-GB, en-AU, etc.)
        if (lang) {
            return !lang.startsWith('en');
        }
        // If language code is omitted, check common non-English keywords in name
        const n = lower(v.name);
        const nonEnglishKeywords = [
            'spanish', 'español', 'french', 'français', 'german', 'deutsch',
            'italian', 'italiano', 'hindi', 'japanese', 'chinese', 'korean',
            'russian', 'portuguese', 'arabic', 'dutch', 'polish', 'turkish',
            'swedish', 'danish', 'norwegian', 'greek', 'thai', 'vietnamese'
        ];
        return nonEnglishKeywords.some(keyword => n.includes(keyword));
    };

    // Step 1: Filter out non-English voices
    let englishVoices = voices.filter(v => !isNonEnglish(v));
    if (englishVoices.length === 0) {
        englishVoices = voices; // Fallback if device has no explicitly labeled English voice
    }

    // Step 2: Filter candidate voices: strictly prefer non-male English voices
    let candidates = englishVoices.filter(v => !isExplicitlyMale(v.name));
    
    // Fallback to English list if all available voices are male
    if (candidates.length === 0) {
        candidates = englishVoices;
    }
    
    // Specific high-quality clean female teacher voice names in English, in priority order
    const priorityFemaleVoices = [
        'google us english female',
        'google uk english female',
        'jenny',      // Microsoft Jenny (Natural clean teacher)
        'aria',       // Microsoft Aria (Natural clean teacher)
        'samantha',   // Apple Samantha (Calm, articulate macOS/iOS teacher)
        'victoria',   // Apple Victoria (Clear UK teacher)
        'karen',      // Apple Karen (Clear AU teacher)
        'serena',     // Apple Serena
        'zira',       // Microsoft Zira
        'ava',
        'allison',
        'susan',
        'fiona',
        'moira',
        'tessa',
        'veena',
        'female',
        'woman',
        'girl'
    ];
    
    // 1. Look for preferred English female teacher voices
    for (const term of priorityFemaleVoices) {
        const found = candidates.find(v => lower(v.name).includes(term));
        if (found) return found;
    }
    
    // 2. Look for any English voice that is not male
    const englishNonMale = candidates.find(v => {
        const lang = lower(v.lang);
        return (lang.startsWith('en') || !lang) && !isExplicitlyMale(v.name);
    });
    if (englishNonMale) return englishNonMale;
    
    // 3. Fallback to first non-male candidate or first available English voice
    return candidates[0] || englishVoices[0];
}

export function speak(text, onEndCallback, options = {}) {
    const { isKid = false, pitch, rate, volume = 1 } = options;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        // nothing we can do in non-browser environments
        return;
    }

    const doSpeak = () => {
        // Cancel any pending speech immediately so repeated clicks repeat without delay
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = chooseVoice(voices);
        
        // Enforce English language speech
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            const voiceLang = (selectedVoice.lang || '').toLowerCase();
            utterance.lang = voiceLang.startsWith('en') ? selectedVoice.lang : 'en-US';
        } else {
            utterance.lang = 'en-US';
        }

        if (isKid) {
            utterance.pitch = pitch !== undefined ? pitch : 1.3; // Higher pitch
            utterance.rate = rate !== undefined ? rate : 0.9;   // Slightly slower
        } else {
            // Clean, neat, instructional female teacher cadence:
            // Pitch: 1.05 - 1.1 (warm, friendly, natural female tone)
            // Rate: 0.85 (clear, articulate teaching pace for kids)
            utterance.pitch = pitch !== undefined ? pitch : 1.05;
            utterance.rate = rate !== undefined ? rate : 0.85;
        }
        utterance.volume = volume;

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
