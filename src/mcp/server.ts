import type { LedgerEntry } from '../types.ts'
import type { LedgerToolParams, PayoutToolParams, HistoryToolParams, MCPResult } from './tools.ts'

export interface LedgerRecord extends LedgerEntry {
  userId: string
  asset: 'star-coin' | 'infinity-token'
  status: 'pending' | 'completed' | 'failed'
}

export interface MCPAccount {
  userId: string
  balances: Record<string, number>
}

export interface LedgerBackend {
  getAccount(userId: string): Promise<MCPAccount>
  record(params: LedgerToolParams): Promise<LedgerRecord>
  payout(params: PayoutToolParams): Promise<LedgerRecord>
  history(params: HistoryToolParams): Promise<LedgerRecord[]>
}

export class InMemoryLedgerBackend implements LedgerBackend {
  private accounts: Map<string, MCPAccount> = new Map()
  private records: LedgerRecord[] = []

  async getAccount(userId: string): Promise<MCPAccount> {
    let account = this.accounts.get(userId)
    if (!account) {
      account = { userId, balances: { 'star-coin': 0, 'infinity-token': 0 } }
      this.accounts.set(userId, account)
    }
    return account
  }

  async record(params: LedgerToolParams): Promise<LedgerRecord> {
    const account = await this.getAccount(params.userId)
    const record: LedgerRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: params.userId,
      asset: params.asset,
      amount: params.amount,
      reason: params.reason,
      type: params.amount >= 0 ? 'credit' : 'debit',
      status: 'completed',
      createdAt: new Date().toISOString(),
      metadata: params.metadata,
    }
    account.balances[params.asset] += params.amount
    this.records.push(record)
    return record
  }

  async payout(params: PayoutToolParams): Promise<LedgerRecord> {
    const account = await this.getAccount(params.userId)
    if (account.balances[params.asset] < params.amount) {
      throw new Error(`Insufficient ${params.asset} balance for payout`)
    }
    const record: LedgerRecord = {
      id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: params.userId,
      asset: params.asset,
      amount: -params.amount,
      reason: `Payout to ${params.destination}: ${params.reason}`,
      type: 'debit',
      status: 'completed',
      createdAt: new Date().toISOString(),
      metadata: { destination: params.destination },
    }
    account.balances[params.asset] -= params.amount
    this.records.push(record)
    return record
  }

  async history(params: HistoryToolParams): Promise<LedgerRecord[]> {
    const records = this.records.filter((r) => r.userId === params.userId)
    if (params.asset) {
      return records.filter((r) => r.asset === params.asset).slice(-(params.limit ?? 50))
    }
    return records.slice(-(params.limit ?? 50))
  }
}

export class StarCoinMCPServer {
  constructor(private readonly backend: LedgerBackend = new InMemoryLedgerBackend()) {}

  private async guard<T>(fn: () => Promise<T>): Promise<MCPResult<T>> {
    try {
      const data = await fn()
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        data,
      }
    } catch (err) {
      return {
        content: [{ type: 'text', text: err instanceof Error ? err.message : String(err) }],
        data: undefined as unknown as T,
        isError: true,
      }
    }
  }

  async ledger(params: LedgerToolParams): Promise<MCPResult<LedgerRecord>> {
    return this.guard(() => this.backend.record(params))
  }

  async payout(params: PayoutToolParams): Promise<MCPResult<LedgerRecord>> {
    return this.guard(() => this.backend.payout(params))
  }

  async history(params: HistoryToolParams): Promise<MCPResult<LedgerRecord[]>> {
    return this.guard(() => this.backend.history(params))
  }

  async balance(userId: string): Promise<MCPResult<MCPAccount>> {
    return this.guard(() => this.backend.getAccount(userId))
  }
}
