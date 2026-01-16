# Claude Instructions for System Cars Site

## Project Overview
System Cars is a WordPress site with a custom theme built using modern web development tools. The project combines traditional WordPress development with modern JavaScript tooling.

**Última actualización:** 2026-01-15
**Docker Container:** `system-cars-site-wordpress-1`
**Local URL:** http://localhost:8080
**Working Directory:** Raíz del proyecto (todos los comandos npm se ejecutan desde aquí)
**Theme Location:** `wp-content/themes/system-cars-theme/`

## 🚧 Current Development Status

### Completed Blocks ✅
- `slider-block/` - Slider de imágenes con Swiper.js (FUNCIONANDO)
- `service-card/` - Tarjetas de servicios (FUNCIONANDO)
- `styled-button-block/` - Botones con estilos personalizados usando Tailwind CSS (FUNCIONANDO)
- `info-image-block/` - Bloque de imagen con información en columnas con controles de padding (FUNCIONANDO)
- `parallax-columns-block/` - Bloque decorativo con imagen de fondo y efecto parallax (FUNCIONANDO)
- `video-modal-block/` - Modal overlay con video embebido YouTube/Vimeo/MP4 (FUNCIONANDO)

### Estilos Globales del Theme ✅
- **Fuente:** Arial, Helvetica, sans-serif
- **Links:** Sin underline (`text-decoration: none`)
- **Navegación:** `.nav-menu li a` con `font-weight: bold`
- **Tailwind CSS:** Cargado globalmente via `dist/css/style.css`

---

## 📦 Detalles de Bloques

### slider-block ✅
**Estado:** COMPLETADO Y FUNCIONANDO
**Archivos:**
- `blocks/slider-block/index.js` - Registro del bloque
- `blocks/slider-block/edit.jsx` - Componente del editor
- `blocks/slider-block/save.jsx` - Componente de guardado
- `blocks/slider-block/slider-frontend.js` - Inicialización de Swiper.js en frontend
- `blocks/slider-block/style.scss` - Estilos del bloque
- `blocks/slider-block/editor.scss` - Estilos del editor

**Características:**
- Slider responsive con Swiper.js
- Navegación con flechas
- Paginación
- Auto-play opcional
- Imágenes cargadas desde WordPress Media Library

**Build:**
- JSX: `npm run dev` o `npm run build`
- SCSS: `npm run build:blocks`
- Output: `dist/slider-block.js`, `dist/slider-frontend.js`, `dist/css/slider-block.css`

---

### service-card ✅
**Estado:** COMPLETADO Y FUNCIONANDO
**Archivos:**
- `blocks/service-card/index.js` - Todo el bloque (edit + save incluidos)
- `blocks/service-card/style.scss` - Estilos del bloque
- `blocks/service-card/editor.scss` - Estilos del editor

**Características:**
- Tarjeta con icono, título y descripción
- Iconos de FontAwesome
- Estilos responsivos
- Hover effects

**Build:**
- JSX: `npm run dev` o `npm run build`
- SCSS: `npm run build:blocks`
- Output: `dist/service-card.js`, `dist/css/service-card-style.css`

---

### styled-button-block ✅
**Estado:** COMPLETADO Y FUNCIONANDO
**Última actualización:** 2026-01-07

**Archivos:**
- `blocks/styled-button-block/index.js` - Registro con versiones deprecated
- `blocks/styled-button-block/edit.jsx` - Editor con Tailwind classes
- `blocks/styled-button-block/save.jsx` - Guardado con Tailwind classes
- `blocks/styled-button-block/style.scss` - Estilos base
- `blocks/styled-button-block/frontend.js` - JavaScript del frontend
- `blocks/styled-button-block/block.json` - Metadata (v3.0.0)

**Características:**
- ✅ Múltiples estilos (primary, secondary, tertiary, white, black)
- ✅ Bordes opcionales (transparent, secondary, primary, tertiary, white, black)
- ✅ Links internos/externos
- ✅ Opción "abrir en nueva pestaña"
- ✅ Texto editable con RichText
- ✅ Estilos con Tailwind CSS: `px-10 py-3 font-black uppercase text-lg`
- ✅ Texto en mayúsculas con `text-transform: uppercase`

