import { WalletAccount } from '../types.ts';

export interface Session {
    token: string;
    account: WalletAccount;
    expiresAt: number;
}
export interface SessionStore {
    get(): Session | null;
    set(session: Session): void;
    clear(): void;
}
export declare class MemorySessionStore implements SessionStore {
    private session;
    get(): Session | null;
    set(session: Session): void;
    clear(): void;
}
export declare function createSession(account: WalletAccount, ttlMs?: number): Session;
export declare function isSessionValid(session: Session | null): boolean;
