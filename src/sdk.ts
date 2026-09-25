import type { WalletAccount, WalletConfig, WalletProvider, WalletState } from './types.ts'
import { MockWalletProvider } from './adapter/mock.ts'
import { LedgerClient } from './ledger/client.ts'
import { CloudflareLedgerAdapter, type RewardAction } from './ledger/cloudflare.ts'
import { createSession, isSessionValid, MemorySessionStore, type SessionStore } from './session/index.ts'

export class UnifiedWallet {
  private readonly config: WalletConfig & { apiUrl: string; chains: string[] }
  private readonly providers: Map<string, WalletProvider> = new Map()
  private readonly sessions: SessionStore
  private activeProvider: WalletProvider | null = null
  private ledger: LedgerClient | null = null
  private cloudflare: CloudflareLedgerAdapter | null = null

  private _state: WalletState = {
    connected: false,
    account: null,
    balance: 0,
  }

  constructor(config: WalletConfig) {
    this.config = {
      apiUrl: 'https://api.unifiedwallet.example',
      chains: ['solana'],
      ...config,
    }
    this.sessions = new MemorySessionStore()
    if (config.cloudflare) this.cloudflare = new CloudflareLedgerAdapter(config.cloudflare)
    this.registerProvider(new MockWalletProvider())
  }

  get state(): WalletState {
    return { ...this._state }
  }

  registerProvider(provider: WalletProvider): void {
    this.providers.set(provider.name, provider)
  }

  async connect(providerName?: string, chain?: string): Promise<WalletAccount> {
    const provider = providerName
      ? this.providers.get(providerName)
      : Array.from(this.providers.values()).find((p) => p.isAvailable())

    if (!provider) {
      throw new Error(`No wallet provider available${providerName ? ` for "${providerName}"` : ''}`)
    }

    const account = await provider.connect(chain ?? this.config.chains[0])
    this.activeProvider = provider
    this.ledger = new LedgerClient({
      apiKey: this.config.apiKey,
      apiUrl: this.config.apiUrl,
      account,
    })

    const session = createSession(account)
    this.sessions.set(session)

    this._state = {
      ...this._state,
      connected: true,
      account,
    }

    await this.refreshBalance()
    return account
  }

  async disconnect(): Promise<void> {
    await this.activeProvider?.disconnect()
    this.sessions.clear()
    this.ledger = null
    this.activeProvider = null
    this._state = {
      connected: false,
      account: null,
      balance: 0,
    }
  }

  async getBalance(): Promise<number> {
    if (this.cloudflare) {
      await this.refreshCloudflareState()
      return this._state.balance
    }
    return this.refreshBalance()
  }

  async collectStars(amount: number, reason: string, metadata?: Record<string, unknown>): Promise<void> {
    const entry = await this.ledger?.collectStars(amount, reason, metadata)
    if (entry) {
      this._state.balance += entry.amount
    }
  }

  async getLedger(limit?: number): Promise<import('./types.ts').LedgerEntry[]> {
    return this.ledger?.getLedger(limit) ?? []
  }

  /** Production-safe reward path. The server, not the browser, decides the amount. */
  async reward(action: RewardAction, referenceId: string, metadata?: Record<string, unknown>): Promise<unknown> {
    if (!this.cloudflare) throw new Error('Cloudflare ledger is not configured')
    const result = await this.cloudflare.reward(action, referenceId, metadata)
    await this.refreshCloudflareState()
    return result
  }

  async getCloudflareState(): Promise<unknown> {
    if (!this.cloudflare) throw new Error('Cloudflare ledger is not configured')
    return this.cloudflare.state()
  }

  private async refreshCloudflareState(): Promise<void> {
    if (!this.cloudflare) return
    const state = await this.cloudflare.state() as { starCoins?: number }
    if (typeof state.starCoins === 'number') {
      this._state = { ...this._state, balance: state.starCoins }
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.activeProvider) throw new Error('Wallet not connected')
    return this.activeProvider.signMessage(message)
  }

  isConnected(): boolean {
    const session = this.sessions.get()
    return this._state.connected && isSessionValid(session)
  }

  private async refreshBalance(): Promise<number> {
    if (!this.ledger) return this._state.balance
    const balance = await this.ledger.getBalance()
    this._state = { ...this._state, balance }
    return balance
  }
}
