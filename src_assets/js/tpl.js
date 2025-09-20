(() => {
  let theme = localStorage.getItem('darkthemeswitcher');
  if (!theme) {
    theme = window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches.toString();
    localStorage.setItem('darkthemeswitcher', theme);
  }
  document.documentElement.classList.add(theme === 'true' ? 'is-dark' : 'is-light');
})();
// navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((registration) => registration.unregister());
const currentDate = new Date(), month = currentDate.getUTCMonth() + 1, day = currentDate.getUTCDate();
if ((10 === month && 26 === day) || (11 === month && 28 === day)) import('https://dgrammatiko.dev/static/js/balloons.js').then((m) => m.balloons());
