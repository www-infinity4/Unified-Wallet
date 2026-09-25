import type { LedgerEntry } from '../types.ts'

export interface LedgerToolParams {
  userId: string
  asset: 'star-coin' | 'infinity-token'
  amount: number
  reason: string
  metadata?: Record<string, unknown>
}

export interface PayoutToolParams {
  userId: string
  asset: 'star-coin' | 'infinity-token'
  amount: number
  destination: string
  reason: string
}

export interface HistoryToolParams {
  userId: string
  asset?: 'star-coin' | 'infinity-token'
  limit?: number
}

export interface MCPTool<T> {
  name: string
  description: string
  inputSchema: object
  execute(params: T): Promise<unknown>
}

export interface MCPResult<T> {
  content: Array<{ type: 'text'; text: string }>
  data: T
  isError?: boolean
}

export function success<T>(data: T, summary?: string): MCPResult<T> {
  return {
    content: [{ type: 'text', text: summary ?? JSON.stringify(data, null, 2) }],
    data,
  }
}

export function error(message: string): MCPResult<never> {
  return {
    content: [{ type: 'text', text: message }],
    data: undefined as never,
    isError: true,
  }
}