**Build:**
- JSX: `npm run dev` o `npm run build`
- Output: `dist/styled-button-block.js` (7.86 KB), `dist/styled-button-frontend.js`, `dist/css/styled-button-style.css` (1.21 KB)

**Solución implementada:**
- Problema de caché resuelto usando versiones deprecated para migración automática
- Versión actualizada a 3.0.0 para forzar actualización
- Clases Tailwind correctamente aplicadas: `uppercase text-lg`
- CSS SCSS solo maneja colores y transiciones, spacing viene de Tailwind

---

### parallax-columns-block ✅
**Estado:** COMPLETADO Y FUNCIONANDO
**Última actualización:** 2026-01-07

**Archivos:**
- `blocks/parallax-columns-block/index.js` - Registro del bloque
- `blocks/parallax-columns-block/edit.jsx` - Componente del editor
- `blocks/parallax-columns-block/save.jsx` - Componente de guardado
- `blocks/parallax-columns-block/frontend.js` - Efecto parallax en frontend
- `blocks/parallax-columns-block/style.scss` - Estilos del bloque
- `blocks/parallax-columns-block/block.json` - Metadata (v2.0.0)

**Características:**
- ✅ Imagen de fondo con efecto parallax
- ✅ Altura mínima configurable
- ✅ Parallax activable/desactivable
- ✅ Optimización para mobile
- ✅ **Controles de spacing nativos de WordPress:**
  - Margin-top y margin-bottom configurables
  - Sin margin lateral (imagen siempre de lado a lado)
  - Sin padding configurable (el bloque tiene padding fijo interno)

**Build:**
- JSX: `npm run dev` o `npm run build`
- Output: `dist/parallax-columns-block.js` (4.81 KB), `dist/parallax-columns-frontend.js` (2.46 KB), `dist/css/parallax-columns-style.css` (0.93 KB)

**Controles nativos de WordPress:**
```json
"supports": {
  "spacing": {
    "margin": ["top", "bottom"],  // Solo margin vertical
    "padding": false
  }
}
```

---

### info-image-block ✅
**Estado:** COMPLETADO Y FUNCIONANDO
**Última actualización:** 2026-01-07

**Archivos:**
- `blocks/info-image-block/index.js` - Registro del bloque
- `blocks/info-image-block/edit.jsx` - Componente del editor con controles de padding
- `blocks/info-image-block/save.jsx` - Componente de guardado
- `blocks/info-image-block/style.scss` - Estilos del bloque
- `blocks/info-image-block/editor.scss` - Estilos del editor
- `blocks/info-image-block/block.json` - Metadata

**Estructura HTML:**
```html
<div class="info-image-block">
  <!-- Top Section (Título y descripción principal) -->
  <div class="info-top-section text-left max-md:text-center">
    <h2 class="info-main-title">Título Principal</h2>
    <p class="info-main-description">Descripción principal</p>
  </div>

  <!-- Columns Section (Imagen izquierda + Contenido derecha) -->
  <div class="info-columns-section">
    <div class="info-column-left">
      <img class="info-image" src="..." alt="...">
    </div>
    <div class="info-column-right text-left max-md:text-center">
      <h4 class="info-column-title">Título de Columna</h4>
      <p class="info-column-description">Descripción de columna</p>
    </div>
  </div>
</div>
```

**Características:**
- ✅ Sección superior con título (H2) y descripción principal
- ✅ Layout de 2 columnas con CSS Grid (desktop) / 1 columna (mobile)
- ✅ Columna izquierda: imagen desde WordPress Media Library
- ✅ Columna derecha: título (H4) y descripción
- ✅ **Alineación responsive con Tailwind CSS:**
  - Desktop: `text-left` (textos alineados a la izquierda)
  - Mobile: `max-md:text-center` (textos centrados)
- ✅ **Controles de padding personalizados (WordPress BoxControl):**
  - "Espaciado - Sección Superior": controla padding del título y descripción principal
  - "Espaciado - Columna Derecha": controla padding del contenido de la columna derecha
  - **La imagen NO se ve afectada** por estos controles (siempre pegada al borde)
