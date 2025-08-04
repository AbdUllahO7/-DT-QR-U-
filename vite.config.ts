import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Otomatik self-signed sertifika oluşturur
  ],
  server: {
    port: 3000,
    host: true,
    // basicSsl plugin'i otomatik olarak HTTPS'i aktif eder
    proxy: {
      '/api': {
        target: 'https://localhost:7001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    },
    hmr: {
      // WebSocket bağlantısı için güvenli protokol kullan
      protocol: 'wss',
      // Otomatik olarak bağlantı yeniden denensin
      timeout: 5000,
      // WebSocket bağlantısı için host ve port
      host: 'localhost',
      port: 3000,
      // HTTPS WebSocket bağlantısı için
      clientPort: 3000,
      overlay: true
    }
  },
  resolve: {
    alias: {
      // Favicon ve diğer statik dosyalar için yol tanımlamaları
      '/vite.svg': path.resolve(__dirname, 'public/favicon.ico'),
      '/favicon.svg': path.resolve(__dirname, 'public/favicon.ico')
    }
  }
}) 