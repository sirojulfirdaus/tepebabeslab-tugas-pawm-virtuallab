const feedbackTones = new Set(["neutral", "success", "retry", "error", "info"]);

export function createFeedback(message = "", tone = "neutral") {
  const feedback = document.createElement("div");
  feedback.className = "lab-feedback";
  feedback.setAttribute("role", tone === "error" ? "alert" : "status");
  feedback.setAttribute("aria-live", tone === "error" ? "assertive" : "polite");

  const text = document.createElement("p");
  feedback.append(text);
  updateFeedback(feedback, message, tone);

  return feedback;
}

export function updateFeedback(feedback, message, tone = "neutral") {
  if (!(feedback instanceof HTMLElement)) {
    return;
  }

  const safeTone = feedbackTones.has(tone) ? tone : "neutral";
  const text = feedback.querySelector("p") ?? document.createElement("p");

  if (!text.isConnected) {
    feedback.append(text);
  }

  feedback.dataset.tone = safeTone;
  feedback.setAttribute("role", safeTone === "error" ? "alert" : "status");
  feedback.setAttribute("aria-live", safeTone === "error" ? "assertive" : "polite");
  text.textContent = message;
}
