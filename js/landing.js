/**
 * landing.js — Landing Section
 * GSAP entrance animations, magnetic button effect, CTA click handler.
 */
import gsap from 'gsap';

/**
 * Animate the landing section entrance
 */
export function animateLanding(onStart) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(
    '#landing-badge',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 }
  )
    .fromTo(
      '#landing-title',
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8 },
      '-=0.3'
    )
    .fromTo(
      '#landing-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(
      '#landing-desc',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    )
    .fromTo(
      '#cta-start',
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6 },
      '-=0.3'
    )
    .fromTo(
      '#landing-stats',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.2'
    );

  // CTA click
  document.getElementById('cta-start').addEventListener('click', () => {
    if (onStart) onStart();
  });

  // Magnetic button effect
  initMagneticButtons();
}

/**
 * Magnetic hover effect for all .magnetic-btn elements
 * Buttons subtly follow the cursor when hovered
 */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

export default { animateLanding };
