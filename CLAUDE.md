# Claude Instructions for System Cars Site

## Project Overview
System Cars is a WordPress site with a custom theme built using modern web development tools. The project combines traditional WordPress development with modern JavaScript tooling.

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
