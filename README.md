# Unified Wallet

A plug-and-play wallet SDK and star-coin / infinity-token ledger that other websites can drop in with one script tag or npm install.

## Quick start

### HTML / Vanilla JS

```html
<script type="module">
  import { UnifiedWallet } from 'https://cdn.example.com/unified-wallet.js'
  const wallet = new UnifiedWallet({ apiKey: 'YOUR_KEY', appName: 'My Site' })
  await wallet.connect()
  await wallet.collectStars(10, 'welcome bonus')
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
| `wallet.connect(provider?, chain?)` | Connect a wallet |
| `wallet.getBalance()` | Get current star-coin balance |
| `wallet.collectStars(amount, reason)` | Credit star-coins |
| `wallet.getLedger(limit?)` | List ledger entries |
| `wallet.disconnect()` | Disconnect wallet |

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
