
const toggleTheme = () => {
  if (document.body.getAttribute('data-theme') === 'dark') {
    document.body.setAttribute('data-theme', 'light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
  }
}

const toggleThemeButton = document.getElementById('toggle-theme');
toggleThemeButton.addEventListener('click', toggleTheme);

const osDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
if (osDarkMode && osDarkMode.matches) {
  toggleTheme();
}
