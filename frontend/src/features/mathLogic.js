// Pure logic helpers extracted from math.js for testability

export function generateQuestionData(op, random = Math.random) {
    // "random" should be a function returning a number in [0,1)
    const r = () => random();
    let a, b, answer, symbol;

    switch (op) {
        case 'add':
            a = Math.floor(r() * 10) + 1;
            b = Math.floor(r() * 10) + 1;
            answer = a + b;
            symbol = '+';
            break;
        case 'sub':
            a = Math.floor(r() * 10) + 5; // Ensure positive result
            b = Math.floor(r() * a);
            answer = a - b;
            symbol = '-';
            break;
        case 'mul':
            a = Math.floor(r() * 5) + 1; // Keep numbers small
            b = Math.floor(r() * 5) + 1;
            answer = a * b;
            symbol = '×';
            break;
        case 'div':
            b = Math.floor(r() * 5) + 1;
            answer = Math.floor(r() * 5) + 1;
            a = b * answer; // Ensure clean division
            symbol = '÷';
            break;
        default:
            throw new Error(`Unknown operation: ${op}`);
    }

    return { a, b, answer, symbol };
}

export function generateAnswers(correctAnswer, random = Math.random) {
    const r = () => random();
    const answers = new Set([correctAnswer]);

    let attempts = 0;
    // try to generate wrong answers, but give up after a while
    while (answers.size < 4 && attempts < 100) {
        attempts++;
        // generate wrong answer offset from -5 to +4
        let wrong = correctAnswer + Math.floor(r() * 10) - 5;
        if (wrong >= 0 && wrong !== correctAnswer) {
            answers.add(wrong);
        }
    }

    // if we still don't have enough options, fill with sequential numbers
    let filler = correctAnswer + 1;
    while (answers.size < 4) {
        if (!answers.has(filler)) answers.add(filler);
        filler++;
    }

    // shuffle
    return Array.from(answers).sort(() => r() - 0.5);
}

export function isCorrect(selected, correct) {
    return selected === correct;
}
