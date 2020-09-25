export default {
  // init() {
  //   const accessor = (update, props, key, value) => {
  //     props[key] = {
  //       get: () => value,
  //       set: (v) => v !== value && ((value = v), update()),
  //     };
  //   };

  //   const reactive = (update, defaults = {}) => {
  //     const props = {};
  //     const keys = Object.keys(defaults);

  //     for (let i = 0, key; (key = keys[i]); i++) {
  //       accessor(update, props, key, defaults[key]);
  //     }

  //     return Object.defineProperties({}, props);
  //   };

  //   this.state = reactive(this.render, this.state);
  //   this.render();
  // },
  setState(data, callback) {
    const validTypes = ["function", "object"];

    if (!validTypes.includes(typeof data) || Array.isArray(data)) {
      throw new Error("Invalid data type!");
    }

    this.state =
      typeof data === "function"
        ? data(this.state)
        : Object.assign(this.state, data);

    this.render();
    callback && callback(this.state);
  },
};
