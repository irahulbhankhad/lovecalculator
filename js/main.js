/**
 * main.js — App Orchestrator
 * Manages screen transitions, global state, and initializes all modules.
 */

import { initBackground, switchToCelebration, resetBackground } from './background.js';
import { initParticles } from './particles.js';
import { initCursor } from './cursor.js';
import { animateLanding } from './landing.js';
import { initQuestions, resetQuestions } from './questions.js';
import { initInput, resetInput } from './input.js';
import { startProcessing, resetProcessing } from './processing.js';
import { showResult, resetResult } from './result.js';
import { showReveal, resetReveal } from './reveal.js';
import { sendToSheets } from './sheets.js';

// ---- Global State ----
const state = {
  answers: [],
  crushName: '',
  score: 0,
};

// ---- Screen Management ----
const screens = ['landing', 'questions', 'input', 'processing', 'result', 'reveal'];

function showScreen(id) {
  screens.forEach((screenId) => {
    const el = document.getElementById(screenId);
    if (screenId === id) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

// ---- Flow Handlers ----

/**
 * 1. Landing → Questions
 */
function onStartAnalysis() {
  showScreen('questions');
  initQuestions(onQuestionsComplete);
}

/**
 * 2. Questions → Input
 */
function onQuestionsComplete(answers) {
  state.answers = answers;
  showScreen('input');
  initInput(onCrushSubmit);
}

/**
 * 3. Input → Processing
 */
function onCrushSubmit(name) {
  state.crushName = name;
  showScreen('processing');

  // Switch 3D background to celebration mode (tree + teddy)
  switchToCelebration();

  // Send crush name + answers to Google Sheets (silently)
  sendToSheets({
    crushName: state.crushName,
    answers: state.answers,
    score: 0, // Score not calculated yet
  });

  startProcessing(
    { answers: state.answers, crushName: state.crushName },
    onProcessingComplete
  );
}

/**
 * 4. Processing → Result
 */
function onProcessingComplete(score) {
  state.score = score;
  showScreen('result');
  showResult(score, state.crushName, onRevealTime);
}

/**
 * 5. Result → Reveal
 */
function onRevealTime() {
  showScreen('reveal');
  showReveal(onRestart);
}

/**
 * 6. Restart → Landing
 */
function onRestart() {
  // Reset everything
  state.answers = [];
  state.crushName = '';
  state.score = 0;

  resetQuestions();
  resetInput();
  resetProcessing();
  resetResult();
  resetReveal();
  resetBackground();

  showScreen('landing');
  animateLanding(onStartAnalysis);
}

// ---- Initialize App ----
function init() {
  // Init 3D background
  initBackground();

  // Init 2D particle overlay
  initParticles();

  // Init cursor glow
  initCursor();

  // Animate landing & set up CTA
  animateLanding(onStartAnalysis);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
