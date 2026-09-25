import type { WalletAccount, WalletProvider } from '../types.ts'

export abstract class BaseWalletProvider implements WalletProvider {
  abstract readonly name: string
  abstract readonly chains: string[]

  protected _account: WalletAccount | null = null

  abstract isAvailable(): boolean

  abstract connect(chain?: string): Promise<WalletAccount>

  abstract disconnect(): Promise<void>

  abstract signMessage(message: string): Promise<string>

  get account(): WalletAccount | null {
    return this._account
  }

  protected setAccount(account: WalletAccount): void {
    this._account = account
  }

  protected clearAccount(): void {
    this._account = null
  }
}
