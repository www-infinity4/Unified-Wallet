import { useEffect, useState } from 'react'
import { UnifiedWallet } from '../sdk.ts'
import type { WalletAccount } from '../types.ts'

export interface WidgetProps {
  apiKey: string
  apiUrl?: string
  appName: string
}

export function UnifiedWalletWidget(props: WidgetProps): JSX.Element {
  const [wallet] = useState(() => new UnifiedWallet(props))
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [balance, setBalance] = useState(0)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    return () => {
      wallet.disconnect().catch(() => undefined)
    }
  }, [wallet])

  const connect = async () => {
    setStatus('connecting')
    try {
      const acc = await wallet.connect('mock')
      setAccount(acc)
      const bal = await wallet.getBalance()
      setBalance(bal)
      setStatus('connected')
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'connection failed')
    }
  }

  const collect = async () => {
    if (!account) return
    setStatus('collecting')
    await wallet.collectStars(10, 'Widget collect action')
    const bal = await wallet.getBalance()
    setBalance(bal)
    setStatus('collected +10')
  }

  const disconnect = async () => {
    await wallet.disconnect()
    setAccount(null)
    setBalance(0)
    setStatus('disconnected')
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16, border: '1px solid #ccc', borderRadius: 8, maxWidth: 320 }}>
      <h3>{props.appName} Wallet</h3>
      {!account ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <>
          <p>Address: <code>{account.address.slice(0, 12)}...</code></p>
          <p>Balance: <strong>{balance}</strong> ⭐</p>
          <button onClick={collect}>Collect 10 Stars</button>{' '}
          <button onClick={disconnect}>Disconnect</button>
        </>
      )}
      <p style={{ fontSize: 12, color: '#666' }}>{status}</p>
    </div>
  )
}
