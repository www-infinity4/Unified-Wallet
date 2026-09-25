var a = Object.defineProperty;
var i = (s, t, e) => t in s ? a(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var o = (s, t, e) => i(s, typeof t != "symbol" ? t + "" : t, e);
import { B as r } from "./UnifiedWalletWidget-B321ABAC.js";
import { L as f, M as b, a as S, b as I, U as M, c as A, i as k } from "./UnifiedWalletWidget-B321ABAC.js";
class h extends r {
  constructor() {
    super(...arguments);
    o(this, "name", "phantom-solana");
    o(this, "chains", ["solana"]);
  }
  get injected() {
    return window.solana;
  }
  isAvailable() {
    var e;
    return !!((e = this.injected) != null && e.isPhantom);
  }
  async connect() {
    if (!this.injected)
      throw new Error("Phantom wallet not installed");
    const { publicKey: e } = await this.injected.connect(), n = {
      address: e.toString(),
      chain: "solana",
      publicKey: e.toString()
    };
    return this.setAccount(n), n;
  }
  async disconnect() {
    var e;
    await ((e = this.injected) == null ? void 0 : e.disconnect()), this.clearAccount();
  }
  async signMessage(e) {
    if (!this.injected || !this._account)
      throw new Error("Wallet not connected");
    const n = new TextEncoder().encode(e), { signature: c } = await this.injected.signMessage(n, "utf8");
    return btoa(String.fromCharCode(...c));
  }
}
class d {
  constructor() {
    o(this, "accounts", /* @__PURE__ */ new Map());
    o(this, "records", []);
  }
  async getAccount(t) {
    let e = this.accounts.get(t);
    return e || (e = { userId: t, balances: { "star-coin": 0, "infinity-token": 0 } }, this.accounts.set(t, e)), e;
  }
  async record(t) {
    const e = await this.getAccount(t.userId), n = {
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: t.userId,
      asset: t.asset,
      amount: t.amount,
      reason: t.reason,
      type: t.amount >= 0 ? "credit" : "debit",
      status: "completed",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      metadata: t.metadata
    };
    return e.balances[t.asset] += t.amount, this.records.push(n), n;
  }
  async payout(t) {
    const e = await this.getAccount(t.userId);
    if (e.balances[t.asset] < t.amount)
      throw new Error(`Insufficient ${t.asset} balance for payout`);
    const n = {
      id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: t.userId,
      asset: t.asset,
      amount: -t.amount,
      reason: `Payout to ${t.destination}: ${t.reason}`,
      type: "debit",
      status: "completed",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      metadata: { destination: t.destination }
    };
    return e.balances[t.asset] -= t.amount, this.records.push(n), n;
  }
  async history(t) {
    const e = this.records.filter((n) => n.userId === t.userId);
    return t.asset ? e.filter((n) => n.asset === t.asset).slice(-(t.limit ?? 50)) : e.slice(-(t.limit ?? 50));
  }
}
class y {
  constructor(t = new d()) {
    this.backend = t;
  }
  async guard(t) {
    try {
      const e = await t();
      return {
        content: [{ type: "text", text: JSON.stringify(e, null, 2) }],
        data: e
      };
    } catch (e) {
      return {
        content: [{ type: "text", text: e instanceof Error ? e.message : String(e) }],
        data: void 0,
        isError: !0
      };
    }
  }
  async ledger(t) {
    return this.guard(() => this.backend.record(t));
  }
  async payout(t) {
    return this.guard(() => this.backend.payout(t));
  }
  async history(t) {
    return this.guard(() => this.backend.history(t));
  }
  async balance(t) {
    return this.guard(() => this.backend.getAccount(t));
  }
}
export {
  r as BaseWalletProvider,
  d as InMemoryLedgerBackend,
  f as LedgerClient,
  b as MemorySessionStore,
  S as MockWalletProvider,
  h as SolanaWalletProvider,
  y as StarCoinMCPServer,
  I as UnifiedWallet,
  M as UnifiedWalletWidget,
  A as createSession,
  k as isSessionValid
};
