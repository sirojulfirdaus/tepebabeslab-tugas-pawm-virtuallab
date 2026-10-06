import { updateFeedback } from "../ui/feedback.js";

const SCENARIOS = [
  {
    title: "Group assignment",
    prompt:
      "One group member is quiet during meetings and has gradually been left out of important tasks.",
    options: [
      {
        label: "Invite their perspective and agree on a fair task division together.",
        alignment: "Stronger alignment",
        values: ["Kemanusiaan yang adil dan beradab", "Persatuan Indonesia"],
        feedback:
          "Active inclusion respects each person’s dignity while strengthening cooperation within the group."
      },
      {
        label: "Keep the current division so the group can finish as quickly as possible.",
        alignment: "Trade-off to consider",
        values: ["Persatuan Indonesia"],
        feedback:
          "Efficiency matters, but excluding a member can weaken participation and shared responsibility."
      },
      {
        label: "Ask the instructor to assign every task without a group discussion.",
        alignment: "Partial alignment",
        values: ["Keadilan sosial bagi seluruh rakyat Indonesia"],
        feedback:
          "Outside guidance may improve fairness, although the group loses an opportunity to practice deliberation."
      }
    ]
  },
  {
    title: "Community schedule",
    prompt:
      "Neighbors disagree about when a shared courtyard should be used for study, exercise, and community events.",
    options: [
      {
        label: "Hold a discussion and create a schedule that accommodates the different needs.",
        alignment: "Stronger alignment",
        values: ["Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan"],
        feedback:
          "Deliberation lets different voices shape a practical agreement rather than allowing one preference to dominate."
      },
      {
        label: "Use a majority vote immediately without hearing the reasons behind each proposal.",
        alignment: "Partial alignment",
        values: ["Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan"],
        feedback:
          "Voting can settle a decision, but listening first can reveal compromises and improve mutual understanding."
      },
      {
        label: "Give the courtyard to whichever group arrives first each day.",
        alignment: "Trade-off to consider",
        values: ["Keadilan sosial bagi seluruh rakyat Indonesia"],
        feedback:
          "A simple rule is easy to apply, yet it may repeatedly disadvantage people with less flexible schedules."
      }
    ]
  },
  {
    title: "Shared learning resources",
    prompt:
      "A study group has fewer laptops than members during a time-limited research session.",
    options: [
      {
        label: "Agree on timed turns and pair tasks that do not require a laptop.",
        alignment: "Stronger alignment",
        values: ["Keadilan sosial bagi seluruh rakyat Indonesia", "Persatuan Indonesia"],
        feedback:
          "Shared access and coordinated roles distribute limited resources while keeping everyone involved."
      },
      {
        label: "Let the most experienced members use every laptop for the whole session.",
        alignment: "Trade-off to consider",
        values: ["Keadilan sosial bagi seluruh rakyat Indonesia"],
        feedback:
          "Experience may improve speed, but unequal access limits learning opportunities for other members."
      },
      {
        label: "Ask one representative to decide who receives access.",
        alignment: "Partial alignment",
        values: ["Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan"],
        feedback:
          "Representation can help coordinate a choice, especially when the group agrees on fair criteria beforehand."
      }
    ]
  }
];

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function createPancasilaLab(regions) {
  const state = { scenarioIndex: 0, selectedOption: null };
  const eventController = new AbortController();

  regions.stage.classList.add("lab-stage--interactive");
  const stageTitle = createElement("h2", "visually-hidden", "Civic decision scenario");
  stageTitle.id = "stage-title";
  const scenarioView = createElement("article", "scenario-view");
  regions.stage.replaceChildren(stageTitle, scenarioView);

  const nextButton = createElement("button", "button button--primary", "Next");
  nextButton.type = "button";
  regions.controls.replaceChildren(
    createElement(
      "p",
      "lab-control-copy",
      "Choose a response, read the reflection, then continue. Responses explore alignment and trade-offs rather than political positions."
    ),
    nextButton
  );

  const reflection = createElement("div", "scenario-reflection");
  regions.observation.replaceChildren(createElement("h2", "", "Value reflection"), reflection);

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Reflection task"),
    createElement(
      "p",
      "challenge-prompt",
      "Consider how participation, dignity, deliberation, and fairness affect each decision."
    ),
    challengeStatus
  );

  function render() {
    const scenario = SCENARIOS[state.scenarioIndex];
    const progressText = createElement(
      "p",
      "scenario-progress",
      `Scenario ${state.scenarioIndex + 1} / ${SCENARIOS.length}`
    );
    const progress = createElement("progress", "scenario-progress__bar");
    progress.max = SCENARIOS.length;
    progress.value = state.scenarioIndex + 1;
    const heading = createElement("h2", "scenario-view__title", scenario.title);
    const prompt = createElement("p", "scenario-view__prompt", scenario.prompt);
    const choices = createElement("div", "scenario-options");
    choices.setAttribute("role", "group");
    choices.setAttribute("aria-label", "Response choices");

    scenario.options.forEach((option, index) => {
      const button = createElement("button", "scenario-option", option.label);
      button.type = "button";
      button.dataset.optionIndex = String(index);
      button.setAttribute("aria-pressed", String(index === state.selectedOption));
      choices.append(button);
    });
    scenarioView.replaceChildren(progressText, progress, heading, prompt, choices);

    nextButton.disabled = state.selectedOption === null;
    nextButton.textContent =
      state.scenarioIndex === SCENARIOS.length - 1 ? "Restart" : "Next";

    if (state.selectedOption === null) {
      reflection.replaceChildren(
        createElement("p", "scenario-reflection__empty", "Select a response to reveal its values and trade-offs.")
      );
      challengeStatus.dataset.state = "idle";
      challengeStatus.textContent = "Choose a response and consider the explanation before moving on.";
      return;
    }

    const option = scenario.options[state.selectedOption];
    const valuesList = createElement("ul", "value-list");
    option.values.forEach((value) => valuesList.append(createElement("li", "", value)));
    reflection.replaceChildren(
      createElement("p", "reflection-alignment", option.alignment),
      createElement("h3", "", "Related Pancasila values"),
      valuesList,
      createElement("p", "", option.feedback)
    );
    challengeStatus.dataset.state = "success";
    challengeStatus.textContent = "Reflection complete for this scenario. You can compare another response or continue.";
  }

  scenarioView.addEventListener(
    "click",
    (event) => {
      const optionButton = event.target.closest(".scenario-option");
      if (!optionButton) return;
      state.selectedOption = Number(optionButton.dataset.optionIndex);
      const option = SCENARIOS[state.scenarioIndex].options[state.selectedOption];
      render();
      updateFeedback(
        regions.feedback,
        `${option.alignment}: ${option.feedback}`,
        option.alignment === "Stronger alignment" ? "success" : "info"
      );
    },
    { signal: eventController.signal }
  );

  nextButton.addEventListener(
    "click",
    () => {
      if (state.selectedOption === null) return;
      state.scenarioIndex = (state.scenarioIndex + 1) % SCENARIOS.length;
      state.selectedOption = null;
      render();
      updateFeedback(
        regions.feedback,
        state.scenarioIndex === 0
          ? "Scenarios restarted. Try different responses and compare the reflections."
          : `Scenario ${state.scenarioIndex + 1} ready. Consider the values behind each response.`,
        "info"
      );
    },
    { signal: eventController.signal }
  );

  function reset() {
    state.scenarioIndex = 0;
    state.selectedOption = null;
    render();
    updateFeedback(
      regions.feedback,
      "Start with the first everyday scenario and choose the response you want to examine.",
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
