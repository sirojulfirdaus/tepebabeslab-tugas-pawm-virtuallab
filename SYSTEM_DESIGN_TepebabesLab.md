# SYSTEM_DESIGN — TepebabesLab

**Product:** TepebabesLab  
**Type:** Frontend-only interactive virtual laboratory  
**Stack:** HTML5, CSS3, Vanilla JavaScript (ES Modules)  
**Architecture Goal:** Fast, modular, browser-native implementation suitable for coursework with multiple interactive mini-labs.

---

# 1. Purpose

This document defines the implementation structure for TepebabesLab.

It complements `PRD.md` by translating product requirements into a lightweight technical design.

The main engineering goal is:

> Keep each lab independent, interactive, easy to debug, and easy to render without introducing unnecessary framework complexity.

TepebabesLab should remain:

- frontend-only;
- dependency-light;
- easy to run locally;
- modular enough to avoid one giant JavaScript file;
- simple enough to finish quickly.

---

# 2. Engineering Priorities

Priority order:

1. Working simulations
2. Clear separation of concerns
3. Rich HTML5 interaction
4. Responsive layout
5. Visual polish
6. Optional enhancements

Do not sacrifice working interactions for architectural perfection.

---

# 3. Non-Goals

Do not introduce:

- backend services;
- databases;
- authentication;
- build systems;
- frontend frameworks;
- state-management libraries;
- external APIs;
- routing frameworks;
- heavy animation libraries;
- physics engines;
- chemistry engines.

The browser is the entire runtime.

---

# 4. High-Level Architecture

```text
index.html
   ↓
app.js
   ↓
Lab Catalogue Data
   ↓
UI / Workspace Controller
   ↓
Selected Lab Module
   ↓
Interactive State + DOM / Canvas
```

Conceptually:

```text
User Action
    ↓
UI Event
    ↓
Active Lab Module
    ↓
Update Lab State
    ↓
Recalculate / Re-render
    ↓
Visual Feedback
```

Each lab owns its own behavior.

---

# 5. Repository Structure

Recommended structure:

```text
tepebabeslab/
├── index.html
├── README.md
├── PRD.md
├── SYSTEM_DESIGN.md
├── AGENTS.md
├── css/
│   ├── variables.css
│   ├── main.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── data/
│   │   └── labs.js
│   ├── labs/
│   │   ├── mathLab.js
│   │   ├── physicsLab.js
│   │   ├── chemistryLab.js
│   │   ├── computationalLab.js
│   │   ├── aiLab.js
│   │   ├── sportsLab.js
│   │   ├── pancasilaLab.js
│   │   ├── indonesianLab.js
│   │   └── englishLab.js
│   ├── ui/
│   │   ├── library.js
│   │   ├── workspace.js
│   │   └── feedback.js
│   └── utils/
│       ├── canvas.js
│       ├── dragDrop.js
│       └── helpers.js
└── assets/
    ├── icons/
    └── images/
```

This structure may be simplified if necessary, but the following boundary must remain:

> Lab-specific interaction logic belongs in `js/labs/`, not in `app.js`.

---

# 6. File Responsibilities

## `index.html`

Responsibilities:

- semantic application shell;
- header/navigation;
- landing/library mount point;
- workspace mount point;
- help dialog if used;
- footer;
- script/module entrypoint.

Do not hardcode all simulation content directly in HTML.

---

## `js/app.js`

Responsibilities:

- application bootstrap;
- high-level navigation state;
- subject filtering;
- active lab selection;
- switching between library and workspace;
- mounting/unmounting active lab modules.

Do not place simulation formulas or large rendering logic here.

---

## `js/data/labs.js`

Single source of truth for lab catalogue metadata.

Recommended shape:

```js
{
  id: "projectile-motion",
  subject: "physics",
  subjectLabel: "Fisika",
  title: "Projectile Motion Lab",
  description: "...",
  interactionType: "canvas",
  accent: "physics"
}
```

Catalogue metadata belongs here.

Lab implementation logic does not.

---

## `js/labs/*.js`

Each file owns one lab.

Each lab module should expose a consistent public interface.

Preferred shape:

```js
export function createPhysicsLab(container) {
  // initialize lab
  // attach listeners
  // render initial state

  return {
    reset() {},
    destroy() {}
  };
}
```

Equivalent names are acceptable if consistent.

Every lab should support cleanup.

---

## `js/ui/library.js`

Responsibilities:

- render simulation catalogue;
- render subject filters;
- render featured lab;
- open selected lab through callbacks.

No lab calculations.

---

## `js/ui/workspace.js`

Responsibilities:

- render common lab workspace shell;
- title;
- objective;
- simulation region;
- controls region;
- observation/result region;
- challenge region;
- back/reset UI where shared.

It should not know individual simulation formulas.

