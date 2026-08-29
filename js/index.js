/* ─────────────────────────────────────────────
   HOME — FMDCOMPUTACION
   Slider de proyectos (drag, flechas y dots) y botón flotante
   "Ver servicios" que aparece mientras se recorre la sección.
   ───────────────────────────────────────────── */

/* ── Slider de proyectos ── */
(function () {
    'use strict';

    var slider = document.getElementById('projects-slider');
    var dotsContainer = document.getElementById('slider-dots');
    var prevBtn = document.getElementById('slider-prev');
    var nextBtn = document.getElementById('slider-next');
    if (!slider) return;

    var cards = Array.prototype.slice.call(slider.querySelectorAll('.project-card'));

    cards.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Proyecto ' + (i + 1));
        dot.addEventListener('click', function () { scrollToCard(i); });
        dotsContainer.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsContainer.querySelectorAll('.slider-dot'));

    function getActiveIndex() {
        var origin = slider.getBoundingClientRect().left;
        var closest = 0, minDist = Infinity;
        cards.forEach(function (card, i) {
            var dist = Math.abs(card.getBoundingClientRect().left - origin);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        return closest;
    }

    function updateDots(idx) {
        dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }

    function scrollToCard(idx) {
        var card = cards[idx];
        slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: 'smooth' });
    }

    slider.addEventListener('scroll', function () { updateDots(getActiveIndex()); }, { passive: true });

    if (prevBtn) prevBtn.addEventListener('click', function () {
        var idx = getActiveIndex();
        if (idx > 0) scrollToCard(idx - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
        var idx = getActiveIndex();
        if (idx < cards.length - 1) scrollToCard(idx + 1);
    });

    /* Arrastrar con el mouse. Si hubo drag, cancelamos el click para no
       entrar al proyecto sin querer. */
    var isDown = false, startX = 0, scrollStart = 0, didDrag = false;

    slider.addEventListener('mousedown', function (e) {
        isDown = true; didDrag = false;
        startX = e.pageX; scrollStart = slider.scrollLeft;
        slider.classList.add('is-dragging');
    });
    document.addEventListener('mouseup', function () {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('is-dragging');
    });
    document.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var dx = e.pageX - startX;
        if (Math.abs(dx) > 4) didDrag = true;
        slider.scrollLeft = scrollStart - dx;
    });
    slider.addEventListener('click', function (e) {
        if (didDrag) e.preventDefault();
    }, true);
}());


/* ── Botón flotante "Ver servicios" ──
   Visible solo mientras estamos dentro de #servicios y todavía no
   apareció el CTA del final de la sección. */
(function () {
    'use strict';

    var floatBtn = document.getElementById('servicios-float');
    var serviciosSection = document.getElementById('servicios');
    if (!floatBtn || !serviciosSection) return;

    var galleryCta = serviciosSection.querySelector('.gallery-cta');
    if (!galleryCta) return;

    var inServicios = false;
    var ctaVisible = false;

    function sync() {
        floatBtn.classList.toggle('visible', inServicios && !ctaVisible);
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.target === serviciosSection) inServicios = e.isIntersecting;
            if (e.target === galleryCta)       ctaVisible  = e.isIntersecting;
        });
        sync();
    }, { threshold: 0.1 });

    observer.observe(serviciosSection);
    observer.observe(galleryCta);
}());
