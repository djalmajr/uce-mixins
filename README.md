## uce-mixins

Provides an events and state mixins to enhance [uce](https://github.com/WebReflection/uce) lib.

### Example

```js
import { css, define } from "https://unpkg.com/uce?module";
import mixin, { events, state } from "https://unpkg.com/uce-mixins?module";

define("my-loader", mixin(events, {
  props: {
    loading: false,
  },
  handleClick() {
    this.emit("catch", "You caught me!");
  },
  render() {
    const { loading } = this;

    this.html`
      <p onclick=${this.handleClick}>
        <span>${loading ? "Decreasing..." : ""}</span>
      </p>
    `;
  },
}));

define("my-counter", mixin(events, state, {
  style(el) {
    return css`
      ${el} span {
        font-size: 2em;
        display: inline-block;
        text-align: center;
        width: 4rem;
      }
      ${el} button {
        background-color: seagreen;
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 2em;
        height: 64px;
        width: 64px;
      }
    `;
  },
  state: {
    count: 0,
    loading: false,
  },
  events: {
    catch: "handleCatch",
  },
  async dec() {
    if (this.state.loading) return;

    this.setState({ loading: true }, console.log);

    await new Promise((resolve) => {
      setTimeout(() => {
        this.setState(
          (s) => ({ count: s.count - 1, loading: false }),
          console.log
        );
        resolve();
      }, 1000);
    });
  },
  inc() {
    this.setState((s) => ({ count: s.count + 1 }));
  },
  handleCatch(evt) {
    alert(evt.detail);
  },
  render() {
    const { count, loading } = this.state;

    this.html`
      <button onclick="${this.dec}">-</button>
      <span>${count}</span>
      <button onclick="${this.inc}">+</button>
      <my-loader .loading=${loading} />
    `;
  },
}));
```

Result: https://codepen.io/djalmajr/pen/vYGjWrG
