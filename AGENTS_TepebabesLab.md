# AGENTS — TepebabesLab

**Project:** TepebabesLab  
**Purpose:** Guardrails for Codex / coding agents working on this repository  
**Stack:** HTML5, CSS3, Vanilla JavaScript (ES Modules)  
**Mode:** Frontend-only virtual lab

---

# 1. Required Reading Order

Before making changes, read:

1. `PRD.md`
2. `SYSTEM_DESIGN.md`
3. `AGENTS.md`
4. `README.md` only when relevant

Treat these files as the repository source of truth.

---

# 2. Source-of-Truth Precedence

When instructions conflict, use this order:

1. explicit current user instruction;
2. `PRD.md`;
3. `SYSTEM_DESIGN.md`;
4. `AGENTS.md`;
5. existing implementation;
6. comments / README.

Do not silently invent missing product decisions.

---

# 3. Primary Goal

Build TepebabesLab as a polished, interactive **virtual laboratory platform**, not as a conventional LMS.

The experience must emphasize:

- experimentation;
- manipulation;
- simulation;
- live feedback;
- learning by doing.

Every lab must contain meaningful interaction.

---

# 4. Scope Lock

The supported subject areas are:

- Matematika
- Fisika
- Kimia
- Berpikir Komputasional
- Literasi Digital dan AI
- Olahraga
- Pancasila
- Bahasa Indonesia
- Bahasa Inggris

Do not add unrelated subjects or features unless explicitly requested.

Do not add:

- authentication;
- backend;
- database;
- admin dashboard;
- course management;
- cloud save;
- chat;
- AI API integration;
- external data APIs;
- social features;
- multiplayer;
- leaderboard;
- certification;
- complex routing.

---

# 5. Test Execution Policy

Codex must **not run automated tests, test suites, live browser automation, or broad validation commands unless the user explicitly asks**.

Codex may:

- create test files;
- update test files;
- perform lightweight code sanity inspection.

Default behavior:

> Implement code only. Do not execute tests unless explicitly requested.

---

# 6. Implementation Priority

When time is limited, prioritize in this order:

1. working lab interactions;
2. all nine subjects represented;
3. HTML5 feature usage;
4. JavaScript interactivity;
5. responsive layout;
6. visual polish;
7. optional enhancements.

Do not spend excessive time on abstractions before P0 behavior works.

---

# 7. Repository Boundary Rules

## `index.html`

Use for:

- semantic shell;
- app mount regions;
- header/navigation;
- shared dialog;
- footer.

Do not put all lab markup and behavior directly into `index.html`.

## `js/app.js`

Use for:

- bootstrap;
- active view;
- subject filtering;
- lab selection;
- mounting/unmounting.

Do not place lab formulas or large simulation logic here.

## `js/data/`

Use for:

- lab catalogue metadata;
- static questions/scenarios when shared.

## `js/labs/`

Use for:

- lab-specific state;
- lab-specific calculations;
- lab-specific event handling;
- lab-specific rendering.

## `js/ui/`

Use for:

- library rendering;
- workspace rendering;
- shared feedback/display behavior.

## `js/utils/`

Use only for truly reusable helpers.

Avoid premature abstractions.

---

# 8. Lab Module Rules

Each lab should be isolated.

Preferred pattern:

```js
export function createXLab(container) {
  // init

  return {
    reset() {},
    destroy() {}
  };
}
```

Every lab should support:

- initialization;
- interaction;
- reset/retry;
- cleanup.

If the lab uses animation:

- track the frame ID;
- cancel animation on reset;
- cancel animation on destroy.

If the lab installs global/window listeners:

- remove them on destroy.

---

# 9. No Giant Files

Do not collapse the entire app into:

- one massive `app.js`;
- one giant CSS file;
- one monolithic lab controller.

If a file becomes difficult to understand because it contains unrelated responsibilities, split by responsibility.

Do not over-fragment trivial code into dozens of tiny files.

---

# 10. HTML5 Usage Rules

The coursework explicitly values HTML5 features.

Use them meaningfully.

Preferred examples:

- `<canvas>` for graph/simulation;
- native drag-and-drop;
- `<dialog>`;
- `<details>` / `<summary>`;
- `<progress>` or `<meter>`;
- `input[type="range"]`;
- semantic `header`, `main`, `section`, `article`, `aside`, `nav`, `footer`;
- `<output>` for live calculated values.

Do not add HTML5 elements purely to claim rubric coverage if they serve no purpose.

---

# 11. Canvas Rules

Canvas must be used for meaningful visualization, especially:

- Math Function Playground;
- Physics Projectile Motion.

