/**
 * input.js — Name & Crush Name Input Section
 * Floating label animation, glowing border, validation.
 * Uses AbortController to prevent duplicate listeners on restart.
 */
import gsap from 'gsap';

let abortController = null;

/**
 * Initialize input section
 * @param {Function} onSubmit — called with { userName, crushName } object
 */
export function initInput(onSubmit) {
  // Abort any previous listeners to prevent duplicates
  if (abortController) abortController.abort();
  abortController = new AbortController();
  const signal = abortController.signal;

  const userNameInput = document.getElementById('user-name-input');
  const crushInput = document.getElementById('crush-input');
  const submitBtn = document.getElementById('submit-crush');

  // Entrance animation
  gsap.fromTo(
    '.input-container',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.2 }
  );

  submitBtn.addEventListener('click', () => {
    const userName = userNameInput.value.trim();
    const crushName = crushInput.value.trim();

    // Validate user name
    if (!userName) {
      gsap.to(userNameInput, {
        x: [-8, 8, -6, 6, -3, 3, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
      userNameInput.focus();
      return;
    }

    // Validate crush name
    if (!crushName) {
      gsap.to(crushInput, {
        x: [-8, 8, -6, 6, -3, 3, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
      crushInput.focus();
      return;
    }

    if (onSubmit) onSubmit({ userName, crushName });
  }, { signal });

  // Also allow Enter key on both inputs
  [userNameInput, crushInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        submitBtn.click();
      }
    }, { signal });
  });
}

/**
 * Reset input fields and remove listeners
 */
export function resetInput() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  document.getElementById('user-name-input').value = '';
  document.getElementById('crush-input').value = '';
}

export default { initInput, resetInput };
