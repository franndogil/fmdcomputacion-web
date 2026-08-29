const container = document.getElementById('servicios-container');
const allCards = Array.from(container.querySelectorAll('.service-card'));

function cardsSortedByTitulo(cards) {
    return [...cards].sort((a, b) =>
        a.dataset.titulo.localeCompare(b.dataset.titulo, 'es')
    );
}

/* inmediato = la lista es respuesta a un click, así que se muestra ya.
   Sin esto las cards conservan el retardo de cascada de su posición
   anterior y algunas entran con opacity 0 y más de un segundo de espera. */
function renderGrid(cards, inmediato) {
    if (cards.length === 0) {
        container.innerHTML = '<p class="no-results">No hay servicios en esta categoría.</p>';
        return;
    }
    const grid = document.createElement('div');
    grid.className = 'services-grid';
    cards.forEach(c => grid.appendChild(c));
    container.innerHTML = '';
    container.appendChild(grid);

    if (inmediato && window.FMDReveal) window.FMDReveal.limpiar(grid);
}

function aplicarFiltro(cat, inmediato) {
    document.querySelectorAll('.filtro-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.cat === cat)
    );

    const visibles = cat === 'az' ? allCards : allCards.filter(c => c.dataset.cat === cat);
    renderGrid(cardsSortedByTitulo(visibles), inmediato);
}

document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => aplicarFiltro(btn.dataset.cat, true));
});

const urlCat = new URLSearchParams(window.location.search).get('cat');
if (urlCat) {
    const norm = str => str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const categorias = [...new Set(allCards.map(c => c.dataset.cat))];
    const match = urlCat === 'az' ? 'az' : categorias.find(c => norm(c) === norm(urlCat));
    if (match) aplicarFiltro(match);
}
