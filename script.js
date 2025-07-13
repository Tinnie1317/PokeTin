let pokemonData = [];
let currentSort = 'number';
let currentPage = 1;
const itemsPerPage = 100;
let searchQuery = '';

window.onload = async () => {
  const res = await fetch('pokedex.json');
  pokemonData = await res.json();
  loadSavedStatus();
  renderList();
  updateProgressTracker(); 
};

function renderList() {
  const list = document.getElementById('pokemon-list');
  list.innerHTML = '';

  // Always sort first
  const sorted = [...pokemonData].sort((a, b) => {
    if (currentSort === 'name') return a.name.localeCompare(b.name);
    return a.id - b.id;
  });

  // Filter across all Pokémon if search is active
  const filtered = searchQuery
    ? sorted.filter(p => p.name.toLowerCase().includes(searchQuery))
    : sorted;

  // Apply pagination only if not searching
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleItems = searchQuery ? filtered : filtered.slice(start, end);

  visibleItems.forEach(pokemon => {
    const li = document.createElement('li');
    if (isCollected(pokemon.id)) {
      li.classList.add('collected');
    }

    const label = document.createElement('label');
    label.innerHTML = `#${String(pokemon.id).padStart(3, '0')} <span class="pokemon-name">${pokemon.name}</span>`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCollected(pokemon.id);
    checkbox.addEventListener('change', () => {
      saveCollected(pokemon.id, checkbox.checked);
      li.classList.toggle('collected', checkbox.checked);
      updateProgressTracker();
    });

    li.appendChild(label);
    li.appendChild(checkbox);
    list.appendChild(li);
  });

  // Show or hide pagination controls
  document.getElementById('pagination-controls').style.display = searchQuery ? 'none' : 'flex';

  updatePageInfo(filtered.length);
  updateProgressTracker();
}

function filterList() {
  const input = document.getElementById('search-bar');
  searchQuery = input.value.toLowerCase().trim();
  renderList(); // re-render based on the new query
}

  allItems.forEach(li => {
    const nameSpan = li.querySelector('.pokemon-name');
    const name = nameSpan ? nameSpan.textContent.toLowerCase() : '';
    li.style.display = name.includes(query) ? '' : 'none';
  });
}

function updateProgressTracker() {
  const total = pokemonData.length;
  const collected = pokemonData.filter(p => isCollected(p.id)).length;
  const tracker = document.getElementById('progress-tracker');
  if (tracker) {
    tracker.textContent = `Collected: ${collected} / ${total}`;
  }
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