export interface WalletAccount {
  address: string
  chain: string
  publicKey?: string
}

export interface WalletConfig {
  apiKey: string
  apiUrl?: string
  appName: string
  chains?: string[]
}

export interface LedgerEntry {
  id: string
  amount: number
  reason: string
  type: 'credit' | 'debit'
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface WalletState {
  connected: boolean
  account: WalletAccount | null
  balance: number
}

export interface WalletProvider {
  readonly name: string
  readonly chains: string[]
  isAvailable(): boolean
  connect(chain?: string): Promise<WalletAccount>
  disconnect(): Promise<void>
  signMessage(message: string): Promise<string>
}
