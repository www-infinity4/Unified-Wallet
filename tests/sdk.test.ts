import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { UnifiedWallet } from '../src/sdk.ts'

const TEST_CONFIG = {
  apiKey: 'test-key',
  apiUrl: 'http://localhost:3000',
  appName: 'Test App',
}

const globalFetch = globalThis.fetch

describe('UnifiedWallet SDK', () => {
  beforeEach(() => {
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = new URL(input.toString())
      if (url.pathname === '/ledger/balance') {
        return Response.json({ balance: 42 })
      }
      if (url.pathname === '/ledger/collect') {
        return Response.json({ id: '1', amount: 10, reason: 'test', type: 'credit', createdAt: new Date().toISOString() })
      }
      if (url.pathname === '/ledger') {
        return Response.json([])
      }
      return Response.json({}, { status: 404 })
    }
  })

  afterEach(() => {
    globalThis.fetch = globalFetch
  })

  it('connects with mock provider', async () => {
    const wallet = new UnifiedWallet(TEST_CONFIG)
    const account = await wallet.connect('mock')
    expect(account.address).toContain('mock-solana')
    expect(wallet.isConnected()).toBe(true)
  })

  it('fetches balance after connect', async () => {
    const wallet = new UnifiedWallet(TEST_CONFIG)
    await wallet.connect('mock')
    const balance = await wallet.getBalance()
    expect(balance).toBe(42)
  })

  it('collects stars', async () => {
    const wallet = new UnifiedWallet(TEST_CONFIG)
    await wallet.connect('mock')
    await wallet.collectStars(10, 'reward')
    expect(wallet.state.balance).toBe(52)
  })

  it('disconnects and clears state', async () => {
    const wallet = new UnifiedWallet(TEST_CONFIG)
    await wallet.connect('mock')
    await wallet.disconnect()
    expect(wallet.isConnected()).toBe(false)
    expect(wallet.state.account).toBeNull()
  })
})


describe('Cloudflare reward mode', () => {
  afterEach(() => {
    globalThis.fetch = globalFetch
  })

  it('maps a share reference to StarQuest attemptId and contentId', async () => {
    let body: Record<string, unknown> | null = null
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(input.toString())
      if (url.pathname === '/v1/shares') {
        body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
        return Response.json({ ok: true, credited: true, state: { starCoins: 7 } })
      }
      if (url.pathname === '/v1/state') {
        return Response.json({ starCoins: 7 })
      }
      return Response.json({}, { status: 404 })
    }

    const wallet = new UnifiedWallet({
      ...TEST_CONFIG,
      cloudflare: {
        starquestUrl: 'https://starquest.example',
        getDeviceToken: () => 'sq_abcdefghijklmnopqrstuvwxyzABCDEFGH',
      },
    })

    await wallet.reward('share', 'share-attempt-123', { contentId: 'card-456' })
    expect(body).toEqual({ attemptId: 'share-attempt-123', contentId: 'card-456' })
  })

  it('rejects a share without contentId before calling the network', async () => {
    let calls = 0
    globalThis.fetch = async () => {
      calls += 1
      return Response.json({})
    }

    const wallet = new UnifiedWallet({
      ...TEST_CONFIG,
      cloudflare: {
        starquestUrl: 'https://starquest.example',
        getDeviceToken: () => 'sq_abcdefghijklmnopqrstuvwxyzABCDEFGH',
      },
    })

    await expect(wallet.reward('share', 'share-attempt-123')).rejects.toThrow('contentId is required')
    expect(calls).toBe(0)
  })
})
