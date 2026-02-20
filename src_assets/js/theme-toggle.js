let theme = localStorage.getItem('darkthemeswitcher');
if (!theme) {
  theme = window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches.toString();
  localStorage.setItem('darkthemeswitcher', theme);
}
document.documentElement.classList.add(theme === 'true' ? 'is-dark' : 'is-light');

const template = `<button aria-pressed="false">
  <svg class="theme-icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
    <mask id="MASK_ID">
      <rect x="0" y="0" width="100%" height="100%" fill="white" />
      <circle class="moon-mask-shape" cx="24" cy="10" r="6" fill="black" />
    </mask>
    <circle class="sun-core" cx="12" cy="12" r="6" mask="url(#MASK_ID)" fill="currentColor" />
    <g class="sun-beams" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </g>
  </svg>
</button>`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(`:host {
  --size: 1.5;
  position: relative;
  display: inline-block;
  width: calc(var(--size) * 2rem);
  height: calc(var(--size) * 1rem);
}

button {
  unset: all;
  position: absolute;
  width: calc(var(--size) * 2rem);
  height: calc(var(--size) * 1rem);
  padding: 0;
  margin: 0;
  color: transparent;
  background-color: #000;
  border: 0;
  border-radius: calc(var(--size) * 1rem);
  transition: background-color ease 0.4s;
  cursor: pointer;
}

button[aria-pressed=false] {
  background-color: royalblue;
}

.theme-icon {
  position: absolute;
  top: .15rem;
  left: .15rem;
  width: calc(var(--size) * .8rem);
  height: calc(var(--size) * .8rem);
  color: white;
  transition: transform ease 0.4s, color ease 0.4s;
}

button[aria-pressed=false] .theme-icon {
  transform: translateX(calc(var(--size) * 1rem));
  color: yellow;
}

.theme-icon .sun-core {
  transform-origin: center center;
  transition: transform .5s cubic-bezier(.5, 1.25, .75, 1.25);
}

.theme-icon .sun-beams {
  transform-origin: center center;
  transition: transform .5s cubic-bezier(.5, 1.5, .75, 1.25),
              opacity .5s cubic-bezier(.25, 0, .3, 1);
}

.theme-icon .moon-mask-shape {
  transition: transform .25s cubic-bezier(0, 0, 0, 1);
}

button[aria-pressed=true] .theme-icon .sun-core {
  transform: scale(1.75);
}
button[aria-pressed=true] .theme-icon .sun-beams {
  opacity: 0;
  transform: rotate(-25deg);
}
button[aria-pressed=true] .theme-icon .moon-mask-shape {
  transform: translateX(-7px);
}

button[aria-pressed=false] .theme-icon .sun-core {
  transform: scale(1);
}
button[aria-pressed=false] .theme-icon .sun-beams {
  opacity: 1;
  transform: rotate(0deg);
}
button[aria-pressed=false] .theme-icon .moon-mask-shape {
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  button, .theme-icon, .theme-icon .sun-core, .theme-icon .sun-beams, .theme-icon .moon-mask-shape {
    transition: all 0.1s !important;
  }
}`);

function supportsMediaColorScheme() {
  return (
    typeof window.matchMedia === 'function' &&
    typeof window.matchMedia('(prefers-color-scheme)').media === 'string' &&
    window.matchMedia('(prefers-color-scheme)').media !== 'not all' &&
    window.matchMedia('(prefers-color-scheme)').media !== 'all'
  );
}

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

class Switcher extends HTMLElement {
  #_value = false;
  #_on = 'Dark theme enabled';
  #_off = 'Light theme enabled';

  constructor() {
    super();

    const maskId = `moon-mask-${Math.random().toString(36).substr(2, 9)}`;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets.push(sheet);
    this.shadowRoot.innerHTML = template.replace(/MASK_ID/g, maskId);
    this.button = this.shadowRoot.querySelector('button');
    this.onClick = this.onClick.bind(this);
    this.update = this.update.bind(this);
    this._update = this._update.bind(this);
    this.button.addEventListener('click', this.onClick);
  }

  static get observedAttributes() {
    return ['value', 'text-on', 'text-off'];
  }

  get value() {
    return this.#_value;
  }
  set value(value) {
    this.#_value = value;
    this.update();
  }
  get on() {
    return this.#_on;
  }
  set on(value) {
    this.#_on = value;
    this._update();
  }
  get off() {
    return this.#_off;
  }
  set off(value) {
    this.#_off = value;
    this._update();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'value':
        this.#_value = !!newValue;
        this.update();
        break;
      case 'text-on':
        this.#_on = newValue;
        this.update();
        break;
      case 'text-off':
        this.#_off = newValue;
        this.update();
        break;
    }
  }

  connectedCallback() {
    document.documentElement.classList.remove('is-dark', 'is-light');
    if (localStorage.getItem('darkthemeswitcher')) {
      this.#_value = localStorage.getItem('darkthemeswitcher') === 'true';
    }
    this._update();

    if (supportsMediaColorScheme()) {
      darkModeMediaQuery.addEventListener('change', this.systemQuery);
    }
  }

  systemQuery(event) {
    this.#_value = event.matches;
    this.update();
  }

  disconnectedCallback() {
    if (supportsMediaColorScheme()) {
      darkModeMediaQuery.removeEventListener(this.systemQuery);
    }
  }

  onClick() {
    this.#_value = !this.#_value;
    this.update();

    this.dispatchEvent(new Event('change'));
  }

  async _update() {
    localStorage.setItem('darkthemeswitcher', this.#_value);
    document.documentElement.classList.remove(this.#_value ? 'is-light' : 'is-dark');
    document.documentElement.classList.add(this.#_value ? 'is-dark' : 'is-light');
    this.button.setAttribute('aria-pressed', this.#_value);
    this.button.setAttribute('aria-label', `${this.#_value ? this.on : this.off}`);

    return Promise.resolve();
  }

  async update() {
    if (!('startViewTransition' in document)) {
      return this._update();
    }

    document.querySelector('.site-header')?.classList.replace('site-header', 'site-header_notransition');
    document.querySelector('.site-main')?.classList.replace('site-main', 'site-main_notransition');
    document.querySelector('.site-footer')?.classList.replace('site-footer', 'site-footer_notransition');

    document.documentElement.style.viewTransitionName = 'dark-light';
    const transition = document.startViewTransition(this._update);

    try {
      await transition.finished;
    } finally {
      document.documentElement.style = '';
      document.querySelector('.site-header_notransition')?.classList.replace('site-header_notransition', 'site-header');
      document.querySelector('.site-main_notransition')?.classList.replace('site-main_notransition', 'site-main');
      document.querySelector('.site-footer_notransition')?.classList.replace('site-footer_notransition', 'site-footer');
    }
  }
}

if (!customElements.get('dark-light-switch')) {
  customElements.define('dark-light-switch', Switcher);
}
