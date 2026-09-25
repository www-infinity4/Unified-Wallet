import type { LedgerEntry, WalletAccount } from '../types.ts'

export interface LedgerClientConfig {
  apiKey: string
  apiUrl: string
  account: WalletAccount
}

export class LedgerClient {
  constructor(private readonly config: LedgerClientConfig) {}

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = new URL(path, this.config.apiUrl)
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'X-Wallet-Address': this.config.account.address,
        'X-Chain': this.config.account.chain,
        ...options.headers,
      },
    })
    if (!response.ok) {
      throw new Error(`Ledger API error: ${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<T>
  }

  async getBalance(): Promise<number> {
    const { balance } = await this.request<{ balance: number }>('/ledger/balance')
    return balance
  }

  async collectStars(amount: number, reason: string, metadata?: Record<string, unknown>): Promise<LedgerEntry> {
    return this.request<LedgerEntry>('/ledger/collect', {
      method: 'POST',
      body: JSON.stringify({ amount, reason, metadata }),
    })
  }

  async spendStars(amount: number, reason: string, metadata?: Record<string, unknown>): Promise<LedgerEntry> {
    return this.request<LedgerEntry>('/ledger/spend', {
      method: 'POST',
      body: JSON.stringify({ amount, reason, metadata }),
    })
  }

  async getLedger(limit = 50): Promise<LedgerEntry[]> {
    return this.request<LedgerEntry[]>(`/ledger?limit=${limit}`)
  }
}
