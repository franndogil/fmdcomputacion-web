/* ─────────────────────────────────────────────
   LAYOUT COMPARTIDO — FMDCOMPUTACION

   Nav, footer y botón flotante de WhatsApp viven acá y solo acá.
   Cada página los inserta en el punto exacto donde va el bloque:

       <script>FMD.nav()</script>
       ... contenido ...
       <script>FMD.footer()</script>

   La inserción es sincrónica (durante el parseo del HTML), así que
   no hay parpadeo ni salto de layout.

   Para cambiar un link del menú, el número de WhatsApp o una red
   social: se edita una sola vez acá y cambia en todo el sitio.
   ───────────────────────────────────────────── */
(function (window, document) {
    'use strict';

    /* ── Datos del sitio (única fuente de verdad) ── */

    var WA = 'https://wa.me/5491128352176';

    /* home: destino alternativo cuando ya estamos en la portada
       (ahí Servicios y Proyectos bajan a la sección en vez de cambiar de página). */
    var NAV_LINKS = [
        { label: 'Servicios', href: '/servicios.html', home: '#servicios' },
        { label: 'Proyectos', href: '/proyectos.html', home: '#proyectos' },
        { label: 'Nosotros',  href: '/index.html#por-que' },
        { label: 'Sobre mí',  href: '/index.html#sobre-mi' },
        { label: 'Contacto',  href: '/index.html#contacto' }
    ];

    var FOOTER_LINKS = [
        { label: 'Servicios', href: '/servicios.html' },
        { label: 'Proyectos', href: '/proyectos.html' },
        { label: 'FAQs',      href: '/faqs.html' },
        { label: 'Contacto',  href: '/index.html#contacto' }
    ];

    var REDES = [
        { title: 'WhatsApp',  href: null,                                        icon: 'whatsapp_white.png' },
        { title: 'Instagram', href: 'https://www.instagram.com/fmdcomputacion/', icon: 'instragram_white.png' },
        { title: 'TikTok',    href: 'https://www.tiktok.com/@fmdcomputacion',    icon: 'tiktok_white.png' },
        { title: 'YouTube',   href: 'https://www.youtube.com/@FMD_Vlogs',        icon: 'youtube_white.png' },
        { title: 'Facebook',  href: 'https://www.facebook.com/FMDCOMPUTACION',   icon: 'facebook_white.png' },
        { title: 'Email',     href: 'mailto:fmdcomputacion@gmail.com',           icon: 'email_white.png' }
    ];

    var HORARIOS = 'Lunes a Viernes de 9:00 a 19:00<br>Sábados de 9:00 a 14:00';

    /* ── Página actual ── */

    var path = location.pathname;
    var isHome = path === '/' || path === '' || /\/index\.html$/.test(path);

    /* En el home los anclas quedan como hash puro (#contacto) para que el
       scroll sea suave; en el resto apuntan a /index.html#contacto. */
    function href(link) {
        if (!isHome) return link.href;
        return link.home || link.href.replace('/index.html', '') || '#';
    }

    /* Marca "Servicios" o "Proyectos" cuando estamos en esa sección
       (incluye las páginas de proyecto individuales). */
    function esActual(link) {
        if (link.href.indexOf('#') !== -1) return false;
        var seccion = link.href.replace(/^\//, '').replace(/\.html$/, '');
        return path === '/' + seccion + '.html' ||
               path.indexOf('/' + seccion + '/') === 0;
    }

    /* ── Mensajes de WhatsApp ──
       Quedan abiertos a propósito (sin punto final): la persona completa
       la frase y el mensaje llega con el caso concreto en vez de un "hola".
       El texto cambia según dónde estaba parada cuando tocó el botón. */
    function nombreDeLaPagina() {
        return (document.title.split('|')[0] || '').trim();
    }

    function mensaje() {
        if (path.indexOf('/proyectos/') === 0)
            return 'Hola Franco! Vi el proyecto "' + nombreDeLaPagina() + '" y quiero algo parecido para';
        if (path.indexOf('/proyectos.html') === 0)
            return 'Hola Franco! Estuve viendo los proyectos y quiero algo parecido para';
        if (path.indexOf('/servicios.html') === 0)
            return 'Hola Franco! Estuve viendo los servicios. Me pasa que';
        if (path.indexOf('/faqs.html') === 0)
            return 'Hola Franco! Leí las preguntas frecuentes y me quedó una duda:';
        return 'Hola Franco! Te escribo desde la web. Me pasa que';
    }

    function wa() {
        return WA + '?text=' + encodeURIComponent(mensaje());
    }

    function linkAttrs(link) {
        return 'href="' + href(link) + '"' + (esActual(link) ? ' aria-current="page"' : '');
    }

    function externo(url) {
        return url.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
    }

    /* ── Markup ── */

    function navHTML() {
        var escritorio = NAV_LINKS.map(function (l) {
            return '<li><a ' + linkAttrs(l) + '>' + l.label + '</a></li>';
        }).join('');

        var movil = NAV_LINKS.map(function (l) {
            return '<a ' + linkAttrs(l) + ' onclick="closeMenu()">' + l.label + '</a>';
        }).join('');

        return '' +
        '<nav id="main-nav">' +
            '<div class="nav-bar">' +
                '<a href="' + (isHome ? '#' : '/index.html') + '" class="nav-logo">' +
                    '<img src="/assets/navIcon.png" alt="FMD Computación" width="150" height="50" ' +
                         'loading="eager" decoding="async" fetchpriority="high">' +
                '</a>' +
                '<ul class="nav-links">' + escritorio + '</ul>' +
                '<a href="' + wa() + '" target="_blank" rel="noopener" class="nav-btn"><span>WhatsApp</span></a>' +
                '<button class="nav-hamburger" aria-label="Abrir menú" aria-expanded="false" onclick="toggleMenu()">' +
                    '<span></span><span></span><span></span>' +
                '</button>' +
            '</div>' +
            '<div class="nav-mobile-menu">' + movil +
                '<a href="' + wa() + '" target="_blank" rel="noopener" class="nav-mobile-cta" onclick="closeMenu()">WhatsApp</a>' +
            '</div>' +
        '</nav>';
    }

    function footerHTML() {
        var links = FOOTER_LINKS.map(function (l) {
            return '<a href="' + href(l) + '">' + l.label + '</a>';
        }).join('');

        var redes = REDES.map(function (r) {
            var url = r.href || wa();
            return '<a href="' + url + '"' + externo(url) + ' class="social-btn" title="' + r.title + '">' +
                       '<img src="/assets/icons/' + r.icon + '" alt="' + r.title + '" ' +
                            'width="20" height="20" loading="lazy" decoding="async">' +
                   '</a>';
        }).join('');

        return '' +
        '<footer>' +
            '<div class="footer-inner">' +
                '<div class="footer-brand">' +
                    '<div class="nav-logo">' +
                        '<img src="/assets/navIcon.png" alt="" width="150" height="50" loading="lazy" decoding="async">' +
                    '</div>' +
                    '<p>PCs, redes, cámaras y soluciones IT · Quilmes, BA</p>' +
                '</div>' +
                '<div class="footer-links">' + links + '</div>' +
                '<div class="footer-social">' + redes + '</div>' +
            '</div>' +
            '<div class="footer-copy">' +
                '© ' + new Date().getFullYear() + ' FMDCOMPUTACION · Quilmes, Buenos Aires · +54 9 11 2835-2176' +
                '<p>' + HORARIOS + '</p>' +
            '</div>' +
        '</footer>' +
        '<a href="' + wa() + '" target="_blank" rel="noopener" ' +
           'class="wa-float" title="Escribinos por WhatsApp">' +
            '<img src="/assets/icons/whatsapp_white_button.png" alt="" width="40" height="40" loading="lazy" decoding="async">' +
        '</a>';
    }

    /* Cierre de las páginas de proyecto: el mismo en todas. */
    function ctaProyectoHTML() {
        return '' +
        '<div class="proyecto-cta-section">' +
            '<div class="cta-panel">' +
                '<p>¿Querés un proyecto similar?</p>' +
                '<a href="' + wa() + '" ' +
                   'target="_blank" rel="noopener" class="btn-primary">' +
                    '<span>Escribinos por WhatsApp</span>' +
                '</a>' +
            '</div>' +
        '</div>';
    }

    /* ── Inserción ──
       document.currentScript es el <script> inline que nos llama, así que
       el bloque queda exactamente donde estaba escrito a mano antes. */
    function insertar(html) {
        var aqui = document.currentScript;
        if (aqui && aqui.parentNode) aqui.insertAdjacentHTML('afterend', html);
        else document.body.insertAdjacentHTML('beforeend', html);
    }

    /* ── Menú mobile ── */

    window.toggleMenu = function () {
        var nav = document.getElementById('main-nav');
        if (!nav) return;
        var abierto = nav.classList.toggle('menu-open');
        var burger = nav.querySelector('.nav-hamburger');
        if (burger) burger.setAttribute('aria-expanded', String(abierto));
    };

    window.closeMenu = function () {
        var nav = document.getElementById('main-nav');
        if (!nav) return;
        nav.classList.remove('menu-open');
        var burger = nav.querySelector('.nav-hamburger');
        if (burger) burger.setAttribute('aria-expanded', 'false');
    };

    window.FMD = {
        wa: WA,
        nav: function () { insertar(navHTML()); },
        footer: function () { insertar(footerHTML()); },
        ctaProyecto: function () { insertar(ctaProyectoHTML()); }
    };

}(window, document));
