import {
  createCoordinateTransform,
  observeCanvasResize,
  resizeCanvasToDisplaySize
} from "../utils/canvas.js";
import { updateFeedback } from "../ui/feedback.js";

const DEFAULT_STATE = {
  velocity: 20,
  angleDeg: 45,
  gravity: 9.8,
  running: false,
  elapsedTime: 0
};
const TARGET = { start: 35, end: 45 };
const ANIMATION_DURATION = 2200;

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createRangeControl({ id, label, unit, min, max, step, value, signal, onInput }) {
  const group = createElement("div", "lab-control-group");
  const heading = createElement("div", "lab-control-heading");
  const labelElement = createElement("label", "lab-control-label", label);
  labelElement.htmlFor = id;
  const output = createElement("output", "lab-control-output", `${value} ${unit}`);
  output.setAttribute("for", id);
  const input = createElement("input", "range-input");
  input.type = "range";
  input.id = id;
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  input.addEventListener("input", onInput, { signal });
  heading.append(labelElement, output);
  group.append(heading, input);
  return { group, input, output, unit };
}

function calculateMotion({ velocity, angleDeg, gravity }) {
  const theta = (angleDeg * Math.PI) / 180;
  const vx = velocity * Math.cos(theta);
  const vy = velocity * Math.sin(theta);
  const flightTime = (2 * vy) / gravity;
  const range = vx * flightTime;
  const maxHeight = (vy * vy) / (2 * gravity);
  return { theta, vx, vy, flightTime, range, maxHeight };
}

