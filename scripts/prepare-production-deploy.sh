#!/usr/bin/env bash
# Prepare System Cars local site for cPanel production deployment.
# Run from project root: bash scripts/prepare-production-deploy.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="${ROOT_DIR}/deploy"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
PROD_URL="https://systemcars.co"
LOCAL_URL="http://localhost:8080"

echo "==> Building assets..."
cd "$ROOT_DIR"
npm run build

echo "==> Creating deploy directory..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "==> Packaging wp-content (theme, plugins, uploads)..."
cd "${ROOT_DIR}/wp-content"
zip -r "${DEPLOY_DIR}/wp-content-${TIMESTAMP}.zip" \
  themes/system-cars-theme \
  plugins/advanced-custom-fields \
  plugins/akismet \
  plugins/bold-pagos-en-linea \
  plugins/google-site-kit \
  plugins/sc-excel-products \
  plugins/woocommerce \
  plugins/wordpress-seo \
  plugins/wp-mail-smtp \
  plugins/wpforms-lite \
  uploads \
  -x "*.DS_Store" -x "*/node_modules/*" -x "*/.git/*"

echo "==> Exporting database (OrbStack Docker context)..."
DB_CONTAINER="$(docker --context orbstack ps --format '{{.Names}}' 2>/dev/null | grep -E 'system-cars.*db' | head -1 || true)"

if [[ -z "$DB_CONTAINER" ]]; then
  DB_CONTAINER="$(docker ps --format '{{.Names}}' 2>/dev/null | grep -E 'mysql|db' | head -1 || true)"
fi

if [[ -n "$DB_CONTAINER" ]]; then
  docker --context orbstack exec "$DB_CONTAINER" mysqldump \
    -uwordpress -pwordpress wordpress \
    --single-transaction --quick --lock-tables=false \
    > "${DEPLOY_DIR}/database-${TIMESTAMP}.sql" 2>/dev/null || {
      echo "WARN: Could not export DB from Docker. Export manually via phpMyAdmin or WP plugin."
      rm -f "${DEPLOY_DIR}/database-${TIMESTAMP}.sql"
    }

  if [[ -f "${DEPLOY_DIR}/database-${TIMESTAMP}.sql" ]]; then
  echo "==> Replacing local URLs in SQL dump..."
  sed -i '' \
    -e "s|${LOCAL_URL}|${PROD_URL}|g" \
    -e "s|http://localhost|${PROD_URL}|g" \
  "${DEPLOY_DIR}/database-${TIMESTAMP}.sql" 2>/dev/null || \
  sed -i \
    -e "s|${LOCAL_URL}|${PROD_URL}|g" \
    -e "s|http://localhost|${PROD_URL}|g" \
  "${DEPLOY_DIR}/database-${TIMESTAMP}.sql"
  fi
else
  echo "WARN: No MySQL container found. Export the database manually before uploading."
fi

cat > "${DEPLOY_DIR}/CHECKLIST-${TIMESTAMP}.txt" <<EOF
System Cars — Migración a producción (${PROD_URL})
Generado: ${TIMESTAMP}

ANTES DE EMPEZAR (cPanel)
-------------------------
[ ] Descargar backup de public_html actual (página "Próximamente")
[ ] Crear base de datos MySQL en cPanel (anotar: nombre, usuario, contraseña, host)
[ ] Verificar SSL activo para systemcars.co

INSTALAR WORDPRESS
------------------
[ ] cPanel > Softaculous > WordPress > Instalar en systemcars.co
    - O instalar manualmente si Softaculous no está disponible
[ ] Anotar credenciales de admin de WordPress

SUBIR ARCHIVOS (File Manager)
-----------------------------
[ ] Subir wp-content-${TIMESTAMP}.zip a public_html/
[ ] Extraer y reemplazar la carpeta wp-content existente
[ ] Verificar permisos: carpetas 755, archivos 644

IMPORTAR BASE DE DATOS (phpMyAdmin)
-----------------------------------
[ ] Seleccionar la base de datos de WordPress
[ ] Importar database-${TIMESTAMP}.sql
    (Si no existe el .sql, exportar desde local con el plugin "All-in-One WP Migration")
[ ] Si las URLs no se reemplazaron, usar plugin "Better Search Replace":
    Buscar: ${LOCAL_URL}  →  Reemplazar: ${PROD_URL}

wp-config.php (editar en File Manager)
--------------------------------------
[ ] Actualizar DB_NAME, DB_USER, DB_PASSWORD, DB_HOST
[ ] Agregar al final (antes de "That's all"):
    define('WP_HOME', '${PROD_URL}');
    define('WP_SITEURL', '${PROD_URL}');
    define('FORCE_SSL_ADMIN', true);

CONFIGURACIONES A RE-INGRESAR (no vienen en la DB de forma portable)
---------------------------------------------------------------------
[ ] Bold Pagos: llaves de PRODUCCIÓN + webhook en panel Bold
[ ] WP Mail SMTP: credenciales SMTP del hosting (gerencia@systemcars.co)
[ ] Google Site Kit: reconectar Analytics/Search Console
[ ] WooCommerce > Ajustes > Finalizar compra: desactivar "Forzar SSL" solo si hay error
[ ] Ajustes > Enlaces permanentes: guardar de nuevo (sin cambiar nada)
[ ] WooCommerce > Estado del sistema: verificar que no haya errores

VERIFICACIÓN FINAL
------------------
[ ] Home, tienda, producto individual, carrito, checkout
[ ] Formulario de contacto (envía a gerencia@systemcars.co)
[ ] Quick View y mini-cart
[ ] Pago Bold en modo prueba antes de activar producción
[ ] Menú móvil y slider en mobile
EOF

echo ""
echo "Done. Files ready in: ${DEPLOY_DIR}/"
ls -lh "${DEPLOY_DIR}/"
