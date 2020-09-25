import bound from "bound-once";

const fns = ["init", "connected", "disconnected", "attributeChanged"];

function addOrRemEvt(type) {
  const evts = this.events;

  if (typeof evts === "object") {
    const isArr = Array.isArray(evts);

    (isArr ? evts : Object.keys(evts)).forEach((evt) => {
      const [name, ...rest] = evt.split(" ");
      const query = rest.join(" ").trim();
      const el = query ? this.querySelector(query) : this;
      const fn = isArr ? this.handleEvent : bound(this, evts[evt]);
      el && fn && el[`${type}EventListener`](name.trim(), fn);
    });
  }
}

export default {
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
  emit(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  },
};
