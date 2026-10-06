import { getDragPayload, moveItem, setDragPayload } from "../utils/dragDrop.js";
import { updateFeedback } from "../ui/feedback.js";

const EXERCISES = [
  {
    prompt: "Build a Subject + Verb + Object sentence.",
    words: { students: "Students", discuss: "discuss", the: "the", experiment: "experiment" },
    shuffled: ["experiment", "students", "the", "discuss"],
    answer: ["students", "discuss", "the", "experiment"],
    hint: "Begin with who performs the action, then place the verb before its object.",
    explanation: "The sentence follows Subject + Verb + Object order."
  },
  {
    prompt: "Place the manner adverb in a natural position.",
    words: { she: "She", carefully: "carefully", records: "records", results: "results" },
    shuffled: ["records", "results", "carefully", "she"],
    answer: ["she", "carefully", "records", "results"],
    hint: "The manner adverb belongs after the subject and before the main verb here.",
    explanation: "The adverb ‘carefully’ modifies how she records the results."
  },
  {
    prompt: "Build a present-tense question.",
    words: { do: "Do", they: "they", understand: "understand", pattern: "the pattern?" },
    shuffled: ["pattern", "understand", "do", "they"],
    answer: ["do", "they", "understand", "pattern"],
    hint: "A yes/no question begins with the auxiliary verb before the subject.",
    explanation: "The auxiliary ‘Do’ comes before the subject in a present-tense question."
  },
  {
    prompt: "Build a sentence with a time expression.",
    words: { our: "Our", team: "team", will: "will", present: "present", tomorrow: "tomorrow" },
    shuffled: ["tomorrow", "present", "our", "will", "team"],
    answer: ["our", "team", "will", "present", "tomorrow"],
    hint: "Build the subject first; the time expression can close this sentence.",
    explanation: "The time expression ‘tomorrow’ appears naturally at the end of the sentence."
  }
];

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function normalizeSentence(words) {
  return words
    .join(" ")
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, " ")
    .replace(/[.!?]+$/, "");
}

