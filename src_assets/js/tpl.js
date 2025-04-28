(() => {
  let ___ls = localStorage.getItem('darkthemeswitcher');
  if (!___ls) {
    ___ls = window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches.toString();
    localStorage.setItem('darkthemeswitcher', ___ls);
  }
  document.documentElement.classList.add(___ls === 'true' ? 'is-dark' : 'is-light');
})();
// navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((registration) => registration.unregister());
const currentDate = new Date(),
  m = currentDate.getUTCMonth(),
  d = currentDate.getUTCDate();
if ((9 === m && 26 === d) || (10 === m && 28 === d)) import('https://dgrammatiko.dev/static/js/balloons.js').then((m) => m.balloons());
