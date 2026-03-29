/**
 * sheets.js — Google Sheets Integration
 * Sends user name, crush name, answers, and score to a Google Sheet via Apps Script.
 * Matches sheet headers: User Name | Crush Name | Answers 1-5 | Score | User Agent
 */

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwR-x5fapUvr2hwCHxHrfcZtG27qt8tcvwp-0dRFCGpqXFpSRlEn-k3SfSOZaTqdFT0/exec';

/**
 * Send data to Google Sheets — called ONCE when the user submits
 */
export function sendToSheets({ userName, crushName, answers, score }) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
    console.warn('[Sheets] Google Script URL not configured. Skipping send.');
    return;
  }

  const payload = {
    userName: userName || 'Unknown',
    crushName: crushName || 'Unknown',
    answers: answers || [],
    score: score ?? 0,
    userAgent: navigator.userAgent,
  };

  // Send silently — text/plain is required for no-cors to actually deliver the body
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(payload),
  })
    .then(() => {
      console.log('[Sheets] Data sent successfully');
    })
    .catch((err) => {
      console.warn('[Sheets] Failed to send data:', err);
    });
}

export default { sendToSheets };
