
import { addStar } from '../services/supabase.js';
import { speak } from '../utils/speech.js';
import { generateQuestionData, generateAnswers as makeAnswers, isCorrect } from './mathLogic.js';

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
        card.onclick = (e) => {
            e.currentTarget.classList.add('bouncing');
            setTimeout(() => e.currentTarget.classList.remove('bouncing'), 500);
            speakNumber(i);
        };
        grid.appendChild(card);
    }
}


function speakNumber(num) {
    // Use lower pitch (1.2) and slower rate (0.8) for clear, distinct pronunciation
    speak(num.toString(), null, { isKid: false, pitch: 1.2, rate: 0.8 });
}

function startQuiz() {
    document.getElementById('math-quiz').classList.remove('hidden');
    generateQuestion();
}

function generateQuestion() {
    const { a, b, answer, symbol } = generateQuestionData(currentOp);
    currentQuestion = { a, b, answer, symbol };

    document.getElementById('question-text').innerText = `${a} ${symbol} ${b} = ?`;
    document.getElementById('feedback-msg').innerText = '';

    generateAnswers(answer);
}

function generateAnswers(correctAnswer) {
    const grid = document.getElementById('answers-grid');
    grid.innerHTML = '';

    const shuffledArr = makeAnswers(correctAnswer);

    shuffledArr.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerText = ans;
        btn.onclick = (e) => {
            e.currentTarget.classList.add('bouncing');
            setTimeout(() => e.currentTarget.classList.remove('bouncing'), 500);
            checkAnswer(ans, correctAnswer, btn);
        };
        grid.appendChild(btn);
    });
}

function triggerConfetti() {
    const app = document.getElementById('app');
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        confetti.style.opacity = '1';
        confetti.style.top = '-10px';
        app.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0)', opacity: 1 },
            { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 2000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

function checkAnswer(selected, correct, btnElement) {
    if (selected === correct) {
        btnElement.classList.add('correct');
        document.getElementById('feedback-msg').innerText = 'Yay! Correct! 🎉';
        triggerConfetti();
        addStar();
        setTimeout(generateQuestion, 1500);
    } else {
        btnElement.classList.add('wrong');
        document.getElementById('feedback-msg').innerText = 'Try again! 🙃';
    }
}
