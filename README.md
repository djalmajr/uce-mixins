## uce-mixins

Provides an events and state mixins to enhance [uce](https://github.com/WebReflection/uce) lib.

### Example

```js
import { css, define } from "https://unpkg.com/uce?module";
import { events, mixin, state } from "https://unpkg.com/uce-mixins?module";

define("my-loader", mixin(events, {
  props: {
    loading: false,
  },
  handleEvent() {
    this.emit("catch", "You caught me!");
  },
  render() {
    const { loading } = this;

    this.html`
      <p onclick=${this}>
        <span>${loading ? "Decreasing..." : ""}</span>
      </p>
    `;
  },
}));

/**
 * == events mixin
 *
 * Bound all methods and provides some useful like:
 *
 * - emit method
 * - events attribute
 *
 * == state mixin
 *
 * Works similarly React's state/setState.
 */
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
  // If events is an array, the bound method is handleEvent.
  events: {
    "click button:nth-child(1)": "dec",
    "click button:nth-child(3)": "inc",
    /**
     * If query is not defined, event listeners
     * will be added to this custom element.
     * 
     * PS: this is not necessary as you can use the
     * auto-attach feature from uce... But, if you 
     * would like to use another method name, this 
     * can become handy.
     */
    "catch": "handleCatch",
  },
  // Could be `onCatch` too (auto-attach handler).
  handleCatch(evt) {
    alert(evt.detail);
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
  render() {
    const { count, loading } = this.state;

    this.html`
      <button>-</button>
      <span>${count}</span>
      <button>+</button>
      <my-loader .loading=${loading} />
    `;
  },
}));
```

Result: https://codepen.io/djalmajr/pen/vYGjWrG
