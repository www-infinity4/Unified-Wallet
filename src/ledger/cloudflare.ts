export type RewardAction = 'share' | 'collect' | 'watch' | 'search'

export interface CloudflareLedgerAdapterConfig {
  starquestUrl: string
  infinityUrl?: string
  getDeviceToken: () => string | Promise<string>
}

/**
 * Adapter for Infinity's authoritative Cloudflare ledgers.
 *
 * Browser sites report actions, never reward amounts. The Worker remains
 * authoritative for reward values, idempotency, rate limits and persistence.
 */
export class CloudflareLedgerAdapter {
  constructor(private readonly config: CloudflareLedgerAdapterConfig) {}

  private async starquest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.config.getDeviceToken()
    if (!/^sq_[A-Za-z0-9_-]{32,}$/.test(token)) {
      throw new Error('A valid StarQuest device token is required')
    }
    const response = await fetch(new URL(path, this.config.starquestUrl), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { error?: string; message?: string } | null
      throw new Error(body?.message ?? body?.error ?? `Ledger request failed: ${response.status}`)
    }
    return response.json() as Promise<T>
  }

  async state(): Promise<unknown> {
    return this.starquest('/v1/state')
  }

  async history(): Promise<unknown> {
    return this.starquest('/v1/history')
  }

  /**
   * Reports an action to the server. No amount is accepted intentionally.
   * The authoritative Worker decides whether the action earns a reward.
   */
  async reward(action: RewardAction, referenceId: string, metadata: Record<string, unknown> = {}): Promise<unknown> {
    if (!referenceId.trim()) throw new Error('referenceId is required')
    const routes: Partial<Record<RewardAction, string>> = {
      share: '/v1/shares',
    }
    const path = routes[action]
    if (!path) {
      throw new Error(`Reward action "${action}" is not enabled by the authoritative Worker yet`)
    }
    if (action === 'share') {
      const contentId = typeof metadata.contentId === 'string' ? metadata.contentId.trim() : ''
      if (!contentId) throw new Error('contentId is required for share rewards')
      return this.starquest(path, {
        method: 'POST',
        body: JSON.stringify({ ...metadata, attemptId: referenceId, contentId }),
      })
    }

    return this.starquest(path, {
      method: 'POST',
      body: JSON.stringify({ ...metadata, referenceId }),
    })
  }
}
