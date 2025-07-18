let searchQuery = '';
let pokemonData = [];
let currentSort = 'number';
let currentPage = 1;
const itemsPerPage = 100;

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

  // Sort full dataset first
  const sorted = [...pokemonData].sort((a, b) => {
    if (currentSort === 'name') return a.name.localeCompare(b.name);
    return a.id - b.id;
  });

  // Filter full list by search query (if any)
  const filtered = searchQuery
    ? sorted.filter(pokemon => pokemon.name.toLowerCase().includes(searchQuery))
    : sorted;

  // Paginate filtered results
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleItems = filtered.slice(start, end);
  const noResultsMessage = document.getElementById('no-results-message');
noResultsMessage.style.display = visibleItems.length === 0 ? 'block' : 'none';

  // Render visible items
  visibleItems.forEach(pokemon => {
    const card = document.createElement('div');
card.classList.add('pokemon-card');
    if (isCollected(pokemon.id)) {
   card.classList.add('collected');
    }

    const label = document.createElement('label');
    label.innerHTML = `#${String(pokemon.id).padStart(3, '0')} <span class="pokemon-name">${pokemon.name}</span>`;

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

  // Show pagination controls always (search results also paginated)
  document.getElementById('pagination-controls').style.display = 'flex';

  // Update page info & progress based on filtered data
  updatePageInfo(filtered.length);
  updateProgressTracker();
}

function filterList() {
  const input = document.getElementById('search-bar');
  searchQuery = input.value.toLowerCase().trim();
  currentPage = 1; // Reset to first page on new search
  renderList();
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
