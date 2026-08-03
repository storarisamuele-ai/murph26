(function () {
  if (!document.body.classList.contains('mission-brief')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', "Torna all'inizio");
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="21" x2="12" y2="3"/><polyline points="6 9 12 3 18 9"/></svg>';
  document.body.appendChild(btn);

  const SHOW_SCROLL_Y = 600;

  function onScroll() {
    if (window.scrollY > SHOW_SCROLL_Y) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    btn.blur();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
