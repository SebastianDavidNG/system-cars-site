import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic', // Usa el runtime clásico para evitar importaciones automáticas de 'react'
      jsxInject: false, // Desactiva la inyección automática de importaciones de React
    }),
  ],
  css: {
    postcss: './postcss.config.js',
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./themes/system-cars-theme/scss/variables.scss" as *;`,
      },
    },
  },
  build: {
    outDir: './themes/system-cars-theme/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'themes/system-cars-theme/js/main.js'),
        'car-block': path.resolve(__dirname, 'themes/system-cars-theme/blocks/car-block/index.js'),
      },
      output: {
        format: 'es', // Mantiene módulos ES
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].[ext]';
          }
          return 'js/[name].[ext]';
        },
      },
      external: [], // No necesitamos externalizar react ni WordPress, ya que usamos globales
    },
  },
  esbuild: {
    jsx: 'automatic',
    include: /\.(js|jsx)$/,
  },
  resolve: {
    alias: {
      react: 'wp.element', // Redirige importaciones de 'react' a wp.element
      'react-dom': 'wp.element', // Redirige importaciones de 'react-dom' a wp.element
    },
  },
});