---

## `js/ui/feedback.js`

Optional shared feedback rendering:

- success;
- retry;
- explanation;
- challenge completion;
- aria-live announcements.

Do not overengineer.

---

## `js/utils/canvas.js`

Optional shared helpers for:

- high-DPI canvas resizing;
- coordinate conversion;
- clearing canvas;
- resize handling.

Do not place lab-specific equations here.

---

## `js/utils/dragDrop.js`

Optional shared helpers for:

- draggable setup;
- drop-zone setup;
- shared drag state;
- touch/click fallback utilities.

Keep native HTML5 drag-and-drop as the main implementation where required.

---

# 7. Application State

A full global state library is unnecessary.

Recommended application state:

```js
const appState = {
  activeView: "library",
  activeSubject: "all",
  activeLabId: null
};
```

Individual labs own their own local state.

Example:

```js
const state = {
  angle: 45,
  velocity: 20,
  running: false
};
```

Do not centralize every lab's state into one global object unless needed.

---

# 8. Lab Lifecycle

When opening a lab:

```text
User clicks Start Lab
    ↓
Set activeLabId
    ↓
Render workspace shell
    ↓
Load/create lab module
    ↓
Lab initializes state
    ↓
Lab renders interaction
```

When leaving a lab:

```text
Back to Labs
    ↓
Call activeLab.destroy()
    ↓
Cancel animation if any
    ↓
Remove lab event listeners if needed
    ↓
Clear workspace
    ↓
Render library
```

This is important for canvas/animation labs.

---

# 9. Shared Lab Contract

Each lab should conceptually support:

```js
{
  reset(),
  destroy()
}
```

Optional:

```js
{
  checkChallenge(),
  nextScenario()
}
```

The exact API may vary slightly, but every lab must clean up after itself.

---

# 10. Canvas Strategy

Canvas is required for at least the Math and Physics experiences.

Recommended labs:

- Mathematics — graph rendering
- Physics — projectile animation

Use:

```js
const ctx = canvas.getContext("2d");
```

Canvas should:

- scale to its container;
- account for device pixel ratio where feasible;
- re-render on resize;
- avoid fixed-only dimensions.

Shared resize helper is encouraged.

---

# 11. Animation Strategy

Use:

```js
requestAnimationFrame()
```

for projectile motion or similar visual animation.

Rules:

- store the current animation frame ID;
- cancel it on reset;
- cancel it when leaving the lab;
- avoid multiple concurrent loops;
- do not run animation when nothing is moving.

Conceptual:

```js
let animationFrameId = null;

function animate() {
  ...
  animationFrameId = requestAnimationFrame(animate);
}

function destroy() {
  cancelAnimationFrame(animationFrameId);
}
```

---

# 12. Drag-and-Drop Strategy

Use native HTML5 drag-and-drop where possible.

Relevant labs:

- Chemistry
- Computational Thinking
- Bahasa Indonesia
- Bahasa Inggris

Base pattern:

```text
draggable item
    ↓ dragstart
dataTransfer stores item ID
    ↓
drop zone
    ↓ dragover
preventDefault()
    ↓
drop
update local state
    ↓
render feedback
```

For mobile/touch:

- provide click/tap selection fallback where practical;
- do not make completion impossible without desktop drag.

Example fallback:

```text
Tap item
→ item becomes selected
→ tap target/drop zone
→ item is placed
```

---

# 13. Mathematics Lab Design

State:

```js
{
  a: 1,
  b: 0,
  c: 0
}
```

Render process:

```text
Slider change
→ update coefficient
→ recompute function
→ redraw canvas
→ update equation
→ update vertex
→ check challenge
```

Equation:

```text
y = ax² + bx + c
```

Vertex calculation when `a !== 0`:

```text
xv = -b / (2a)
yv = f(xv)
```

If `a === 0`, treat graph as linear and do not fabricate a parabola vertex.

---

# 14. Physics Lab Design

State:

```js
{
  velocity,
  angleDeg,
  gravity,
  running,
  elapsedTime
}
```

Use simplified projectile motion without air resistance.

Convert angle:

```text
theta = angleDeg × π / 180
```

Useful equations:

```text
vx = v × cos(theta)
vy = v × sin(theta)

x(t) = vx × t
y(t) = vy × t - 0.5 × g × t²

flightTime = 2 × vy / g
range = vx × flightTime
maxHeight = vy² / (2g)
```

Only animate while `y >= 0`.

This is an educational idealized model.

---

# 15. Chemistry Lab Design

Use a simplified educational pH model.

Do not attempt full acid-base chemistry.

Recommended substance metadata:

```js
{
  id: "acid",
  label: "Acidic Solution",
  ph: 3,
  type: "acid"
}
```

