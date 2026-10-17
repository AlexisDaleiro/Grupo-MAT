const header = document.querySelector<HTMLElement>('[data-site-header]');
if (header) {
  header.setAttribute('data-nav-ready', '');
  let frame = 0;
  const updateScroll = () => {
    frame = 0;
    header.toggleAttribute('data-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  updateScroll();

  const heroes = document.querySelectorAll<HTMLElement>('[data-hero]');
  const activeHeroes = new Set<Element>();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.boundingClientRect.top <= 64) activeHeroes.add(entry.target);
      else activeHeroes.delete(entry.target);
    });
    if (activeHeroes.size > 0) header.dataset.theme = 'dark';
    else header.removeAttribute('data-theme');
  }, { rootMargin: '-64px 0px 0px 0px' });
  heroes.forEach((hero) => {
    const bounds = hero.getBoundingClientRect();
    if (bounds.top <= 64 && bounds.bottom > 64) activeHeroes.add(hero);
    observer.observe(hero);
  });
  if (activeHeroes.size) header.dataset.theme = 'dark';
  else header.removeAttribute('data-theme');

  const updateCurrent = () => {
    const normalizePath = (path: string) => path.replace(/\/$/u, '') || '/';
    document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((link) => {
      const url = new URL(link.href);
      const current = normalizePath(url.pathname) === normalizePath(location.pathname) && (!url.hash || url.hash === location.hash);
      if (current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('hashchange', updateCurrent);
  updateCurrent();
}

export {};
