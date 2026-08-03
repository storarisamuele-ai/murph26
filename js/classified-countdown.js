(function () {
  const FORCE_DECLASSIFIED = true; // Set to false to enable real classified countdown

  const overlay = document.querySelector('.classified-overlay');
  if (!overlay) return;

  if (FORCE_DECLASSIFIED) {
    overlay.remove();
    return;
  }

  const raw = overlay.dataset.deadline;
  const deadline = raw ? new Date(raw) : null;

  if (!deadline || isNaN(deadline.getTime()) || deadline <= new Date()) {
    overlay.remove();
    return;
  }

  const numbers = overlay.querySelectorAll('.countdown__number');
  document.body.classList.add('is-classified');

  function update() {
    const now = new Date();
    const diff = Math.max(0, deadline - now);
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    numbers[0].textContent = String(hrs).padStart(2, '0');
    numbers[1].textContent = String(mins).padStart(2, '0');
    numbers[2].textContent = String(secs).padStart(2, '0');

    if (diff === 0) {
      overlay.remove();
      document.body.classList.remove('is-classified');
    }
  }

  update();
  setInterval(update, 1000);
})();
