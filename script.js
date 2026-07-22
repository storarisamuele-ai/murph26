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
