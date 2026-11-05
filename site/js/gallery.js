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
  const $ = s => document.querySelector(s), grid = $('#grid'), lb = $('#lb'), lbImg = lb.querySelector('img');
  const tabs = [...document.querySelectorAll('.tabs button')];
  let key = 'admin', idx = 0;
  const enc = encodeURI;
  function show(k) {
    key = DATA[k] ? k : 'admin'; const d = DATA[key];
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.k === key));
    $('#desc').textContent = d.desc;
    grid.className = 'grid' + (d.phone ? ' phone' : '');
    let last = null;
    grid.innerHTML = d.items.map((it, i) => (it.group && it.group !== last ? (last = it.group, `<h3 class="grp">${it.group}</h3>`) : '') + `<figure data-i="${i}" tabindex="0" style="animation-delay:${Math.min(i, 8) * 40}ms"><div class="frame"><img src="${enc(it.src)}" alt="${it.label}" loading="lazy"></div><figcaption>${it.label}</figcaption></figure>`).join('');
  }
  function open(i) {
    const items = DATA[key].items; idx = (i + items.length) % items.length;
    lbImg.src = enc(items[idx].src); lbImg.alt = items[idx].label;
    $('#lbC').textContent = `${items[idx].label} (${idx + 1} of ${items.length})`; lb.classList.add('open');
  }
  const close = () => lb.classList.remove('open');
  tabs.forEach(t => t.addEventListener('click', () => { location.hash = t.dataset.k; }));
  addEventListener('hashchange', () => show(location.hash.slice(1)));
  grid.addEventListener('click', e => { const f = e.target.closest('figure'); f && open(+f.dataset.i); });
  grid.addEventListener('keydown', e => { if (e.key === 'Enter') { const f = e.target.closest('figure'); f && open(+f.dataset.i); } });
  $('#lbX').onclick = close; $('#lbP').onclick = () => open(idx - 1); $('#lbN').onclick = () => open(idx + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') open(idx - 1); if (e.key === 'ArrowRight') open(idx + 1); });
  show(location.hash.slice(1));
})();