const template = '<button aria-pressed="false"></button>';

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
  transition: background-color ease 0.4s, transform ease 0.4s;
}

button::before {
  position: absolute;
  top: .15rem;
  bottom: 0;
  left: .15rem;
  width: calc(var(--size) * .8rem);
  height: calc(var(--size) * .8rem);
  padding: 0;
  margin: 0;
  content: "";
  background-color: #000;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' focusable='false' role='img' height='.8rem' viewBox='0 0 384 512'%3E%3Cpath fill='white' d='M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  border-radius: calc(var(--size) * .8rem);
  transition: background-color ease 0.4s, transform ease 0.4s;
}

button[aria-pressed=false] {
  background-color: royalblue;
}

button[aria-pressed=false]::before {
  background-color: royalblue;
  background-image: url("data:image/svg+xml,%3Csvg aria-hidden='true' focusable='false' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='yellow' stroke='yellow' stroke-width='15' d='M469.333333 128a42.666667 42.666667 0 0 1 85.333334 0v85.333333a42.666667 42.666667 0 0 1-85.333334 0V128z m0 682.666667a42.666667 42.666667 0 0 1 85.333334 0v85.333333a42.666667 42.666667 0 0 1-85.333334 0v-85.333333z m42.666667-85.333334a213.333333 213.333333 0 1 1 0-426.666666 213.333333 213.333333 0 0 1 0 426.666666z m0-85.333333a128 128 0 1 0 0-256 128 128 0 0 0 0 256z m-384-85.333333a42.666667 42.666667 0 0 1 0-85.333334h85.333333a42.666667 42.666667 0 0 1 0 85.333334H128z m682.666667 0a42.666667 42.666667 0 0 1 0-85.333334h85.333333a42.666667 42.666667 0 0 1 0 85.333334h-85.333333z m-30.165334-371.498667a42.666667 42.666667 0 0 1 60.330667 60.330667l-67.456 67.456a42.666667 42.666667 0 0 1-60.330667-60.330667l67.413334-67.456zM243.498667 840.832a42.666667 42.666667 0 1 1-60.330667-60.330667l67.456-67.456a42.666667 42.666667 0 1 1 60.330667 60.330667l-67.413334 67.456z m-60.330667-597.333333a42.666667 42.666667 0 0 1 60.330667-60.330667l67.456 67.456a42.666667 42.666667 0 0 1-60.330667 60.330667l-67.456-67.413334z m657.664 537.002666a42.666667 42.666667 0 0 1-60.330667 60.330667l-67.456-67.456a42.666667 42.666667 0 0 1 60.330667-60.330667l67.456 67.413334z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  transform: translateX(1.5rem);
}

button span {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

@media (prefers-reduced-motion: reduce) {
  button, button::before {
    transition: all 0.1s;
  }
}`);

function supportsMediaColorScheme() {
  return typeof window.matchMedia === 'function' &&
         typeof window.matchMedia('(prefers-color-scheme)').media === 'string' &&
         window.matchMedia('(prefers-color-scheme)').media !== 'not all' &&
         window.matchMedia('(prefers-color-scheme)').media !== 'all';
}

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

class Switcher extends HTMLElement {
  #_value = false;
  #_on = 'Dark theme enabled';
  #_off = 'Light theme enabled';

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets.push(sheet);
    this.shadowRoot.innerHTML = template;
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
