# Claude Instructions for System Cars Site

## Project Overview
System Cars is a WordPress site with a custom theme built using modern web development tools. The project combines traditional WordPress development with modern JavaScript tooling.

**Última actualización:** 2025-12-31
**Docker Container:** `system-cars-site-wordpress-1`
**Local URL:** http://localhost:8080
**Working Directory:** `themes/system-cars-theme/` (todos los comandos npm se ejecutan desde aquí)

## 🚧 Current Development Status

### Completed Blocks ✅
- `slider-block/` - Slider de imágenes con Swiper.js (FUNCIONANDO)
- `service-card/` - Tarjetas de servicios (FUNCIONANDO)

### In Progress 🔨
1. **styled-button-block** - Botones con estilos personalizados (DEBUGGING - Ver sección de problemas conocidos)
2. **parallax-columns-block** - Columnas con efecto parallax (EN DESARROLLO)
3. **video-modal-block** - Modal overlay con video embebido (EN DESARROLLO)

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

### styled-button-block 🔨
**Estado:** EN DEBUGGING - Problemas con caché de WordPress
**Última actualización:** 2025-12-31

**Archivos:**
- `blocks/styled-button-block/index.js` - Registro con versiones deprecated
- `blocks/styled-button-block/edit.jsx` - Editor con Tailwind classes
- `blocks/styled-button-block/save.jsx` - Guardado con Tailwind classes
- `blocks/styled-button-block/style.scss` - Estilos base (sin padding/font-weight/font-size)
- `blocks/styled-button-block/block.json` - Metadata (v2.1.0)

**Objetivo actual:**
Migrar estilos de SCSS a Tailwind CSS classes:
- ✅ Código actualizado: Tailwind classes añadidas (`px-10 py-3 font-black capitalize text-base`)
- ✅ SCSS actualizado: Removido `padding`, `font-weight`, `font-size`
- ✅ Archivos compilados correctamente
- ❌ **PROBLEMA:** WordPress no está usando los nuevos archivos compilados

**Cambios realizados:**
1. `save.jsx:16-25` - Añadidas clases Tailwind al array `buttonClasses`
2. `edit.jsx:106` - Añadidas clases Tailwind al className del anchor
3. `style.scss:5-13` - Removidas propiedades: `padding`, `font-weight`, `font-size`
4. `block.json:4` - Versión actualizada a "2.1.0"
5. `index.js:10-62` - Añadida versión deprecated para migración

**Build:**
- JSX: `npm run dev` o `npm run build`
- SCSS: No existe `npm run build:styled-button` - usar `npm run build` (Vite compila todo)
- Output: `dist/styled-button-block.js` (7.86 KB), `dist/css/styled-button-style.css` (1.10 KB)

**Características planeadas:**
- ✅ Múltiples estilos (primary, secondary, tertiary, white, black)
- ✅ Bordes opcionales (transparent, secondary, primary, tertiary, white, black)
- ✅ Links internos/externos
- ✅ Opción "abrir en nueva pestaña"
- ✅ Text editable con RichText
- 🔨 Integración con Tailwind CSS (EN DEBUGGING)

**PROBLEMA ACTUAL:**
WordPress está sirviendo CSS inline en el `<head>` con valores antiguos:
```css
.styled-button {
  padding: 27px 38px;      /* ← ANTIGUO, debería ser removido */
  font-weight: 600;         /* ← ANTIGUO, debería ser removido */
  font-size: 16px;          /* ← ANTIGUO, debería ser removido */
}
```

Y el HTML renderizado NO incluye las clases de Tailwind:
```html
<!-- Actual (INCORRECTO): -->
<a class="styled-button styled-button--secondary" href="#" target="_self">
  <span>Botón</span>
</a>

<!-- Esperado (CORRECTO): -->
<a class="styled-button styled-button--secondary px-10 py-3 font-black capitalize text-base" href="#" target="_self">
  <span>Botón</span>
</a>
```

**Intentos de solución:**
1. ✅ Recompilar con `npm run build`
2. ✅ Reiniciar contenedor Docker
3. ✅ Añadir versión deprecated para migración
4. ✅ Actualizar versión en block.json a 2.1.0
5. ✅ Guardar página en WordPress Editor
6. ❌ Los archivos compilados no se están cargando - aparece CSS inline cacheado

