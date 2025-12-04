import { defineConfig } from 'vite'

export default defineConfig ({
  root: ".",
  build: {
    rollupOptions: {
      input: 'main-page/main-page.html'
    }
  },
  server: {
    port: 5100,
    host: true
  }
});