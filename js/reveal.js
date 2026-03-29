/**
 * reveal.js — Prank Reveal Screen
 * Confetti burst, glitch effect, and restart handler.
 */
import gsap from 'gsap';

let confettiCanvas, confettiCtx;
let confettiPieces = [];
let confettiAnimId;

/**
 * Show the prank reveal with confetti
 * @param {string} userName — the user's name
 * @param {string} crushName — the crush's name
 * @param {Function} onRestart — called when user clicks "Try Again"
 */
export function showReveal(userName, crushName, onRestart) {
  // Populate the names
  document.getElementById('reveal-user-name').textContent = userName;
  document.getElementById('reveal-crush-name').textContent = crushName;

  // Entrance animation
  gsap.fromTo(
    '.reveal-container',
    { opacity: 0, scale: 0.7 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }
  );

  // Start confetti
  startConfetti();

  // Restart button
  document.getElementById('reveal-restart').addEventListener('click', () => {
    stopConfetti();
    if (onRestart) onRestart();
  });
}

/**
 * 2D Canvas confetti burst
 */
function startConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCtx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const colors = ['#ff2d7b', '#a855f7', '#ff6b9d', '#e040fb', '#00e5ff', '#ffd700', '#ff1744', '#22c55e'];

  // Create confetti pieces
  confettiPieces = [];
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * confettiCanvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  animateConfetti();
}

function animateConfetti() {
  confettiAnimId = requestAnimationFrame(animateConfetti);
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let allDone = true;
  confettiPieces.forEach((p) => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotSpeed;
    p.speedY += 0.05; // gravity

    // Fade when near bottom
    if (p.y > confettiCanvas.height - 100) {
      p.opacity -= 0.02;
    }

    if (p.opacity > 0 && p.y < confettiCanvas.height + 20) {
      allDone = false;
      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
    }
  });

  if (allDone) {
    cancelAnimationFrame(confettiAnimId);
  }
}

function stopConfetti() {
  cancelAnimationFrame(confettiAnimId);
  if (confettiCtx) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  confettiPieces = [];
}

/**
 * Reset reveal screen
 */
export function resetReveal() {
  stopConfetti();
  document.getElementById('reveal-user-name').textContent = '';
  document.getElementById('reveal-crush-name').textContent = '';
}

export default { showReveal, resetReveal };
