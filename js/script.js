(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Initials avatar if a team photo is missing
  $$('.photo img').forEach(img => {
    const swap = () => { img.onerror = null; img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0B3A8A"/><text x="100" y="124" font-family="Arial" font-size="70" font-weight="700" fill="#fff" text-anchor="middle">${img.dataset.initials || ''}</text></svg>`); };
    img.onerror = swap; if (img.complete && img.naturalWidth === 0) swap();
  });
  // Mobile menu
  const burger = $('#burger'), menu = $('#links-menu');
  const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  // Back to top
  const top = $('#toTop');
  if (top) { addEventListener('scroll', () => top.classList.toggle('show', scrollY > 600), { passive: true }); top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })); }
  // Nav highlight on the home page
  const links = $$('.links a[href^="index.html#"]');
  if ($('#top') && links.length) {
    const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && links.forEach(a => a.classList.toggle('active', a.getAttribute('href').endsWith('#' + e.target.id)))), { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(s => spy.observe(s));
  }
})();