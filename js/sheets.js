/**
 * sheets.js — Google Sheets Integration
 * Sends crush name, answers, and score to a Google Sheet via Apps Script webhook.
 * The data is sent silently in the background — the user never sees it.
 */

// ⚠️ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwR-x5fapUvr2hwCHxHrfcZtG27qt8tcvwp-0dRFCGpqXFpSRlEn-k3SfSOZaTqdFT0/exec';

/**
 * Send crush data to Google Sheets
 * Called when the user submits their crush's name
 */
export function sendToSheets({ userName, crushName, answers, score }) {
  // Don't send if URL hasn't been configured
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
    console.warn('[Sheets] Google Script URL not configured. Skipping send.');
    return;
  }

  const payload = {
    userName: userName || 'Unknown',
    crushName: crushName || 'Unknown',
    answers: answers || [],
    score: score ?? 0,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  // Send silently in the background — don't block the UI
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Required for Apps Script
    headers: {
      'Content-Type': 'application/json',
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
