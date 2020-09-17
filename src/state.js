export default {
  async setState(data, callback) {
    const validTypes = ["function", "object"];

    if (!validTypes.includes(typeof data) || Array.isArray(data)) {
      throw new Error("Invalid data type!");
    }

    this.state =
      typeof data === "function"
        ? data(this.state)
        : Object.assign(this.state, data);

    // An attempt to make the "caller" method
    // terminate (specially if we face a async code)
    // before call the "render" again.
    await new Promise(setTimeout);

    this.render();
    callback && callback(this.state);
  },
};
