export const events = {
  init() {
    if (typeof this.events === "object") {
      if (Array.isArray(this.events)) {
        this.events.forEach(name => {
          this.addEventListener(name, this.handleEvent);
        });
      } else {
        Object.keys(this.events).forEach(name => {
          this[this.events[name]] = this[this.events[name]].bind(this);
          this.addEventListener(name, this[this.events[name]]);
        });
      }
    }

    this.render();
  },
  disconnected() {
    if (this.events) {
      Object.keys(this.events).forEach(name => {
        this.removeEventListener(name, this[this.events[name]]);
      });
    }
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
