# PRD — TepebabesLab

**Product Name:** TepebabesLab  
**Tagline:** *Explore. Experiment. Understand.*  
**Product Type:** Frontend-only interactive virtual laboratory  
**Target Context:** TPB ITB learning topics  
**Primary Stack:** HTML5, CSS3, Vanilla JavaScript  
**Status:** Implementation baseline for coursework submission

---

## 1. Product Overview

TepebabesLab is an interactive web-based virtual laboratory for TPB ITB subjects. The product is designed as a **simulation library and experimentation workspace**, not as a conventional LMS.

Users can explore multiple TPB subject areas and interact with mini-labs that emphasize learning by doing through simulation, manipulation, drag-and-drop, dynamic visual feedback, and immediate result interpretation.

The experience is inspired by the interaction style of virtual-lab platforms such as PhET, Labster, and LabXchange, while remaining fully client-side and feasible to implement using HTML, CSS, and JavaScript only.

---

## 2. Coursework Alignment

The product must clearly demonstrate the three grading dimensions of the assignment.

### 2.1 HTML5

The implementation should use HTML5 features intentionally, including where relevant:

- semantic elements such as `header`, `main`, `section`, `article`, `nav`, `aside`, and `footer`;
- `<canvas>` for simulations and dynamic graphics;
- native drag-and-drop interactions;
- form controls such as `input[type="range"]`, buttons, selects, checkboxes, and radio inputs;
- `<progress>` and/or `<meter>` where appropriate;
- `<dialog>` for instructions/help;
- `<details>` and `<summary>` for compact explanations;
- accessible labels and keyboard-operable controls.

### 2.2 CSS

The interface must demonstrate:

- a distinctive visual identity;
- consistent typography and color system;
- responsive layouts;
- subject-based visual differentiation;
- clear state styling;
- hover/focus/active feedback;
- animation and transition where useful;
- visually polished simulation workspaces;
- no dependency on CSS frameworks.

### 2.3 JavaScript

JavaScript must be central to the user experience through:

- dynamic simulation state;
- real-time parameter updates;
- canvas rendering;
- drag-and-drop behavior;
- scoring and feedback;
- reset/replay behavior;
- state transitions;
- challenge completion logic;
- interactive filters/navigation;
- deterministic calculations where applicable.

---

## 3. Product Vision

> **TepebabesLab makes TPB concepts explorable instead of merely readable.**

The product should feel like a small simulation platform where each subject presents a hands-on experience.

The main product principle is:

> **Do first, explain second.**

Users should manipulate parameters, objects, or choices and observe what changes.

---

## 4. Target Users

Primary users:

- TPB ITB students;
- first-year university students;
- students reviewing basic concepts;
- learners who benefit from interactive visualization.

Secondary users:

- instructors demonstrating concepts;
- peers reviewing material collaboratively.

---

## 5. Core User Flow

```text
Landing Page
    ↓
Browse / Filter TPB Labs
    ↓
Choose a Subject
    ↓
Open Simulation Workspace
    ↓
Manipulate / Experiment
    ↓
Observe Live Result
    ↓
Complete Mini Challenge
    ↓
Reset / Try Again / Return to Library
```

The interface must not require login, account creation, or backend persistence.

---

## 6. Information Architecture

### 6.1 Landing / Simulation Library

The homepage acts as the main simulation catalogue.

It should include:

- TepebabesLab branding;
- short product description;
- subject filters;
- featured simulations;
- all available labs;
- short description per lab;
- difficulty or interaction-type hint if useful;
- button to start each lab.

### 6.2 Simulation Workspace

Each selected lab opens in a dedicated interactive workspace.

Common layout:

- lab title;
- learning objective;
- simulation area;
- control panel;
- live result/observation;
- challenge;
- reset/retry control;
- short explanation;
- return-to-library control.

The workspace may be shown using a single-page application style without a full routing framework.

---

## 7. Subject Coverage

TepebabesLab should represent the following TPB subject areas:

1. Matematika
2. Fisika
3. Kimia
4. Berpikir Komputasional
5. Literasi Digital dan AI
6. Olahraga
7. Pancasila
8. Bahasa Indonesia
9. Bahasa Inggris

