
import { addStar } from '../services/supabase.js';
import { speak } from '../utils/speech.js';

let currentOp = 'add';
let currentQuestion = {};

export function initMath() {
    initNumbers();

    const opBtns = document.querySelectorAll('.op-btn');
    const answersGrid = document.getElementById('answers-grid');

    opBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Highlight active button
            opBtns.forEach(b => b.style.background = 'white');
            opBtns.forEach(b => b.style.color = 'black');
            // Reset styles (simple toggle)

            btn.style.background = 'var(--secondary-color)';
            btn.style.color = 'white';

            currentOp = btn.getAttribute('data-op');
            startQuiz();
        });
    });
}

function initNumbers() {
    const grid = document.getElementById('numbers-grid');
    if (!grid) return; // safety check

    grid.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const card = document.createElement('div');
        card.className = 'number-card';
        card.innerText = i;
        card.onclick = () => speakNumber(i);
        grid.appendChild(card);
    }
}


function speakNumber(num) {
    speak(num.toString(), null, { isKid: true, pitch: 1.6, rate: 1.0 });
}

function startQuiz() {
    document.getElementById('math-quiz').classList.remove('hidden');
    generateQuestion();
}

function generateQuestion() {
    let a, b, answer, symbol;

    switch (currentOp) {
        case 'add':
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            answer = a + b;
            symbol = '+';
            break;
        case 'sub':
            a = Math.floor(Math.random() * 10) + 5; // Ensure positive result
            b = Math.floor(Math.random() * a);
            answer = a - b;
            symbol = '-';
            break;
        case 'mul':
            a = Math.floor(Math.random() * 5) + 1; // Keep numbers small
            b = Math.floor(Math.random() * 5) + 1;
            answer = a * b;
            symbol = '×';
            break;
        case 'div':
            b = Math.floor(Math.random() * 5) + 1;
            answer = Math.floor(Math.random() * 5) + 1;
            a = b * answer; // Ensure clean division
            symbol = '÷';
            break;
    }

    currentQuestion = { a, b, answer, symbol };

    document.getElementById('question-text').innerText = `${a} ${symbol} ${b} = ?`;
    document.getElementById('feedback-msg').innerText = '';

    generateAnswers(answer);
}

function generateAnswers(correctAnswer) {
    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';

    // Generate 3 wrong answers
    let answers = new Set();
    answers.add(correctAnswer);

    while (answers.size < 4) {
        let wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrong >= 0 && wrong !== correctAnswer) {
            answers.add(wrong);
        }
    }

    const shuffledArr = Array.from(answers).sort(() => Math.random() - 0.5);

    shuffledArr.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerText = ans;
        btn.onclick = () => checkAnswer(ans, correctAnswer, btn);
        grid.appendChild(btn);
    });
}

function checkAnswer(selected, correct, btnElement) {
    if (selected === correct) {
        btnElement.classList.add('correct');
        document.getElementById('feedback-msg').innerText = 'Yay! Correct! 🎉';
        addStar(); // Confetti or celebration here
        setTimeout(generateQuestion, 1500);
    } else {
        btnElement.classList.add('wrong');
        document.getElementById('feedback-msg').innerText = 'Try again! 🙃';
    }
}
