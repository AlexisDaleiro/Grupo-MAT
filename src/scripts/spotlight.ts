const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
let cleanup: (() => void) | undefined;

function syncSpotlights() {
  cleanup?.();
  cleanup = undefined;
  if (!media.matches) return;
  const dispose: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-spotlight-group]').forEach((group) => {
    const cards = Array.from(group.querySelectorAll<HTMLElement>('.spotlight'));
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Todas las lecturas preceden a las escrituras para evitar layout thrashing.
        const bounds = cards.map((card) => card.getBoundingClientRect());
        cards.forEach((card, index) => {
          card.style.setProperty('--x', `${event.clientX - bounds[index].left}px`);
          card.style.setProperty('--y', `${event.clientY - bounds[index].top}px`);
        });
      });
    };
    group.addEventListener('pointermove', onMove, { passive: true });
    dispose.push(() => {
      cancelAnimationFrame(frame);
      group.removeEventListener('pointermove', onMove);
      cards.forEach((card) => { card.style.removeProperty('--x'); card.style.removeProperty('--y'); });
    });
  });
  cleanup = () => dispose.forEach((disposeGroup) => disposeGroup());
}

media.addEventListener('change', syncSpotlights);
syncSpotlights();

export {};