- ✅ Editor con hover states para facilitar edición de textos

**Build:**
- JSX: `npm run dev` o `npm run build`
- Output: `dist/info-image-block.js` (9.12 KB), `dist/css/info-image-style.css` (2.51 KB), `dist/css/info-image-editor.css` (2.09 KB)

**Controles de Spacing:**
Los controles de padding son **específicos por sección**, NO afectan a todo el bloque:

**Atributos personalizados:**
```json
"topSectionPadding": {
  "type": "object",
  "default": { "top": "0px", "right": "0px", "bottom": "0px", "left": "0px" }
},
"columnRightPadding": {
  "type": "object",
  "default": { "top": "0px", "right": "0px", "bottom": "0px", "left": "0px" }
}
```

**Aplicación en save.jsx:**
```jsx
<div
  className="info-top-section text-left max-md:text-center"
  style={{
    paddingTop: topSectionPadding?.top || '0px',
    paddingRight: topSectionPadding?.right || '0px',
    paddingBottom: topSectionPadding?.bottom || '0px',
    paddingLeft: topSectionPadding?.left || '0px'
  }}
>
```

**Ventajas de este enfoque:**
- Imagen siempre pegada al borde izquierdo (sin padding)
- Control fino de spacing solo en textos
- Usa BoxControl nativo de WordPress (mismo UI que otros bloques)
- Valores aplicados con inline styles para máxima flexibilidad

---

### video-modal-block ✅
**Estado:** COMPLETADO Y FUNCIONANDO
**Última actualización:** 2026-01-15

**Archivos:**
- `blocks/video-modal-block/index.js` - Registro del bloque
- `blocks/video-modal-block/edit.jsx` - Componente del editor
- `blocks/video-modal-block/save.jsx` - Componente de guardado
- `blocks/video-modal-block/frontend.js` - Lógica del modal en frontend
- `blocks/video-modal-block/style.scss` - Estilos del bloque y modal
- `blocks/video-modal-block/block.json` - Metadata del bloque

**Características:**
- ✅ Modal overlay responsive con fondo semi-transparente
- ✅ Thumbnail clickable con play button SVG
- ✅ Soporte YouTube/Vimeo/MP4
- ✅ Close button con animación de rotación (::before/::after formando X)
- ✅ Cierre con click fuera del modal o tecla Escape
- ✅ Animaciones de entrada (fadeIn + zoomIn)

**Build:**
- Comando: `npm run build` (desde raíz del proyecto)
- Output: `dist/video-modal-block.js`, `dist/video-modal-frontend.js`, `dist/css/video-modal-style.css`

---

## 🎨 CSS Global del Theme

### Archivos CSS Principales
| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| `dist/css/style.css` | Tailwind CSS completo (base, components, utilities) | ~26 KB |
| `dist/css/main.css` | Estilos SCSS personalizados (header, footer, nav, etc.) | ~4 KB |

### style.css (Tailwind)
**Ubicación fuente:** `scss/style.css`
**Contenido:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Este archivo se compila con PostCSS y genera todas las clases de Tailwind usadas en los templates PHP.

### main.css (SCSS personalizado)
**Ubicación fuente:** `scss/main.scss`
**Contiene:**
- Estilos globales del body (font-family: Arial)
- Reset de links (text-decoration: none)
- Estilos del header y navegación
- Estilos del footer
- Estilos de WooCommerce personalizados

### Carga de CSS (functions.php)
Los CSS se cargan en este orden:
1. Google Fonts (Roboto Condensed - legacy)
2. Font Awesome 6.6.0
3. `style.css` (Tailwind)
4. `main.css` (SCSS personalizado)
5. Swiper CSS (para slider-block)

---

## Tech Stack
- **CMS**: WordPress
- **Theme**: Custom theme (`system-cars-theme`)
- **Build Tool**: Vite 5.x
- **CSS Framework**: Tailwind CSS 3.x
- **CSS Preprocessor**: SASS
- **JavaScript**: React components with WordPress Gutenberg blocks
- **Icons**: FontAwesome
- **Slider**: Swiper.js
- **Local Development**: Docker (see docker-compose.yml)
- **Theme Configuration**: theme.json (WordPress FSE - Full Site Editing)

