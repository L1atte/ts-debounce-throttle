function w(s, h = 100, e) {
  let t;
  const f = (e == null ? void 0 : e.immediate) ?? !1, i = e == null ? void 0 : e.maxWait, o = (e == null ? void 0 : e.callback) ?? !1;
  let l = Date.now(), u = [];
  const d = () => {
    if (i !== void 0) {
      const c = Date.now() - l, a = i - c;
      return Math.max(a, 0);
    }
    return h;
  }, n = function(...c) {
    const a = this;
    return new Promise((v, k) => {
      const I = function() {
        if (t = void 0, l = Date.now(), !f) {
          const m = s.apply(a, c);
          o && o(m), u.forEach(({ resolve: x }) => x(m)), u = [];
        }
      }, r = f && t === void 0;
      if (t !== void 0 && clearTimeout(t), t = setTimeout(I, d()), r) {
        const m = s.apply(a, c);
        return o && o(m), v(m);
      }
      u.push({ resolve: v, reject: k });
    });
  };
  return n.cancel = function(c) {
    t !== void 0 && clearTimeout(t), u.forEach(({ reject: a }) => a(c)), u = [];
  }, n;
}
function D(s, h = 100, e) {
  let t;
  const f = (e == null ? void 0 : e.immediate) ?? !1, i = (e == null ? void 0 : e.callback) ?? !1;
  let o = Date.now(), l = [];
  const u = () => {
    const n = Date.now() - o, c = h - n;
    return Math.max(c, 0);
  }, d = function(...n) {
    const c = this;
    return new Promise((a, v) => {
      const k = function() {
        if (t = void 0, o = Date.now(), !f) {
          const r = s.apply(c, n);
          i && i(r), l.forEach(({ resolve: m }) => m(r)), l = [];
        }
      }, I = f && t === void 0;
      if (t !== void 0 && clearTimeout(t), t = setTimeout(k, u()), I) {
        const r = s.apply(c, n);
        return i && i(r), a(r);
      }
      l.push({ resolve: a, reject: v });
    });
  };
  return d.cancel = function(n) {
    t !== void 0 && clearTimeout(t), l.forEach(({ reject: c }) => c(n)), l = [];
  }, d;
}
export {
  w as debounce,
  D as throttle
};
