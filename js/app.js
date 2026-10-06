import { labs, subjectFilters } from "./data/labs.js";
import { createAiLab } from "./labs/aiLab.js";
import { createChemistryLab } from "./labs/chemistryLab.js";
import { createComputationalLab } from "./labs/computationalLab.js";
import { createEnglishLab } from "./labs/englishLab.js";
import { createIndonesianLab } from "./labs/indonesianLab.js";
import { createMathLab } from "./labs/mathLab.js";
import { createPancasilaLab } from "./labs/pancasilaLab.js";
import { createPhysicsLab } from "./labs/physicsLab.js";
import { createSportsLab } from "./labs/sportsLab.js";
import { updateFeedback } from "./ui/feedback.js";
import { renderLibrary } from "./ui/library.js";
import { renderWorkspace } from "./ui/workspace.js";

const appState = {
  activeView: "library",
  activeSubject: "all",
  activeLabId: null
};

let activeLabInstance = null;
let workspaceController = null;

const labFactories = new Map([
  ["function-playground", createMathLab],
  ["projectile-motion", createPhysicsLab],
  ["ph-mixer", createChemistryLab],
  ["sorting", createComputationalLab],
  ["ai-decision", createAiLab],
  ["pacing", createSportsLab],
  ["civic-decision", createPancasilaLab],
  ["sentence-structure", createIndonesianLab],
  ["sentence-builder", createEnglishLab]
]);

const libraryView = document.querySelector("#library-view");
const workspaceView = document.querySelector("#workspace-view");
const subjectContext = document.querySelector("[data-subject-context]");
const libraryButton = document.querySelector("[data-library-button]");
const libraryLink = document.querySelector("[data-library-link]");

if (!libraryView || !workspaceView || !subjectContext || !libraryButton || !libraryLink) {
  throw new Error("The application shell is incomplete.");
}

const featuredLab = labs.find((lab) => lab.featured) ?? labs[0];

const libraryController = renderLibrary({
  labs,
  filters: subjectFilters,
  featuredLab,
  activeSubject: appState.activeSubject,
  onSubjectChange: setActiveSubject,
  onOpenLab: openLab
});

function setActiveSubject(subjectId) {
  const filter = subjectFilters.find((item) => item.id === subjectId) ?? subjectFilters[0];
  appState.activeSubject = filter.id;
  libraryController.setActiveSubject(filter.id);
  subjectContext.textContent = filter.id === "all" ? "All subjects" : filter.label;
}

function openLab(labId) {
  const lab = labs.find((item) => item.id === labId);

  if (!lab) {
    return;
  }

  destroyActiveLab();
  workspaceController?.destroy();

  appState.activeView = "workspace";
  appState.activeLabId = lab.id;

  workspaceController = renderWorkspace(workspaceView, {
    lab,
    onBack: closeLab,
    onReset: () => activeLabInstance?.reset?.()
  });

  showActiveView();
  const createLab = labFactories.get(lab.id);

  if (createLab) {
    try {
      activeLabInstance = createLab(workspaceController);
      workspaceController.setResetEnabled(true);
    } catch (error) {
      activeLabInstance = null;
      updateFeedback(
        workspaceController.feedback,
        "This lab could not initialize. Return to the library and try opening it again.",
        "error"
      );
      console.error(`Failed to initialize ${lab.id}.`, error);
    }
  }

  workspaceController.focusTitle();
}

function closeLab() {
  destroyActiveLab();
  workspaceController?.destroy();
  workspaceController = null;

  appState.activeView = "library";
  appState.activeLabId = null;
  showActiveView();
  libraryController.focusHeading();
}

function destroyActiveLab() {
  activeLabInstance?.destroy?.();
  activeLabInstance = null;
}

function showActiveView() {
  const isLibrary = appState.activeView === "library";
  libraryView.hidden = !isLibrary;
  workspaceView.hidden = isLibrary;

  if (isLibrary) {
    libraryButton.setAttribute("aria-current", "page");
  } else {
    libraryButton.removeAttribute("aria-current");
  }

  if (isLibrary) {
    const filter = subjectFilters.find((item) => item.id === appState.activeSubject);
    subjectContext.textContent = filter?.id === "all" ? "All subjects" : filter?.label ?? "All subjects";
    libraryView.classList.remove("view-enter");
    void libraryView.offsetWidth;
    libraryView.classList.add("view-enter");
    return;
  }

  const activeLab = labs.find((lab) => lab.id === appState.activeLabId);
  subjectContext.textContent = activeLab?.subjectLabel ?? "Lab workspace";
  workspaceView.classList.remove("view-enter");
  void workspaceView.offsetWidth;
  workspaceView.classList.add("view-enter");
}

function handleLibraryNavigation(event) {
  event.preventDefault();

  if (appState.activeView === "workspace") {
    closeLab();
  } else {
    libraryController.focusHeading();
  }
}

libraryButton.addEventListener("click", handleLibraryNavigation);
libraryLink.addEventListener("click", handleLibraryNavigation);
showActiveView();
