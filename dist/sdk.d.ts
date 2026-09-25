import { WalletAccount, WalletConfig, WalletProvider, WalletState } from './types.ts';

export declare class UnifiedWallet {
    private readonly config;
    private readonly providers;
    private readonly sessions;
    private activeProvider;
    private ledger;
    private _state;
    constructor(config: WalletConfig);
    get state(): WalletState;
    registerProvider(provider: WalletProvider): void;
    connect(providerName?: string, chain?: string): Promise<WalletAccount>;
    disconnect(): Promise<void>;
    getBalance(): Promise<number>;
    collectStars(amount: number, reason: string, metadata?: Record<string, unknown>): Promise<void>;
    getLedger(limit?: number): Promise<import('./types.ts').LedgerEntry[]>;
    signMessage(message: string): Promise<string>;
    isConnected(): boolean;
    private refreshBalance;
}
