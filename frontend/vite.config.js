import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['recursos/logo.png'],
      manifest: {
        name: 'Metrolínea Inteligente',
        short_name: 'Metrolínea',
        description: 'Sistema inteligente de movilidad urbana del Área Metropolitana de Bucaramanga',
        theme_color: '#96BD0D',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/recursos/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
