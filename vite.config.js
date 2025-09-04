// vite.config.js (en la raíz del proyecto)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      jsxInject: false,
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
        main:               path.resolve(__dirname, 'themes/system-cars-theme/js/main.js'),
        'car-block':        path.resolve(__dirname, 'themes/system-cars-theme/blocks/car-block/index.js'),
        'slider-block':     path.resolve(__dirname, 'themes/system-cars-theme/blocks/slider-block/index.js'),
        'slider-frontend':  path.resolve(__dirname, 'themes/system-cars-theme/blocks/slider-block/slider-frontend.js'),
        // <<< Aquí añadimos el SCSS del editor como entrada:
        'slider-block-editor': path.resolve(
          __dirname,
          'themes/system-cars-theme/blocks/slider-block/slider-block-editor.scss'
        ),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name].[ext]';
          }
          return 'js/[name].[ext]';
        },
      },
      external: [
        '@wordpress/blocks',
        '@wordpress/block-editor',
        '@wordpress/components',
        '@wordpress/data',
        '@wordpress/element',
        '@wordpress/i18n',
        'wp',
      ],
    },
  },
  resolve: {
    alias: {
      '@wordpress/blocks':       'wp.blocks',
      '@wordpress/block-editor':'wp.blockEditor',
      '@wordpress/components':  'wp.components',
      '@wordpress/data':        'wp.data',
      '@wordpress/element':     'wp.element',
      '@wordpress/i18n':        'wp.i18n',
      react:                   'wp.element',
      'react-dom':             'wp.element',
    },
  },
});
