const container = document.getElementById('servicios-container');
const allCards = Array.from(container.querySelectorAll('.service-card'));

function cardsSortedByTitulo(cards) {
    return [...cards].sort((a, b) =>
        a.dataset.titulo.localeCompare(b.dataset.titulo, 'es')
    );
}

function renderGrid(cards) {
    if (cards.length === 0) {
        container.innerHTML = '<p class="no-results">No hay servicios en esta categoría.</p>';
        return;
    }
    const grid = document.createElement('div');
    grid.className = 'services-grid';
    cards.forEach(c => grid.appendChild(c));
    container.innerHTML = '';
    container.appendChild(grid);
}

function renderAgrupado(cards) {
    const grupos = {};
    cardsSortedByTitulo(cards)
        .sort((a, b) => a.dataset.cat.localeCompare(b.dataset.cat, 'es'))
        .forEach(c => {
            (grupos[c.dataset.cat] ||= []).push(c);
        });

    container.innerHTML = '';
    Object.entries(grupos).forEach(([cat, items]) => {
        const section = document.createElement('div');
        section.className = 'categoria-section';
        section.innerHTML = `<h2 class="categoria-titulo">${cat}</h2>`;
        const grid = document.createElement('div');
        grid.className = 'services-grid';
        items.forEach(c => grid.appendChild(c));
        section.appendChild(grid);
        container.appendChild(section);
    });
}

function aplicarFiltro(cat) {
    document.querySelectorAll('.filtro-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.cat === cat)
    );

    if (cat === 'todos') {
        renderAgrupado(allCards);
    } else if (cat === 'az') {
        renderGrid(cardsSortedByTitulo(allCards));
    } else {
        renderGrid(cardsSortedByTitulo(allCards.filter(c => c.dataset.cat === cat)));
    }
}

document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => aplicarFiltro(btn.dataset.cat));
});

const urlCat = new URLSearchParams(window.location.search).get('cat');
if (urlCat) {
    const norm = str => str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const categorias = [...new Set(allCards.map(c => c.dataset.cat))];
    const match = urlCat === 'az' ? 'az' : categorias.find(c => norm(c) === norm(urlCat));
    if (match) aplicarFiltro(match);
}
