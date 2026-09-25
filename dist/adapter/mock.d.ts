import { WalletAccount } from '../types.ts';
import { BaseWalletProvider } from './base.ts';

export declare class MockWalletProvider extends BaseWalletProvider {
    readonly name = "mock";
    readonly chains: string[];
    isAvailable(): boolean;
    connect(chain?: string): Promise<WalletAccount>;
    disconnect(): Promise<void>;
    signMessage(message: string): Promise<string>;
}