export function createPhysicsLab(regions) {
  const state = { ...DEFAULT_STATE };
  const eventController = new AbortController();
  let animationFrameId = null;
  let animationStart = null;
  let animationProgress = 0;

  regions.stage.classList.add("lab-stage--interactive", "lab-stage--canvas");
  const figure = createElement("figure", "simulation-figure");
  const stageTitle = createElement("h2", "visually-hidden", "Projectile motion simulation");
  stageTitle.id = "stage-title";
  const canvas = createElement("canvas", "lab-canvas physics-canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "Projectile experiment showing the predicted path, target zone, ground, and animated projectile."
  );
  const caption = createElement(
    "figcaption",
    "simulation-caption",
    "Idealized model: equal launch and landing height, constant gravity, and no air resistance."
  );
  figure.append(canvas, caption);
  regions.stage.replaceChildren(stageTitle, figure);

  const speedControl = createRangeControl({
    id: "physics-velocity",
    label: "Launch speed",
    unit: "m/s",
    min: 5,
    max: 30,
    step: 1,
    value: state.velocity,
    signal: eventController.signal,
    onInput: (event) => {
      state.velocity = Number(event.currentTarget.value);
      handleParameterChange();
    }
  });
  const angleControl = createRangeControl({
    id: "physics-angle",
    label: "Launch angle",
    unit: "°",
    min: 10,
    max: 80,
    step: 1,
    value: state.angleDeg,
    signal: eventController.signal,
    onInput: (event) => {
      state.angleDeg = Number(event.currentTarget.value);
      handleParameterChange();
    }
  });
  const actionRow = createElement("div", "lab-control-actions");
  const launchButton = createElement("button", "button button--primary", "Launch");
  launchButton.type = "button";
  const resetButton = createElement("button", "button button--secondary", "Reset");
  resetButton.type = "button";
  actionRow.append(launchButton, resetButton);
  regions.controls.replaceChildren(
    speedControl.group,
    angleControl.group,
    createElement("p", "lab-model-note", "Gravity is fixed at 9.8 m/s²."),
    actionRow
  );

  const rangeOutput = createElement("output");
  const heightOutput = createElement("output");
  const timeOutput = createElement("output");
  const resultList = createElement("dl", "result-list result-list--metrics");
  [
    ["Range", rangeOutput],
    ["Maximum height", heightOutput],
    ["Flight time", timeOutput]
  ].forEach(([label, output]) => {
    const row = createElement("div", "result-list__row");
    row.append(createElement("dt", "", label), output);
    resultList.append(row);
  });
  regions.observation.replaceChildren(
    createElement("h2", "", "Predicted motion"),
    resultList,
    createElement(
      "p",
      "model-disclaimer",
      "These values use an idealized projectile model without air resistance."
    )
  );

  const challengeStatus = createElement("p", "challenge-status");
  regions.challenge.replaceChildren(
    createElement("h2", "", "Target challenge"),
    createElement(
      "p",
      "challenge-prompt",
      `Land the projectile in the target zone from ${TARGET.start} m to ${TARGET.end} m.`
    ),
    challengeStatus
  );

  function cancelAnimation() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    state.running = false;
    animationStart = null;
    launchButton.textContent = "Launch";
    launchButton.setAttribute("aria-label", "Launch projectile");
  }

  function updateResults() {
    const motion = calculateMotion(state);
    rangeOutput.value = `${motion.range.toFixed(1)} m`;
    heightOutput.value = `${motion.maxHeight.toFixed(1)} m`;
    timeOutput.value = `${motion.flightTime.toFixed(1)} s`;
    rangeOutput.textContent = rangeOutput.value;
    heightOutput.textContent = heightOutput.value;
    timeOutput.textContent = timeOutput.value;
    speedControl.output.value = `${state.velocity} m/s`;
    speedControl.output.textContent = speedControl.output.value;
    angleControl.output.value = `${state.angleDeg}°`;
    angleControl.output.textContent = angleControl.output.value;
    return motion;
  }

  function renderScene(progress = animationProgress) {
    const motion = calculateMotion(state);
    const { context, width, height } = resizeCanvasToDisplaySize(canvas);
    const xMax = Math.max(TARGET.end * 1.12, motion.range * 1.12, 50);
    const yMax = Math.max(motion.maxHeight * 1.3, 12);
    const transform = createCoordinateTransform({
      xMin: 0,
      xMax,
      yMin: 0,
      yMax,
      width,
      height,
      padding: { top: 20, right: 20, bottom: 38, left: 44 }
    });

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#f8fbfd";
    context.fillRect(0, 0, width, height);
    context.font = "11px system-ui, sans-serif";

    context.strokeStyle = "#dce6ec";
    context.lineWidth = 1;
    for (let index = 1; index < 5; index += 1) {
      const yValue = (yMax / 5) * index;
      const y = transform.yToPixel(yValue);
      context.beginPath();
      context.moveTo(transform.left, y);
      context.lineTo(transform.right, y);
      context.stroke();
    }
    for (let index = 1; index < 6; index += 1) {
      const xValue = (xMax / 6) * index;
      const x = transform.xToPixel(xValue);
      context.beginPath();
      context.moveTo(x, transform.top);
      context.lineTo(x, transform.bottom);
      context.stroke();
    }

    const groundY = transform.yToPixel(0);
    context.strokeStyle = "#53636d";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(transform.left, groundY);
    context.lineTo(transform.right, groundY);
    context.stroke();

    const targetStart = transform.xToPixel(TARGET.start);
    const targetEnd = transform.xToPixel(TARGET.end);
    context.fillStyle = "#d9eaf4";
    context.fillRect(targetStart, groundY - 12, targetEnd - targetStart, 12);
    context.strokeStyle = "#2474ad";
    context.strokeRect(targetStart, groundY - 12, targetEnd - targetStart, 12);
    context.fillStyle = "#31536a";
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.fillText("TARGET", (targetStart + targetEnd) / 2, groundY - 16);

    function pointAt(time) {
      return {
        x: motion.vx * time,
        y: Math.max(0, motion.vy * time - 0.5 * state.gravity * time * time)
      };
    }

    function tracePath(pathProgress, strokeStyle, dashed = false) {
      context.save();
      context.strokeStyle = strokeStyle;
      context.lineWidth = dashed ? 1.5 : 3;
      context.setLineDash(dashed ? [6, 6] : []);
      context.beginPath();
      const steps = 90;
      for (let step = 0; step <= steps * pathProgress; step += 1) {
        const time = motion.flightTime * (step / steps);
        const point = pointAt(time);
        const x = transform.xToPixel(point.x);
        const y = transform.yToPixel(point.y);
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      context.restore();
    }

    tracePath(1, "#8fa9ba", true);
    if (progress > 0) tracePath(progress, "#2474ad");

    const currentPoint = pointAt(motion.flightTime * progress);
    context.fillStyle = "#173f59";
    context.beginPath();
    context.arc(
      transform.xToPixel(currentPoint.x),
      transform.yToPixel(currentPoint.y),
      6,
      0,
      Math.PI * 2
    );
    context.fill();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = "#5b6871";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("0 m", transform.left, groundY + 8);
    context.textAlign = "right";
    context.fillText(`${Math.round(xMax)} m`, transform.right, groundY + 8);
  }

  function setChallengeActive() {
    challengeStatus.dataset.state = "active";
    challengeStatus.textContent = "Launch the projectile to test this setup against the target.";
  }

  function setChallengeIdle() {
    challengeStatus.dataset.state = "idle";
    challengeStatus.textContent = "Adjust the controls or launch when you are ready to begin.";
  }

  function evaluateLanding(range) {
    const hitTarget = range >= TARGET.start && range <= TARGET.end;
    challengeStatus.dataset.state = hitTarget ? "success" : "retry";

    if (hitTarget) {
      challengeStatus.textContent = `Target reached — the projectile landed at ${range.toFixed(1)} m.`;
      updateFeedback(
        regions.feedback,
        "Success: this speed and angle place the landing point inside the target zone.",
        "success"
      );
    } else if (range < TARGET.start) {
      challengeStatus.textContent = `Too short at ${range.toFixed(1)} m — increase speed or adjust the angle.`;
      updateFeedback(
        regions.feedback,
        "Too short — try increasing speed or moving the angle closer to its maximum-range region.",
        "retry"
      );
    } else {
      challengeStatus.textContent = `Too far at ${range.toFixed(1)} m — reduce speed or change the angle.`;
      updateFeedback(
        regions.feedback,
        "Too far — reduce speed or use an angle that produces a shorter horizontal range.",
        "retry"
      );
    }
  }

  function animate(timestamp) {
    if (animationStart === null) animationStart = timestamp;
    animationProgress = Math.min((timestamp - animationStart) / ANIMATION_DURATION, 1);
    const motion = calculateMotion(state);
    state.elapsedTime = motion.flightTime * animationProgress;
    renderScene(animationProgress);

    if (animationProgress < 1) {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }

    animationFrameId = null;
    state.running = false;
    launchButton.textContent = "Launch";
    launchButton.setAttribute("aria-label", "Launch projectile again");
    evaluateLanding(motion.range);
  }

  function launch() {
    cancelAnimation();
    animationProgress = 0;
    state.elapsedTime = 0;
    state.running = true;
    launchButton.textContent = "Launch";
    launchButton.setAttribute("aria-label", "Restart current projectile launch");
    setChallengeActive();
    updateFeedback(regions.feedback, "Projectile launched — watch the path build toward the ground.", "info");
    animationFrameId = requestAnimationFrame(animate);
  }

  function handleParameterChange() {
    cancelAnimation();
    animationProgress = 0;
    state.elapsedTime = 0;
    updateResults();
    setChallengeActive();
    updateFeedback(
      regions.feedback,
      "Prediction updated. Launch to compare the path with the target zone.",
      "info"
    );
    renderScene(0);
  }

  function reset() {
    cancelAnimation();
    Object.assign(state, DEFAULT_STATE);
    animationProgress = 0;
    speedControl.input.value = String(state.velocity);
    angleControl.input.value = String(state.angleDeg);
    updateResults();
    setChallengeIdle();
    updateFeedback(
      regions.feedback,
      "Controls reset to 20 m/s at 45°. Adjust them or launch the projectile.",
      "info"
    );
    renderScene(0);
  }

  launchButton.addEventListener("click", launch, { signal: eventController.signal });
  resetButton.addEventListener("click", reset, { signal: eventController.signal });
  const canvasObserver = observeCanvasResize(canvas, () => renderScene(animationProgress));
  reset();

  return {
    reset,
    destroy() {
      cancelAnimation();
      eventController.abort();
      canvasObserver.destroy();
    }
  };
}
