import './styles/style.css'
import { initAlphabet } from './features/alphabet.js'
import { initMath } from './features/math.js'
import { initRhymes } from './features/rhymes.js'
import { initSupabase } from './services/supabase.js'

document.addEventListener('DOMContentLoaded', () => {
  console.log('Silly School Initialized! 🎈');

  // Initialize Modules
  initAlphabet();
  initMath();
  initRhymes();
  initSupabase();

  // Navigation Logic
  setupNavigation();
});

function setupNavigation() {
  const landingPage = document.getElementById('landing-page');
  const pages = document.querySelectorAll('.page');
  const backBtns = document.querySelectorAll('.back-btn');

  // Navigate to section
  document.querySelectorAll('[data-target]').forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-target') + '-page';
      navigateTo(targetId);
    });
  });

  // Navigate back
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo('landing-page');
    });
  });

  function navigateTo(pageId) {
    pages.forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    // Reset specific page states if needed
    if (pageId === 'landing-page') {
      // maybe stop videos or audio
    }
  }
}
