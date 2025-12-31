import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import iifeWrapper from './vite-plugin-iife-wrapper.js';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      jsxInject: false,
    }),
    iifeWrapper(), // Envuelve bloques en IIFE para evitar conflictos
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
    emptyOutDir: false,
    minify: false, // CRÍTICO: No minificar para evitar conflictos de variables
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'themes/system-cars-theme/js/main.js'),
        'car-block':        path.resolve(__dirname, 'themes/system-cars-theme/blocks/car-block/index.js'),
        'service-card':     path.resolve(__dirname, 'themes/system-cars-theme/blocks/service-card/index.js'),
        'slider-block':     path.resolve(__dirname, 'themes/system-cars-theme/blocks/slider-block/index.js'),
        'slider-frontend':  path.resolve(__dirname, 'themes/system-cars-theme/blocks/slider-block/slider-frontend.js'),
        'slider-block-editor':      path.resolve(__dirname, 'themes/system-cars-theme/blocks/slider-block/slider-block-editor.scss'),
        'service-card-editor':      path.resolve(__dirname, 'themes/system-cars-theme/blocks/service-card/editor.scss'),
        'service-card-style': path.resolve(__dirname, 'themes/system-cars-theme/blocks/service-card/style.scss'),
        'styled-button-block': path.resolve(__dirname, 'themes/system-cars-theme/blocks/styled-button-block/index.js'),
        'styled-button-style': path.resolve(__dirname, 'themes/system-cars-theme/blocks/styled-button-block/style.scss'),
        'info-image-block': path.resolve(__dirname, 'themes/system-cars-theme/blocks/info-image-block/index.js'),
        'info-image-style': path.resolve(__dirname, 'themes/system-cars-theme/blocks/info-image-block/style.scss'),
        'parallax-columns-block': path.resolve(__dirname, 'themes/system-cars-theme/blocks/parallax-columns-block/index.js'),
        'parallax-columns-frontend': path.resolve(__dirname, 'themes/system-cars-theme/blocks/parallax-columns-block/frontend.js'),
        'parallax-columns-style': path.resolve(__dirname, 'themes/system-cars-theme/blocks/parallax-columns-block/style.scss'),
        'video-modal-block': path.resolve(__dirname, 'themes/system-cars-theme/blocks/video-modal-block/index.js'),
        'video-modal-frontend': path.resolve(__dirname, 'themes/system-cars-theme/blocks/video-modal-block/frontend.js'),
        'video-modal-style': path.resolve(__dirname, 'themes/system-cars-theme/blocks/video-modal-block/style.scss'),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
        // No hacer code-splitting - cada entrada es independiente
        manualChunks: undefined,
      },
      external: [
        '@wordpress/blocks',
        '@wordpress/block-editor',
        '@wordpress/components',
        '@wordpress/data',
        '@wordpress/element',
        '@wordpress/i18n',
        'react',
        'react-dom',
        'classnames',
      ],
    },
  },
  resolve: {
    alias: {
      '@wordpress/blocks':        'wp.blocks',
      '@wordpress/block-editor':  'wp.blockEditor',
      '@wordpress/components':    'wp.components',
      '@wordpress/data':          'wp.data',
      '@wordpress/element':       'wp.element',
      '@wordpress/i18n':          'wp.i18n',
      react:                      'wp.element',
      'react-dom':                'wp.element',
    },
  },
});