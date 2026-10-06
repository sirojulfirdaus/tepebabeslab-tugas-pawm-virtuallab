import { updateFeedback } from "../ui/feedback.js";

const SUBSTANCES = [
  { id: "lemon", label: "Lemon solution", ph: 2, type: "acid" },
  { id: "vinegar", label: "Vinegar", ph: 3, type: "acid" },
  { id: "water", label: "Water", ph: 7, type: "neutral" },
  { id: "baking-soda", label: "Baking soda solution", ph: 9, type: "base" },
  { id: "soap", label: "Soap solution", ph: 11, type: "base" }
];

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function calculateSimplifiedPH(portions) {
  if (portions.length === 0) return null;
  const total = portions.reduce((sum, substance) => sum + substance.ph, 0);
  return Math.min(14, Math.max(0, total / portions.length));
}

function classifyPH(ph) {
  if (ph === null) return "Empty";
  if (ph < 7) return "Acidic";
  if (ph > 7) return "Basic";
  return "Neutral";
}

function indicatorColor(ph) {
  if (ph === null) return "transparent";
  if (ph <= 2.5) return "#d4514a";
  if (ph <= 4.5) return "#df7b42";
  if (ph < 6.5) return "#d5aa35";
  if (ph <= 7.5) return "#4f9961";
  if (ph <= 10) return "#3d82b7";
  return "#7057a5";
}

