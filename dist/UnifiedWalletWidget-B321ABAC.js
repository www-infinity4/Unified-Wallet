var dr = Object.defineProperty;
var vr = (f, n, o) => n in f ? dr(f, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : f[n] = o;
var T = (f, n, o) => vr(f, typeof n != "symbol" ? n + "" : n, o);
import Ce, { useState as N, useEffect as hr } from "react";
class pr {
  constructor() {
    T(this, "_account", null);
  }
  get account() {
    return this._account;
  }
  setAccount(n) {
    this._account = n;
  }
  clearAccount() {
    this._account = null;
  }
}
class gr extends pr {
  constructor() {
    super(...arguments);
    T(this, "name", "mock");
    T(this, "chains", ["solana", "ethereum"]);
  }
  isAvailable() {
    return !0;
  }
  async connect(o = "solana") {
    const u = {
      address: `mock-${o}-${Math.random().toString(36).slice(2, 10)}`,
      chain: o,
      publicKey: `pk-${Math.random().toString(36).slice(2, 10)}`
    };
    return this.setAccount(u), u;
  }
  async disconnect() {
    this.clearAccount();
  }
  async signMessage(o) {
    if (!this._account) throw new Error("Wallet not connected");
    return `signed:${o}`;
  }
}
class yr {
  constructor(n) {
    this.config = n;
  }
  async request(n, o = {}) {
    const u = new URL(n, this.config.apiUrl), h = await fetch(u.toString(), {
      ...o,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.config.apiKey,
        "X-Wallet-Address": this.config.account.address,
        "X-Chain": this.config.account.chain,
        ...o.headers
      }
    });
    if (!h.ok)
      throw new Error(`Ledger API error: ${h.status} ${h.statusText}`);
    return h.json();
  }
  async getBalance() {
    const { balance: n } = await this.request("/ledger/balance");
    return n;
  }
  async collectStars(n, o, u) {
    return this.request("/ledger/collect", {
      method: "POST",
      body: JSON.stringify({ amount: n, reason: o, metadata: u })
    });
  }
  async spendStars(n, o, u) {
    return this.request("/ledger/spend", {
      method: "POST",
      body: JSON.stringify({ amount: n, reason: o, metadata: u })
    });
  }
  async getLedger(n = 50) {
    return this.request(`/ledger?limit=${n}`);
  }
}
class br {
  constructor() {
    T(this, "session", null);
  }
  get() {
    return this.session;
  }
  set(n) {
    this.session = n;
  }
  clear() {
    this.session = null;
  }
}
function _r(f, n = 36e5) {
  return {
    token: `session-${Math.random().toString(36).slice(2)}`,
    account: f,
    expiresAt: Date.now() + n
  };
}
function mr(f) {
  return !!f && f.expiresAt > Date.now();
}
class Er {
  constructor(n) {
    T(this, "config");
    T(this, "providers", /* @__PURE__ */ new Map());
    T(this, "sessions");
    T(this, "activeProvider", null);
    T(this, "ledger", null);
    T(this, "_state", {
      connected: !1,
      account: null,
      balance: 0
    });
    this.config = {
      apiUrl: "https://api.unifiedwallet.example",
      chains: ["solana"],
      ...n
    }, this.sessions = new br(), this.registerProvider(new gr());
  }
  get state() {
    return { ...this._state };
  }
  registerProvider(n) {
    this.providers.set(n.name, n);
  }
  async connect(n, o) {
    const u = n ? this.providers.get(n) : Array.from(this.providers.values()).find((P) => P.isAvailable());
    if (!u)
      throw new Error(`No wallet provider available${n ? ` for "${n}"` : ""}`);
    const h = await u.connect(o ?? this.config.chains[0]);
    this.activeProvider = u, this.ledger = new yr({
      apiKey: this.config.apiKey,
      apiUrl: this.config.apiUrl,
      account: h
    });
    const R = _r(h);
    return this.sessions.set(R), this._state = {
      ...this._state,
      connected: !0,
      account: h
    }, await this.refreshBalance(), h;
  }
  async disconnect() {
    var n;
    await ((n = this.activeProvider) == null ? void 0 : n.disconnect()), this.sessions.clear(), this.ledger = null, this.activeProvider = null, this._state = {
      connected: !1,
      account: null,
      balance: 0
    };
  }
  async getBalance() {
    return this.refreshBalance();
  }
  async collectStars(n, o, u) {
    var R;
    const h = await ((R = this.ledger) == null ? void 0 : R.collectStars(n, o, u));
    h && (this._state.balance += h.amount);
  }
  async getLedger(n) {
    var o;
    return ((o = this.ledger) == null ? void 0 : o.getLedger(n)) ?? [];
  }
  async signMessage(n) {
    if (!this.activeProvider) throw new Error("Wallet not connected");
    return this.activeProvider.signMessage(n);
  }
  isConnected() {
    const n = this.sessions.get();
    return this._state.connected && mr(n);
  }
  async refreshBalance() {
    if (!this.ledger) return this._state.balance;
    const n = await this.ledger.getBalance();
    return this._state = { ...this._state, balance: n }, n;
  }
}
var Q = { exports: {} }, I = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Pe;
function Rr() {
  if (Pe) return I;
  Pe = 1;
  var f = Ce, n = Symbol.for("react.element"), o = Symbol.for("react.fragment"), u = Object.prototype.hasOwnProperty, h = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, R = { key: !0, ref: !0, __self: !0, __source: !0 };
  function P(m, p, C) {
    var y, g = {}, O = null, L = null;
    C !== void 0 && (O = "" + C), p.key !== void 0 && (O = "" + p.key), p.ref !== void 0 && (L = p.ref);
    for (y in p) u.call(p, y) && !R.hasOwnProperty(y) && (g[y] = p[y]);
    if (m && m.defaultProps) for (y in p = m.defaultProps, p) g[y] === void 0 && (g[y] = p[y]);
    return { $$typeof: n, type: m, key: O, ref: L, props: g, _owner: h.current };
  }
  return I.Fragment = o, I.jsx = P, I.jsxs = P, I;
}
var M = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Oe;
function wr() {
  return Oe || (Oe = 1, process.env.NODE_ENV !== "production" && function() {
    var f = Ce, n = Symbol.for("react.element"), o = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), h = Symbol.for("react.strict_mode"), R = Symbol.for("react.profiler"), P = Symbol.for("react.provider"), m = Symbol.for("react.context"), p = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), y = Symbol.for("react.suspense_list"), g = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), L = Symbol.for("react.offscreen"), ee = Symbol.iterator, xe = "@@iterator";
    function je(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = ee && e[ee] || e[xe];
      return typeof r == "function" ? r : null;
    }
    var A = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function b(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++)
          t[a - 1] = arguments[a];
        ke("error", e, t);
      }
    }
    function ke(e, r, t) {
      {
        var a = A.ReactDebugCurrentFrame, c = a.getStackAddendum();
        c !== "" && (r += "%s", t = t.concat([c]));
        var l = t.map(function(s) {
          return String(s);
        });
        l.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, l);
      }
    }
    var Ae = !1, De = !1, Fe = !1, We = !1, $e = !1, re;
    re = Symbol.for("react.module.reference");
    function Ie(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === u || e === R || $e || e === h || e === C || e === y || We || e === L || Ae || De || Fe || typeof e == "object" && e !== null && (e.$$typeof === O || e.$$typeof === g || e.$$typeof === P || e.$$typeof === m || e.$$typeof === p || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === re || e.getModuleId !== void 0));
    }
    function Me(e, r, t) {
      var a = e.displayName;
      if (a)
        return a;
      var c = r.displayName || r.name || "";
      return c !== "" ? t + "(" + c + ")" : t;
    }
    function te(e) {
      return e.displayName || "Context";
    }
    function x(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && b("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case u:
          return "Fragment";
        case o:
          return "Portal";
        case R:
          return "Profiler";
        case h:
          return "StrictMode";
        case C:
          return "Suspense";
        case y:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case m:
            var r = e;
            return te(r) + ".Consumer";
          case P:
            var t = e;
            return te(t._context) + ".Provider";
          case p:
            return Me(e, e.render, "ForwardRef");
          case g:
            var a = e.displayName || null;
            return a !== null ? a : x(e.type) || "Memo";
          case O: {
            var c = e, l = c._payload, s = c._init;
            try {
              return x(s(l));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var j = Object.assign, W = 0, ne, ae, ie, se, oe, ce, le;
    function ue() {
    }
    ue.__reactDisabledLog = !0;
    function Le() {
      {
        if (W === 0) {
          ne = console.log, ae = console.info, ie = console.warn, se = console.error, oe = console.group, ce = console.groupCollapsed, le = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ue,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        W++;
      }
    }
    function Ue() {
      {
        if (W--, W === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: j({}, e, {
              value: ne
            }),
            info: j({}, e, {
              value: ae
            }),
            warn: j({}, e, {
              value: ie
            }),
            error: j({}, e, {
              value: se
            }),
            group: j({}, e, {
              value: oe
            }),
            groupCollapsed: j({}, e, {
              value: ce
            }),
            groupEnd: j({}, e, {
              value: le
            })
          });
        }
        W < 0 && b("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var q = A.ReactCurrentDispatcher, K;
    function U(e, r, t) {
      {
        if (K === void 0)
          try {
            throw Error();
          } catch (c) {
            var a = c.stack.trim().match(/\n( *(at )?)/);
            K = a && a[1] || "";
          }
        return `
` + K + e;
      }
    }
    var J = !1, Y;
    {
      var Ye = typeof WeakMap == "function" ? WeakMap : Map;
      Y = new Ye();
    }
    function fe(e, r) {
      if (!e || J)
        return "";
      {
        var t = Y.get(e);
        if (t !== void 0)
          return t;
      }
      var a;
      J = !0;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var l;
      l = q.current, q.current = null, Le();
      try {
        if (r) {
          var s = function() {
            throw Error();
          };
          if (Object.defineProperty(s.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(s, []);
            } catch (E) {
              a = E;
            }
            Reflect.construct(e, [], s);
          } else {
            try {
              s.call();
            } catch (E) {
              a = E;
            }
            e.call(s.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (E) {
            a = E;
          }
          e();
        }
      } catch (E) {
        if (E && a && typeof E.stack == "string") {
          for (var i = E.stack.split(`
`), _ = a.stack.split(`
`), d = i.length - 1, v = _.length - 1; d >= 1 && v >= 0 && i[d] !== _[v]; )
            v--;
          for (; d >= 1 && v >= 0; d--, v--)
            if (i[d] !== _[v]) {
              if (d !== 1 || v !== 1)
                do
                  if (d--, v--, v < 0 || i[d] !== _[v]) {
                    var w = `
` + i[d].replace(" at new ", " at ");
                    return e.displayName && w.includes("<anonymous>") && (w = w.replace("<anonymous>", e.displayName)), typeof e == "function" && Y.set(e, w), w;
                  }
                while (d >= 1 && v >= 0);
              break;
            }
        }
      } finally {
        J = !1, q.current = l, Ue(), Error.prepareStackTrace = c;
      }
      var F = e ? e.displayName || e.name : "", k = F ? U(F) : "";
      return typeof e == "function" && Y.set(e, k), k;
    }
    function Be(e, r, t) {
      return fe(e, !1);
    }
    function Ve(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function B(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return fe(e, Ve(e));
      if (typeof e == "string")
        return U(e);
      switch (e) {
        case C:
          return U("Suspense");
        case y:
          return U("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case p:
            return Be(e.render);
          case g:
            return B(e.type, r, t);
          case O: {
            var a = e, c = a._payload, l = a._init;
            try {
              return B(l(c), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var $ = Object.prototype.hasOwnProperty, de = {}, ve = A.ReactDebugCurrentFrame;
    function V(e) {
      if (e) {
        var r = e._owner, t = B(e.type, e._source, r ? r.type : null);
        ve.setExtraStackFrame(t);
      } else
        ve.setExtraStackFrame(null);
    }
    function Ne(e, r, t, a, c) {
      {
        var l = Function.call.bind($);
        for (var s in e)
          if (l(e, s)) {
            var i = void 0;
            try {
              if (typeof e[s] != "function") {
                var _ = Error((a || "React class") + ": " + t + " type `" + s + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[s] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw _.name = "Invariant Violation", _;
              }
              i = e[s](r, s, a, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (d) {
              i = d;
            }
            i && !(i instanceof Error) && (V(c), b("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", a || "React class", t, s, typeof i), V(null)), i instanceof Error && !(i.message in de) && (de[i.message] = !0, V(c), b("Failed %s type: %s", t, i.message), V(null));
          }
      }
    }
    var qe = Array.isArray;
    function X(e) {
      return qe(e);
    }
    function Ke(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function Je(e) {
      try {
        return he(e), !1;
      } catch {
        return !0;
      }
    }
    function he(e) {
      return "" + e;
    }
    function pe(e) {
      if (Je(e))
        return b("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Ke(e)), he(e);
    }
    var ge = A.ReactCurrentOwner, Xe = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ye, be;
    function ze(e) {
      if ($.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function Ge(e) {
      if ($.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function He(e, r) {
      typeof e.ref == "string" && ge.current;
    }
    function Ze(e, r) {
      {
        var t = function() {
          ye || (ye = !0, b("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function Qe(e, r) {
      {
        var t = function() {
          be || (be = !0, b("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var er = function(e, r, t, a, c, l, s) {
      var i = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: n,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: s,
        // Record the component responsible for creating this element.
        _owner: l
      };
      return i._store = {}, Object.defineProperty(i._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(i, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: a
      }), Object.defineProperty(i, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: c
      }), Object.freeze && (Object.freeze(i.props), Object.freeze(i)), i;
    };
    function rr(e, r, t, a, c) {
      {
        var l, s = {}, i = null, _ = null;
        t !== void 0 && (pe(t), i = "" + t), Ge(r) && (pe(r.key), i = "" + r.key), ze(r) && (_ = r.ref, He(r, c));
        for (l in r)
          $.call(r, l) && !Xe.hasOwnProperty(l) && (s[l] = r[l]);
        if (e && e.defaultProps) {
          var d = e.defaultProps;
          for (l in d)
            s[l] === void 0 && (s[l] = d[l]);
        }
        if (i || _) {
          var v = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          i && Ze(s, v), _ && Qe(s, v);
        }
        return er(e, i, _, c, a, ge.current, s);
      }
    }
    var z = A.ReactCurrentOwner, _e = A.ReactDebugCurrentFrame;
    function D(e) {
      if (e) {
        var r = e._owner, t = B(e.type, e._source, r ? r.type : null);
        _e.setExtraStackFrame(t);
      } else
        _e.setExtraStackFrame(null);
    }
    var G;
    G = !1;
    function H(e) {
      return typeof e == "object" && e !== null && e.$$typeof === n;
    }
    function me() {
      {
        if (z.current) {
          var e = x(z.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function tr(e) {
      return "";
    }
    var Ee = {};
    function nr(e) {
      {
        var r = me();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function Re(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = nr(r);
        if (Ee[t])
          return;
        Ee[t] = !0;
        var a = "";
        e && e._owner && e._owner !== z.current && (a = " It was passed a child from " + x(e._owner.type) + "."), D(e), b('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, a), D(null);
      }
    }
    function we(e, r) {
      {
        if (typeof e != "object")
          return;
        if (X(e))
          for (var t = 0; t < e.length; t++) {
            var a = e[t];
            H(a) && Re(a, r);
          }
        else if (H(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var c = je(e);
          if (typeof c == "function" && c !== e.entries)
            for (var l = c.call(e), s; !(s = l.next()).done; )
              H(s.value) && Re(s.value, r);
        }
      }
    }
    function ar(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === p || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === g))
          t = r.propTypes;
        else
          return;
        if (t) {
          var a = x(r);
          Ne(t, e.props, "prop", a, e);
        } else if (r.PropTypes !== void 0 && !G) {
          G = !0;
          var c = x(r);
          b("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", c || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && b("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ir(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var a = r[t];
          if (a !== "children" && a !== "key") {
            D(e), b("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", a), D(null);
            break;
          }
        }
        e.ref !== null && (D(e), b("Invalid attribute `ref` supplied to `React.Fragment`."), D(null));
      }
    }
    var Se = {};
    function Te(e, r, t, a, c, l) {
      {
        var s = Ie(e);
        if (!s) {
          var i = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (i += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var _ = tr();
          _ ? i += _ : i += me();
          var d;
          e === null ? d = "null" : X(e) ? d = "array" : e !== void 0 && e.$$typeof === n ? (d = "<" + (x(e.type) || "Unknown") + " />", i = " Did you accidentally export a JSX literal instead of a component?") : d = typeof e, b("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", d, i);
        }
        var v = rr(e, r, t, c, l);
        if (v == null)
          return v;
        if (s) {
          var w = r.children;
          if (w !== void 0)
            if (a)
              if (X(w)) {
                for (var F = 0; F < w.length; F++)
                  we(w[F], e);
                Object.freeze && Object.freeze(w);
              } else
                b("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              we(w, e);
        }
        if ($.call(r, "key")) {
          var k = x(e), E = Object.keys(r).filter(function(fr) {
            return fr !== "key";
          }), Z = E.length > 0 ? "{key: someKey, " + E.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Se[k + Z]) {
            var ur = E.length > 0 ? "{" + E.join(": ..., ") + ": ...}" : "{}";
            b(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Z, k, ur, k), Se[k + Z] = !0;
          }
        }
        return e === u ? ir(v) : ar(v), v;
      }
    }
    function sr(e, r, t) {
      return Te(e, r, t, !0);
    }
    function or(e, r, t) {
      return Te(e, r, t, !1);
    }
    var cr = or, lr = sr;
    M.Fragment = u, M.jsx = cr, M.jsxs = lr;
  }()), M;
}
process.env.NODE_ENV === "production" ? Q.exports = Rr() : Q.exports = wr();
var S = Q.exports;
function Pr(f) {
  const [n] = N(() => new Er(f)), [o, u] = N(null), [h, R] = N(0), [P, m] = N("idle");
  hr(() => () => {
    n.disconnect().catch(() => {
    });
  }, [n]);
  const p = async () => {
    m("connecting");
    try {
      const g = await n.connect("mock");
      u(g);
      const O = await n.getBalance();
      R(O), m("connected");
    } catch (g) {
      m(g instanceof Error ? g.message : "connection failed");
    }
  }, C = async () => {
    if (!o) return;
    m("collecting"), await n.collectStars(10, "Widget collect action");
    const g = await n.getBalance();
    R(g), m("collected +10");
  }, y = async () => {
    await n.disconnect(), u(null), R(0), m("disconnected");
  };
  return /* @__PURE__ */ S.jsxs("div", { style: { fontFamily: "system-ui, sans-serif", padding: 16, border: "1px solid #ccc", borderRadius: 8, maxWidth: 320 }, children: [
    /* @__PURE__ */ S.jsxs("h3", { children: [
      f.appName,
      " Wallet"
    ] }),
    o ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
      /* @__PURE__ */ S.jsxs("p", { children: [
        "Address: ",
        /* @__PURE__ */ S.jsxs("code", { children: [
          o.address.slice(0, 12),
          "..."
        ] })
      ] }),
      /* @__PURE__ */ S.jsxs("p", { children: [
        "Balance: ",
        /* @__PURE__ */ S.jsx("strong", { children: h }),
        " ⭐"
      ] }),
      /* @__PURE__ */ S.jsx("button", { onClick: C, children: "Collect 10 Stars" }),
      " ",
      /* @__PURE__ */ S.jsx("button", { onClick: y, children: "Disconnect" })
    ] }) : /* @__PURE__ */ S.jsx("button", { onClick: p, children: "Connect Wallet" }),
    /* @__PURE__ */ S.jsx("p", { style: { fontSize: 12, color: "#666" }, children: P })
  ] });
}
export {
  pr as B,
  yr as L,
  br as M,
  Pr as U,
  gr as a,
  Er as b,
  _r as c,
  mr as i
};
