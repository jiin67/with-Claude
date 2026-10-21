#!/bin/sh
# Builds dist/stardrift-crazygames.zip for upload to the CrazyGames developer portal.
set -e
cd "$(dirname "$0")/.."
mkdir -p dist
rm -f dist/stardrift-crazygames.zip
zip -qr dist/stardrift-crazygames.zip index.html style.css js
echo "dist/stardrift-crazygames.zip ($(du -h dist/stardrift-crazygames.zip | cut -f1))"
