const { DateTime } = require("luxon");

module.exports = {
  head: (array, n) => (n < 0) ? array.slice(n) : array.slice(0, n),
  htmlDateString: (dateObj) => DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd"),
  readableDate: (dateObj) => DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy"),
  getWebmentionsForUrl: (webmentions, url) => webmentions.children.filter(entry => entry['wm-target'] === url),
  size: (mentions) => !mentions ? 0 : mentions.length,
  webmentionsByType: (mentions, mentionType) => mentions.filter(entry => !!entry[mentionType]),
  readableDateFromISO: (dateStr, formatStr = "dd LLL yyyy 'at' hh:mma") => DateTime.fromISO(dateStr).toFormat(formatStr),
}
