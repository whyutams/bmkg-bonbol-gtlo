cd /var/www/bmkg-bonbol
mkdir -p scripts

cat << 'EOF' > scripts/deploy.sh
#!/bin/bash
set -e

# Berpindah ke direktori root projek (satu level di atas folder scripts/)
cd "$(dirname "$0")/.."

echo "🚀 Memulai Deployment dari $(pwd)..."

# 1. Tarik pembaruan dari Git
git reset --hard HEAD
git pull origin main

# 2. Update dependensi Composer
composer install --no-dev --optimize-autoloader --ignore-platform-req=php

# 3. Install package NPM & build assets frontend
npm install
npm run build

# 4. Migrasi database
php artisan migrate --force

# 5. Refresh cache Laravel
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Jaga kepemilikan dan hak akses berkas web server
# sudo chown -R $USER:www-data storage bootstrap/cache public/build
# sudo chmod -R 775 storage bootstrap/cache public/build
chmod -R 775 storage bootstrap/cache public/build 2>/dev/null || true

echo "✅ Deployment selesai!"
EOF