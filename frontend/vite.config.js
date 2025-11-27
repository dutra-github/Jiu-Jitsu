import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
// https://vitejs.dev/config/
export default defineConfig({
  // Modo de desenvolvimento
  mode: 'development',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'pwa-192x192.png'],
      manifest: {
        name: 'Academia Jiu-Jitsu',
        short_name: 'Jiu-Jitsu',
        description: 'Sistema de gerenciamento para academias de Jiu-Jitsu',
        theme_color: '#1a73e8',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/masked-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 3201,
    strictPort: false,
    host: true, // Listen on all addresses, including LAN and public addresses
    cors: true,
    hmr: {
      // host: '127.0.0.1', // Remove explicit host to allow automatic detection
      port: 3201,
      // clientPort: 3201, // Remove clientPort to allow automatic detection
      overlay: true,
      timeout: 30000
    },

    proxy: {
      '/api': {
        target: 'http://localhost:3200',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
