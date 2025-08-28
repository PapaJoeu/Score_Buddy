// src/dom/dom.js
// Centralized DOM helpers and element registry with lazy lookup + caching

/**
 * Query a single element by CSS selector.
 * Throws if not found unless optional is true.
 */
export function qs(selector, root = document, { optional = false } = {}) {
  const el = root.querySelector(selector);
  if (!el && !optional) {
    throw new Error(`DOM: selector not found: ${selector}`);
  }
  return el;
}

/**
 * Query all elements by CSS selector (returns a static array).
 */
export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Get element by id ("#" prefix optional). Throws if not found unless optional.
 */
export function byId(id, { optional = false } = {}) {
  const key = id.startsWith('#') ? id.slice(1) : id;
  const el = document.getElementById(key);
  if (!el && !optional) {
    throw new Error(`DOM: element id not found: #${key}`);
  }
  return el;
}

/**
 * Event helper
 */
export function on(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

/**
 * Delegate events from a container to matching descendants.
 */
export function delegate(container, type, selector, handler) {
  return on(container, type, (event) => {
    const match = event.target && event.target.closest(selector);
    if (match && container.contains(match)) {
      handler(event, match);
    }
  });
}

/**
 * Simple class + visibility helpers
 */
export const classes = {
  add: (el, ...cls) => el.classList.add(...cls),
  remove: (el, ...cls) => el.classList.remove(...cls),
  toggle: (el, cls, force) => el.classList.toggle(cls, force),
};

export const visibility = {
  show: (el) => classes.remove(el, 'hidden'),
  hide: (el) => classes.add(el, 'hidden'),
  toggle: (el, show) => classes.toggle(el, 'hidden', !show),
};

/**
 * Read/write utilities for inputs
 */
export const input = {
  number: (el) => {
    const v = parseFloat(el.value);
    return Number.isFinite(v) ? v : 0;
  },
  setNumber: (el, v) => { el.value = String(v); },
};

/**
 * Define a lazily-resolving, cached elements bag.
 * Provide a map of keys -> selectors ("#id" or any CSS selector).
 * Example: defineElements({ canvas: '#layoutCanvas', buttons: '.btn' })
 */
export function defineElements(defs) {
  const cache = Object.create(null);
  const getEl = (sel) => {
    if (typeof sel === 'string') {
      if (sel.startsWith('#')) {
        return byId(sel, { optional: false });
      }
      return qs(sel);
    }
    // Allow direct HTMLElement values as well
    return sel;
  };

  const bag = { __cache: cache, refresh: () => {
    for (const k of Object.keys(cache)) delete cache[k];
  }};

  for (const [key, selector] of Object.entries(defs)) {
    Object.defineProperty(bag, key, {
      enumerable: true,
      configurable: false,
      get() {
        if (!(key in cache)) {
          cache[key] = getEl(selector);
        }
        return cache[key];
      },
    });
  }

  return bag;
}

/**
 * Run a callback on DOMContentLoaded (or immediately if already loaded).
 */
export function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

