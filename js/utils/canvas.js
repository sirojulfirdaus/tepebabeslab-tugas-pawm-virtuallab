const MAX_PIXEL_RATIO = 2;

export function resizeCanvasToDisplaySize(canvas) {
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(bounds.width));
  const height = Math.max(1, Math.round(bounds.height));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  const renderWidth = Math.round(width * pixelRatio);
  const renderHeight = Math.round(height * pixelRatio);
  const resized = canvas.width !== renderWidth || canvas.height !== renderHeight;

  if (resized) {
    canvas.width = renderWidth;
    canvas.height = renderHeight;
  }

  const context = canvas.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return { context, width, height, pixelRatio, resized };
}

export function observeCanvasResize(canvas, onResize) {
  const resize = () => onResize(resizeCanvasToDisplaySize(canvas));

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    return {
      resize,
      destroy() {
        observer.disconnect();
      }
    };
  }

  window.addEventListener("resize", resize);
  resize();

  return {
    resize,
    destroy() {
      window.removeEventListener("resize", resize);
    }
  };
}

export function createCoordinateTransform({
  xMin,
  xMax,
  yMin,
  yMax,
  width,
  height,
  padding = 0
}) {
  const inset =
    typeof padding === "number"
      ? { top: padding, right: padding, bottom: padding, left: padding }
      : padding;
  const plotWidth = Math.max(1, width - inset.left - inset.right);
  const plotHeight = Math.max(1, height - inset.top - inset.bottom);

  return {
    left: inset.left,
    right: inset.left + plotWidth,
    top: inset.top,
    bottom: inset.top + plotHeight,
    width: plotWidth,
    height: plotHeight,
    xToPixel(value) {
      return inset.left + ((value - xMin) / (xMax - xMin)) * plotWidth;
    },
    yToPixel(value) {
      return inset.top + ((yMax - value) / (yMax - yMin)) * plotHeight;
    },
    pixelToX(pixel) {
      return xMin + ((pixel - inset.left) / plotWidth) * (xMax - xMin);
    },
    pixelToY(pixel) {
      return yMax - ((pixel - inset.top) / plotHeight) * (yMax - yMin);
    }
  };
}