**Próximos pasos sugeridos:**
- Investigar por qué WordPress usa CSS inline en lugar de cargar el archivo compilado
- Verificar si hay plugins de caché activos
- Revisar cómo `functions.php` encola los assets del bloque
- Posible solución: Eliminar completamente el bloque de la base de datos y recrearlo

---

### parallax-columns-block 🔨
**Estado:** EN DESARROLLO
**Archivos:**
- `blocks/parallax-columns-block/index.js`
- `blocks/parallax-columns-block/edit.jsx`
- `blocks/parallax-columns-block/save.jsx`
- `blocks/parallax-columns-block/frontend.js`
- `blocks/parallax-columns-block/style.scss`
- `blocks/parallax-columns-block/block.json`

**Características planeadas:**
- 2-4 columnas configurables
- Background images con parallax effect
- Velocidad parallax ajustable
- Overlay de color opcional

**Build:**
- JSX: `npm run dev` o `npm run build`
- SCSS: `npm run build:blocks`
- Output: `dist/parallax-columns-block.js`, `dist/parallax-columns-frontend.js`, `dist/css/parallax-columns-style.css`

---

### video-modal-block 🔨
**Estado:** EN DESARROLLO
**Archivos:**
- `blocks/video-modal-block/index.js`
- `blocks/video-modal-block/edit.jsx`
- `blocks/video-modal-block/save.jsx`
- `blocks/video-modal-block/frontend.jsx`
- `blocks/video-modal-block/style.scss`
- `blocks/video-modal-block/block.json`

**Características planeadas:**
- Modal overlay responsive
- Thumbnail clickable con play button
- Soporte YouTube/Vimeo
- Close button accesible
- Lazy loading del video

**Build:**
- JSX: `npm run dev` o `npm run build`
- SCSS: `npm run build:blocks`
- Output: `dist/video-modal-block.js`, `dist/video-modal-frontend.js`, `dist/css/video-modal-style.css`

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

### Compile Block JavaScript/JSX (React Components)

When editing JSX files like `edit.jsx`, `save.jsx`, `frontend.jsx`, or block `index.js` files:

**Development Mode (Recommended while editing):**
```bash
cd wp-content/themes/system-cars-theme
npm run dev
```
- Watches for file changes and recompiles automatically
- Hot Module Replacement (HMR) for faster development
- Use this while actively developing blocks

**Production Build:**
```bash
cd wp-content/themes/system-cars-theme
npm run build
```
- Compiles and optimizes all JSX/JS for production
- Minifies code and generates optimized bundles
- Run before deployment

**Blocks with JSX compiled by Vite:**
- `slider-block/` - `index.js`, `edit.jsx`, `save.jsx`, `slider-frontend.js`
- `service-card/` - `index.js` (includes edit/save)
- `video-modal-block/` - `index.js`, `edit.jsx`, `save.jsx`, `modal.jsx`, `frontend.jsx`
- `parallax-columns-block/` - `index.js`, `edit.jsx`, `save.jsx`, `frontend.jsx`
- `styled-button-block/` - `index.js`, `edit.jsx`

All compiled JS files are output to: `dist/[block-name].js`

### Compile Block Styles (SASS)

The theme has custom Gutenberg blocks with SASS styles that need to be compiled separately.

**Compile all block styles:**
```bash
cd wp-content/themes/system-cars-theme
npm run build:blocks
```

**Compile individual blocks:**
```bash
npm run build:car-block          # Car block styles
npm run build:slider-block       # Slider block styles
npm run build:service-card       # Service card styles
npm run build:parallax-columns   # Parallax columns styles
npm run build:styled-button      # Styled button styles
npm run build:video-modal        # Video modal styles
```

**Compile everything (main SCSS + all blocks):**
```bash
npm run build:all
```

**Available Blocks:**
- `car-block/` - Car display block
- `slider-block/` - Image slider with Swiper.js
- `service-card/` - Service card component
- `parallax-columns-block/` - Parallax columns layout
- `styled-button-block/` - Styled button component
- `video-modal-block/` - Video modal popup

All compiled CSS files are output to: `dist/css/[block-name].css`

### Docker
```bash
docker-compose up
```
Runs WordPress locally at http://localhost:8080

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

The project uses **two build systems**:

