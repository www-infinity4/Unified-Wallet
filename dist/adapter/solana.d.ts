import { WalletAccount } from '../types.ts';
import { BaseWalletProvider } from './base.ts';

export declare class SolanaWalletProvider extends BaseWalletProvider {
    readonly name = "phantom-solana";
    readonly chains: string[];
    private get injected();
    isAvailable(): boolean;
    connect(): Promise<WalletAccount>;
    disconnect(): Promise<void>;
    signMessage(message: string): Promise<string>;
}
