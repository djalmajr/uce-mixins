import { fns } from "./helpers";

const { keys } = Object;
const { isArray } = Array;

function addOrRemEvt(option) {
  const evts = this.events;

  if (typeof evts === "object") {
    const isArr = isArray(evts);

    (isArr ? evts : keys(evts)).forEach((name) => {
      const [type, ...q] = name.split(" ");
      const query = q.join(" ").trim();
      const el = query ? this.querySelector(query) : this;
      const handler = isArr ? this.handleEvent : this[evts[name]];
      el && el[`${option}EventListener`](type, handler);
    });
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

    this.render();
  },
  connected() {
    addOrRemEvt.call(this, "add");
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
