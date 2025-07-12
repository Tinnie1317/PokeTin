let pokemonData = [];
let currentSort = 'number';

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

  sorted.forEach(pokemon => {
    const li = document.createElement('li');

    const label = document.createElement('label');
    label.textContent = `#${String(pokemon.id).padStart(3, '0')} ${pokemon.name}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCollected(pokemon.id);
    checkbox.addEventListener('change', () => {
      saveCollected(pokemon.id, checkbox.checked);
    });

    li.appendChild(label);
    li.appendChild(checkbox);
    list.appendChild(li);
  });
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