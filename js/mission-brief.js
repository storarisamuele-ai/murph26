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
});