All nine subjects must appear in the simulation library.

---

# 8. Virtual Lab Modules

## 8.1 Matematika — Function Playground

### Purpose

Help users understand how parameter changes affect a quadratic function.

### Core Interaction

Users manipulate:

- `a`
- `b`
- `c`

for:

```text
y = ax² + bx + c
```

### Required Behavior

- use sliders or numeric controls;
- render the graph dynamically on `<canvas>`;
- update graph in real time;
- show the current equation;
- show vertex information where feasible;
- include reset button;
- include one short challenge.

### Example Challenge

> Adjust the parameters so the parabola opens downward and its vertex is above the x-axis.

### HTML5 Showcase

- canvas;
- range inputs;
- output elements.

---

## 8.2 Fisika — Projectile Motion Lab

### Purpose

Help users observe how launch speed and angle affect projectile motion.

### Controls

- launch velocity;
- launch angle;
- gravity preset or default Earth gravity.

### Required Behavior

- draw trajectory on `<canvas>`;
- animate projectile launch;
- show:
  - horizontal range;
  - maximum height;
  - approximate flight time;
- provide launch and reset controls;
- include target-based challenge.

### Example Challenge

> Try to land the projectile inside the target zone.

### HTML5 Showcase

- canvas;
- animation loop;
- range inputs;
- dynamic output.

---

## 8.3 Kimia — pH Mixer Lab

### Purpose

Teach basic acid/base intuition through interactive mixing.

### Core Interaction

Users drag or select predefined substances into a virtual beaker.

Possible substances:

- acidic solution;
- neutral water;
- basic solution.

### Required Behavior

- support drag-and-drop where feasible;
- show beaker liquid;
- update approximate pH;
- change indicator color;
- classify result:
  - acidic;
  - neutral;
  - basic;
- reset mixture;
- provide one challenge.

### Important Scope Rule

This is an educational simplified model, not a chemically rigorous laboratory simulator.

### HTML5 Showcase

- drag-and-drop;
- custom data attributes;
- visual meter.

---

## 8.4 Berpikir Komputasional — Sorting Lab

### Purpose

Teach decomposition, ordering, and simple algorithmic reasoning.

### Core Interaction

Users arrange a list of values into the correct order.

### Required Behavior

- draggable number blocks;
- detect correct/incorrect order;
- count attempts or moves;
- allow reset;
- provide visual success feedback.

### Optional Enhancement

Add a "show algorithm" mode that demonstrates a simple bubble-sort step sequence.

### HTML5 Showcase

- drag-and-drop;
- ordered lists;
- dynamic feedback.

---

## 8.5 Literasi Digital & AI — AI Decision Lab

### Purpose

Demonstrate that AI output depends on input features and weighting.

### Core Interaction

Provide a simplified decision model with several adjustable factors.

Example fictional model:

"Should this content be recommended?"

Possible controls:

- relevance;
- engagement;
- reliability.

### Required Behavior

- sliders affect weighted score;
- output updates live;
- classify output:
  - Recommend;
  - Review;
  - Do Not Recommend;
- show that changing weights changes decisions;
- include explanation that this is a simplified educational model.

### Important Scope Rule

Do not present the simulation as a real AI model or claim real-world predictive accuracy.

---

## 8.6 Olahraga — Pacing Lab

### Purpose

Help users understand pacing and exercise intensity.

### Core Interaction

Users adjust:

- duration;
- pace/intensity;
- rest interval.

### Required Behavior

- calculate a simple relative effort score;
- show effort zone;
- visualize session composition;
- compare easier vs harder configurations;
- include reset.

### Important Scope Rule

This is an educational simulation and must not present itself as medical or physiological diagnosis.

---

## 8.7 Pancasila — Civic Decision Lab

### Purpose

Encourage reflection on values and decision-making in simple social scenarios.

### Core Interaction

Users receive a short scenario and select among several responses.

### Required Behavior

