import { describe, it, expect } from 'vitest'
import { StarCoinMCPServer, InMemoryLedgerBackend } from '../src/mcp/index.ts'

const backend = new InMemoryLedgerBackend()
const server = new StarCoinMCPServer(backend)

const USER = 'user-1'

describe('StarCoin MCP Server', () => {
  it('credits star-coins and returns balance', async () => {
    await server.ledger({ userId: USER, asset: 'star-coin', amount: 100, reason: 'signup bonus' })
    const balance = await server.balance(USER)
    expect(balance.data.balances['star-coin']).toBe(100)
  })

  it('credits infinity-tokens', async () => {
    await server.ledger({ userId: USER, asset: 'infinity-token', amount: 5, reason: 'airdrop' })
    const balance = await server.balance(USER)
    expect(balance.data.balances['infinity-token']).toBe(5)
  })

  it('payout debits balance', async () => {
    await server.payout({
      userId: USER,
      asset: 'star-coin',
      amount: 20,
      destination: 'wallet-abc',
      reason: 'withdrawal',
    })
    const balance = await server.balance(USER)
    expect(balance.data.balances['star-coin']).toBe(80)
  })

  it('returns history for user', async () => {
    const history = await server.history({ userId: USER, asset: 'star-coin' })
    expect(history.data.length).toBeGreaterThanOrEqual(2)
  })
})
