import { WalletAccount, WalletProvider } from '../types.ts';

export declare abstract class BaseWalletProvider implements WalletProvider {
    abstract readonly name: string;
    abstract readonly chains: string[];
    protected _account: WalletAccount | null;
    abstract isAvailable(): boolean;
    abstract connect(chain?: string): Promise<WalletAccount>;
    abstract disconnect(): Promise<void>;
    abstract signMessage(message: string): Promise<string>;
    get account(): WalletAccount | null;
    protected setAccount(account: WalletAccount): void;
    protected clearAccount(): void;
}
