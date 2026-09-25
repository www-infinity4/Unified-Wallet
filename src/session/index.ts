import type { WalletAccount } from '../types.ts'

export interface Session {
  token: string
  account: WalletAccount
  expiresAt: number
}

export interface SessionStore {
  get(): Session | null
  set(session: Session): void
  clear(): void
}

export class MemorySessionStore implements SessionStore {
  private session: Session | null = null

  get(): Session | null {
    return this.session
  }

  set(session: Session): void {
    this.session = session
  }

  clear(): void {
    this.session = null
  }
}

export function createSession(account: WalletAccount, ttlMs = 3600000): Session {
  return {
    token: `session-${Math.random().toString(36).slice(2)}`,
    account,
    expiresAt: Date.now() + ttlMs,
  }
}

export function isSessionValid(session: Session | null): boolean {
  return !!session && session.expiresAt > Date.now()
}
