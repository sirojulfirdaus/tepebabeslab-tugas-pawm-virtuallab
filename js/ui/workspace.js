import { labInstructions } from "../data/labInstructions.js";
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
  const helpButton = createElement("button", "button button--secondary", "How to Use");
  helpButton.type = "button";
  const resetButton = createElement("button", "button button--secondary", "Reset");
  resetButton.type = "button";
  resetButton.dataset.labReset = "";
  resetButton.disabled = true;
  resetButton.title = "Reset becomes available when the interactive lab is mounted.";
  actions.append(backButton, helpButton, resetButton);
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

  const instructions = labInstructions[lab.id];
  const helpDialog = createElement("dialog", "lab-help-dialog");
  helpDialog.setAttribute("aria-labelledby", "lab-help-title");
  const helpTitle = createElement("h2", "", `How to use ${lab.title}`);
  helpTitle.id = "lab-help-title";
  const helpContent = createElement("div", "lab-help-dialog__content");
  [
    ["Manipulate", instructions?.manipulate ?? "Use the controls to change the experiment."],
    ["Observe", instructions?.observe ?? "Watch the stage and observations respond."],
    ["Challenge", instructions?.challenge ?? "Use the challenge prompt to test what you notice."]
  ].forEach(([label, copy]) => {
    const section = createElement("section", "lab-help-dialog__section");
    section.append(createElement("h3", "", label), createElement("p", "", copy));
    helpContent.append(section);
  });
  if (instructions?.note) {
    helpContent.append(createElement("p", "lab-help-dialog__note", instructions.note));
  }
  const closeHelpButton = createElement("button", "button button--primary", "Close");
  closeHelpButton.type = "button";
  helpDialog.append(helpTitle, helpContent, closeHelpButton);

  workspace.append(header, layout, lower, helpDialog);
  root.replaceChildren(workspace);

  const handleBack = () => onBack();
  const handleReset = () => onReset();
  const handleHelp = () => {
    if (typeof helpDialog.showModal === "function") {
      helpDialog.showModal();
    } else {
      helpDialog.setAttribute("open", "");
    }
  };
  const handleCloseHelp = () => {
    if (typeof helpDialog.close === "function" && helpDialog.open) {
      helpDialog.close();
    } else {
      helpDialog.removeAttribute("open");
      helpButton.focus();
    }
  };
  const handleDialogClose = () => helpButton.focus();
  backButton.addEventListener("click", handleBack);
  helpButton.addEventListener("click", handleHelp);
  resetButton.addEventListener("click", handleReset);
  closeHelpButton.addEventListener("click", handleCloseHelp);
  helpDialog.addEventListener("close", handleDialogClose);

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
      title.focus();
    },
    destroy() {
      if (helpDialog.open && typeof helpDialog.close === "function") {
        helpDialog.close();
      }
      backButton.removeEventListener("click", handleBack);
      helpButton.removeEventListener("click", handleHelp);
      resetButton.removeEventListener("click", handleReset);
      closeHelpButton.removeEventListener("click", handleCloseHelp);
      helpDialog.removeEventListener("close", handleDialogClose);
      root.replaceChildren();
    }
  };
}
