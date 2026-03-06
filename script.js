/* ============================================
   ALENA POROKH — CV  |  main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. LANGUAGE DOTS ──────────────────────────────────────────
  document.querySelectorAll('.lang-dots[data-level]').forEach(wrap => {
    const level = parseInt(wrap.dataset.level, 10);
    const max   = 5;
    for (let i = 1; i <= max; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot ' + (i <= level ? 'filled' : 'empty');
      wrap.appendChild(dot);
    }
  });


  // ── 2. ANIMATED STAT COUNTERS ─────────────────────────────────
  const counterEls = document.querySelectorAll('.stat-cell .num[data-target]');

  const animateCounter = (el) => {
    const target  = parseFloat(el.dataset.target);
    const suffix  = el.dataset.suffix || '';
    const isFloat = target % 1 !== 0;
    const duration = 1400; // ms
    const start    = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = target * eased;
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Trigger on intersection
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counterEls.forEach(el => statObserver.observe(el));


  // ── 3. CONTRIBUTION GRAPH ────────────────────────────────────
  const graph = document.getElementById('contrib-graph');
  if (graph) {
    const WEEKS = 52;
    const DAYS  = 7;

    // Seed a reproducible-ish pattern (fake but plausible activity)
    const pattern = [];
    for (let w = 0; w < WEEKS; w++) {
      for (let d = 0; d < DAYS; d++) {
        const base = w > 8 ? 0.65 : 0.35; // more recent = more activity
        const rand = Math.random();
        let level = 0;
        if (rand < base) {
          const r2 = Math.random();
          level = r2 < 0.4 ? 1 : r2 < 0.7 ? 2 : r2 < 0.9 ? 3 : 4;
        }
        pattern.push(level);
      }
    }

    for (let w = 0; w < WEEKS; w++) {
      const col = document.createElement('div');
      col.className = 'contrib-col';
      for (let d = 0; d < DAYS; d++) {
        const cell = document.createElement('div');
        cell.className = 'contrib-cell c' + pattern[w * DAYS + d];
        col.appendChild(cell);
      }
      graph.appendChild(col);
    }
  }


  // ── 4. ACTIVE NAV TAB on scroll ──────────────────────────────
  const sections  = document.querySelectorAll('#about, #experience, #education');
  const navTabs   = document.querySelectorAll('.nav-tab');

  const sectionMap = {
    'about':      0,
    'experience': 1,
    'education':  2,
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = sectionMap[entry.target.id];
        if (idx !== undefined) {
          navTabs.forEach((t, i) => t.classList.toggle('active', i === idx));
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => scrollObserver.observe(s));


  // ── 5. SMOOTH SCROLL for nav tabs ────────────────────────────
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const href = tab.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      }
    });
  });


  // ── 6. REPO CARD — subtle tilt on mousemove ──────────────────
  document.querySelectorAll('.repo-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
