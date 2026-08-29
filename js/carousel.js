/* ─────────────────────────────────────────────
   CARRUSEL DE PROYECTO — FMDCOMPUTACION
   Usado por todas las páginas de /proyectos/.

   La página solo pone las imágenes:

       <div class="carousel-section">
         <div class="carousel" id="carousel">
           <div class="carousel-track" id="carousel-track">
             <div class="carousel-slide"><img src="..." alt="..."></div>
             ...
           </div>
         </div>
       </div>

   Las flechas y los puntos los arma este script. Si no hay carrusel
   en la página, no hace nada.
   ───────────────────────────────────────────── */
(function () {
    'use strict';

    var carousel = document.getElementById('carousel');
    var track    = document.getElementById('carousel-track');
    if (!carousel || !track) return;

    var slides = track.querySelectorAll('.carousel-slide');

    var current   = 0;
    var autoTimer = null;
    var total     = slides.length;

    /* ── Con una sola imagen no hace falta ningún control ── */
    if (total <= 1) {
        carousel.setAttribute('data-single', '');
        return;
    }

    /* ── Controles ── */
    var btnPrev  = boton('carousel-btn--prev', 'Imagen anterior', '‹');
    var btnNext  = boton('carousel-btn--next', 'Imagen siguiente', '›');
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-dots';
    carousel.appendChild(dotsWrap);

    function boton(clase, etiqueta, simbolo) {
        var b = document.createElement('button');
        b.className = 'carousel-btn ' + clase;
        b.setAttribute('aria-label', etiqueta);
        b.innerHTML = simbolo;
        carousel.appendChild(b);
        return b;
    }

    /* ── Dots ── */
    Array.prototype.forEach.call(slides, function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetAuto(); });
        dotsWrap.appendChild(dot);
    });

    /* ── Navegación ── */
    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + slides[current].offsetLeft + 'px)';
        dotsWrap.querySelectorAll('.carousel-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    window.addEventListener('resize', function () { goTo(current); });

    btnPrev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    btnNext.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    /* ── Teclado ── */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
        if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
    });

    /* ── Touch / swipe ── */
    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 44) {
            goTo(diff > 0 ? current + 1 : current - 1);
            resetAuto();
        }
    }, { passive: true });

    /* ── Auto-play ── */
    function startAuto() {
        autoTimer = setInterval(function () { goTo(current + 1); }, 6000);
    }
    function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    carousel.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    carousel.addEventListener('mouseleave', startAuto);

    startAuto();
}());
