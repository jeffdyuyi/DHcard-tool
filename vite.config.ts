
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 通用配置：使用相对路径，自动适配任意子目录或根目录
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 增加警告阈值到 1000KB，并进行分包优化
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库打包成一个单独的文件
          'react-vendor': ['react', 'react-dom'],
          // 将 html2canvas 打包成单独文件（因为它很大）
          'html2canvas': ['html2canvas'],
          // 将图标库单独打包
          'icons': ['lucide-react']
        }
      }
    }
  },
});