export function createEnglishLab(regions) {
  const state = { exerciseIndex: 0, arrangement: [], checked: false, completed: false };
  const eventController = new AbortController();

  regions.stage.classList.add("lab-stage--interactive");
  const stageTitle = createElement("h2", "visually-hidden", "English sentence builder");
  stageTitle.id = "stage-title";
  const builder = createElement("div", "sentence-builder");
  regions.stage.replaceChildren(stageTitle, builder);

  const checkButton = createElement("button", "button button--primary", "Check Sentence");
  checkButton.type = "button";
  const clearButton = createElement("button", "button button--secondary", "Clear Sentence");
  clearButton.type = "button";
  const nextButton = createElement("button", "button button--secondary", "Next Sentence");
  nextButton.type = "button";
  nextButton.disabled = true;
  const actionRow = createElement("div", "lab-control-actions");
  actionRow.append(checkButton, clearButton, nextButton);
  regions.controls.replaceChildren(
    createElement(
      "p",
      "lab-control-copy",
      "Select words to append them, select arranged words to remove them, or drag words into a new order."
    ),
    actionRow
  );

  const progressOutput = createElement("output", "exercise-progress");
  const sentenceOutput = createElement("output", "built-sentence-output");
  regions.observation.replaceChildren(
    createElement("h2", "", "Built sentence"),
    progressOutput,
    sentenceOutput
  );

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Grammar check"),
    createElement("p", "challenge-prompt", "Arrange every word, then check the sentence."),
    challengeStatus
  );

  function currentExercise() {
    return EXERCISES[state.exerciseIndex];
  }

  function createWordToken(wordId, location, index = null) {
    const token = createElement("button", "word-token", currentExercise().words[wordId]);
    token.type = "button";
    token.draggable = true;
    token.dataset.wordId = wordId;
    token.dataset.location = location;
    if (index !== null) token.dataset.index = String(index);
    return token;
  }

  function render() {
    const exercise = currentExercise();
    const prompt = createElement("p", "sentence-builder__prompt", exercise.prompt);
    const bank = createElement("div", "word-bank");
    bank.setAttribute("aria-label", "Available words");
    exercise.shuffled.forEach((wordId) => {
      if (!state.arrangement.includes(wordId)) bank.append(createWordToken(wordId, "bank"));
    });
    if (bank.childElementCount === 0) {
      bank.append(createElement("p", "word-bank__empty", "All words are in the sentence."));
    }

    const sentence = createElement("div", "sentence-line");
    sentence.dataset.sentenceDrop = "";
    sentence.setAttribute("aria-label", "Current sentence order");
    state.arrangement.forEach((wordId, index) => {
      sentence.append(createWordToken(wordId, "sentence", index));
    });
    if (state.arrangement.length === 0) {
      sentence.append(createElement("p", "sentence-line__empty", "Build the sentence here"));
    }
    builder.replaceChildren(prompt, bank, sentence);

    const words = state.arrangement.map((wordId) => exercise.words[wordId]);
    const displaySentence = words.join(" ");
    progressOutput.value = `Sentence ${state.exerciseIndex + 1} / ${EXERCISES.length}`;
    progressOutput.textContent = progressOutput.value;
    sentenceOutput.value = displaySentence;
    sentenceOutput.textContent = displaySentence || "No words arranged yet.";
    challengeStatus.dataset.state = state.completed ? "success" : state.checked ? "retry" : "pending";
    challengeStatus.textContent = state.completed
      ? `Correct — ${exercise.explanation}`
      : state.checked
        ? `Try again — ${exercise.hint}`
        : "Use every word and check the completed sentence.";
    nextButton.disabled = !state.completed;
  }

  function invalidateCheck() {
    state.checked = false;
    state.completed = false;
    nextButton.disabled = true;
  }

  builder.addEventListener(
    "click",
    (event) => {
      const token = event.target.closest(".word-token");
      if (!token) return;
      const wordId = token.dataset.wordId;
      if (token.dataset.location === "bank") {
        state.arrangement.push(wordId);
      } else {
        state.arrangement = state.arrangement.filter((id) => id !== wordId);
      }
      invalidateCheck();
      render();
      updateFeedback(
        regions.feedback,
        token.dataset.location === "bank"
          ? `${currentExercise().words[wordId]} added to the sentence.`
          : `${currentExercise().words[wordId]} returned to the word bank.`,
        "info"
      );
    },
    { signal: eventController.signal }
  );
  builder.addEventListener(
    "dragstart",
    (event) => {
      const token = event.target.closest(".word-token");
      if (!token) return;
      setDragPayload(event, token.dataset.wordId);
      token.classList.add("is-dragging");
    },
    { signal: eventController.signal }
  );
  builder.addEventListener(
    "dragover",
    (event) => {
      if (!event.target.closest("[data-sentence-drop], .word-token[data-location='sentence']")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    { signal: eventController.signal }
  );
  builder.addEventListener(
    "drop",
    (event) => {
      const sentence = event.target.closest("[data-sentence-drop]");
      if (!sentence) return;
      event.preventDefault();
      const wordId = getDragPayload(event);
      if (!(wordId in currentExercise().words)) return;
      const existingIndex = state.arrangement.indexOf(wordId);
      const targetToken = event.target.closest(".word-token[data-location='sentence']");
      const targetIndex = targetToken ? Number(targetToken.dataset.index) : state.arrangement.length;

      if (existingIndex === -1) {
        state.arrangement.splice(targetIndex, 0, wordId);
      } else {
        const destination = targetToken
          ? Math.max(0, targetIndex - (existingIndex < targetIndex ? 1 : 0))
          : state.arrangement.length - 1;
        state.arrangement = moveItem(state.arrangement, existingIndex, destination);
      }
      invalidateCheck();
      render();
      updateFeedback(regions.feedback, "Word order updated. Check the sentence when ready.", "info");
    },
    { signal: eventController.signal }
  );
  builder.addEventListener(
    "dragend",
    (event) => event.target.closest(".word-token")?.classList.remove("is-dragging"),
    { signal: eventController.signal }
  );

  checkButton.addEventListener(
    "click",
    () => {
      const exercise = currentExercise();
      const builtWords = state.arrangement.map((wordId) => exercise.words[wordId]);
      const answerWords = exercise.answer.map((wordId) => exercise.words[wordId]);
      state.checked = true;
      state.completed =
        state.arrangement.length === exercise.answer.length &&
        normalizeSentence(builtWords) === normalizeSentence(answerWords);
      render();
      updateFeedback(
        regions.feedback,
        state.completed ? `Correct. ${exercise.explanation}` : exercise.hint,
        state.completed ? "success" : "retry"
      );
    },
    { signal: eventController.signal }
  );

  function resetCurrent() {
    state.arrangement = [];
    state.checked = false;
    state.completed = false;
    nextButton.disabled = true;
    render();
  }

  clearButton.addEventListener(
    "click",
    () => {
      resetCurrent();
      updateFeedback(regions.feedback, "Sentence cleared. Select words in the order you want.", "info");
    },
    { signal: eventController.signal }
  );
  nextButton.addEventListener(
    "click",
    () => {
      if (!state.completed) return;
      state.exerciseIndex = (state.exerciseIndex + 1) % EXERCISES.length;
      resetCurrent();
      updateFeedback(
        regions.feedback,
        `Sentence ${state.exerciseIndex + 1} ready. Use the prompt to plan the word order.`,
        "info"
      );
    },
    { signal: eventController.signal }
  );

  function reset() {
    resetCurrent();
    updateFeedback(regions.feedback, "Current sentence reset. Select a word to begin.", "info");
  }

  reset();

  return {
    reset,
    destroy() {
      eventController.abort();
    }
  };
}
