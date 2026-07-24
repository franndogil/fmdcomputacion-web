/* ─────────────────────────────────────────────
   Reveal on scroll — FMDCOMPUTACION
   Agrega .in-view a los elementos cuando entran en pantalla.
   Los grupos revelan sus hijos en cascada (stagger).

   Observa cada elemento por separado (no el contenedor), así
   sobrevive a re-renders y filtros que mueven las cards.
   Al terminar la animación limpia las clases para no interferir
   con los :hover de las cards (transform).
   ───────────────────────────────────────────── */
(function () {
  // Respetar "reducir movimiento": no ocultamos nada.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  // Elementos que se revelan enteros.
  var SINGLES = [
    '.section-head',
    '.proyectos-header',
    '.faqs-header',
    '.filtros-bar',
    '.about-photo',
    '.about-text',
    '.contact-info',
    '.contact-form',
    '.faqs .footer-faq-cta',
    '.projects-cta',
    '.faqs-cta',
    '.carousel-section',
    '.sidebar-card',
    '.proyecto-cta'
  ];

  // Contenedores cuyos hijos se revelan en cascada.
  var GROUPS = [
    '.stats-bar-inner',
    '.services-grid',
    '.why-grid',
    '.about-highlights',
    '.projects-slider',
    '.projects-grid',
    '.faqs-div',
    '.proyecto-descripcion'
  ];

  var STAGGER = 90; // ms entre cada hijo

  var io = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      show(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function show(el) {
    el.classList.add('in-view');
    // Al terminar, quitamos las clases para no dejar un transform
    // que compita con los :hover de las cards.
    var cleanup = function (e) {
      if (e && e.propertyName && e.propertyName !== 'transform') return;
      el.classList.remove('reveal', 'in-view');
      el.style.transitionDelay = '';
      el.style.willChange = '';
      el.removeEventListener('transitionend', cleanup);
    };
    el.addEventListener('transitionend', cleanup);
    setTimeout(cleanup, 1600); // fallback si transitionend no dispara
  }

  function prepare(el, delay) {
    el.classList.add('reveal');
    if (delay) el.style.transitionDelay = delay + 'ms';
    io.observe(el);
  }

  SINGLES.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { prepare(el, 0); });
  });

  GROUPS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (child, i) {
        prepare(child, i * STAGGER);
      });
    });
  });
})();
