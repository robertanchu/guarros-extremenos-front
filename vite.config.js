// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 🔧 Shim para evitar que Vite falle si queda algún import de react-helmet-async
      'react-helmet-async': path.resolve(__dirname, 'src/shims/empty-helmet.js')
    }
  }
})
