# Pokémon Checklist Tracker

https://tinnie1317.github.io/PokeTin/

A simple, lightweight web app for tracking your collected Pokémon — designed to run smoothly on mobile via browser or GitHub Pages.

---

## ✅ Current Features (v0.2)
- 🔄 **Pagination**: Displays Pokémon in pages of 100 per view (currently Gen 1 & 2, 251 total).
- 📋 **Checklist Functionality**: Checkbox per Pokémon with local save (via `localStorage`).
- 🔡 **Sorting**: Sort by National Dex number or alphabetically.
- ✅ **Highlighting**: Visually distinguishes collected Pokémon with a green background.
- 📂 **Data Source**: Powered by `pokedex.json` containing accurate names and IDs for 1–251.

---

## 📂 File Structure
- `index.html` — Main layout and structure
- `style.css` — Visual styling and layout
- `script.js` — Logic for loading data, rendering lists, handling checkboxes, pagination
- `pokedex.json` — Pokémon entry data (currently 251 entries from Gen 1 & 2)

---

## 🔜 Planned Features
These features are scoped for the next development phase:
- 🧠 **Header Bar**: App title and subtitle (Gen range, collected count, etc.)
- 📘 **Pokémon Detail View**: On tap, show image, types, evolution, and brief Pokédex info
- 🔍 **Search Functionality**: Filter list by name or ID
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 🌐 **Full Pokédex Expansion**: Load all ~1000+ Pokémon using chunked JSON for performance

---

## 🛠 Future Architecture Considerations
When scaling beyond Gen 2:
- Split `pokedex.json` into chunks (e.g., by generation or ID range)
- Implement dynamic loading of JSON files on demand (to avoid memory/performance issues)
- Optionally add caching via localStorage or IndexedDB

---

## 🧪 Tested On
- iPhone using Kodex + GitHub Pages
- Safari and Chrome mobile browsers

---

## 🔖 Version
`v0.2-alpha` – Stable core functionality for Gen 1–2 checklist with pagination and progress tracking foundation.
