export function resolveTarget(targetId: string): Element | null {
  return document.querySelector(`[data-tour-id="${targetId}"]`);
}

export function scrollTargetIntoView(el: Element): void {
  el.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
}
