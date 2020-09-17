import $ from "assign-properties";
import { arr, by, fns } from './helpers';
export * from './events';
export * from './state';

export function mixin(...mixins) {
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

