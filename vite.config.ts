import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    https: false, // Disable HTTPS
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
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
      protocol: 'wss',
      timeout: 5000,
      host: 'localhost',
      port: 3000,
      clientPort: 3000,
      overlay: true
    }
  },
  resolve: {
    alias: {
      '/vite.svg': path.resolve(__dirname, 'public/favicon.ico'),
      '/favicon.svg': path.resolve(__dirname, 'public/favicon.ico')
    }
  }
})