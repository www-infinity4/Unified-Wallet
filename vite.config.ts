import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), dts({ include: ['src'] })],
  build: {
    lib: {
      entry: {
        'unified-wallet': resolve(__dirname, 'src/index.ts'),
        widget: resolve(__dirname, 'src/widget/index.ts'),
      },
      name: 'UnifiedWallet',
      formats: ['es', 'umd'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.js` : `${entryName}.${format}.cjs`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
})
