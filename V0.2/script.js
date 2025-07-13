let pokemonData = [];
let currentPage = 1;
let itemsPerPage = 100;
let currentSort = 'number';
let searchQuery = '';

fetch('./pokedex.json')
  .then(res => res.json())
  .then(data => {
    pokemonData = data;
    renderList();
  });

function saveCollected(id, value) {
  let collected = JSON.parse(localStorage.getItem('collected') || '[]');
  if (value) {
    if (!collected.includes(id)) collected.push(id);
  } else {
    collected = collected.filter(pid => pid !== id);
  }
  localStorage.setItem('collected', JSON.stringify(collected));
}

function isCollected(id) {
  const collected = JSON.parse(localStorage.getItem('collected') || '[]');
  return collected.includes(id);
}

function setSort(method) {
  currentSort = method === 'name' ? 'name' : 'number';
  currentPage = 1;
  renderList();
}

function changePage(direction) {
  const filtered = getFilteredData();
  const maxPages = Math.ceil(filtered.length / itemsPerPage);
  currentPage = Math.max(1, Math.min(maxPages, currentPage + direction));
  renderList();
}

function handleSearch() {
  const input = document.getElementById('search-bar');
  searchQuery = input.value.trim().toLowerCase();
  currentPage = 1;
  renderList();
}

function updateProgressTracker() {
  const collected = JSON.parse(localStorage.getItem('collected') || '[]');
  document.getElementById('progress-tracker').textContent = `${collected.length} / ${pokemonData.length}`;
}

function getFilteredData() {
  const sorted = [...pokemonData].sort((a, b) => {
    if (currentSort === 'name') return a.name.localeCompare(b.name);
    return a.id - b.id;
  });

  if (!searchQuery) return sorted;
  return sorted.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery)
  );
}

function renderList() {
  const list = document.getElementById('pokemon-list');
  list.innerHTML = '';

  const filtered = getFilteredData();
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleItems = filtered.slice(start, end);

  const noResultsMessage = document.getElementById('no-results-message');
  noResultsMessage.style.display = visibleItems.length === 0 ? 'block' : 'none';

  visibleItems.forEach(pokemon => {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    if (isCollected(pokemon.id)) {
      card.classList.add('collected');
    }

    const label = document.createElement('label');
    label.innerHTML = `
      <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span><br>
      <span class="pokemon-name">${pokemon.name}</span>
    `;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCollected(pokemon.id);
    checkbox.addEventListener('change', () => {
      saveCollected(pokemon.id, checkbox.checked);
      card.classList.toggle('collected', checkbox.checked);
      updateProgressTracker();
    });

    card.appendChild(label);
    card.appendChild(checkbox);
    list.appendChild(card);
  });

  updatePageInfo(filtered.length);
  updateProgressTracker();
}

function updatePageInfo(totalItems) {
  const pageInfo = document.getElementById('page-info');
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}