### 1. Vite (Theme Level - JavaScript/JSX)
Located in theme folder, configured in `vite.config.js`:
- Process React/JSX files for blocks (`edit.jsx`, `save.jsx`, `frontend.jsx`)
- Bundle JavaScript modules (`index.js`, `slider-frontend.js`, etc.)
- Handle WordPress externals (React, WordPress packages)
- Generate optimized production assets with code splitting
- Output: `dist/[block-name].js`

**Run from:** Theme directory (`wp-content/themes/system-cars-theme`)
**Commands:**
- `npm run dev` - Development mode with file watching
- `npm run build` - Production build with optimization

**Configured inputs** (`vite.config.js:45-55`):
- main.js
- sliderBlock, sliderFrontend
- serviceCard
- videoModalBlock, videoModalBlockFront
- parallaxColumnsBlock, parallaxColumnsBlockFront
- styledButtonBlock

### 2. SASS Compiler (Theme Level)
Located in theme folder, configured in `package.json` scripts:
- Compile block-specific SCSS files
- Process main theme SCSS
- Apply Tailwind CSS via PostCSS
- Direct SCSS → CSS compilation without bundling
- Output: `dist/css/[filename].css`

**Run from:** Theme directory (`wp-content/themes/system-cars-theme`)
**Commands:** `npm run build:blocks` or `npm run build:all`

### When to Use Each:

| You're editing... | Command to use | What it does |
|------------------|----------------|--------------|
| `edit.jsx`, `save.jsx`, `index.js` | `npm run dev` | Vite watches JSX/JS files and recompiles |
| `style.scss`, `editor.scss` | `npm run build:blocks` | SASS compiles styles to CSS |
| Both JSX and SCSS | Run both commands in separate terminals | Both systems work independently |
| Final deployment | `npm run build` (Vite) + `npm run build:all` (SASS) | Production-optimized builds |

**Important:** Both systems run from `wp-content/themes/system-cars-theme/`

Built assets are served to WordPress and enqueued in `functions.php`.

## Questions to Ask Before Starting Work:

1. Is this a theme file, plugin, or core WordPress modification?
2. Do changes require rebuilding assets?
   - JSX/JS changes? → `npm run dev` or `npm run build`
   - SCSS changes? → `npm run build:blocks`
3. Will this affect existing WordPress functionality or custom blocks?
4. Should this be tested in both development and production modes?
5. Are you editing block code that needs compilation?
   - Block JSX files? → Start `npm run dev` in theme directory
   - Block SCSS files? → Run `npm run build:blocks` in theme directory

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

All commands run from: `cd wp-content/themes/system-cars-theme`

```bash
# Development (watching for changes)
npm run dev                    # Watch and compile JSX/JS files
npm run dev &                  # Run in background
# (Run npm run build:blocks separately if editing SCSS)

# Production builds
npm run build                  # Compile JSX/JS for production
npm run build:blocks           # Compile all block SCSS
npm run build:all              # Compile main.scss + all block SCSS

# Individual block SCSS compilation
npm run build:car-block
npm run build:slider-block
npm run build:service-card
npm run build:parallax-columns
npm run build:styled-button
npm run build:video-modal

# Main theme SCSS
npm run build:scss             # Compile main.scss only
```

### File Types & Their Commands

| File Type | Example | Command | Output |
|-----------|---------|---------|--------|
| Block JSX | `blocks/slider-block/edit.jsx` | `npm run dev` | `dist/sliderBlock.js` |
| Block JS | `blocks/slider-block/index.js` | `npm run dev` | `dist/sliderBlock.js` |
| Block SCSS | `blocks/slider-block/style.scss` | `npm run build:slider-block` | `dist/css/slider-block.css` |
| Main JS | `js/main.js` | `npm run dev` | `dist/main.js` |
| Main SCSS | `scss/main.scss` | `npm run build:scss` | `dist/css/main.css` |

### Typical Development Workflow

**Working on a block (JSX + SCSS):**
```bash
cd wp-content/themes/system-cars-theme

# Terminal 1: Watch JSX files
npm run dev

# Terminal 2: Compile SCSS when needed
npm run build:blocks
```

**Before committing/deploying:**
```bash
cd wp-content/themes/system-cars-theme

# Build everything for production
npm run build          # JavaScript/JSX
npm run build:all      # All SCSS (main + blocks)
```
