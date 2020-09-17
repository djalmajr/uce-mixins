import { fns } from './helpers';

function addOrRemEvt(type) {
  if (typeof this.events === "object") {
    if (Array.isArray(this.events)) {
      this.events.forEach((name) => {
        this[type + "EventListener"](name, this.handleEvent);
      });
    } else {
      Object.keys(this.events).forEach((name) => {
        this[type + "EventListener"](name, this[this.events[name]]);
      });
    }
  }
}

export const events = {
  init() {
    const props = Object.keys(Object.getPrototypeOf(this))
      .filter((prop) => typeof this[prop] === "function")
      .filter((prop) => !fns.includes(prop));

    for (const prop of props) {
      this[prop] = this[prop].bind(this);
    }

    addOrRemEvt.call(this, "add");
    this.render();
  },
  disconnected() {
    addOrRemEvt.call(this, "remove");
  },
  emit(name, data) {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        detail: data,
      })
    );
  },
};
