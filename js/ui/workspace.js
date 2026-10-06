import { createFeedback } from "./feedback.js";

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

export function renderWorkspace(root, { lab, onBack, onReset }) {
  const workspace = createElement("section", "lab-workspace");
  workspace.dataset.accent = lab.accent;
  workspace.setAttribute("aria-labelledby", "workspace-title");

  const header = createElement("header", "lab-workspace__header");
  const heading = createElement("div", "workspace-heading");
  const title = createElement("h1", "", lab.title);
  title.id = "workspace-title";
  title.tabIndex = -1;
  title.dataset.labTitle = "";
  const objective = createElement("p", "workspace-heading__objective", lab.description);
  objective.dataset.labObjective = "";
  heading.append(
    createElement("p", "workspace-heading__subject", lab.subjectLabel),
    title,
    createElement("span", "workspace-heading__objective-label", "Learning objective"),
    objective
  );

  const actions = createElement("div", "workspace-actions");
  const backButton = createElement("button", "button button--secondary", "Back to Labs");
  backButton.type = "button";
  const resetButton = createElement("button", "button button--secondary", "Reset Lab");
  resetButton.type = "button";
  resetButton.dataset.labReset = "";
  resetButton.disabled = true;
  resetButton.title = "Reset becomes available when the interactive lab is mounted.";
  actions.append(backButton, resetButton);
  header.append(heading, actions);

  const layout = createElement("div", "lab-workspace__layout");
  const stage = createElement("section", "lab-stage");
  stage.dataset.labStage = "";
  stage.setAttribute("aria-labelledby", "stage-title");

  const stageReady = createElement("div", "stage-ready");
  const stageMarker = createElement("div", "stage-ready__marker");
  stageMarker.setAttribute("aria-hidden", "true");
  const stageTitle = createElement("h2", "", "Simulation area ready");
  stageTitle.id = "stage-title";
  stageReady.append(
    stageMarker,
    stageTitle,
    createElement("p", "", "Interactive simulation will load here.")
  );
  stage.append(stageReady);

  const controls = createElement("aside", "lab-controls");
  controls.dataset.labControls = "";
  controls.setAttribute("aria-labelledby", "controls-title");
  const controlsTitle = createElement("h2", "", "Experiment controls");
  controlsTitle.id = "controls-title";
  const controlsMount = createElement("div", "lab-controls__mount");
  controlsMount.append(
    createElement("p", "", "Controls for this experiment will mount in this panel.")
  );
  controls.append(controlsTitle, controlsMount);

  layout.append(stage, controls);

  const lower = createElement("div", "workspace-lower");
  const observation = createElement("section", "lab-observation");
  observation.dataset.labObservation = "";
  observation.append(
    createElement("h2", "", "Observations"),
    createElement("p", "", "Live measurements and results will appear here as you experiment.")
  );

  const challenge = createElement("section", "lab-challenge");
  challenge.dataset.labChallenge = "";
  challenge.append(
    createElement("h2", "", "Challenge"),
    createElement("p", "", "A short goal will help you test what you discover in the simulation.")
  );

  const feedback = createFeedback(
    "The workspace is prepared for this lab's interactive module.",
    "info"
  );
  feedback.dataset.labFeedback = "";
  lower.append(observation, challenge, feedback);

  workspace.append(header, layout, lower);
  root.replaceChildren(workspace);

  const handleBack = () => onBack();
  const handleReset = () => onReset();
  backButton.addEventListener("click", handleBack);
  resetButton.addEventListener("click", handleReset);

  return {
    stage,
    controls: controlsMount,
    observation,
    challenge,
    feedback,
    setResetEnabled(isEnabled) {
      resetButton.disabled = !isEnabled;
      resetButton.title = isEnabled
        ? "Reset this lab to its initial state."
        : "Reset becomes available when the interactive lab is mounted.";
    },
    focusTitle() {
      title.focus({ preventScroll: true });
    },
    destroy() {
      backButton.removeEventListener("click", handleBack);
      resetButton.removeEventListener("click", handleReset);
      root.replaceChildren();
    }
  };
}
