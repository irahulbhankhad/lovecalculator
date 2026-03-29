/**
 * result.js — Result Screen
 * Animated number counter and heart explosion particle burst.
 */
import gsap from 'gsap';

/**
 * Show the love score result
 * @param {number} score — the love percentage (0–100)
 * @param {string} userName — the user's name
 * @param {string} crushName — the crush's name
 * @param {Function} onReveal — called after a delay to trigger prank reveal
 */
export function showResult(score, userName, crushName, onReveal) {
  const scoreEl = document.getElementById('result-score');
  const nameEl = document.getElementById('result-name');

  scoreEl.textContent = '0';
  nameEl.textContent = `${userName} & ${crushName}`;

  // Animate number counter with GSAP
  const counter = { val: 0 };
  gsap.to(counter, {
    val: score,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      scoreEl.textContent = Math.round(counter.val);
    },
    onComplete: () => {
      // Heart burst after counter completes
      createHeartBurst();

      // Prank reveal after 2.5 seconds
      setTimeout(() => {
        if (onReveal) onReveal();
      }, 2500);
    },
  });

  // Entrance animation
  gsap.fromTo(
    '.result-container',
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
  );
}

/**
 * Heart explosion particle burst — spawns floating hearts from center
 */
function createHeartBurst() {
  const container = document.getElementById('heart-burst');
  container.innerHTML = '';

  const hearts = ['💖', '💗', '💕', '❤️', '💘', '💝', '🩷', '♥️'];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.classList.add('heart-particle');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.fontSize = `${Math.random() * 20 + 12}px`;
    heart.style.left = '50%';
    heart.style.top = '50%';
    container.appendChild(heart);

    // Random direction
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = 100 + Math.random() * 250;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance - 50;

    gsap.fromTo(
      heart,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 0,
        rotation: Math.random() * 360,
      },
      {
        opacity: 0,
        x: targetX,
        y: targetY,
        scale: 1 + Math.random(),
        rotation: Math.random() * 720 - 360,
        duration: 1.5 + Math.random(),
        ease: 'power2.out',
        onComplete: () => heart.remove(),
      }
    );
  }
}

/**
 * Reset result screen
 */
export function resetResult() {
  document.getElementById('result-score').textContent = '0';
  document.getElementById('result-name').textContent = '';
  document.getElementById('heart-burst').innerHTML = '';
}

export default { showResult, resetResult };