Canvas implementation should:

- resize reasonably with the container;
- remain sharp where feasible;
- redraw only when necessary;
- use `requestAnimationFrame()` for animation;
- avoid endless loops when inactive.

Canvas must not be the only source of information; provide surrounding text/results.

---

# 12. Drag-and-Drop Rules

Use native HTML5 drag-and-drop in relevant labs:

- Chemistry;
- Computational Thinking;
- Bahasa Indonesia;
- Bahasa Inggris.

Requirements:

- visual draggable state;
- clear drop zones;
- valid/invalid feedback;
- state updated after drop;
- reset support.

Where practical, provide tap/click fallback for touch users.

Do not make a mobile user completely unable to use a lab.

---

# 13. Scientific / Educational Model Honesty

Some labs intentionally use simplified educational models.

Never present simplified calculations as scientifically exact.

Examples:

- pH Mixer is simplified;
- AI Decision Lab is not a real ML model;
- Sports effort is not medical guidance;
- projectile simulation ignores air resistance.

Where appropriate, include short contextual wording such as:

> Simplified educational model.

Do not clutter the interface with long disclaimers.

---

# 14. No Arbitrary Code Execution

Do not use:

- `eval`;
- `new Function`;
- arbitrary user-entered JavaScript execution.

Computational Thinking must simulate algorithmic concepts without executing user code.

---

# 15. State Rules

Use simple application state.

Application-level state should be limited to things such as:

- current view;
- active subject;
- active lab.

Lab-specific state stays inside the lab module.

Do not introduce Redux, Zustand, MobX, or other state libraries.

---

# 16. Navigation Rules

Required navigation behavior:

- library → lab;
- lab → library;
- subject filtering;
- optional help.

Switching labs must:

1. destroy old lab;
2. clear temporary state/listeners;
3. render the next lab.

Do not reload the browser page unnecessarily.

---

# 17. Feedback Rules

Feedback should be:

- immediate;
- short;
- educational;
- tied to the user's action.

Prefer:

> Increasing velocity increased the projectile range.

over:

> Correct!

Use:

- visible text;
- state styling;
- `aria-live` where useful.

Do not rely on color alone.

---

# 18. UI Design Philosophy

The UI direction is:

> **Modern academic playground + simulation platform**

It should feel:

- energetic;
- experimental;
- academic;
- polished;
- approachable;
- hands-on.

It must NOT feel like:

- generic SaaS dashboard;
- admin panel;
- LMS course table;
- fintech dashboard;
- AI-generated card grid;
- marketing landing page.

The simulation itself should be the visual centerpiece.

---

# 19. Anti-AI-Slop Rules

Explicitly avoid:

- excessive gradients;
- excessive glassmorphism;
- card-inside-card layouts;
- making every section a rounded rectangle;
- pill overload;
- random neon colors;
- giant empty hero spacing;
- generic “stats dashboard” layouts;
- duplicated information;
- decorative charts without learning value;
- random icons with mixed styles;
- huge marketing CTA blocks;
- excessive drop shadows;
- floating decorative blobs;
- overly centered layouts;
- unnecessary animations;
- adding filler sections just to make the page longer.

If an element has no learning, information, or interaction purpose, remove it.

---

# 20. Visual Hierarchy

## Landing Page

Priority:

1. TepebabesLab identity;
2. featured / highlighted experiment;
3. subject filter;
4. simulation catalogue.

## Lab Workspace

Priority:

1. lab title and objective;
2. simulation area;
3. controls;
4. live observations/results;
5. challenge;
6. explanatory note.

Do not give every element equal visual weight.

---

# 21. Layout Rules

Wide lab layout:

```text
Simulation Stage     Controls / Results
Simulation Stage     Controls / Results
```

Target proportion:

- simulation ≈ 60–70%;
- controls/results ≈ 30–40%.

Compact layout:

```text
Simulation
Controls
Results
Challenge
```

Avoid horizontal scrolling.

Do not make the simulator tiny while controls dominate the screen.

---

# 22. Spacing Rules

Use consistent spacing tokens.

Prefer a simple scale such as:

```text
4
8
12
16
24
32
48
64
```

Do not scatter arbitrary values everywhere.

Avoid excessive vertical dead space.

Whitespace should clarify grouping, not push useful content below the fold.

---

# 23. Typography Rules

Use a small, consistent type scale.

Recommended hierarchy:

- display/title;
- section heading;
- lab heading;
- body;
- caption/meta.

Do not use too many font sizes.

Avoid excessive all-caps.

Use emphasis through hierarchy, not decorative fonts everywhere.

If an external web font is added, keep it lightweight and optional.

