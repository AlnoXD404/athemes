#!/usr/bin/env bash

# athemes Theme — release packaging script (NookTheme-style).
# Builds the frontend and packages a drop-in `panel.tar.gz` that users
# extract over an existing Pterodactyl 1.x install (see README).

set -e

start=`date +%s`

echo "==> Building panel frontend"
yarn build:production

echo "==> Preparing release directory"
mkdir -p release
rm -rf tmp && mkdir tmp
cd tmp

git clone https://github.com/AlnoXD404/athemes.git
cd athemes

rm -rf .git

# Copy compiled assets over the source tree.
cp -r ../../public .

# Remove anything not needed for production.
rm -rf node_modules tests storage/logs/laravel.log

echo "==> Packaging release"
tar -czvf ./panel.tar.gz .
zip -r ./panel.zip . > /dev/null

mv ./panel.tar.gz ../../release/panel.tar.gz
mv ./panel.zip ../../release/panel.zip

cd ../..
rm -rf tmp

end=`date +%s`

echo "==> Done. Artifacts in ./release (built in $(expr $end - $start)s)"