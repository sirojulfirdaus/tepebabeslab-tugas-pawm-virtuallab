import { updateFeedback } from "../ui/feedback.js";

const DEFAULT_STATE = { relevance: 60, reliability: 60, engagement: 40 };
const FACTORS = [
  { key: "relevance", label: "Relevance", weight: 0.4 },
  { key: "reliability", label: "Reliability", weight: 0.4 },
  { key: "engagement", label: "Engagement", weight: 0.2 }
];

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function calculateScore(state) {
  return FACTORS.reduce((score, factor) => score + state[factor.key] * factor.weight, 0);
}

function classifyScore(score) {
  if (score >= 70) return "Recommend";
  if (score >= 40) return "Review";
  return "Do Not Recommend";
}

export function createAiLab(regions) {
  const state = { ...DEFAULT_STATE };
  const eventController = new AbortController();
  const controls = new Map();
  const contributionBars = new Map();
  const contributionValues = new Map();

  regions.stage.classList.add("lab-stage--interactive");
  const stageTitle = createElement("h2", "visually-hidden", "Weighted decision visualization");
  stageTitle.id = "stage-title";
  const model = createElement("div", "decision-model");
  model.append(
    createElement("p", "interaction-instruction", "Weighted contribution to the final score")
  );
  const contributionList = createElement("div", "contribution-list");
  FACTORS.forEach((factor) => {
    const row = createElement("div", "contribution-row");
    const label = createElement("span", "contribution-row__label", factor.label);
    const bar = createElement("progress", "contribution-row__bar");
    bar.max = factor.weight * 100;
    const value = createElement("output", "contribution-row__value");
    row.append(label, bar, value);
    contributionList.append(row);
    contributionBars.set(factor.key, bar);
    contributionValues.set(factor.key, value);
  });
  const thresholdGuide = createElement("div", "threshold-guide");
  thresholdGuide.append(
    createElement("span", "", "0–39 Do Not Recommend"),
    createElement("span", "", "40–69 Review"),
    createElement("span", "", "70–100 Recommend")
  );
  model.append(contributionList, thresholdGuide);
  regions.stage.replaceChildren(stageTitle, model);

  const controlsFragment = document.createDocumentFragment();
  FACTORS.forEach((factor) => {
    const group = createElement("div", "lab-control-group");
    const heading = createElement("div", "lab-control-heading");
    const id = `ai-${factor.key}`;
    const label = createElement("label", "lab-control-label", factor.label);
    label.htmlFor = id;
    const output = createElement("output", "lab-control-output", String(state[factor.key]));
    output.setAttribute("for", id);
    const input = createElement("input", "range-input");
    input.type = "range";
    input.id = id;
    input.min = "0";
    input.max = "100";
    input.step = "1";
    input.value = String(state[factor.key]);
    input.addEventListener(
      "input",
      (event) => {
        state[factor.key] = Number(event.currentTarget.value);
        update();
      },
      { signal: eventController.signal }
    );
    heading.append(label, output);
    group.append(heading, input);
    controls.set(factor.key, { input, output });
    controlsFragment.append(group);
  });
  controlsFragment.append(
    createElement(
      "p",
      "lab-model-note",
      "Simplified educational decision model — this is not a real AI system."
    )
  );
  regions.controls.replaceChildren(controlsFragment);

  const scoreOutput = createElement("output", "decision-score");
  const decisionOutput = createElement("output", "decision-label");
  const explanation = createElement("p", "decision-explanation");
  regions.observation.replaceChildren(
    createElement("h2", "", "Model output"),
    createElement("span", "result-label", "Weighted score"),
    scoreOutput,
    createElement("span", "result-label", "Decision"),
    decisionOutput,
    explanation
  );

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Threshold challenge"),
    createElement(
      "p",
      "challenge-prompt",
      "Make the model recommend the content while keeping engagement below 50."
    ),
    challengeStatus
  );

  function update() {
    FACTORS.forEach((factor) => {
      const contribution = state[factor.key] * factor.weight;
      const control = controls.get(factor.key);
      control.output.value = String(state[factor.key]);
      control.output.textContent = String(state[factor.key]);
      contributionBars.get(factor.key).value = contribution;
      contributionValues.get(factor.key).value = contribution.toFixed(1);
      contributionValues.get(factor.key).textContent = `${contribution.toFixed(1)} pts`;
    });

    const score = calculateScore(state);
    const decision = classifyScore(score);
    scoreOutput.value = score.toFixed(1);
    scoreOutput.textContent = `${score.toFixed(1)} / 100`;
    decisionOutput.value = decision;
    decisionOutput.textContent = decision;
    decisionOutput.dataset.decision = decision.toLowerCase().replaceAll(" ", "-");
    explanation.textContent =
      decision === "Recommend"
        ? "The weighted score reached the recommendation threshold."
        : decision === "Review"
          ? "The score is between the lower and recommendation thresholds."
          : "The score remains below the review threshold.";

    const challengeMet = score >= 70 && state.engagement < 50;
    challengeStatus.dataset.state = challengeMet ? "success" : "pending";
    challengeStatus.textContent = challengeMet
      ? `Challenge met — score ${score.toFixed(1)} recommends content with engagement at ${state.engagement}.`
      : `Not yet met — score ${score.toFixed(1)}, engagement ${state.engagement}. Keep engagement below 50 and reach 70.`;
    updateFeedback(
      regions.feedback,
      challengeMet
        ? "Success: relevance and reliability carried the decision above the threshold without high engagement."
        : `The model currently says “${decision}.” Adjusting higher-weight factors changes the score more strongly.`,
      challengeMet ? "success" : "info"
    );
  }

  function reset() {
    Object.assign(state, DEFAULT_STATE);
    controls.forEach((control, key) => {
      control.input.value = String(state[key]);
    });
    update();
  }

  update();

  return {
    reset,
    destroy() {
      eventController.abort();
    }
  };
}
