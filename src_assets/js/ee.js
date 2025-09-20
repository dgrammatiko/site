const currentDate = new Date();
const month = currentDate.getUTCMonth() + 1;
const day = currentDate.getUTCDate();
if ((10 === month && 26 === day) || (11 === month && 28 === day))
  import('https://dgrammatiko.dev/static/js/balloons.js').then((m) => m.balloons());
