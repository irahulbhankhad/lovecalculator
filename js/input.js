/**
 * input.js — Crush Name Input Section
 * Floating label animation, glowing border, validation.
 */
import gsap from 'gsap';

/**
 * Initialize input section
 * @param {Function} onSubmit — called with the crush name string
 */
export function initInput(onSubmit) {
  const input = document.getElementById('crush-input');
  const submitBtn = document.getElementById('submit-crush');

  // Entrance animation
  gsap.fromTo(
    '.input-container',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.2 }
  );

  submitBtn.addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) {
      // Shake effect for empty input
      gsap.to(input, {
        x: [-8, 8, -6, 6, -3, 3, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
      input.focus();
      return;
    }
    if (onSubmit) onSubmit(name);
  });

  // Also allow Enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });
}

/**
 * Reset input field
 */
export function resetInput() {
  document.getElementById('crush-input').value = '';
}

export default { initInput, resetInput };
