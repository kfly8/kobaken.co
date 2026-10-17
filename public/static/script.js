
const THEME_STORAGE_KEY = 'theme';

const toggleTheme = () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch (e) {
    // localStorage unavailable (private mode, disabled, etc.) — the
    // toggle still works for this pageview, it just won't persist.
  }
}

const toggleThemeButton = document.getElementById('toggle-theme');
if (toggleThemeButton) {
  toggleThemeButton.addEventListener('click', toggleTheme);
}

// The header's language menu is a <details>: it opens and closes with its
// own summary. Close it too on a click outside it and on Escape, as menus
// do. Listening on document keeps working after the client router swaps
// the header.
document.addEventListener('click', (event) => {
  for (const menu of document.querySelectorAll('details.lang-menu[open]')) {
    if (!menu.contains(event.target)) menu.removeAttribute('open');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  for (const menu of document.querySelectorAll('details.lang-menu[open]')) {
    menu.removeAttribute('open');
    menu.querySelector('summary')?.focus();
  }
});
