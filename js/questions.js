/**
 * questions.js — Multi-step Question Flow
 * 5 slider-based questions with smooth transitions and progress bar.
 * Uses AbortController to prevent duplicate listeners on restart.
 */
import gsap from 'gsap';

const LABELS = [
  ['Rarely', 'Sometimes', 'Often', 'Daily', '24/7'],
  ['Never', 'Monthly', 'Weekly', 'Often', 'Daily'],
  ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
  ['Avoids', 'Shy', 'Normal', 'Intense', '🔥'],
  ['Always Me', 'Mostly Me', 'Equal', 'Mostly Them', 'Always Them'],
];

let currentStep = 0;
let answers = [3, 3, 3, 3, 3];
let onComplete = null;
let abortController = null;

/**
 * Initialize the question flow
 * @param {Function} callback — called when all questions answered, receives answers array
 */
export function initQuestions(callback) {
  // Abort previous listeners to prevent duplicates
  if (abortController) abortController.abort();
  abortController = new AbortController();
  const signal = abortController.signal;

  onComplete = callback;
  currentStep = 0;
  answers = [3, 3, 3, 3, 3];

  // Attach slider listeners
  for (let i = 0; i < 5; i++) {
    const slider = document.getElementById(`q-slider-${i}`);
    const valueDisplay = document.getElementById(`q-value-${i}`);

    slider.addEventListener('input', () => {
      const val = parseInt(slider.value);
      answers[i] = val;
      valueDisplay.textContent = LABELS[i][val - 1];

      gsap.fromTo(
        valueDisplay,
        { scale: 1.15, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }, { signal });
  }

  // Nav buttons
  document.getElementById('q-next').addEventListener('click', nextStep, { signal });
  document.getElementById('q-prev').addEventListener('click', prevStep, { signal });

  // Entrance animation
  animateCardEntrance();
}

function animateCardEntrance() {
  const card = document.querySelector(`.question-card[data-step="${currentStep}"]`);
  gsap.fromTo(
    card,
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
  );
}

function nextStep() {
  if (currentStep >= 4) {
    if (onComplete) onComplete(answers);
    return;
  }

  const currentCard = document.querySelector(`.question-card[data-step="${currentStep}"]`);

  gsap.to(currentCard, {
    opacity: 0,
    x: -60,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: () => {
      currentCard.classList.remove('active');
      currentCard.classList.add('exit-left');

      currentStep++;
      updateUI();

      const nextCard = document.querySelector(`.question-card[data-step="${currentStep}"]`);
      nextCard.classList.remove('exit-left');
      nextCard.classList.add('active');

      gsap.fromTo(
        nextCard,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }
      );
    },
  });
}

function prevStep() {
  if (currentStep <= 0) return;

  const currentCard = document.querySelector(`.question-card[data-step="${currentStep}"]`);

  gsap.to(currentCard, {
    opacity: 0,
    x: 60,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: () => {
      currentCard.classList.remove('active');

      currentStep--;
      updateUI();

      const prevCard = document.querySelector(`.question-card[data-step="${currentStep}"]`);
      prevCard.classList.remove('exit-left');
      prevCard.classList.add('active');

      gsap.fromTo(
        prevCard,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }
      );
    },
  });
}

function updateUI() {
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  const percent = ((currentStep + 1) / 5) * 100;

  gsap.to(fill, { width: `${percent}%`, duration: 0.5, ease: 'power2.out' });
  label.textContent = `Step ${currentStep + 1} of 5`;

  const prevBtn = document.getElementById('q-prev');
  prevBtn.disabled = currentStep === 0;

  const nextBtn = document.getElementById('q-next');
  nextBtn.querySelector('.btn-text').textContent =
    currentStep === 4 ? 'Continue' : 'Next';
}

/**
 * Reset question flow to initial state
 */
export function resetQuestions() {
  // Remove all listeners
  if (abortController) {
    abortController.abort();
    abortController = null;
  }

  currentStep = 0;
  answers = [3, 3, 3, 3, 3];

  document.querySelectorAll('.question-card').forEach((card, i) => {
    card.classList.remove('active', 'exit-left');
    card.style.opacity = '';
    card.style.transform = '';
    if (i === 0) card.classList.add('active');
  });

  for (let i = 0; i < 5; i++) {
    document.getElementById(`q-slider-${i}`).value = 3;
    document.getElementById(`q-value-${i}`).textContent = LABELS[i][2];
  }

  document.getElementById('progress-fill').style.width = '20%';
  document.getElementById('progress-label').textContent = 'Step 1 of 5';
  document.getElementById('q-prev').disabled = true;
  document.getElementById('q-next').querySelector('.btn-text').textContent = 'Next';
}

export default { initQuestions, resetQuestions };
