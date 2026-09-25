import { UnifiedWalletWidget } from '../../../src/widget'

export default function App() {
  return (
    <main style={{ padding: 24 }}>
      <h1>React Site</h1>
      <UnifiedWalletWidget
        apiKey="demo-key"
        apiUrl="http://localhost:3000"
        appName="React Demo"
      />
    </main>
  )
}