## Theme Configuration (theme.json)

El proyecto utiliza `theme.json` para configurar características globales del tema según el estándar de WordPress Full Site Editing (FSE).

**Ubicación:** `themes/system-cars-theme/theme.json`

**Características configuradas:**

### Spacing Presets
Valores predefinidos para margin y padding que aparecen en todos los bloques con soporte de spacing:

| Preset | Slug | Tamaño | Uso |
|--------|------|--------|-----|
| Extra pequeño | `xs` | 0.5rem (8px) | Espacios mínimos |
| Pequeño | `small` | 1rem (16px) | Espacios reducidos |
| Mediano | `medium` | 1.5rem (24px) | Espacios estándar |
| Grande | `large` | 2rem (32px) | Espacios generosos |
| Extra grande | `xl` | 3rem (48px) | Separaciones grandes |
| 2X grande | `2xl` | 4rem (64px) | Separaciones muy grandes |

**Unidades soportadas:** `px`, `em`, `rem`, `%`, `vh`, `vw`

### Color Palette
Paleta de colores del tema System Cars:
- **Primary:** `#ff0000` (Rojo)
- **Secondary:** `#002060` (Azul oscuro)
- **Tertiary:** `#232225` (Gris oscuro)
- **White:** `#ffffff`
- **Black:** `#000000`

### Typography
Tamaños de fuente predefinidos:
- **Pequeño:** 0.875rem
- **Mediano:** 1rem
- **Grande:** 1.25rem
- **Extra grande:** 1.75rem

**Nota:** Estos valores se sincronizan automáticamente con WordPress y están disponibles en todos los bloques que soporten estas características.

## File Structure
```
.
├── wp-content/
│   ├── themes/
│   │   └── system-cars-theme/    # Main custom theme
│   ├── plugins/                   # WordPress plugins
│   │   └── advanced-custom-fields/
│   └── uploads/                   # Media uploads
├── vite.config.js                 # Vite build configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── package.json                   # NPM dependencies
```

## Development Commands

**IMPORTANTE:** Todos los comandos se ejecutan desde la **raíz del proyecto**, NO desde el directorio del tema.

### Compile Everything (JS + SCSS)

Vite compila tanto JavaScript/JSX como SCSS en un solo comando:

**Development Mode (Recommended while editing):**
```bash
npm run dev
```
- Watches for file changes and recompiles automatically
- Hot Module Replacement (HMR) for faster development
- Use this while actively developing blocks

**Production Build:**
```bash
npm run build
```
- Compiles and optimizes all JSX/JS and SCSS for production
- Output goes directly to `wp-content/themes/system-cars-theme/dist/`
- Files are immediately available for Docker/OrbStack

**Blocks compiled by Vite:**
- `slider-block/` - `index.js`, `edit.jsx`, `save.jsx`, `slider-frontend.js`, `style.scss`
- `service-card/` - `index.js`, `style.scss`, `editor.scss`
- `video-modal-block/` - `index.js`, `edit.jsx`, `save.jsx`, `frontend.js`, `style.scss`
- `parallax-columns-block/` - `index.js`, `edit.jsx`, `save.jsx`, `frontend.js`, `style.scss`
- `styled-button-block/` - `index.js`, `edit.jsx`, `frontend.js`, `style.scss`
- `info-image-block/` - `index.js`, `edit.jsx`, `save.jsx`, `style.scss`, `editor.scss`

**Output:**
- JS files: `wp-content/themes/system-cars-theme/dist/[block-name].js`
- CSS files: `wp-content/themes/system-cars-theme/dist/css/[block-name]-style.css`

### Docker / OrbStack
```bash
docker-compose up
```
Runs WordPress locally at http://localhost:8080

**NOTA:** Los archivos compilados van directamente a `wp-content/` que es el volumen montado por Docker, por lo que los cambios se reflejan inmediatamente sin necesidad de copiar archivos.

## Coding Guidelines

### WordPress Theme Development
- All theme files are in `wp-content/themes/system-cars-theme/`
- Follow WordPress coding standards for PHP
- Use WordPress template hierarchy conventions
- Leverage ACF (Advanced Custom Fields) for custom fields

