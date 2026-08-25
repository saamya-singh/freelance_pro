/* ============================================================
   LANDING PAGE SCRIPT - ANIMATIONS & PREVIEW INTERACTION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Live metric number counter animation on preview card
  const revenueEl = document.getElementById('preview-rev');
  const outstandingEl = document.getElementById('preview-out');
  const taxEl = document.getElementById('preview-tax');
  const netEl = document.getElementById('preview-net');

  if (revenueEl) {
    animateCounter(revenueEl, 0, 482500, '₹');
    animateCounter(outstandingEl, 0, 85000, '₹');
    animateCounter(taxEl, 0, 24500, '₹');
    animateCounter(netEl, 0, 373000, '₹');
  }

  // Scroll reveal stage cards
  const stages = document.querySelectorAll('.stage-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 });

  stages.forEach(stage => {
    stage.style.opacity = '0';
    stage.style.transform = 'translateY(20px)';
    stage.style.transition = 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(stage);
  });

  // Smooth scroll button
  const seeHowBtn = document.getElementById('see-how-btn');
  if (seeHowBtn) {
    seeHowBtn.onclick = () => {
      const explainer = document.getElementById('explainer');
      if (explainer) explainer.scrollIntoView({ behavior: 'smooth' });
    };
  }
});

function animateCounter(element, start, end, prefix = '') {
  let startTime = null;
  const duration = 1500;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * (end - start) + start);
    
    element.textContent = `${prefix}${new Intl.NumberFormat('en-IN').format(current)}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}
