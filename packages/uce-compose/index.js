import $ from "assign-properties";

const by = (prop) => (obj) => obj[prop];
const arr = ["bound", "observedAttributes"];
const fns = ["init", "connected", "disconnected", "attributeChanged"];

export default function (...mixins) {
  const props = mixins.filter(by("props")).reduce((r, m) => $(r, m.props), {});
  const merged = { props };

  for (let i = 0, fn; (fn = fns[i]); i++) {
    merged[fn] = function (...args) {
      const cbs = mixins.filter(by(fn)).map(by(fn));
      for (let j = 0, cb; (cb = cbs[j]); j++) cb.apply(this, args);
    };
  }

  for (let i = 0, key; (key = arr[i]); i++) {
    merged[key] = new Set(mixins.reduce((p, c) => p.concat(c[key] || []), []));
  }

  return $({}, ...mixins, merged);
}
