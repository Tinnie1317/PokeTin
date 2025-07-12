let pokemonData = [];
let currentSort = 'number';
let currentPage = 1;
const itemsPerPage = 100;

window.onload = async () => {
  const res = await fetch('pokedex.json');
  pokemonData = await res.json();
  loadSavedStatus();
  renderList();
};

function renderList() {
  const list = document.getElementById('pokemon-list');
  list.innerHTML = '';

  const sorted = [...pokemonData].sort((a, b) => {
    if (currentSort === 'name') return a.name.localeCompare(b.name);
    return a.id - b.id;
  });

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = sorted.slice(start, end);

  paginated.forEach(pokemon => {
    const li = document.createElement('li');
    if (isCollected(pokemon.id)) {
  li.classList.add('collected');
}

    const label = document.createElement('label');
    label.textContent = `#${String(pokemon.id).padStart(3, '0')} ${pokemon.name}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCollected(pokemon.id);
    checkbox.addEventListener('change', () => {
  saveCollected(pokemon.id, checkbox.checked);
  li.classList.toggle('collected', checkbox.checked);
});

    li.appendChild(label);
    li.appendChild(checkbox);
    list.appendChild(li);
  });

  updatePageInfo(sorted.length);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderList();
  }
}

function nextPage() {
  const maxPage = Math.ceil(pokemonData.length / itemsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    renderList();
  }
}

function updatePageInfo(totalItems) {
  const maxPage = Math.ceil(totalItems / itemsPerPage);
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${maxPage}`;
}

function sortList(by) {
  currentSort = by;
  renderList();
}

function saveCollected(id, status) {
  const saved = JSON.parse(localStorage.getItem('collected') || '{}');
  saved[id] = status;
  localStorage.setItem('collected', JSON.stringify(saved));
}

function isCollected(id) {
  const saved = JSON.parse(localStorage.getItem('collected') || '{}');
  return saved[id] || false;
}

function loadSavedStatus() {
  // Just ensures localStorage is initialized
  if (!localStorage.getItem('collected')) {
    localStorage.setItem('collected', '{}');
  }
}