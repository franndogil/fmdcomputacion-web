/* ─────────────────────────────────────────────
   FAQS — FMD Computación
   Acordeón: cada tarjeta abre y cierra su respuesta.
   ───────────────────────────────────────────── */
(function () {
    'use strict';

    document.querySelectorAll('.faq-card').forEach(function (card) {
        card.addEventListener('click', function () { card.classList.toggle('open'); });
    });
}());
