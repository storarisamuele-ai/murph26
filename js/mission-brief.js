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
  initMissionSectionHeaders();
  initMissionArchiveLink();
  initPrintButtons();
});

function initMissionSectionHeaders() {
  const isPrint = document.body.classList.contains('print-document') || document.querySelector('.print-document') !== null;
  if (isPrint) return;

  const content = document.querySelector('.mission-content') || document.querySelector('.mission-brief-body');
  if (!content) return;

  const cards = Array.from(content.querySelectorAll('.mission-card')).filter((card) => {
    if (card.classList.contains('mission-card--scorecard')) return false;
    if (card.closest('.print-document')) return false;
    return true;
  });

  cards.forEach((card, index) => {
    const title = card.querySelector('.mission-card-title');
    if (!title) return;
    const num = String(index + 1).padStart(2, '0');
    const ref = document.createElement('span');
    ref.className = 'mission-section-ref';
    ref.textContent = `SECT. ${num} — REF JTO-${num}`;
    title.insertBefore(ref, title.firstChild);
  });
}

function initMissionArchiveLink() {
  const archiveLink = document.querySelector('.dossier-nav__archive');
  if (!archiveLink) return;

  const pathMatch = window.location.pathname.match(/mission-(\d{2})\.html$/);
  const current = pathMatch ? parseInt(pathMatch[1], 10) : null;

  if (current === 0) {
    archiveLink.style.display = 'none';
    archiveLink.setAttribute('aria-hidden', 'true');
  } else {
    archiveLink.setAttribute('href', 'mission-00.html');
  }
}

function initPrintButtons() {
  const printCtas = document.querySelectorAll('.print-cta');
  if (!printCtas.length) return;

  // Fallback only if an older brief lacks the explicit data attribute
  const pathMatch = window.location.pathname.match(/mission-(\d{2})\.html$/);
  const defaultPrintUrl = pathMatch ? `mission-${pathMatch[1]}-print.html` : null;

  printCtas.forEach((btn) => {
    const printUrl = btn.dataset.printDocument || defaultPrintUrl;
    if (!printUrl) return;

    // remove any legacy inline print handler
    btn.removeAttribute('onclick');
    btn.onclick = null;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPrintFrame(printUrl);
    });
  });
}

function openPrintFrame(url) {
  if (!url) return;

  const existing = document.getElementById('mb-print-iframe');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = 'mb-print-iframe';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('title', 'Printable mission dossier');
  iframe.setAttribute('data-print-frame', url);
  iframe.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;border:0;visibility:hidden;pointer-events:none;';

  // Attach listener before setting src/appending to avoid missing cached loads,
  // then call print() as soon as the document is ready.
  iframe.addEventListener('load', () => {
    const cw = iframe.contentWindow;
    if (!cw) return;
    try {
      cw.print();
    } catch (_) {}
  });

  iframe.src = url;
  document.body.appendChild(iframe);
}

function initMissionScaling() {
  const tables = document.querySelectorAll('.js-scaling-table');
  if (!tables.length) return;

  tables.forEach((table) => {
    if (table.classList.contains('mb03-scaling-table')) return;
    const desktop = table.closest('.scaling-desktop');
    const existing = desktop ? desktop.nextElementSibling : table.nextElementSibling;
    if (existing && existing.classList.contains('scaling-mobile')) return;

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

    if (desktop && desktop.parentNode) {
      desktop.parentNode.insertBefore(mobile, desktop.nextSibling);
    } else if (table.parentNode) {
      table.parentNode.insertBefore(mobile, table.nextSibling);
    }
  });
}
