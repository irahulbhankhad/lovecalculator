/**
 * particles.js — 2D Canvas Particle Overlay
 * Lightweight floating hearts and light dots rendered on a 2D canvas.
 */

let canvas, ctx;
let particlesArray = [];
let animId;

const HEART_EMOJIS = ['💗', '💕', '💖', '✨', '💫', '♥'];

class Particle {
  constructor(w, h) {
    this.reset(w, h, true);
  }

  reset(w, h, initial = false) {
    this.x = Math.random() * w;
    this.y = initial ? Math.random() * h : h + 20;
    this.size = Math.random() * 14 + 6;
    this.speedY = -(Math.random() * 0.5 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
    this.wobbleOffset = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
  }

  update(w, h, time) {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(time * this.wobbleSpeed + this.wobbleOffset) * 0.3;
    this.rotation += this.rotSpeed;

    // Reset when off screen
    if (this.y < -20) {
      this.reset(w, h);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }
}

/**
 * Initialize particle overlay
 */
export function initParticles() {
  canvas = document.getElementById('particle-overlay');
  ctx = canvas.getContext('2d');

  resize();
  window.addEventListener('resize', resize);

  // Create particles
  const count = Math.min(30, Math.floor(window.innerWidth / 40));
  for (let i = 0; i < count; i++) {
    particlesArray.push(new Particle(canvas.width, canvas.height));
  }

  animate(0);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function animate(time) {
  animId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particlesArray.forEach((p) => {
    p.update(canvas.width, canvas.height, time);
    p.draw(ctx);
  });
}

export default { initParticles };
