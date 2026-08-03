// mission-brief.js
// Template-specific scripts for the Mission Brief pages.

function injectFavicon() {
  if (document.querySelector('link[rel*="icon"], link[rel="manifest"]')) return;
  const head = document.head;
  const links = [
    { rel: 'icon', href: '../favicon.ico', sizes: 'any', type: 'image/x-icon' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '../favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '../favicon-32x32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '../apple-touch-icon.png' },
    { rel: 'manifest', href: '../manifest.json' },
  ];
  links.forEach((attrs) => {
    const link = document.createElement('link');
    Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
    head.appendChild(link);
  });
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = '#0694B9';
  head.appendChild(meta);
}

injectFavicon();

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
    accordion.className = 'accordion scaling-accordion';

    headers.forEach((level, colIndex) => {
      if (colIndex === 0) return;

      const details = document.createElement('details');
      details.className = 'accordion-item';

      const summary = document.createElement('summary');
      summary.className = 'accordion-header';
      summary.innerHTML = `<span class="accordion-title">${level}</span><span class="accordion-toggle"></span>`;

      const content = document.createElement('div');
      content.className = 'accordion-content';

      const steps = document.createElement('div');
      steps.className = 'workout-steps';

      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        const labelCell = cells[0];
        const iconEl = labelCell?.querySelector('.table-icon');
        const iconText = iconEl ? iconEl.textContent.trim() : '';
        let label = labelCell?.textContent.trim() || '';
        if (iconText) {
          label = label.replace(iconText, '').trim();
        }
        const value = cells[colIndex]?.textContent.trim() || '';

        const step = document.createElement('div');
        step.className = 'workout-step';

        if (iconEl) {
          const stepIcon = iconEl.cloneNode(true);
          stepIcon.className = 'workout-step-icon';
          stepIcon.setAttribute('aria-hidden', 'true');
          step.appendChild(stepIcon);
        }

        const stepContent = document.createElement('div');
        stepContent.className = 'workout-step-content';

        const labelEl = document.createElement('span');
        labelEl.className = 'workout-step-label';
        labelEl.textContent = label;

        const valueEl = document.createElement('span');
        valueEl.className = 'workout-step-value';
        valueEl.textContent = value;

        stepContent.appendChild(labelEl);
        stepContent.appendChild(valueEl);
        step.appendChild(stepContent);
        steps.appendChild(step);
      });

      content.appendChild(steps);
      details.appendChild(summary);
      details.appendChild(content);
      accordion.appendChild(details);
    });

    const mobile = document.createElement('div');
    mobile.className = 'scaling-mobile';
    mobile.setAttribute('aria-label', 'Confronto scale mobile');
    mobile.appendChild(accordion);

    const desktop = table.closest('.scaling-desktop');
    if (desktop && desktop.parentNode) {
      desktop.parentNode.insertBefore(mobile, desktop.nextSibling);
    } else if (table.parentNode) {
      table.parentNode.insertBefore(mobile, table.nextSibling);
    }
  });
}