### JavaScript/React
- Use React components for interactive elements
- WordPress block editor components are available (@wordpress/blocks, @wordpress/block-editor)
- Prefer functional components with hooks
- Keep components modular and reusable

### Styling
- Use Tailwind CSS utility classes as the primary styling method
- SASS is available for complex custom styles
- Follow mobile-first responsive design
- Use PostCSS for CSS processing
- **Tailwind safelist** (`tailwind.config.js`): Contiene clases que deben estar siempre disponibles:
  - Grid columns: `grid`, `grid-cols-12`, `col-span-*`, `md:col-span-*`
  - Text sizes: `text-xs` a `text-3xl` con variantes `md:` y `lg:`
  - Text alignment: `text-left`, `text-center`, `text-right`, `max-md:text-center`
  - Custom heights: `h-[350px]`, `md:h-[300px]`, `lg:h-[400px]`

### Git Workflow
- Main branch: `main`
- Current working branch: `master`
- Always review changes before committing
- Write clear, descriptive commit messages

## Important Notes

### When Working on This Project:

1. **Theme Location**: The active theme is `system-cars-theme` in `wp-content/themes/`

2. **Asset Building**:
   - For JSX/JS changes (block React components): `npm run dev` from theme directory
   - For block SCSS changes: `npm run build:blocks` from theme directory
   - The theme has TWO build systems: Vite (for JS/JSX) and SASS compiler (for styles)
   - **Important**: Both commands run from `wp-content/themes/system-cars-theme/`

3. **Block Development Workflow**:

   **For JSX/React changes:**
   - Block JSX files: `blocks/[block-name]/edit.jsx`, `save.jsx`, `index.js`, etc.
   - Run `npm run dev` from theme directory (watches and auto-recompiles)
   - Compiled JS outputs to `dist/[block-name].js`
   - JS files must be enqueued in `functions.php`

   **For SCSS/Style changes:**
   - Block SCSS files: `blocks/[block-name]/style.scss`
   - Run `npm run build:blocks` from theme directory
   - Compiled CSS outputs to `dist/css/[block-name].css`
   - CSS files must be enqueued in `functions.php`

4. **WordPress Integration**: Vite assets need to be properly enqueued in WordPress theme files (typically in `functions.php`)

5. **ACF Plugin**: Advanced Custom Fields is installed - use it for custom field management

6. **Gutenberg Blocks**: The project uses WordPress block editor components - custom blocks should follow WordPress block API

7. **File References**: When referencing code, use the format `file_path:line_number`

### Before Making Changes:

- Check if changes affect both development and production builds
- Ensure WordPress-specific functionality remains compatible
- Test responsive design across breakpoints
- Verify asset paths work correctly in WordPress context

### Common Patterns:

- **Custom Blocks**: Located in theme directory with block editor registration
- **Sliders**: Use Swiper.js library (already installed)
- **Icons**: Use FontAwesome React components
- **Responsive**: Mobile-first with Tailwind breakpoints (sm:, md:, lg:, xl:)

### Asset Enqueuing in WordPress

Los bloques se pueden registrar de dos formas:

**1. Usando block.json (Recomendado - WordPress 5.8+):**
```json
{
  "apiVersion": 3,
  "name": "system-cars/styled-button",
  "editorScript": "file:../../dist/styled-button-block.js",
  "style": "file:../../dist/css/styled-button-style.css"
}
```
WordPress carga automáticamente los archivos cuando se usa `register_block_type()` con el path al directorio del bloque.

**2. Usando functions.php (Método manual):**
```php
function system_cars_block_editor_assets() {
    wp_enqueue_script(
        'system-cars-slider-block',
        get_template_directory_uri() . '/dist/slider-block.js',
        ['wp-blocks', 'wp-element', 'wp-block-editor'],
        filemtime(get_template_directory() . '/dist/slider-block.js')
    );
}
add_action('enqueue_block_editor_assets', 'system_cars_block_editor_assets');
```

