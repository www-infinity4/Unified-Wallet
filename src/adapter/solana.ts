import type { WalletAccount } from '../types.ts'
import { BaseWalletProvider } from './base.ts'

interface SolanaWindow {
  solana?: {
    isPhantom?: boolean
    connect(): Promise<{ publicKey: { toString(): string } }>
    disconnect(): Promise<void>
    signMessage(message: Uint8Array, encoding: string): Promise<{ signature: Uint8Array }>
  }
}

export class SolanaWalletProvider extends BaseWalletProvider {
  readonly name = 'phantom-solana'
  readonly chains = ['solana']

  private get injected() {
    return (window as unknown as SolanaWindow).solana
  }

  isAvailable(): boolean {
    return !!(this.injected?.isPhantom)
  }

  async connect(): Promise<WalletAccount> {
    if (!this.injected) {
      throw new Error('Phantom wallet not installed')
    }
    const { publicKey } = await this.injected.connect()
    const account: WalletAccount = {
      address: publicKey.toString(),
      chain: 'solana',
      publicKey: publicKey.toString(),
    }
    this.setAccount(account)
    return account
  }

  async disconnect(): Promise<void> {
    await this.injected?.disconnect()
    this.clearAccount()
  }

  async signMessage(message: string): Promise<string> {
    if (!this.injected || !this._account) {
      throw new Error('Wallet not connected')
    }
    const encoded = new TextEncoder().encode(message)
    const { signature } = await this.injected.signMessage(encoded, 'utf8')
    return btoa(String.fromCharCode(...signature))
  }
}
