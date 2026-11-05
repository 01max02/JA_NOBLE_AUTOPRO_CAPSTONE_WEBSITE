(() => {
  const W = 'assets/screenshots/Website Interface/', M = 'assets/screenshots/Mobile Interface/', C = M + 'Customer Dasboard/', S = M + 'Staff Dashboard/';
  const mk = (dir, files, prefix, group) => files.map((f, i) => ({ group, src: dir + f, label: prefix ? `${prefix} ${i + 1}` : f.replace(/\.\w+$/, '').replace(/Page$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase()) }));
  // Edit the label text below to name each screen (e.g. 'Login', 'Service history')
  const LOGIN = mk(M, ['Screenshot_20260906_022608.jpg', 'Screenshot_20260906_022621.jpg', 'Screenshot_20260906_145759.jpg', 'Screenshot_20260909_223133.jpg', 'Screenshot_20260911_210443.jpg', 'Screenshot_20260911_210532.jpg'], 'Login step', 'Login process (shared by staff and customer)');
  const DATA = {
    admin: { phone: false, desc: 'Web portal used by administrators and managers.', items: [
      ['adminDashboardPage.png', 'Admin dashboard'], ['loginPage.png', 'Login'], ['signUpPage.png', 'Sign up'], ['forgotPassword.png', 'Forgot password'],
      ['stockInventoryPage.png', 'Stock inventory'], ['itemMasterPage.png', 'Item master'], ['invTransactionsPage.png', 'Inventory transactions'], ['issuancesPage.png', 'Issuances'],
      ['PurchaseOrdersPage.png', 'Purchase orders'], ['vehicleListPage.png', 'Vehicle list'], ['vehicleMaintenancePage.png', 'Vehicle maintenance'], ['serviceBookingPage.png', 'Service booking'],
      ['aiAssistant.png', 'AI assistant'], ['userManagementPage.png', 'User management'], ['domainManagementPage.png', 'Domain management'], ['archivePage.png', 'Archive']
    ].map(([f, l]) => ({ src: W + f, label: l })) },
    staff: { phone: true, desc: 'Mobile app used by staff for scanning, stock updates and service jobs.', items: [...LOGIN, ...mk(S, ['Screenshot_20260828_110205.jpg','Screenshot_20260905_230617.jpg','Screenshot_20260905_230704.jpg','Screenshot_20260905_230713.jpg','Screenshot_20260905_230722.jpg','Screenshot_20260905_231603.jpg','Screenshot_20260911_144456.jpg','Screenshot_20260911_150432.jpg','Screenshot_20260911_150458.jpg','Screenshot_20260911_154633.jpg','Screenshot_20260911_165054.jpg','Screenshot_20260911_175339.jpg','Screenshot_20260911_180516.jpg','Screenshot_20260911_180636.jpg','Screenshot_20260911_203424.jpg'], 'Staff screen', 'Staff dashboard')] },
    customer: { phone: true, desc: 'Mobile customer portal for service history and PMS due dates.', items: [...LOGIN, ...mk(C, ['Screenshot_20260828_105217.jpg', 'Screenshot_20260828_105227.jpg', 'Screenshot_20260906_020924.jpg', 'Screenshot_20260906_021615.jpg', 'Screenshot_20260906_021632.jpg', 'Screenshot_20260906_021720.jpg', 'Screenshot_20260906_021745.jpg', 'Screenshot_20260906_021805.jpg', 'Screenshot_20260906_031442.jpg', 'Screenshot_20260911_185942.jpg', 'Screenshot_20260911_190324.jpg', 'Screenshot_20260911_190332.jpg', 'Screenshot_20260911_194555.jpg', 'Screenshot_20260911_194600.jpg', 'Screenshot_20260911_195501.jpg', 'Screenshot_20260911_195509.jpg', 'Screenshot_20260912_013024.jpg', 'Screenshot_20260912_013037.jpg'], 'Customer screen', 'Customer dashboard')] }
  };

  const $ = s => document.querySelector(s), grid = $('#grid'), lb = $('#lb'), lbImg = lb.querySelector('img'), lbCap = $('#lbC');
  const tabs = [...document.querySelectorAll('.tabs button')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phoneMQ = matchMedia('(max-width: 600px)');
  const enc = encodeURI;
  let key = 'admin', idx = 0, lastFocus = null;

  lbImg.style.transition = 'opacity .15s';

  function show(k) {
    key = DATA[k] ? k : 'admin'; const d = DATA[key];
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.k === key));
    $('#desc').textContent = d.desc;
    grid.className = 'grid' + (d.phone ? ' phone' : '');
    let last = null;
    grid.innerHTML = d.items.map((it, i) => (it.group && it.group !== last ? (last = it.group, `<h3 class="grp">${it.group}</h3>`) : '') + `<figure data-i="${i}" tabindex="0" style="animation-delay:${Math.min(i, 8) * 40}ms"><div class="frame"><img src="${enc(it.src)}" alt="${it.label}" loading="lazy"></div><figcaption>${it.label}</figcaption></figure>`).join('');
  }

  // Lightbox
  const isOpen = () => lb.classList.contains('open');

  function open(i) {
    const items = DATA[key].items, wasOpen = isOpen();
    idx = (i + items.length) % items.length;
    const it = items[idx];
    if (!wasOpen) lastFocus = document.activeElement;
    // dim the image while the next one loads (helps on slow mobile data)
    lbImg.style.opacity = '.35';
    lbImg.onload = lbImg.onerror = () => { lbImg.style.opacity = ''; };
    lbImg.src = enc(it.src); lbImg.alt = it.label;
    lbCap.textContent = `${it.label} (${idx + 1} of ${items.length})`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden'; // stop the page scrolling behind the lightbox
    if (!wasOpen) $('#lbX').focus({ preventScroll: true });
    // preload neighbours so swiping feels instant
    [idx - 1, idx + 1].forEach(n => { new Image().src = enc(items[(n + items.length) % items.length].src); });
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  // Tabs: update the hash without piling up history entries, so the phone's Back button leaves the page
  tabs.forEach(t => t.addEventListener('click', () => {
    const k = t.dataset.k;
    try { history.replaceState(null, '', '#' + k); } catch (_) { location.hash = k; return; }
    show(k);
    // On phones the tabs are stacked, so bring the screenshots into view
    if (phoneMQ.matches) $('.g-body').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }));
  addEventListener('hashchange', () => show(location.hash.slice(1)));

  // Grid: tap / click / Enter / Space opens the lightbox
  grid.addEventListener('click', e => { const f = e.target.closest('figure'); f && open(+f.dataset.i); });
  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const f = e.target.closest('figure');
    if (f) { e.preventDefault(); open(+f.dataset.i); }
  });

  $('#lbX').onclick = close; $('#lbP').onclick = () => open(idx - 1); $('#lbN').onclick = () => open(idx + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  // Keyboard: arrows, Escape, and Tab kept inside the lightbox
  addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') open(idx - 1);
    else if (e.key === 'ArrowRight') open(idx + 1);
    else if (e.key === 'Tab') {
      const f = [...lb.querySelectorAll('button')], first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Touch: swipe left/right for next/previous, swipe down to close
  let sx = 0, sy = 0, multi = false;
  lb.addEventListener('touchstart', e => {
    multi = e.touches.length > 1;           // pinch-zoom, not a swipe
    if (!multi) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (multi || e.touches.length) { if (!e.touches.length) multi = false; return; }
    if (window.visualViewport && visualViewport.scale > 1.05) return; // zoomed in: let the user pan
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) open(idx + (dx < 0 ? 1 : -1));
    else if (dy > 90 && dy > Math.abs(dx) * 1.5) close();
  }, { passive: true });

  show(location.hash.slice(1));
})();
