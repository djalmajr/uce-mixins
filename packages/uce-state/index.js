import bound from "bound-once";

const evtName = "state:changed";

function addOrRemEvt(type) {
  if (!this.onStateChanged) return;
  const opts = this.onStateOptions;
  const handler = bound(this, "onStateChanged");
  this[`${type}EventListener`](evtName, handler, opts);
}

export default {
  connected() {
    addOrRemEvt.call(this, "add");
  },
  disconnected() {
    addOrRemEvt.call(this, "remove");
  },
  setState(data, callback) {
    const isFn = typeof data === "function";
    const validTypes = ["function", "object"];

    if (!validTypes.includes(typeof data) || Array.isArray(data)) {
      throw new Error("Invalid data type!");
    }

    this.state = Object.assign(this.state, isFn ? data(this.state) : data);
    this.render();
    this.dispatchEvent(new Event(evtName));
    callback && callback(this.state);
  },
};
