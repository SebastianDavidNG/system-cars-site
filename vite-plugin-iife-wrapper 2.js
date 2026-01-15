/**
 * Plugin de Vite para envolver cada bloque en IIFE
 * Esto evita conflictos de variables entre bloques
 */
export default function iifeWrapper() {
  return {
    name: 'iife-wrapper',
    generateBundle(options, bundle) {
      const blockNames = [
        'car-block',
        'service-card',
        'slider-block',
        'styled-button-block',
        'info-image-block',
        'parallax-columns-block',
        'video-modal-block',
      ];

      for (const fileName in bundle) {
        const file = bundle[fileName];

        // Solo procesar archivos JS de bloques
        if (file.type === 'chunk' && blockNames.some(name => fileName.startsWith(name))) {
          // Envolver el código en IIFE
          file.code = `(function(wp) {
  'use strict';
  ${file.code}
})(window.wp || {});`;
        }
      }
    },
  };
}
