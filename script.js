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
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({
behavior: 'smooth'
});
}
});
});
