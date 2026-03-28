/**
 * cursor.js — Animated Custom Cursor
 * White dot + outer ring with smooth lerp follow + glow backdrop.
 * Ring follows with a delayed spring for a premium animated feel.
 */

let dotEl, ringEl, glowEl;
let mouseX = -100;
let mouseY = -100;

// Separate positions for dot (fast) and ring (slow lag)
let dotX = -100, dotY = -100;
let ringX = -100, ringY = -100;
let glowX = -100, glowY = -100;

const DOT_SPEED = 0.35;   // Dot tracks fast
const RING_SPEED = 0.15;  // Ring lags behind for visual separation
const GLOW_SPEED = 0.08;  // Glow is slowest for ambient feel

let isVisible = false;
let isHovering = false;

// Interactive selectors (buttons, links, inputs, sliders)
const INTERACTIVE_SELECTORS = 'a, button, input, select, textarea, [role="button"], .magnetic-btn, .q-slider, label';

/**
 * Initialize animated cursor effect
 */
export function initCursor() {
  dotEl = document.getElementById('cursor-dot');
  ringEl = document.getElementById('cursor-ring');
  glowEl = document.getElementById('cursor-glow');

  if (!dotEl || !ringEl || !glowEl) return;

  // Don't init on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    dotEl.style.display = 'none';
    ringEl.style.display = 'none';
    glowEl.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  // Mouse move
  document.addEventListener('mousemove', onMouseMove);

  // Mouse enter / leave viewport
  document.addEventListener('mouseleave', () => {
    dotEl.style.opacity = '0';
    ringEl.style.opacity = '0';
    glowEl.style.opacity = '0';
    isVisible = false;
  });
  document.addEventListener('mouseenter', () => {
    dotEl.style.opacity = '1';
    ringEl.style.opacity = '1';
    glowEl.style.opacity = '1';
    isVisible = true;
  });

  // Mouse down / up for click feedback
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Hover detection via event delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(INTERACTIVE_SELECTORS)) {
      document.body.classList.add('cursor-hover');
      isHovering = true;
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(INTERACTIVE_SELECTORS)) {
      document.body.classList.remove('cursor-hover');
      isHovering = false;
    }
  });

  // Start the animation loop
  updatePosition();
}

function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!isVisible) {
    // Jump to position immediately on first move
    dotX = mouseX;
    dotY = mouseY;
    ringX = mouseX;
    ringY = mouseY;
    glowX = mouseX;
    glowY = mouseY;
    dotEl.style.opacity = '1';
    ringEl.style.opacity = '1';
    glowEl.style.opacity = '1';
    isVisible = true;
  }
}

function updatePosition() {
  requestAnimationFrame(updatePosition);

  // Smooth lerp for each element at different speeds
  dotX += (mouseX - dotX) * DOT_SPEED;
  dotY += (mouseY - dotY) * DOT_SPEED;

  ringX += (mouseX - ringX) * RING_SPEED;
  ringY += (mouseY - ringY) * RING_SPEED;

  glowX += (mouseX - glowX) * GLOW_SPEED;
  glowY += (mouseY - glowY) * GLOW_SPEED;

  // Apply transforms
  dotEl.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
  ringEl.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  glowEl.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
}

export default { initCursor };
