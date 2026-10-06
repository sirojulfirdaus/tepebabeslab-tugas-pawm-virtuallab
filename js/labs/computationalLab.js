import { getDragPayload, moveItem, setDragPayload, swapItems } from "../utils/dragDrop.js";
import { updateFeedback } from "../ui/feedback.js";

const ORIGINAL_VALUES = [7, 3, 9, 1, 5];

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function isSorted(values) {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}

export function createComputationalLab(regions) {
  const state = { values: [...ORIGINAL_VALUES], moves: 0, selectedIndex: null };
  const eventController = new AbortController();

  regions.stage.classList.add("lab-stage--interactive");
  const stageTitle = createElement("h2", "visually-hidden", "Number sorting workspace");
  stageTitle.id = "stage-title";
  const board = createElement("div", "ordering-board");
  const instruction = createElement(
    "p",
    "interaction-instruction",
    "Drag blocks into ascending order, or select one block and then another to swap them."
  );
  const sequence = createElement("ol", "sort-sequence");
  sequence.setAttribute("aria-label", "Current number order");
  board.append(instruction, sequence);
  regions.stage.replaceChildren(stageTitle, board);

  const resetButton = createElement("button", "button button--secondary", "Reset");
  resetButton.type = "button";
  regions.controls.replaceChildren(
    createElement(
      "p",
      "lab-control-copy",
      "Compare neighboring values. Each drag or two-block swap counts as one move."
    ),
    resetButton
  );

  const moveOutput = createElement("output", "metric-value", "0");
  const orderOutput = createElement("output", "sequence-output");
  const stateOutput = createElement("output", "sequence-state");
  const resultList = createElement("dl", "result-list");
  [
    ["Moves", moveOutput],
    ["Current order", orderOutput],
    ["Sequence state", stateOutput]
  ].forEach(([label, output]) => {
    const row = createElement("div", "result-list__row");
    row.append(createElement("dt", "", label), output);
    resultList.append(row);
  });
  regions.observation.replaceChildren(createElement("h2", "", "Sorting progress"), resultList);

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Ordering challenge"),
    createElement("p", "challenge-prompt", "Arrange every value from smallest to largest."),
    challengeStatus
  );

  function render() {
    const sorted = isSorted(state.values);
    const items = state.values.map((value, index) => {
      const item = createElement("li", "sort-sequence__item");
      const button = createElement("button", "number-block", String(value));
      button.type = "button";
      button.draggable = true;
      button.dataset.index = String(index);
      button.setAttribute("aria-pressed", String(state.selectedIndex === index));
      if (state.selectedIndex === index) button.classList.add("is-selected");
      item.append(button);
      return item;
    });
    sequence.replaceChildren(...items);
    sequence.dataset.sorted = String(sorted);

    moveOutput.value = String(state.moves);
    moveOutput.textContent = String(state.moves);
    orderOutput.value = state.values.join(" → ");
    orderOutput.textContent = orderOutput.value;
    stateOutput.value = sorted ? "Sorted" : "Not sorted";
    stateOutput.textContent = stateOutput.value;
    challengeStatus.dataset.state = sorted ? "success" : state.moves > 0 ? "active" : "idle";
    challengeStatus.textContent = sorted
      ? `Sorted in ${state.moves} ${state.moves === 1 ? "move" : "moves"}. Local changes produced a globally ordered sequence.`
      : state.moves > 0
        ? "Keep sorting — compare each value with the value immediately beside it."
        : "Move or swap a block when you are ready to begin.";

    if (sorted) {
      updateFeedback(
        regions.feedback,
        "Sequence complete: every number is now less than or equal to the number after it.",
        "success"
      );
    }
  }

  function applyMove(nextValues) {
    if (nextValues.every((value, index) => value === state.values[index])) return;
    state.values = nextValues;
    state.moves += 1;
    state.selectedIndex = null;
    render();
    if (!isSorted(state.values)) {
      updateFeedback(
        regions.feedback,
        "Move recorded. Continue comparing neighboring values from left to right.",
        "info"
      );
    }
  }

  sequence.addEventListener(
    "click",
    (event) => {
      const block = event.target.closest(".number-block");
      if (!block) return;
      const index = Number(block.dataset.index);
      if (state.selectedIndex === null) {
        state.selectedIndex = index;
        render();
        updateFeedback(
          regions.feedback,
          `${state.values[index]} selected. Choose another block to swap positions.`,
          "info"
        );
        return;
      }
      applyMove(swapItems(state.values, state.selectedIndex, index));
    },
    { signal: eventController.signal }
  );
  sequence.addEventListener(
    "dragstart",
    (event) => {
      const block = event.target.closest(".number-block");
      if (!block) return;
      setDragPayload(event, block.dataset.index);
      block.classList.add("is-dragging");
    },
    { signal: eventController.signal }
  );
  sequence.addEventListener(
    "dragover",
    (event) => {
      const target = event.target.closest(".number-block");
      if (!target) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      sequence.querySelectorAll(".is-drop-target").forEach((block) => {
        block.classList.toggle("is-drop-target", block === target);
      });
    },
    { signal: eventController.signal }
  );
  sequence.addEventListener(
    "dragleave",
    (event) => {
      const target = event.target.closest(".number-block");
      if (target && !target.contains(event.relatedTarget)) target.classList.remove("is-drop-target");
    },
    { signal: eventController.signal }
  );
  sequence.addEventListener(
    "drop",
    (event) => {
      const target = event.target.closest(".number-block");
      if (!target) return;
      event.preventDefault();
      const payload = getDragPayload(event);
      if (payload === "") return;
      const fromIndex = Number(payload);
      const toIndex = Number(target.dataset.index);
      applyMove(moveItem(state.values, fromIndex, toIndex));
    },
    { signal: eventController.signal }
  );
  sequence.addEventListener(
    "dragend",
    (event) => {
      event.target.closest(".number-block")?.classList.remove("is-dragging");
      sequence.querySelectorAll(".is-drop-target").forEach((block) =>
        block.classList.remove("is-drop-target")
      );
    },
    { signal: eventController.signal }
  );

  function reset() {
    state.values = [...ORIGINAL_VALUES];
    state.moves = 0;
    state.selectedIndex = null;
    render();
    updateFeedback(
      regions.feedback,
      "Sequence reset. Drag blocks or select two blocks to swap them.",
      "info"
    );
  }

  resetButton.addEventListener("click", reset, { signal: eventController.signal });
  reset();

  return {
    reset,
    destroy() {
      eventController.abort();
    }
  };
}