Mixture may use a simplified weighted average for interaction purposes, with explicit educational disclaimer.

The goal is:

- recognize acidic / neutral / basic;
- observe indicator color changes;
- interact through dragging/mixing.

Do not claim laboratory-grade chemical accuracy.

---

# 16. Computational Thinking Lab Design

Use reorderable numeric items.

State:

```js
{
  values: [...],
  moves: 0
}
```

Validation:

```js
values.every((value, i, arr) =>
  i === 0 || arr[i - 1] <= value
)
```

Optional bubble-sort demonstration may use sequential highlighting.

Do not build a full algorithm visualizer framework.

---

# 17. AI Decision Lab Design

This is not a real machine-learning model.

Use a simple weighted formula.

Example:

```text
score =
  relevance × 0.4 +
  reliability × 0.4 +
  engagement × 0.2
```

The exact weights may be implementation constants.

Example classification:

```text
>= 70 → Recommend
40–69 → Review
< 40 → Do Not Recommend
```

The UI must label this as a simplified educational model.

Do not call external AI APIs.

---

# 18. Sports Lab Design

Use a simple educational effort model.

Possible inputs:

- duration;
- intensity;
- rest.

Example conceptual score:

```text
effort =
  durationFactor × intensityFactor
  adjusted by rest
```

The UI should emphasize comparison:

> What changes when intensity increases?

Do not make medical or health-risk claims.

---

# 19. Pancasila Lab Design

Use a static scenario collection.

Example structure:

```js
{
  prompt: "...",
  options: [
    {
      label: "...",
      feedback: "...",
      values: ["Kemanusiaan", "Keadilan sosial"]
    }
  ]
}
```

The goal is reflective educational feedback.

No scoring/ranking of political ideology.

---

# 20. Language Lab Design

## Bahasa Indonesia

State may include:

```js
{
  selectedFragments: {},
  currentQuestion: 0
}
```

Validate S-P-O-K structure against prepared answers.

## Bahasa Inggris

State may include:

```js
{
  words: [...],
  arrangement: [...]
}
```

Validate normalized sentence order.

Do not require NLP.

All questions/answers are local static data.

---

# 21. Common Interaction Pattern

Every lab should try to follow:

```text
Instruction
    ↓
Manipulate
    ↓
Immediate visual response
    ↓
Observation
    ↓
Challenge
    ↓
Feedback
    ↓
Reset / Retry
```

This consistent rhythm makes the product feel like one platform.

---

# 22. Shared UI Workspace

Recommended workspace structure:

```html
<section class="lab-workspace">
  <header class="lab-workspace__header">
    ...
  </header>

  <div class="lab-workspace__layout">
    <section class="lab-stage">
      ...
    </section>

    <aside class="lab-controls">
      ...
    </aside>
  </div>

  <section class="lab-observation">
    ...
  </section>

  <section class="lab-challenge">
    ...
  </section>
</section>
```

Avoid duplicating the entire workspace shell in every lab module.

---

# 23. Rendering Strategy

Use direct DOM rendering.

Allowed:

- `createElement`
- `textContent`
- controlled `innerHTML` for known static templates

Avoid repeatedly replacing the entire document.

Only re-render the region that changes.

Canvas labs should redraw canvas instead of rebuilding DOM.

---

# 24. CSS Architecture

## `variables.css`

Contains:

- colors;
- subject accents;
- spacing;
- typography;
- radii;
- shadows;
- motion timing;
- layout sizes.

## `main.css`

Contains:

- reset/base styles;
- body;
- typography;
- main containers;
- navigation;
- global accessibility styles.

## `components.css`

Contains:

- lab cards;
- filters;
- workspace;
- control groups;
- sliders;
- drop zones;
- result blocks;
- challenge blocks;
- dialogs;
- feedback.

## `animations.css`

Contains:

- subtle entry transitions;
- success/error feedback;
- simulation-specific CSS animations if needed.

## `responsive.css`

Contains:

- mobile/tablet/desktop adjustments;
- workspace stacking;
- catalogue column changes;
- touch-friendly layout.

---

# 25. Visual System

Recommended direction:

> Modern academic playground.

Use subject accents consistently.

Example implementation-ready palette direction:

```text
Background       warm off-white / soft neutral
Primary text     near-black navy
Muted text       slate
Surface          white
Border           soft gray
Math             indigo
Physics          blue
Chemistry        teal
Computational    violet
AI               cyan
Sports           orange
Pancasila        red
Indonesian       amber
English          green
```

Exact hex values are UI implementation decisions.

Avoid excessive saturation.

---

# 26. Responsive Rules

Recommended breakpoints:

```text
< 640px        compact
640–959px      medium
>= 960px       wide
```

### Wide

```text
simulation stage  ≈ 65%
controls          ≈ 35%
```

### Compact

