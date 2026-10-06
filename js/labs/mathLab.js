import {
  createCoordinateTransform,
  observeCanvasResize,
  resizeCanvasToDisplaySize
} from "../utils/canvas.js";
import { updateFeedback } from "../ui/feedback.js";

const DEFAULT_STATE = { a: 1, b: 0, c: 0 };
const VIEWPORT = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function formatNumber(value, digits = 2) {
  const normalized = Math.abs(value) < 0.0005 ? 0 : value;
  return Number(normalized.toFixed(digits)).toString();
}

function formatEquation({ a, b, c }) {
  const terms = [
    { value: a, symbol: "x²" },
    { value: b, symbol: "x" },
    { value: c, symbol: "" }
  ].filter((term) => term.value !== 0);

  if (terms.length === 0) return "y = 0";

  const expression = terms
    .map(({ value, symbol }, index) => {
      const absoluteValue = Math.abs(value);
      const coefficient = symbol && absoluteValue === 1 ? "" : formatNumber(absoluteValue);
      const body = `${coefficient}${symbol}`;

      if (index === 0) return value < 0 ? `−${body}` : body;
      return value < 0 ? ` − ${body}` : ` + ${body}`;
    })
    .join("");

  return `y = ${expression}`;
}

function createRangeControl({ id, label, min, max, step, value, signal, onInput }) {
  const group = createElement("div", "lab-control-group");
  const heading = createElement("div", "lab-control-heading");
  const labelElement = createElement("label", "lab-control-label", label);
  labelElement.htmlFor = id;
  const output = createElement("output", "lab-control-output", formatNumber(value));
  output.setAttribute("for", id);

  const input = createElement("input", "range-input");
  input.type = "range";
  input.id = id;
  input.name = id;
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  input.addEventListener("input", onInput, { signal });

  heading.append(labelElement, output);
  group.append(heading, input);
  return { group, input, output };
}