---

# 24. Subject Color System

Each subject may use a stable accent.

Suggested mapping:

- Mathematics → indigo
- Physics → blue
- Chemistry → teal
- Computational Thinking → violet
- Digital & AI → cyan
- Sports → orange
- Pancasila → red
- Bahasa Indonesia → amber
- English → green

Rules:

- use accents consistently;
- keep base surface/background neutral;
- do not recolor the entire interface for every subject;
- do not encode correctness using color only.

---

# 25. Surface / Card Rules

Not everything needs:

- background;
- border;
- radius;
- shadow.

Use cards intentionally for:

- lab catalogue entries;
- compact result blocks;
- challenge blocks where useful.

Prefer whitespace and alignment before adding another container.

Avoid nested cards.

---

# 26. Component Styling Rules

Interactive controls must have visible:

- default;
- hover;
- active;
- focus-visible;
- disabled states.

Buttons should have clear hierarchy:

- primary action: launch/check/start;
- secondary action: reset/back;
- tertiary: help/details.

Do not make every action look primary.

---

# 27. Motion Rules

Motion should explain:

- launch;
- movement;
- state change;
- completion;
- selection.

Motion should not exist merely for decoration.

Allowed:

- subtle fades;
- small translations;
- projectile animation;
- graph redraw;
- drop feedback;
- success feedback;
- controlled transitions.

Avoid:

- constant floating;
- bouncing UI;
- looping decorative motion;
- parallax;
- excessive spring effects.

Typical UI transitions:

```text
120–250ms
```

Simulation animation may be longer as required by the model.

---

# 28. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Reduce or disable:

- decorative transitions;
- nonessential movement;
- looping effects.

Core simulation results must remain understandable without fancy motion.

---

# 29. Responsive Rules

Recommended breakpoints:

```text
< 640px      compact
640–959px    medium
>= 960px     wide
```

Mobile:

- stack simulation and controls;
- maintain readable canvas;
- use touch-friendly controls;
- no horizontal page overflow;
- do not compress controls into tiny rows.

Desktop:

- give simulation area visual dominance;
- keep controls close enough to manipulate while observing results.

---

# 30. Accessibility Rules

Required baseline:

- semantic HTML;
- logical heading order;
- visible `:focus-visible`;
- keyboard-operable buttons;
- labels for sliders;
- appropriate touch target size;
- readable contrast;
- live feedback where useful;
- no color-only correct/error states;
- canvas paired with textual output.

For drag/drop:

- add click/tap fallback where practical.

Do not globally disable outlines.

---

# 31. Library Page Rules

The library should not look like a basic LMS course grid.

Each lab card should quickly communicate:

- subject;
- lab title;
- what the user manipulates;
- interaction type;
- start action.

Avoid long paragraphs.

Subject filtering should feel instant.

No page reload.

---

# 32. Workspace Rules

The workspace should feel like a lab bench.

Include:

- objective;
- experiment stage;
- controls;
- observation;
- challenge;
- reset/retry.

The user should always know:

1. what to change;
2. what happened;
3. what to learn from it.

---

# 33. Per-Lab Interaction Rules

## Mathematics

Must use live graph rendering.

Do not update only after a submit button if real-time updating is feasible.

## Physics

Must visibly animate projectile motion.

Do not reduce it to formula output only.

## Chemistry

Must include visible mixing/manipulation.

Do not reduce it to selecting a value from a dropdown only.

## Computational Thinking

Must require ordering/manipulation.

## AI

Must visibly demonstrate how changing inputs affects result.

Clearly label as simplified model.

## Sports

Must make parameter comparison visible.

No medical claims.

## Pancasila

Must use scenario → decision → reflective explanation.

Avoid partisan framing.

## Bahasa Indonesia

Must involve sentence structure manipulation.

## English

Must involve word/sentence construction.

---

# 34. Loading

No external API is required, so loading states should be minimal.

Do not invent skeleton screens for local static content unless genuinely needed.

If a lab initializes canvas, a brief transition is enough.

---

# 35. Error Handling

Do not let a broken lab crash the entire platform.

Where practical:

```js
try {
  activeLab = createLab(...)
} catch (error) {
  // show concise lab-specific failure state
}
```

Do not expose stack traces in user-facing UI.

---

# 36. Data Rules

All educational datasets/questions/scenarios should be local.

Do not fetch remote JSON just for convenience.

Do not introduce API dependencies.

Static JavaScript objects are acceptable.

---

# 37. CSS Architecture

Keep:

`variables.css`
→ tokens

`main.css`
→ global/base/layout

`components.css`
→ components/labs/shared UI

