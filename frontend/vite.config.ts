import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 如果打包，可能需要配置代理？
export default defineConfig({
  plugins: [react()],
})