```text
simulation
controls
results
challenge
```

Canvas must remain legible.

No horizontal page scrolling.

---

# 27. Accessibility

Required baseline:

- proper labels for controls;
- visible `:focus-visible`;
- keyboard-accessible buttons;
- semantic headings;
- `aria-live="polite"` for relevant feedback;
- drag/drop fallback where feasible;
- readable contrast;
- no color-only correctness indication.

Canvas must have surrounding textual context.

Do not rely on canvas as the only explanation.

---

# 28. Dialog / Help

If implemented, use native:

```html
<dialog>
```

Recommended content:

- lab objective;
- interaction instructions;
- simplified-model disclaimer if needed.

Avoid custom modal frameworks.

---

# 29. Error Isolation

Each lab must fail independently.

A JavaScript issue in one lab should not intentionally affect another.

Wrap high-level lab initialization defensively where useful.

When switching labs:

- clear previous lab;
- cancel animations;
- remove temporary handlers;
- initialize new lab.

---

# 30. Data Strategy

All instructional content is local.

Use static JavaScript arrays/objects.

No JSON fetch is necessary unless intentionally preferred.

Example:

```js
export const pancasilaScenarios = [...]
export const englishQuestions = [...]
```

For this project, simplicity is preferred over external data files.

---

# 31. Browser Persistence

`localStorage` is optional.

If used, restrict it to nonessential preferences such as:

- completed lab IDs;
- last selected subject.

Do not make the core application dependent on storage.

A storage failure should not prevent lab usage.

---

# 32. Performance Rules

- no unnecessary dependencies;
- no large runtime assets;
- only one active animation loop per active lab;
- cancel inactive animations;
- avoid constant global timers;
- canvas redraw should occur only when needed;
- resize listeners should be lightweight.

---

# 33. Security / Safety

Since the project is frontend-only and uses no external API:

- no secrets/API keys should exist;
- no arbitrary HTML from user input should be inserted;
- use `textContent` for user-controlled text;
- avoid `eval`;
- do not dynamically execute code entered by users.

The Computational Thinking and AI labs simulate logic; they do not execute arbitrary code.

---

# 34. Implementation Order

To maximize completion probability:

### Phase 1 — Skeleton

Build:

- repository structure;
- semantic `index.html`;
- CSS token/base files;
- lab catalogue data.

### Phase 2 — App Shell

Build:

- library page;
- subject filtering;
- workspace navigation;
- active lab lifecycle.

### Phase 3 — Core Interactive Labs

Implement first:

1. Physics
2. Mathematics
3. Chemistry

These demonstrate the strongest HTML5/JavaScript interaction.

### Phase 4 — Remaining Labs

Implement:

4. Computational Thinking
5. Digital & AI
6. Sports
7. Pancasila
8. Bahasa Indonesia
9. English

### Phase 5 — Polish

Improve:

- responsive behavior;
- feedback;
- animations;
- accessibility;
- visual consistency.

### Phase 6 — README / Submission

Document:

- description;
- features;
- HTML5 usage;
- JavaScript interactions;
- run instructions.

---

# 35. Hard Architectural Rules

These rules must remain true:

**SD-01** — The project remains frontend-only.  
**SD-02** — No frontend framework is required.  
**SD-03** — Lab-specific logic stays in lab modules.  
**SD-04** — `app.js` does not become a giant simulation file.  
**SD-05** — At least one meaningful canvas simulation exists.  
**SD-06** — At least one meaningful drag-and-drop lab exists.  
**SD-07** — Labs produce interactive feedback, not static content.  
**SD-08** — Canvas animations are cleaned up when inactive.  
**SD-09** — Each lab supports reset/retry.  
**SD-10** — All nine subject areas remain visible.  
**SD-11** — No backend/API dependency is introduced.  
**SD-12** — Core functionality works without localStorage.  
**SD-13** — UI remains responsive.  
**SD-14** — Native browser features are preferred over dependencies.  
**SD-15** — Simplified educational models must not be presented as scientifically/technically exact where they are not.

---

# 36. Definition of Technical Completion

The technical implementation is ready for submission when:

- `index.html` loads successfully through a local HTTP server;
- all nine labs can be opened;
- each lab contains meaningful interaction;
- physics canvas animates correctly;
- mathematics graph updates correctly;
- drag-and-drop interaction works;
- reset works;
- navigation between labs works repeatedly;
- inactive canvas loops do not continue unnecessarily;
- mobile layout remains usable;
- no backend is required;
- no obvious placeholder sections remain;
- HTML/CSS/JS responsibilities remain reasonably separated.

---

# 37. Final Engineering Principle

> **Build the smallest architecture that lets nine interactive labs feel like one coherent platform.**

If an abstraction does not help finish, isolate, reuse, or understand the labs, do not add it.
