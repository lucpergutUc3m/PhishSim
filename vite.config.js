import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    // Proxy en desarrollo: las peticiones /api van al backend sin exponer la URL en el bundle
    proxy: {
      '/api': {
        target: 'https://slmphish-tfm.swedencentral.cloudapp.azure.com:8443',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
