// mission-brief.js
// Template-specific scripts for the Mission Brief pages.

document.addEventListener('DOMContentLoaded', () => {
  const pathMatch = window.location.pathname.match(/mission-(\d{2})\.html$/);
  if (!pathMatch) return;

  const current = parseInt(pathMatch[1], 10);
  const currentFile = `mission-${String(current).padStart(2, '0')}.html`;

  const archiveLinks = document.querySelectorAll('.mission-archive-link');
  archiveLinks.forEach((link) => {
    link.classList.remove('mission-archive-link--active');
    link.removeAttribute('aria-current');
    if (link.getAttribute('href') === currentFile) {
      link.classList.add('mission-archive-link--active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const prevLink = document.querySelector('.dossier-nav__prev');
  const nextLink = document.querySelector('.dossier-nav__next');

  if (prevLink) {
    if (current <= 0) {
      prevLink.setAttribute('href', '#');
      prevLink.setAttribute('aria-disabled', 'true');
      prevLink.classList.add('dossier-nav__link--disabled');
    } else {
      prevLink.setAttribute('href', `mission-${String(current - 1).padStart(2, '0')}.html`);
      prevLink.removeAttribute('aria-disabled');
      prevLink.classList.remove('dossier-nav__link--disabled');
    }
  }

  if (nextLink) {
    if (current >= 6) {
      nextLink.setAttribute('href', '#');
      nextLink.setAttribute('aria-disabled', 'true');
      nextLink.classList.add('dossier-nav__link--disabled');
    } else {
      nextLink.setAttribute('href', `mission-${String(current + 1).padStart(2, '0')}.html`);
      nextLink.removeAttribute('aria-disabled');
      nextLink.classList.remove('dossier-nav__link--disabled');
    }
  }
  initMissionScaling();
});

function initMissionScaling() {
  const tables = document.querySelectorAll('.js-scaling-table');
  if (!tables.length) return;

  tables.forEach((table) => {
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    if (!headers.length) return;

    const accordion = document.createElement('div');
    accordion.className = 'scaling-mobile-accordion js-scaling-accordion';
    accordion.setAttribute('aria-label', 'Mobile scaling comparison');

    headers.forEach((level, colIndex) => {
      if (colIndex === 0) return;

      const details = document.createElement('details');
      details.className = 'scaling-accordion-item';

      const summary = document.createElement('summary');
      summary.className = 'scaling-accordion-header';
      summary.textContent = level;

      const content = document.createElement('div');
      content.className = 'scaling-accordion-content';

      const dl = document.createElement('dl');
      dl.className = 'scaling-accordion-dl';

      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        const label = cells[0]?.textContent.trim() || '';
        const value = cells[colIndex]?.textContent.trim() || '';

        const div = document.createElement('div');
        div.className = 'scaling-accordion-row';

        const dt = document.createElement('dt');
        dt.textContent = label;

        const dd = document.createElement('dd');
        dd.textContent = value;

        div.appendChild(dt);
        div.appendChild(dd);
        dl.appendChild(div);
      });

      content.appendChild(dl);
      details.appendChild(summary);
      details.appendChild(content);
      accordion.appendChild(details);
    });

    table.parentNode.insertBefore(accordion, table.nextSibling);
  });
}
