const DRAG_MIME = "text/plain";

export function setDragPayload(event, value) {
  if (!event.dataTransfer) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData(DRAG_MIME, String(value));
}

export function getDragPayload(event) {
  return event.dataTransfer?.getData(DRAG_MIME) ?? "";
}

export function moveItem(items, fromIndex, toIndex) {
  const nextItems = [...items];
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= nextItems.length ||
    toIndex >= nextItems.length ||
    fromIndex === toIndex
  ) {
    return nextItems;
  }

  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

export function swapItems(items, firstIndex, secondIndex) {
  const nextItems = [...items];
  if (
    firstIndex < 0 ||
    secondIndex < 0 ||
    firstIndex >= nextItems.length ||
    secondIndex >= nextItems.length ||
    firstIndex === secondIndex
  ) {
    return nextItems;
  }

  [nextItems[firstIndex], nextItems[secondIndex]] = [
    nextItems[secondIndex],
    nextItems[firstIndex]
  ];
  return nextItems;
}
