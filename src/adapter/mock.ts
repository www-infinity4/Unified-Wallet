import type { WalletAccount } from '../types.ts'
import { BaseWalletProvider } from './base.ts'

export class MockWalletProvider extends BaseWalletProvider {
  readonly name = 'mock'
  readonly chains = ['solana', 'ethereum']

  isAvailable(): boolean {
    return true
  }

  async connect(chain = 'solana'): Promise<WalletAccount> {
    const account: WalletAccount = {
      address: `mock-${chain}-${Math.random().toString(36).slice(2, 10)}`,
      chain,
      publicKey: `pk-${Math.random().toString(36).slice(2, 10)}`,
    }
    this.setAccount(account)
    return account
  }

  async disconnect(): Promise<void> {
    this.clearAccount()
  }

  async signMessage(message: string): Promise<string> {
    if (!this._account) throw new Error('Wallet not connected')
    return `signed:${message}`
  }
}
