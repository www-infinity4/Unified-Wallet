import { LedgerEntry, WalletAccount } from '../types.ts';

export interface LedgerClientConfig {
    apiKey: string;
    apiUrl: string;
    account: WalletAccount;
}
export declare class LedgerClient {
    private readonly config;
    constructor(config: LedgerClientConfig);
    private request;
    getBalance(): Promise<number>;
    collectStars(amount: number, reason: string, metadata?: Record<string, unknown>): Promise<LedgerEntry>;
    spendStars(amount: number, reason: string, metadata?: Record<string, unknown>): Promise<LedgerEntry>;
    getLedger(limit?: number): Promise<LedgerEntry[]>;
}