export function createMathLab(regions) {
  const state = { ...DEFAULT_STATE };
  const eventController = new AbortController();
  let hasInteracted = false;

  regions.stage.classList.add("lab-stage--interactive", "lab-stage--canvas");
  const figure = createElement("figure", "simulation-figure");
  const stageTitle = createElement("h2", "visually-hidden", "Function graph");
  stageTitle.id = "stage-title";
  const canvas = createElement("canvas", "lab-canvas math-canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Coordinate graph of y equals a x squared plus b x plus c. The graph updates with the coefficient controls."
  );
  const caption = createElement(
    "figcaption",
    "simulation-caption",
    "Viewport: x and y from −10 to 10."
  );
  figure.append(canvas, caption);
  regions.stage.replaceChildren(stageTitle, figure);

  const controls = {};
  const controlDefinitions = [
    { key: "a", label: "Quadratic coefficient (a)", min: -3, max: 3, step: 0.5 },
    { key: "b", label: "Linear coefficient (b)", min: -6, max: 6, step: 0.5 },
    { key: "c", label: "Constant (c)", min: -6, max: 6, step: 0.5 }
  ];

  const controlsFragment = document.createDocumentFragment();
  controlDefinitions.forEach((definition) => {
    const control = createRangeControl({
      id: `math-${definition.key}`,
      label: definition.label,
      min: definition.min,
      max: definition.max,
      step: definition.step,
      value: state[definition.key],
      signal: eventController.signal,
      onInput: (event) => {
        state[definition.key] = Number(event.currentTarget.value);
        hasInteracted = true;
        update();
      }
    });
    controls[definition.key] = control;
    controlsFragment.append(control.group);
  });
  regions.controls.replaceChildren(controlsFragment);

  const observationTitle = createElement("h2", "", "Graph information");
  const equationLabel = createElement("p", "result-label", "Current equation");
  const equationOutput = createElement("output", "equation-output");
  const resultList = createElement("dl", "result-list");
  const typeValue = createElement("dd");
  const directionValue = createElement("dd");
  const vertexValue = createElement("dd");

  [
    ["Graph type", typeValue],
    ["Opening / slope", directionValue],
    ["Vertex", vertexValue]
  ].forEach(([label, value]) => {
    const row = createElement("div", "result-list__row");
    row.append(createElement("dt", "", label), value);
    resultList.append(row);
  });
  regions.observation.replaceChildren(observationTitle, equationLabel, equationOutput, resultList);

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Coefficient challenge"),
    createElement(
      "p",
      "challenge-prompt",
      "Create a parabola that opens downward and has its vertex above the x-axis."
    ),
    challengeStatus
  );

  function evaluate(x) {
    return state.a * x * x + state.b * x + state.c;
  }

  function getVertex() {
    if (state.a === 0) return null;
    const x = -state.b / (2 * state.a);
    return { x, y: evaluate(x) };
  }

  function drawGraph() {
    const { context, width, height } = resizeCanvasToDisplaySize(canvas);
    const transform = createCoordinateTransform({
      ...VIEWPORT,
      width,
      height,
      padding: { top: 20, right: 20, bottom: 34, left: 42 }
    });

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#fbfbfd";
    context.fillRect(0, 0, width, height);
    context.font = "11px system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "top";

    for (let value = -10; value <= 10; value += 1) {
      const x = transform.xToPixel(value);
      const y = transform.yToPixel(value);
      context.strokeStyle = value === 0 ? "#7b8490" : "#e2e4ea";
      context.lineWidth = value === 0 ? 1.5 : 1;
      context.beginPath();
      context.moveTo(x, transform.top);
      context.lineTo(x, transform.bottom);
      context.stroke();
      context.beginPath();
      context.moveTo(transform.left, y);
      context.lineTo(transform.right, y);
      context.stroke();

      if (value !== 0 && value % 5 === 0) {
        context.fillStyle = "#69737e";
        context.fillText(String(value), x, transform.yToPixel(0) + 7);
        context.textAlign = "right";
        context.textBaseline = "middle";
        context.fillText(String(value), transform.xToPixel(0) - 7, y);
        context.textAlign = "center";
        context.textBaseline = "top";
      }
    }

    context.save();
    context.beginPath();
    context.rect(transform.left, transform.top, transform.width, transform.height);
    context.clip();
    context.strokeStyle = "#5655b9";
    context.lineWidth = 2.75;
    context.lineJoin = "round";
    context.beginPath();

    for (let pixel = transform.left; pixel <= transform.right; pixel += 1) {
      const x = transform.pixelToX(pixel);
      const y = transform.yToPixel(evaluate(x));
      if (pixel === transform.left) context.moveTo(pixel, y);
      else context.lineTo(pixel, y);
    }
    context.stroke();

    const vertex = getVertex();
    if (
      vertex &&
      vertex.x >= VIEWPORT.xMin &&
      vertex.x <= VIEWPORT.xMax &&
      vertex.y >= VIEWPORT.yMin &&
      vertex.y <= VIEWPORT.yMax
    ) {
      context.fillStyle = "#332f7d";
      context.beginPath();
      context.arc(transform.xToPixel(vertex.x), transform.yToPixel(vertex.y), 5, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.stroke();
    }
    context.restore();
  }

  function update() {
    Object.entries(controls).forEach(([key, control]) => {
      control.output.value = formatNumber(state[key]);
      control.output.textContent = formatNumber(state[key]);
    });

    equationOutput.value = formatEquation(state);
    equationOutput.textContent = formatEquation(state);
    const vertex = getVertex();

    if (vertex) {
      typeValue.textContent = "Quadratic function";
      directionValue.textContent = state.a > 0 ? "Opens upward" : "Opens downward";
      vertexValue.textContent = `(${formatNumber(vertex.x)}, ${formatNumber(vertex.y)})`;
    } else {
      typeValue.textContent = "Linear function";
      directionValue.textContent = `Slope = ${formatNumber(state.b)}`;
      vertexValue.textContent = "Not applicable";
    }

    const challengeMet = Boolean(vertex && state.a < 0 && vertex.y > 0);
    challengeStatus.dataset.state = challengeMet ? "success" : hasInteracted ? "active" : "idle";
    challengeStatus.textContent = challengeMet
      ? "Challenge met — the negative a value opens the curve downward, and the vertex is above y = 0."
      : hasInteracted
        ? "Keep adjusting — use a negative a value and move the vertex above y = 0."
        : "Adjust the coefficients when you are ready to begin the challenge.";
    updateFeedback(
      regions.feedback,
      challengeMet
        ? "Success: this parabola opens downward with its highest point above the x-axis."
        : hasInteracted
          ? "Keep adjusting a, b, and c; the graph and vertex respond immediately."
          : "Adjust a, b, and c to see how each coefficient changes the curve.",
      challengeMet ? "success" : "info"
    );
    drawGraph();
  }

  const canvasObserver = observeCanvasResize(canvas, drawGraph);

  function reset() {
    Object.assign(state, DEFAULT_STATE);
    hasInteracted = false;
    Object.entries(controls).forEach(([key, control]) => {
      control.input.value = String(state[key]);
    });
    update();
  }

  update();

  return {
    reset,
    destroy() {
      eventController.abort();
      canvasObserver.destroy();
    }
  };
}
