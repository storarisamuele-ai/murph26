// Navbar scroll effect - adds black background when scrolling
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
if (window.scrollY > 50) {
navbar.classList.add('scrolled');
} else {
navbar.classList.remove('scrolled');
}
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const href = this.getAttribute('href');
if (href === '#') return;

const targetId = href.slice(1);
let target = document.getElementById(targetId);

// For scaling category links, fall back to the desktop title if the mobile one is hidden
if (target && href.startsWith('#scaling-') && target.offsetParent === null) {
const fallback = document.getElementById(targetId + '-desktop');
if (fallback) target = fallback;
}

if (target && target.offsetParent !== null) {
if (href.startsWith('#scaling-') || href === '#12h-experience') {
target.scrollIntoView({
behavior: 'smooth',
block: 'start'
});
} else {
target.scrollIntoView({
behavior: 'smooth'
});
}
}
});
});

// Back to top button
document.addEventListener('DOMContentLoaded', () => {
const backToTop = document.getElementById('backToTop');
if (!backToTop) return;

const toggleBackToTop = () => {
if (window.scrollY > 600) {
backToTop.classList.add('visible');
} else {
backToTop.classList.remove('visible');
}
};

window.addEventListener('scroll', toggleBackToTop);
backToTop.addEventListener('click', () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
});

toggleBackToTop();

// Scroll reveal for Operation Timeline
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
const revealObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('is-visible');
revealObserver.unobserve(entry.target);
}
});
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));
}

// Mobile Time Table accordion (single open)
const timeTableAccordion = document.querySelector('.time-table-accordion');
if (timeTableAccordion) {
const timeTableItems = timeTableAccordion.querySelectorAll('.time-table-accordion-item');
timeTableItems.forEach(item => {
const header = item.querySelector('.time-table-accordion-header');
header.addEventListener('click', () => {
const isOpen = item.classList.contains('is-open');
timeTableItems.forEach(i => {
i.classList.remove('is-open');
const h = i.querySelector('.time-table-accordion-header');
if (h) h.setAttribute('aria-expanded', 'false');
});
if (!isOpen) {
item.classList.add('is-open');
header.setAttribute('aria-expanded', 'true');
}
});
});
}
});

// Mission Status Countdown
(function () {
  const targetDate = new Date('2026-08-07T08:00:00+02:00').getTime();
  const elements = {
    days: document.getElementById('ms-days'),
    hours: document.getElementById('ms-hours'),
    minutes: document.getElementById('ms-minutes'),
    seconds: document.getElementById('ms-seconds'),
    state: document.querySelector('.hero-status-state')
  };

  if (!elements.days || !elements.state) return;

  const pad = (n) => String(n).padStart(2, '0');

  function update() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      elements.days.textContent = '00';
      elements.hours.textContent = '00';
      elements.minutes.textContent = '00';
      elements.seconds.textContent = '00';
      elements.state.textContent = 'MISSION LIVE';
      elements.state.setAttribute('data-status', 'live');
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elements.days.textContent = pad(days);
    elements.hours.textContent = pad(hours);
    elements.minutes.textContent = pad(minutes);
    elements.seconds.textContent = pad(seconds);
  }

  update();
  const timer = setInterval(update, 1000);
})();