**En este proyecto:**
- `functions.php:49-66` registra todos los bloques usando `register_block_type()` con block.json
- `functions.php:140-191` encola manualmente algunos scripts del editor (system_cars_block_editor_assets)
- `functions.php:68-134` encola assets del frontend (sc_enqueue_frontend_assets)

**NOTA IMPORTANTE**: Si un bloque está registrado en AMBOS lugares (block.json Y functions.php), puede causar que los scripts se carguen dos veces o que se use una versión cacheada. Revisar `functions.php:148` donde hay un comentario: `// 'styled-button-block' se carga desde block.json`

## Build Process

El proyecto usa **Vite** como único sistema de build, configurado en `vite.config.js` en la raíz del proyecto.

### Vite (Unified Build System)

**Ubicación:** `vite.config.js` en la raíz del proyecto
**Output:** `wp-content/themes/system-cars-theme/dist/`

**Características:**
- Compila React/JSX para bloques (`edit.jsx`, `save.jsx`, `frontend.js`)
- Compila SCSS a CSS (con PostCSS y Tailwind)
- Bundle JavaScript modules
- Maneja WordPress externals (React, WordPress packages)
- Output directo a `wp-content/` para sincronización inmediata con Docker/OrbStack

**Run from:** Raíz del proyecto
**Commands:**
- `npm run dev` - Development mode with file watching
- `npm run build` - Production build

**Inputs configurados** (`vite.config.js`):
- main.js, car-block, service-card, slider-block, slider-frontend
- styled-button-block, styled-button-frontend, styled-button-style
- info-image-block, info-image-style, info-image-editor
- parallax-columns-block, parallax-columns-frontend, parallax-columns-style
- video-modal-block, video-modal-frontend, video-modal-style

### Workflow Simplificado

| You're editing... | Command to use | Output |
|------------------|----------------|--------|
| Any `.jsx`, `.js`, or `.scss` file | `npm run build` | `wp-content/themes/system-cars-theme/dist/` |
| Active development | `npm run dev` | Watch mode, auto-recompile |

**Un solo comando compila todo.** No hay necesidad de comandos separados para JS y SCSS.

## Questions to Ask Before Starting Work:

1. Is this a theme file, plugin, or core WordPress modification?
2. Do changes require rebuilding? → Run `npm run build` from project root
3. Will this affect existing WordPress functionality or custom blocks?
4. Should this be tested in both development and production modes?

## Troubleshooting

### ⚠️ WordPress Block Caching - IMPORTANTE

**PROBLEMA CRÍTICO:** WordPress guarda el HTML de los bloques en la base de datos cuando guardas una página. Esto significa que:

1. **Los bloques guardan HTML estático en la DB**: Cuando guardas una página, WordPress ejecuta la función `save()` del bloque y guarda el HTML resultante en `wp_posts.post_content`

2. **Cambios en `save.jsx` NO se reflejan automáticamente**: Si modificas el componente `save.jsx`, las páginas existentes seguirán mostrando el HTML antiguo guardado en la DB

3. **Necesitas actualizar cada página**: Después de cambiar un bloque, debes:
   - Abrir cada página que usa ese bloque en el editor
   - WordPress detectará que el HTML es diferente
   - Guardar la página para regenerar el HTML con la nueva versión

**Síntomas:**
- Cambios en JSX no aparecen en el frontend aunque compilaste correctamente
- El HTML renderizado no coincide con tu código de `save.jsx`
- Los archivos compilados son correctos pero el sitio muestra código antiguo

**Soluciones:**
1. **Usar deprecated versions**: Añade versiones antiguas en el array `deprecated` del bloque para migración automática
2. **Regenerar páginas**: Abre y guarda cada página en el editor
3. **Eliminar y recrear bloques**: Como último recurso, elimina el bloque de la página y añádelo nuevamente

**Ejemplo en styled-button-block:**
- ✅ Código actualizado con clases Tailwind
- ✅ Archivos compilados correctos
- ❌ Páginas guardadas antes del cambio siguen mostrando HTML antiguo sin las clases Tailwind
- 🔧 Solución: Abrir página en editor → WordPress detecta cambio → Guardar → HTML regenerado

---

### SASS Color Functions
All SASS color functions have been updated to the modern syntax using `color.adjust()` instead of deprecated `darken()` and `lighten()` functions.

