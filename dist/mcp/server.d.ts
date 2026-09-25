import { LedgerEntry } from '../types.ts';
import { LedgerToolParams, PayoutToolParams, HistoryToolParams, MCPResult } from './tools.ts';

export interface LedgerRecord extends LedgerEntry {
    userId: string;
    asset: 'star-coin' | 'infinity-token';
    status: 'pending' | 'completed' | 'failed';
}
export interface MCPAccount {
    userId: string;
    balances: Record<string, number>;
}
export interface LedgerBackend {
    getAccount(userId: string): Promise<MCPAccount>;
    record(params: LedgerToolParams): Promise<LedgerRecord>;
    payout(params: PayoutToolParams): Promise<LedgerRecord>;
    history(params: HistoryToolParams): Promise<LedgerRecord[]>;
}
export declare class InMemoryLedgerBackend implements LedgerBackend {
    private accounts;
    private records;
    getAccount(userId: string): Promise<MCPAccount>;
    record(params: LedgerToolParams): Promise<LedgerRecord>;
    payout(params: PayoutToolParams): Promise<LedgerRecord>;
    history(params: HistoryToolParams): Promise<LedgerRecord[]>;
}
export declare class StarCoinMCPServer {
    private readonly backend;
    constructor(backend?: LedgerBackend);
    private guard;
    ledger(params: LedgerToolParams): Promise<MCPResult<LedgerRecord>>;
    payout(params: PayoutToolParams): Promise<MCPResult<LedgerRecord>>;
    history(params: HistoryToolParams): Promise<MCPResult<LedgerRecord[]>>;
    balance(userId: string): Promise<MCPResult<MCPAccount>>;
}