- show a scenario;
- provide multiple response options;
- after selection, reveal relevant Pancasila value(s);
- provide explanatory feedback;
- allow retry or next scenario.

### Important Scope Rule

The experience should remain educational and reflective, not partisan or political persuasion.

---

## 8.8 Bahasa Indonesia — Sentence Structure Lab

### Purpose

Help users practice identifying and arranging sentence elements.

### Core Interaction

Drag sentence fragments into positions such as:

- S
- P
- O
- K

### Required Behavior

- native drag-and-drop;
- validate arrangement;
- visually distinguish correct/incorrect placement;
- allow retry;
- include at least several sentence examples.

---

## 8.9 Bahasa Inggris — Sentence Builder Lab

### Purpose

Help users practice English sentence construction.

### Core Interaction

Arrange draggable words into a correct sentence.

### Required Behavior

- drag-and-drop word tokens;
- validate sentence order;
- provide immediate feedback;
- allow retry;
- include multiple sentence prompts.

### Optional Enhancement

Show short grammar hint after unsuccessful attempts.

---

# 9. Feature Priorities

## P0 — Must Have

These features are required for submission:

- TepebabesLab landing page;
- all nine subject categories visible;
- all nine lab entries visible;
- each lab opens into an interactive workspace;
- at least three labs use clearly distinct interaction types;
- canvas-based simulation;
- drag-and-drop interaction;
- live JavaScript state/result updates;
- reset/retry behavior;
- responsive layout;
- semantic HTML;
- polished CSS;
- useful interaction feedback;
- no backend dependency.

## P1 — Strongly Preferred

Implement if time allows:

- challenge objective per lab;
- score/move count;
- compact help dialog;
- subject filters;
- progress indicator within a challenge;
- animated state transitions;
- contextual explanations;
- lab-completion feedback;
- keyboard-friendly interactions.

## P2 — Optional

Only if P0 and P1 are stable:

- persistent progress in `localStorage`;
- sound effects toggle;
- lab favorites;
- badges;
- advanced animation;
- additional scenarios/problems.

P2 features must never delay core functionality.

---

# 10. Navigation

Required navigation:

- Home / Lab Library
- Subject filter
- Open Lab
- Back to Labs

Optional:

- About / How to Use
- Help dialog

Do not implement:

- authentication;
- profile page;
- account settings;
- admin interface.

---

# 11. UI / Visual Direction

## 11.1 Design Character

TepebabesLab should feel:

- experimental;
- energetic;
- academic;
- playful without appearing childish;
- modern;
- approachable;
- hands-on.

The interface should resemble a **simulation platform**, not a generic admin dashboard.

## 11.2 Visual Hierarchy

Homepage hierarchy:

1. TepebabesLab identity;
2. featured experiment;
3. subject filters;
4. simulation catalogue.

Lab hierarchy:

1. experiment title;
2. active simulation;
3. controls;
4. live observation/results;
5. challenge;
6. explanation.

## 11.3 Subject Color Coding

Each subject may have a distinct accent color.

Example design decision:

- Mathematics — indigo
- Physics — blue
- Chemistry — teal
- Computational Thinking — purple
- Digital & AI — cyan
- Sports — orange
- Pancasila — red
- Bahasa Indonesia — amber
- English — green

Exact colors are a UI implementation decision, not a product requirement.

## 11.4 Anti-Generic UI Rules

Avoid:

- excessive glassmorphism;
- card-within-card layouts;
- every section being a rounded rectangle;
- generic SaaS KPI dashboards;
- huge marketing hero sections;
- excessive gradients;
- excessive pill badges;
- decorative charts with no learning purpose.

Simulation area should be the visual centerpiece.

---

# 12. Responsive Behavior

The web must remain usable on:

- desktop;
- tablet;
- mobile.

### Wide Layout

Preferred simulation workspace:

```text
Simulation Area      Controls
Simulation Area      Results
```

### Compact Layout

Stack into:

```text
Simulation
Controls
Results
Challenge
```

Avoid horizontal overflow.

Drag-and-drop interactions should have a click/tap fallback where practical.

---

# 13. Interaction States

Every lab should consider:

- initial state;
- active interaction;
- correct result;
- incorrect result;
- reset;
- completed challenge.

No lab should appear static after opening.

---

# 14. Feedback Principles

Feedback must be immediate and useful.

Good:

> "Great — increasing the angle increased the projectile height."

Bad:

> "Correct!"

Prefer explanatory feedback when feasible.

Do not overload users with long paragraphs during active experimentation.

---

# 15. Application State

A lightweight in-browser state is sufficient.

Recommended conceptual shape:

```js
{
  activeLabId: null,
  activeSubject: "all",
  labState: {},
  challengeState: {}
}
```

Each lab may own its own small state object.

No global state-management library is required.

---

# 16. Technical Constraints

Required:

- frontend only;
- HTML;
- CSS;
- JavaScript;
- browser-native APIs;
- no backend;
- no database required.

Preferred:

- Vanilla JavaScript;
- ES Modules;
- no build step;
- no external framework;
- no npm requirement.

External static assets are allowed if properly credited, but core interaction must work locally.

---

# 17. Suggested Repository Structure

```text
tepebabeslab/
├── index.html
├── README.md
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
│       ├── dragDrop.js
│       ├── canvas.js
│       └── helpers.js
└── assets/
    ├── icons/
    └── images/
```

This structure may be simplified if needed, but JavaScript should not be collapsed into one giant file.

---

# 18. Accessibility

Minimum expectations:

- semantic structure;
- logical heading order;
- visible focus;
- keyboard-operable controls;
- labels for sliders and form controls;
- color must not be the only success/error signal;
- meaningful button text;
- appropriate `aria-live` feedback where useful;
- readable contrast;
- responsive touch targets.

For drag-and-drop labs, provide a fallback interaction when practical.

---

# 19. Performance

The application should:

- load without heavy dependencies;
- avoid unnecessary large images;
- keep canvas rendering efficient;
- avoid multiple endless animation loops;
- pause/reset simulation animation when leaving a lab where practical.

---

# 20. Error / Edge Behavior

The app must handle:

- invalid control values;
- empty drop zones;
- repeated reset;
- switching labs mid-simulation;
- resizing the window;
- missing optional input;
- repeated challenge attempts.

A failed lab interaction must not break the rest of the application.

---

# 21. Out of Scope

Do not implement:

- backend;
- database;
- account/login;
- instructor dashboard;
- real LMS course administration;
- cloud save;
- multiplayer;
- video conferencing;
- AI API calls;
- external weather/data APIs;
- real scientific equipment integration;
- advanced physics/chemistry engine;
- graded academic certification.

---

# 22. Acceptance Criteria

The submission is considered functionally complete when:

1. the website runs entirely in the browser;
2. the landing page displays all nine TPB subject areas;
3. users can open and interact with each lab;
4. at least one lab uses `<canvas>`;
5. at least one lab uses drag-and-drop;
6. multiple labs use range/form controls;
7. JavaScript updates results dynamically;
8. users receive immediate feedback;
9. labs can be reset or retried;
10. layout is responsive;
11. HTML, CSS, and JavaScript are separated;
12. the interface is visually consistent;
13. the project does not require a backend;
14. no lab is purely static reading material;
15. the experience clearly qualifies as a virtual lab rather than only an LMS catalogue.

---

# 23. Submission Description

Suggested short description:

> **TepebabesLab** adalah media pembelajaran virtual berbasis web untuk mengeksplorasi konsep-konsep TPB ITB melalui simulasi interaktif. Pengguna dapat mencoba eksperimen Matematika, Fisika, Kimia, Berpikir Komputasional, Literasi Digital & AI, Olahraga, Pancasila, Bahasa Indonesia, dan Bahasa Inggris melalui canvas, drag-and-drop, parameter interaktif, visualisasi, serta feedback langsung. Seluruh aplikasi berjalan di sisi browser menggunakan HTML, CSS, dan JavaScript tanpa backend.

---

# 24. Product North Star

> **Can the user learn a TPB concept by changing something, observing what happens, and understanding why?**

If the answer is yes, the feature belongs in TepebabesLab.