**Modern syntax used:**
```scss
@use "sass:color";
background-color: color.adjust($secondary-color, $lightness: -10%);  // Oscurecer
background-color: color.adjust($black-color, $lightness: 15%);       // Aclarar
```

### Styles Not Updating
1. Make sure you compiled the SCSS: `npm run build:blocks`
2. Check if CSS file exists in `dist/css/`
3. Verify the CSS is enqueued in `functions.php`
4. Clear WordPress cache if using caching plugins
5. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
6. **IMPORTANTE**: Check if WordPress is serving inline CSS (view page source and look for `<style>` tags in `<head>`)
7. If using inline CSS, restart Docker containers: `docker-compose restart`

### Block Not Appearing in Editor
1. Check block registration in block's `index.js`
2. Verify block is enqueued in `functions.php`
3. Compile JavaScript: `cd wp-content/themes/system-cars-theme && npm run build`
4. Check browser console for errors
5. Verify compiled JS file exists in `dist/[block-name].js`

### JSX/React Changes Not Reflecting
1. Make sure Vite is running: `npm run dev` in theme directory
2. Check for compilation errors in terminal
3. Verify the JSX file is listed in `vite.config.js` inputs (line 45-55)
4. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
5. Check that WordPress externals are correctly configured
6. For production: run `npm run build` instead of `dev`

### Build Errors
**Vite/JSX errors:**
- Check for syntax errors in JSX files
- Verify React imports are correct
- Ensure WordPress packages are marked as external in `vite.config.js:57-66`

**SASS errors:**
- Check SCSS syntax in `style.scss` files
- Verify variable imports: `@use "../../scss/variables" as *;`
- Ensure `sass:color` is imported if using color functions

---

### WordPress Inline CSS vs External CSS Files

**Problema:** WordPress puede servir CSS de bloques como inline CSS en el `<head>` en lugar de cargar archivos externos.

**Cómo detectar:**
1. Abrir página en el navegador
2. Ver código fuente (View Page Source)
3. Buscar `<style id="wp-block-library-inline-css">` o similar en el `<head>`
4. Si encuentras los estilos del bloque inline en lugar de `<link>` tags, WordPress está usando inline CSS

**Por qué pasa:**
- WordPress optimiza cargando CSS crítico inline
- Puede usar versiones cacheadas del CSS
- Cambios en archivos CSS compilados no se reflejan hasta reiniciar WordPress

**Solución:**
1. Reiniciar contenedores Docker: `docker-compose restart`
2. Verificar que el CSS está encolado correctamente en `functions.php`
3. Verificar que `block.json` tiene la propiedad `style` correcta
4. En desarrollo, desactivar plugins de optimización/caché si existen

**Archivos a verificar:**
- `themes/system-cars-theme/dist/css/[block-name].css` (archivo compilado)
- `themes/system-cars-theme/blocks/[block-name]/block.json` (metadata)
- `themes/system-cars-theme/functions.php` (enqueue functions)

## Quick Reference

### Command Cheat Sheet

All commands run from: **project root** (NOT from theme directory)

```bash
# Development (watching for changes)
npm run dev                    # Watch and compile everything (JS + SCSS)

# Production build
npm run build                  # Compile everything for production

# Docker/OrbStack
docker-compose up              # Start WordPress at http://localhost:8080
```

### File Types & Output

| File Type | Example | Output |
|-----------|---------|--------|
| Block JSX | `blocks/slider-block/edit.jsx` | `wp-content/.../dist/slider-block.js` |
| Block JS | `blocks/slider-block/index.js` | `wp-content/.../dist/slider-block.js` |
| Block SCSS | `blocks/slider-block/style.scss` | `wp-content/.../dist/css/slider-block.css` |
| Main JS | `js/main.js` | `wp-content/.../dist/main.js` |

**Un solo comando (`npm run build`) compila todo.**

### Typical Development Workflow

```bash
# Terminal 1: Watch and auto-compile
npm run dev

# That's it! Changes sync automatically to Docker/OrbStack
```

**Before committing/deploying:**
```bash
npm run build
```
