
class CssManager {
	constructor() {
		this.deps = {};
	}

	add(url, cssString) {
		if(!this.deps[url]) {
			this.deps[url] = new Set();
		}

		this.deps[url].add(cssString);
	}

	getCSSForPath(url) {
		if(this.deps[url]) {
			return Array.from(this.deps[url]).join("\n");
		} else {
			return "Unknown";
		}
	}
}

module.exports = new CssManager();