export function createChemistryLab(regions) {
  const state = { portions: [], selectedId: null };
  const eventController = new AbortController();

  regions.stage.classList.add("lab-stage--interactive", "lab-stage--chemistry");
  const stageTitle = createElement("h2", "visually-hidden", "pH mixing beaker");
  stageTitle.id = "stage-title";
  const bench = createElement("div", "chemistry-bench");
  const beakerInstruction = createElement(
    "p",
    "beaker-instruction",
    "Drop a substance into the beaker, or select a substance and then activate the beaker."
  );
  beakerInstruction.id = "beaker-instruction";
  const beakerButton = createElement("button", "beaker-drop");
  beakerButton.type = "button";
  beakerButton.dataset.dropTarget = "beaker";
  beakerButton.setAttribute("aria-describedby", beakerInstruction.id);
  beakerButton.setAttribute("aria-label", "Empty beaker. Add the selected substance.");

  const beakerVessel = createElement("span", "beaker-vessel");
  const liquid = createElement("span", "beaker-liquid");
  const beakerScale = createElement("span", "beaker-scale", "150  ·  100  ·  50 mL");
  const beakerLabel = createElement("span", "beaker-label", "BEAKER");
  beakerVessel.append(liquid, beakerScale, beakerLabel);
  beakerButton.append(beakerVessel);

  const indicator = createElement("div", "ph-indicator");
  indicator.setAttribute(
    "aria-label",
    "Indicator reference from acidic red and orange through neutral green to basic blue and purple."
  );
  [
    ["Acidic", "indicator-swatch indicator-swatch--acid"],
    ["Neutral", "indicator-swatch indicator-swatch--neutral"],
    ["Basic", "indicator-swatch indicator-swatch--base"]
  ].forEach(([label, className]) => indicator.append(createElement("span", className, label)));
  bench.append(beakerInstruction, beakerButton, indicator);
  regions.stage.replaceChildren(stageTitle, bench);

  const reagentInstruction = createElement(
    "p",
    "reagent-instruction",
    "Drag a reagent, or select it for touch and keyboard use. Each addition is one equal portion."
  );
  const reagentList = createElement("ul", "reagent-list");
  const reagentButtons = new Map();

  SUBSTANCES.forEach((substance) => {
    const item = createElement("li", "reagent-list__item");
    const button = createElement("button", "reagent");
    button.type = "button";
    button.draggable = true;
    button.dataset.substanceId = substance.id;
    button.dataset.substanceType = substance.type;
    button.setAttribute("aria-pressed", "false");
    button.append(
      createElement("span", "reagent__name", substance.label),
      createElement("span", "reagent__ph", `pH ${substance.ph}`)
    );

    button.addEventListener(
      "dragstart",
      (event) => {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("text/plain", substance.id);
        button.classList.add("is-dragging");
      },
      { signal: eventController.signal }
    );
    button.addEventListener("dragend", () => button.classList.remove("is-dragging"), {
      signal: eventController.signal
    });
    button.addEventListener("click", () => selectSubstance(substance.id), {
      signal: eventController.signal
    });

    item.append(button);
    reagentList.append(item);
    reagentButtons.set(substance.id, button);
  });
  regions.controls.replaceChildren(reagentInstruction, reagentList);

  const phOutput = createElement("output", "chemistry-result__value", "—");
  const classificationOutput = createElement("output", "chemistry-result__classification", "Empty");
  const resultSummary = createElement("div", "chemistry-result");
  const phBlock = createElement("div");
  phBlock.append(createElement("span", "result-label", "Mixture pH"), phOutput);
  const classBlock = createElement("div");
  classBlock.append(createElement("span", "result-label", "Classification"), classificationOutput);
  resultSummary.append(phBlock, classBlock);
  const historyTitle = createElement("h3", "mixture-history__title", "Mixture contents");
  const history = createElement("ul", "mixture-history");
  regions.observation.replaceChildren(
    createElement("h2", "", "Indicator reading"),
    resultSummary,
    historyTitle,
    history,
    createElement(
      "p",
      "model-disclaimer",
      "Simplified educational model: pH is an equal-portion average, not chemical equilibrium."
    )
  );

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Neutral-zone challenge"),
    createElement("p", "challenge-prompt", "Create a mixture with pH between 6 and 8."),
    challengeStatus
  );

  function findSubstance(id) {
    return SUBSTANCES.find((substance) => substance.id === id);
  }

  function selectSubstance(id) {
    state.selectedId = state.selectedId === id ? null : id;
    reagentButtons.forEach((button, buttonId) => {
      const selected = buttonId === state.selectedId;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-selected", selected);
    });

    const selected = findSubstance(state.selectedId);
    updateFeedback(
      regions.feedback,
      selected
        ? `${selected.label} selected. Activate the beaker to add one portion.`
        : "Selection cleared. Choose or drag a substance to continue.",
      "info"
    );
  }

  function renderHistory() {
    if (state.portions.length === 0) {
      history.replaceChildren(createElement("li", "mixture-history__empty", "Nothing added yet."));
      return;
    }

    const counts = new Map();
    state.portions.forEach((substance) => {
      counts.set(substance.id, (counts.get(substance.id) ?? 0) + 1);
    });
    const items = [...counts.entries()].map(([id, count]) => {
      const substance = findSubstance(id);
      return createElement("li", "", `${substance.label} × ${count}`);
    });
    history.replaceChildren(...items);
  }

  function renderMixture(addedSubstance = null) {
    const ph = calculateSimplifiedPH(state.portions);
    const classification = classifyPH(ph);
    const challengeMet = ph !== null && ph >= 6 && ph <= 8;
    const fillLevel = ph === null ? 0 : Math.min(78, 18 + state.portions.length * 10);

    phOutput.value = ph === null ? "—" : ph.toFixed(1);
    phOutput.textContent = phOutput.value;
    classificationOutput.value = classification;
    classificationOutput.textContent = classification;
    liquid.style.height = `${fillLevel}%`;
    liquid.style.backgroundColor = indicatorColor(ph);
    beakerButton.dataset.filled = String(ph !== null);
    beakerButton.setAttribute(
      "aria-label",
      ph === null
        ? "Empty beaker. Add the selected substance."
        : `Beaker mixture, pH ${ph.toFixed(1)}, ${classification}. Add the selected substance.`
    );
    renderHistory();

    challengeStatus.dataset.state = challengeMet
      ? "success"
      : state.portions.length > 0
        ? "active"
        : "idle";
    challengeStatus.textContent = challengeMet
      ? `Challenge met — pH ${ph.toFixed(1)} is inside the 6–8 target range.`
      : ph === null
        ? "Not yet met — add substances and observe the pH."
        : `Not yet met — pH ${ph.toFixed(1)} is ${classification.toLowerCase()}. Continue mixing toward 6–8.`;

    if (addedSubstance) {
      updateFeedback(
        regions.feedback,
        challengeMet
          ? `${addedSubstance.label} added. The simplified mixture is now in the neutral target zone.`
          : `${addedSubstance.label} added. The mixture is pH ${ph.toFixed(1)} and classified as ${classification.toLowerCase()}.`,
        challengeMet ? "success" : "info"
      );
    }
  }

  function addSubstance(id) {
    const substance = findSubstance(id);
    if (!substance) return;
    state.portions.push(substance);
    state.selectedId = null;
    reagentButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.classList.remove("is-selected");
    });
    renderMixture(substance);
  }

  beakerButton.addEventListener(
    "dragover",
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    { signal: eventController.signal }
  );
  beakerButton.addEventListener(
    "dragenter",
    (event) => {
      event.preventDefault();
      beakerButton.classList.add("is-drop-target");
    },
    { signal: eventController.signal }
  );
  beakerButton.addEventListener(
    "dragleave",
    (event) => {
      if (!beakerButton.contains(event.relatedTarget)) {
        beakerButton.classList.remove("is-drop-target");
      }
    },
    { signal: eventController.signal }
  );
  beakerButton.addEventListener(
    "drop",
    (event) => {
      event.preventDefault();
      beakerButton.classList.remove("is-drop-target");
      addSubstance(event.dataTransfer.getData("text/plain"));
    },
    { signal: eventController.signal }
  );
  beakerButton.addEventListener(
    "click",
    () => {
      if (state.selectedId) {
        addSubstance(state.selectedId);
      } else {
        updateFeedback(
          regions.feedback,
          "Select a substance first, or drag one directly into the beaker.",
          "info"
        );
      }
    },
    { signal: eventController.signal }
  );

  function reset() {
    state.portions = [];
    state.selectedId = null;
    reagentButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.classList.remove("is-selected", "is-dragging");
    });
    beakerButton.classList.remove("is-drop-target");
    renderMixture();
    updateFeedback(
      regions.feedback,
      "Beaker cleared. Drag a substance, or select one and activate the beaker.",
      "info"
    );
  }

  reset();

  return {
    reset,
    destroy() {
      eventController.abort();
    }
  };
}
