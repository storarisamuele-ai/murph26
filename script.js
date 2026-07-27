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
