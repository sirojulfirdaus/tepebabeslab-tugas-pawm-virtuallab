import { getDragPayload, setDragPayload } from "../utils/dragDrop.js";
import { updateFeedback } from "../ui/feedback.js";

const ROLES = ["S", "P", "O", "K"];
const EXERCISES = [
  {
    fragments: {
      S: "Mahasiswa itu",
      P: "mengerjakan",
      O: "tugas kelompok",
      K: "di perpustakaan"
    },
    order: ["K", "O", "S", "P"],
    explanation: "Mahasiswa itu (S) mengerjakan (P) tugas kelompok (O) di perpustakaan (K)."
  },
  {
    fragments: {
      S: "Dina",
      P: "membaca",
      O: "artikel ilmiah",
      K: "setiap pagi"
    },
    order: ["O", "K", "P", "S"],
    explanation: "Dina (S) membaca (P) artikel ilmiah (O) setiap pagi (K)."
  },
  {
    fragments: {
      S: "Tim kami",
      P: "mempresentasikan",
      O: "hasil penelitian",
      K: "di kelas"
    },
    order: ["P", "S", "K", "O"],
    explanation: "Tim kami (S) mempresentasikan (P) hasil penelitian (O) di kelas (K)."
  }
];

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function createIndonesianLab(regions) {
  const state = {
    exerciseIndex: 0,
    placements: { S: null, P: null, O: null, K: null },
    selectedFragment: null,
    checked: false,
    completed: false
  };
  const eventController = new AbortController();

  regions.stage.classList.add("lab-stage--interactive");
  const stageTitle = createElement("h2", "visually-hidden", "S P O K sentence workspace");
  stageTitle.id = "stage-title";
  const sentenceBoard = createElement("div", "sentence-structure-board");
  regions.stage.replaceChildren(stageTitle, sentenceBoard);

  const checkButton = createElement("button", "button button--primary", "Check Answer");
  checkButton.type = "button";
  const nextButton = createElement("button", "button button--secondary", "Next Sentence");
  nextButton.type = "button";
  nextButton.disabled = true;
  const actionRow = createElement("div", "lab-control-actions");
  actionRow.append(checkButton, nextButton);
  regions.controls.replaceChildren(
    createElement(
      "p",
      "lab-control-copy",
      "Drag fragments into S, P, O, and K. For touch or keyboard use, select a fragment and then choose a target."
    ),
    actionRow
  );

  const progressOutput = createElement("output", "exercise-progress");
  const placementOutput = createElement("p", "placement-summary");
  regions.observation.replaceChildren(
    createElement("h2", "", "Sentence progress"),
    progressOutput,
    placementOutput
  );

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Structure check"),
    createElement("p", "challenge-prompt", "Place each fragment in its correct sentence role."),
    challengeStatus
  );

  function currentExercise() {
    return EXERCISES[state.exerciseIndex];
  }

  function placedRoleFor(fragmentId) {
    return ROLES.find((role) => state.placements[role] === fragmentId) ?? null;
  }

  function placeFragment(fragmentId, targetRole) {
    if (!ROLES.includes(fragmentId) || !ROLES.includes(targetRole)) return;
    const previousRole = placedRoleFor(fragmentId);
    if (previousRole) state.placements[previousRole] = null;
    state.placements[targetRole] = fragmentId;
    state.selectedFragment = null;
    state.checked = false;
    state.completed = false;
    nextButton.disabled = true;
    render();
    updateFeedback(
      regions.feedback,
      `${currentExercise().fragments[fragmentId]} placed in ${targetRole}. Check the full arrangement when ready.`,
      "info"
    );
  }

  function render() {
    const exercise = currentExercise();
    const assignedFragments = new Set(Object.values(state.placements).filter(Boolean));
    const bank = createElement("div", "fragment-bank");
    bank.setAttribute("aria-label", "Available sentence fragments");
    exercise.order.forEach((fragmentId) => {
      if (assignedFragments.has(fragmentId)) return;
      const fragment = createElement(
        "button",
        "sentence-fragment",
        exercise.fragments[fragmentId]
      );
      fragment.type = "button";
      fragment.draggable = true;
      fragment.dataset.fragmentId = fragmentId;
      fragment.setAttribute("aria-pressed", String(state.selectedFragment === fragmentId));
      if (state.selectedFragment === fragmentId) fragment.classList.add("is-selected");
      bank.append(fragment);
    });
    if (bank.childElementCount === 0) {
      bank.append(createElement("p", "fragment-bank__empty", "All fragments have been placed."));
    }

    const zones = createElement("div", "sentence-zones");
    ROLES.forEach((role) => {
      const placedFragment = state.placements[role];
      const zone = createElement("button", "sentence-zone");
      zone.type = "button";
      zone.dataset.role = role;
      zone.draggable = Boolean(placedFragment);
      if (placedFragment) zone.dataset.fragmentId = placedFragment;
      zone.setAttribute(
        "aria-label",
        placedFragment
          ? `${role}: ${exercise.fragments[placedFragment]}`
          : `${role}: empty target. Place selected fragment.`
      );
      if (state.selectedFragment === placedFragment) zone.classList.add("is-selected");
      if (state.checked) {
        zone.dataset.result = placedFragment === role ? "correct" : "incorrect";
      }
      zone.append(
        createElement("span", "sentence-zone__role", role),
        createElement(
          "span",
          "sentence-zone__content",
          placedFragment ? exercise.fragments[placedFragment] : "Place fragment"
        )
      );
      zones.append(zone);
    });
    sentenceBoard.replaceChildren(
      createElement("p", "interaction-instruction", "Arrange the fragments into sentence roles"),
      bank,
      zones
    );

    progressOutput.value = `Sentence ${state.exerciseIndex + 1} / ${EXERCISES.length}`;
    progressOutput.textContent = progressOutput.value;
    const placedCount = assignedFragments.size;
    placementOutput.textContent = `${placedCount} of ${ROLES.length} fragments placed.`;
    challengeStatus.dataset.state = state.completed ? "success" : state.checked ? "retry" : "pending";
    if (state.completed) {
      challengeStatus.textContent = `Correct — ${exercise.explanation}`;
    } else if (state.checked) {
      const correctCount = ROLES.filter((role) => state.placements[role] === role).length;
      challengeStatus.textContent = `${correctCount} of 4 roles are correct. Reconsider the highlighted placements and try again.`;
    } else {
      challengeStatus.textContent = "Arrange all four fragments, then check the sentence structure.";
    }
  }

  sentenceBoard.addEventListener(
    "click",
    (event) => {
      const fragment = event.target.closest(".sentence-fragment");
      if (fragment) {
        state.selectedFragment = fragment.dataset.fragmentId;
        render();
        updateFeedback(
          regions.feedback,
          `${fragment.textContent} selected. Choose an S, P, O, or K target.`,
          "info"
        );
        return;
      }

      const zone = event.target.closest(".sentence-zone");
      if (!zone) return;
      if (state.selectedFragment) {
        placeFragment(state.selectedFragment, zone.dataset.role);
      } else if (zone.dataset.fragmentId) {
        state.selectedFragment = zone.dataset.fragmentId;
        render();
        updateFeedback(
          regions.feedback,
          `${currentExercise().fragments[state.selectedFragment]} selected. Choose another target to move it.`,
          "info"
        );
      }
    },
    { signal: eventController.signal }
  );
  sentenceBoard.addEventListener(
    "dragstart",
    (event) => {
      const source = event.target.closest("[data-fragment-id]");
      if (!source) return;
      setDragPayload(event, source.dataset.fragmentId);
      source.classList.add("is-dragging");
    },
    { signal: eventController.signal }
  );
  sentenceBoard.addEventListener(
    "dragover",
    (event) => {
      if (!event.target.closest(".sentence-zone")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    { signal: eventController.signal }
  );
  sentenceBoard.addEventListener(
    "drop",
    (event) => {
      const zone = event.target.closest(".sentence-zone");
      if (!zone) return;
      event.preventDefault();
      const fragmentId = getDragPayload(event);
      if (fragmentId) placeFragment(fragmentId, zone.dataset.role);
    },
    { signal: eventController.signal }
  );
  sentenceBoard.addEventListener(
    "dragend",
    (event) => event.target.closest("[data-fragment-id]")?.classList.remove("is-dragging"),
    { signal: eventController.signal }
  );

  checkButton.addEventListener(
    "click",
    () => {
      const allPlaced = ROLES.every((role) => state.placements[role]);
      state.checked = true;
      state.completed = allPlaced && ROLES.every((role) => state.placements[role] === role);
      nextButton.disabled = !state.completed;
      render();
      updateFeedback(
        regions.feedback,
        state.completed
          ? `Correct: ${currentExercise().explanation}`
          : allPlaced
            ? "Some roles need another look. Identify who acts, the action, its object, and the context."
            : "Place all four fragments before checking the sentence.",
        state.completed ? "success" : "retry"
      );
    },
    { signal: eventController.signal }
  );

  function resetCurrent() {
    state.placements = { S: null, P: null, O: null, K: null };
    state.selectedFragment = null;
    state.checked = false;
    state.completed = false;
    nextButton.disabled = true;
    render();
  }

  nextButton.addEventListener(
    "click",
    () => {
      if (!state.completed) return;
      state.exerciseIndex = (state.exerciseIndex + 1) % EXERCISES.length;
      resetCurrent();
      updateFeedback(
        regions.feedback,
        `Sentence ${state.exerciseIndex + 1} ready. Arrange its S, P, O, and K elements.`,
        "info"
      );
    },
    { signal: eventController.signal }
  );

  function reset() {
    resetCurrent();
    updateFeedback(
      regions.feedback,
      "Current sentence reset. Drag a fragment or select it and choose a target.",
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
