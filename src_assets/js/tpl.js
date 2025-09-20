let theme = localStorage.getItem('darkthemeswitcher');
if (!theme) {
  theme = window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches.toString();
  localStorage.setItem('darkthemeswitcher', theme);
}
document.documentElement.classList.add(theme === 'true' ? 'is-dark' : 'is-light');

// navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((registration) => registration.unregister());
