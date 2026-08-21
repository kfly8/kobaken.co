
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