`animations.css`
→ animations/transitions

`responsive.css`
→ breakpoint adjustments

Do not dump all styles into one file.

Do not use `!important` unless absolutely necessary.

---

# 38. JavaScript Style

Use:

- ES Modules;
- `const` / `let`;
- descriptive names;
- small functions;
- pure calculations where practical;
- event delegation where useful;
- JSDoc for non-obvious public helpers.

Avoid:

- unnecessary classes;
- excessive abstraction;
- callback nesting;
- duplicate calculations;
- global mutable variables.

---

# 39. DOM Safety

Prefer:

- `textContent`;
- `createElement`;
- controlled templates.

Do not insert arbitrary user text via unsafe `innerHTML`.

Do not use `eval`.

---

# 40. No New Dependencies by Default

Do not add:

- React;
- Vue;
- Svelte;
- Bootstrap;
- Tailwind;
- GSAP;
- chart libraries;
- drag libraries;
- physics engines;
- icon libraries.

Use browser-native APIs.

If a dependency seems necessary, stop and reconsider whether native browser features can accomplish the same goal.

---

# 41. Implementation Phases

Use this order unless the user explicitly changes it.

## Phase 1 — Skeleton + Library

- folder structure;
- semantic shell;
- catalogue;
- subject filtering;
- navigation.

## Phase 2 — Core Labs

- Mathematics;
- Physics;
- Chemistry.

## Phase 3 — Remaining Labs

- Computational Thinking;
- AI;
- Sports;
- Pancasila;
- Bahasa Indonesia;
- English.

## Phase 4 — Polish

- responsive;
- visual consistency;
- accessibility;
- feedback;
- motion.

## Phase 5 — README / Submission

- document project;
- describe HTML5 usage;
- describe key interactions;
- run instructions.

---

# 42. Change Scope Discipline

For every task:

1. identify the requested phase;
2. modify only relevant files;
3. do not refactor unrelated code;
4. do not add future features early;
5. keep the implementation usable after each phase.

Do not turn a small request into a repository-wide rewrite.

---

# 43. Lightweight Sanity Check

Do not run tests unless requested.

Before finishing a task, inspect:

- imports/exports;
- obvious syntax issues;
- module boundaries;
- no accidental backend/API;
- no duplicate lab IDs;
- no infinite animation loop;
- no missing cleanup for active lab;
- no placeholder-only lab in completed scope.

---

# 44. Definition of Done for a Lab

A lab is considered implemented when:

- it opens correctly;
- it has a clear objective;
- the user can manipulate something;
- JavaScript changes the result;
- feedback is visible;
- reset/retry works;
- it does not crash when reopened;
- layout works on desktop and compact screens;
- interaction feels like a lab, not static content.

---

# 45. Definition of Done for UI

The UI is considered complete when:

- all nine labs are discoverable;
- subject filters work;
- workspace is visually consistent;
- simulation stage is visually dominant;
- responsive behavior is usable;
- keyboard focus is visible;
- no generic dashboard appearance dominates;
- no excessive card/pill/glassmorphism styling exists;
- subject accents are consistent;
- content remains readable.

---

# 46. Forbidden Shortcuts

Do not:

- make six labs static just to claim coverage;
- duplicate the same slider interaction nine times with different labels;
- fake canvas output with static images;
- fake drag-and-drop with noninteractive visuals;
- hardcode only one successful state;
- display random results;
- use arbitrary mathematical/scientific outputs;
- let one lab's event listeners affect another;
- skip reset behavior;
- make mobile drag/drop impossible without fallback where practical;
- hide unfinished areas behind "Coming Soon" if they are P0;
- replace real interaction with long explanatory text.

---

# 47. Final Agent Checklist

Before declaring an implementation task complete, confirm:

- [ ] Current user scope was followed.
- [ ] `PRD.md` requirements were respected.
- [ ] `SYSTEM_DESIGN.md` boundaries were respected.
- [ ] No unnecessary feature was added.
- [ ] No backend/API dependency was introduced.
- [ ] Lab-specific logic is isolated.
- [ ] At least one meaningful interaction exists in the changed lab.
- [ ] Reset/retry behavior is present where relevant.
- [ ] Canvas/animation cleanup is handled where relevant.
- [ ] Responsive behavior was preserved.
- [ ] Accessibility basics were preserved.
- [ ] UI does not drift into generic SaaS/dashboard styling.
- [ ] No tests were executed unless explicitly requested.

---

# 48. Final Principle

> **Prefer a working, polished, interactive experiment over a larger but shallow feature set.**

TepebabesLab should always feel like a place to **try something**, **observe something**, and **learn something**.
