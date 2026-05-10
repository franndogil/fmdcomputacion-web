(function () {
    const lb    = document.createElement('div');
    lb.id       = 'lightbox';
    lb.innerHTML = '<button id="lightbox-close" aria-label="Cerrar">&#x2715;</button><img id="lightbox-img" alt="">';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('img');

    function open(src) {
        lbImg.src = src;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    lb.addEventListener('click', close);
    lb.querySelector('#lightbox-close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
    });

    document.querySelectorAll('.carousel-slide img').forEach(function (img) {
        img.addEventListener('click', function (e) {
            e.stopPropagation();
            open(this.src);
        });
    });
}());
