# Unified Wallet

A plug-and-play wallet SDK backed by the authoritative Cloudflare ledger. Every connected site reads and writes the same StarCoin, Quant, Music Quant, and Infinity state for the same StarQuest identity.

## Quick start

### HTML / Vanilla JS

```html
<script src="https://www-infinity4.github.io/Unified-Wallet/unified-wallet.js"></script>
<script>
  const wallet = new InfinityUnifiedWallet({ appName: 'My Site' })
  const state = await wallet.connect()
  console.log(state.balances)
</script>
```

### React

```tsx
import { UnifiedWalletWidget } from '@infinity4/unified-wallet/widget'

<UnifiedWalletWidget apiKey="YOUR_KEY" appName="My Site" />
```

### npm

```bash
npm install @infinity4/unified-wallet
```

## SDK API

| Method | Description |
| ------ | ----------- |
| `wallet.connect()` | Connect the current StarQuest identity and load every balance |
| `wallet.refresh()` | Reload authoritative Cloudflare state |
| `wallet.importLegacy(...)` | One-time, idempotent browser balance/token migration |
| `wallet.mintToken(type, data, key)` | Store one durable data-backed token |
| `wallet.spendInfinity(...)` | Spend Infinity through the authoritative ledger |
| `wallet.subscribe(listener)` | Receive wallet updates in any website UI |

Local storage is used only to locate the existing StarQuest device credential. Balances and token records come from Cloudflare D1.

## MCP Server

Use `StarCoinMCPServer` to expose ledger, payout, and history tools to agents:

```ts
import { StarCoinMCPServer, InMemoryLedgerBackend } from '@infinity4/unified-wallet'

const server = new StarCoinMCPServer(new InMemoryLedgerBackend())
await server.ledger({ userId: 'u1', asset: 'star-coin', amount: 100, reason: 'task' })
await server.payout({ userId: 'u1', asset: 'star-coin', amount: 20, destination: 'wallet', reason: 'redeem' })
await server.history({ userId: 'u1' })
```

## Development

```bash
npm install
npm run build
npm test
npm run lint
```
