import { updateFeedback } from "../ui/feedback.js";

const DEFAULT_STATE = { duration: 45, intensity: 5, rest: 5 };
const CONTROL_DEFINITIONS = [
  { key: "duration", label: "Duration", min: 10, max: 90, step: 5, unit: "min" },
  { key: "intensity", label: "Intensity", min: 1, max: 10, step: 1, unit: "/ 10" },
  { key: "rest", label: "Rest interval", min: 0, max: 20, step: 1, unit: "min" }
];

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function calculateEffort({ duration, intensity, rest }) {
  const baseEffort = duration * intensity;
  const recoveryAdjustment = Math.max(0.5, 1 - rest / duration);
  const effortScore = Math.min(100, Math.max(0, (baseEffort * recoveryAdjustment * 100) / 900));
  return { baseEffort, recoveryAdjustment, effortScore };
}

function classifyEffort(score) {
  if (score < 25) return "Easy";
  if (score < 50) return "Moderate";
  if (score < 75) return "Hard";
  return "Very Hard";
}

export function createSportsLab(regions) {
  const state = { ...DEFAULT_STATE };
  const eventController = new AbortController();
  let hasInteracted = false;
  const controls = new Map();

  regions.stage.classList.add("lab-stage--interactive");
  const stageTitle = createElement("h2", "visually-hidden", "Training effort visualization");
  stageTitle.id = "stage-title";
  const visual = createElement("div", "pacing-visual");
  const effortMeter = createElement("meter", "effort-meter");
  effortMeter.min = 0;
  effortMeter.max = 100;
  effortMeter.low = 25;
  effortMeter.high = 75;
  effortMeter.optimum = 40;
  const meterLabels = createElement("div", "effort-meter__labels");
  ["Easy", "Moderate", "Hard", "Very Hard"].forEach((label) =>
    meterLabels.append(createElement("span", "", label))
  );
  const sessionTitle = createElement("p", "visual-label", "Session composition");
  const sessionBar = createElement("div", "session-bar");
  const activeSegment = createElement("span", "session-bar__active", "Active");
  const restSegment = createElement("span", "session-bar__rest", "Rest");
  sessionBar.append(activeSegment, restSegment);
  const intensityScale = createElement("div", "intensity-scale");
  for (let level = 1; level <= 10; level += 1) {
    const mark = createElement("span", "intensity-scale__mark");
    mark.dataset.level = String(level);
    intensityScale.append(mark);
  }
  visual.append(
    createElement("p", "interaction-instruction", "Relative effort across the configured session"),
    effortMeter,
    meterLabels,
    sessionTitle,
    sessionBar,
    createElement("p", "visual-label", "Intensity level"),
    intensityScale
  );
  regions.stage.replaceChildren(stageTitle, visual);

  const controlsFragment = document.createDocumentFragment();
  CONTROL_DEFINITIONS.forEach((definition) => {
    const group = createElement("div", "lab-control-group");
    const heading = createElement("div", "lab-control-heading");
    const id = `sports-${definition.key}`;
    const label = createElement("label", "lab-control-label", definition.label);
    label.htmlFor = id;
    const output = createElement(
      "output",
      "lab-control-output",
      `${state[definition.key]} ${definition.unit}`
    );
    output.setAttribute("for", id);
    const input = createElement("input", "range-input");
    input.type = "range";
    input.id = id;
    input.min = String(definition.min);
    input.max = String(definition.max);
    input.step = String(definition.step);
    input.value = String(state[definition.key]);
    input.addEventListener(
      "input",
      (event) => {
        state[definition.key] = Number(event.currentTarget.value);
        hasInteracted = true;
        update();
      },
      { signal: eventController.signal }
    );
    heading.append(label, output);
    group.append(heading, input);
    controls.set(definition.key, { input, output, unit: definition.unit });
    controlsFragment.append(group);
  });
  controlsFragment.append(
    createElement(
      "p",
      "lab-model-note",
      "Educational relative-effort model — not medical or physiological guidance."
    )
  );
  regions.controls.replaceChildren(controlsFragment);

  const scoreOutput = createElement("output", "effort-score");
  const zoneOutput = createElement("output", "effort-zone");
  const comparison = createElement("p", "effort-comparison");
  regions.observation.replaceChildren(
    createElement("h2", "", "Session estimate"),
    createElement("span", "result-label", "Relative effort score"),
    scoreOutput,
    createElement("span", "result-label", "Effort zone"),
    zoneOutput,
    comparison
  );

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Pacing challenge"),
    createElement(
      "p",
      "challenge-prompt",
      "Create a Moderate session with at least 30 minutes of active duration."
    ),
    challengeStatus
  );

  function update() {
    controls.forEach((control, key) => {
      control.input.value = String(state[key]);
      control.output.value = `${state[key]} ${control.unit}`;
      control.output.textContent = control.output.value;
    });

    const result = calculateEffort(state);
    const zone = classifyEffort(result.effortScore);
    effortMeter.value = result.effortScore;
    scoreOutput.value = result.effortScore.toFixed(1);
    scoreOutput.textContent = `${result.effortScore.toFixed(1)} / 100`;
    zoneOutput.value = zone;
    zoneOutput.textContent = zone;
    zoneOutput.dataset.zone = zone.toLowerCase().replaceAll(" ", "-");

    const totalTime = state.duration + state.rest;
    activeSegment.style.flexGrow = String(state.duration);
    restSegment.style.flexGrow = String(state.rest);
    restSegment.hidden = state.rest === 0;
    activeSegment.textContent = `${state.duration} min active`;
    restSegment.textContent = state.rest > 0 ? `${state.rest} min rest` : "No rest";
    sessionBar.setAttribute(
      "aria-label",
      `${state.duration} minutes active and ${state.rest} minutes rest, ${totalTime} minutes total.`
    );
    intensityScale.querySelectorAll(".intensity-scale__mark").forEach((mark) => {
      mark.classList.toggle("is-active", Number(mark.dataset.level) <= state.intensity);
    });
    comparison.textContent = `At intensity ${state.intensity}, rest reduces the base effort to ${Math.round(
      result.recoveryAdjustment * 100
    )}% of its unrecovered value. Intensity raises effort directly; rest moderates it.`;

    const challengeMet = zone === "Moderate" && state.duration >= 30;
    challengeStatus.dataset.state = challengeMet ? "success" : hasInteracted ? "active" : "idle";
    challengeStatus.textContent = challengeMet
      ? `Challenge met — ${state.duration} minutes produces a ${zone} score of ${result.effortScore.toFixed(1)}.`
      : hasInteracted
        ? `Keep adjusting — current zone is ${zone} at ${state.duration} minutes.`
        : "Adjust the session when you are ready to begin the pacing challenge.";
    updateFeedback(
      regions.feedback,
      challengeMet
        ? "Success: the session combines at least 30 minutes with a moderate relative effort."
        : "Adjust duration, intensity, and rest to compare how each changes relative effort.",
      challengeMet ? "success" : "info"
    );
  }

  function reset() {
    Object.assign(state, DEFAULT_STATE);
    hasInteracted = false;
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
